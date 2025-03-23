const express = require('express');
const { ChromaClient } = require('chromadb');
const { pipeline } = require('@xenova/transformers');

const app = express();
app.use(express.json());

// chromaDB instance is launched using docker on an EC-2 AWS machine
const chromaDB_url = "http://44.202.103.153:8000";

let model;
(async () => {
  model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
})();

class HuggingFaceEmbedder {
  async generate(texts) {
    try {
      if (!Array.isArray(texts)) {
        texts = [texts];
      }
      const output = await model(texts, { 
        pooling: 'mean', 
        normalize: true,
        batch_size: 8 
      });
      return output.tolist(); 
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw new Error('Failed to generate embeddings');
    }
  }
}

const chroma = new ChromaClient({ path: chromaDB_url});
const embeddingFunction = new HuggingFaceEmbedder();

async function getOrCreateCollection() {
  return chroma.getOrCreateCollection({
    name: 'documents',
    embeddingFunction: embeddingFunction
  });
}

app.post('/api/documents', async (req, res) => {
  try {
    const { documents } = req.body;
    if (!Array.isArray(documents)) {
      return res.status(400).json({ error: 'Documents must be an array' });
    }

    const collection = await getOrCreateCollection();
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < documents.length; i += batchSize) {
      batches.push(documents.slice(i, i + batchSize));
    }

    let totalAdded = 0;
    for (const batch of batches) {
      const ids = batch.map((_, i) => `doc-${Date.now()}-${totalAdded + i}`);
      await collection.add({
        ids,
        documents: batch,
        metadatas: batch.map(() => ({ timestamp: new Date().toISOString() }))
      });
      totalAdded += batch.length;
    }

    res.json({ success: true, added: totalAdded });
  } catch (error) {
    console.error('Error adding documents:', error);
    res.status(500).json({ 
      error: 'Failed to add documents',
      details: error.message
    });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const collection = await getOrCreateCollection();
    const results = await collection.query({
      queryTexts: [query],
      nResults: 5
    });

    res.json({
      query,
      results: results.documents[0].map((doc, i) => ({
        id: results.ids[0][i],
        document: doc,
        score: results.distances[0][i]
      }))
    });
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`ChromaDB path: ${chromaDB_url}`);
});
