# Document Similarity API
This project is a REST API that uses Hugging Face's Sentence Transformers to generate embeddings for documents and performs similarity searches using ChromaDB hosted on an AWS EC2 instance.

## Backend is hosted at: https://document-similarity-api.onrender.com

## Features
Document Storage: Add text documents to ChromaDB with metadata.

Similarity Search: Query the most similar documents to a given text.

Hugging Face Transformers: Uses all-MiniLM-L6-v2 for embedding generation.

ChromaDB Integration: Stores and retrieves embeddings using ChromaDB hosted on an AWS EC2 instance.

Accepts a query from the user: Returns the top 5 most similar documents.

## Additional Features:

Support for different similarity metrics (e.g., cosine similarity, dot product).

Real-time indexing for newly added documents.

## Tech Stack
Backend: Node.js with Express.js

Machine Learning: OpenAI API (for embeddings)

Vector Database: ChromaDB

## Prerequisites
Node.js installed on your system.

A dataset of text documents in JSON format.

## Installation Steps
1. Clone this repository using command:
    git clone https://github.com/your-repo/document-similarity-api.git
    cd document-similarity-api

2. Install dependencies:
    npm install

3. Prepare your dataset:
    Place your dataset in a file named dataset.json in the root directory.

    Example format:
    {
        "documents": [
            "This is the first document.",
            "Here is another document.",
            "Machine learning is fascinating.",
            "OpenAI APIs are powerful tools.",
            "Vector databases enable semantic search."
        ]
    }

4. Start the server:
        node index.js

The server will start on http://localhost:3000.

## Usage
### Add Documents to Database
Endpoint: /api/documents
Method: POST
Description: Add an array of documents to the vector database.

Request Body Example:
    {
        "documents": [
            "This is a new document.",
            "Another document to be added."
        ]
    }

Response Example:
    {
      "message": "Documents added successfully!"
    }

### Search for Similar Documents
Endpoint: /api/search?q=<query>
Method: GET
Description: Search for the top 5 most similar documents based on the query.

Example Request:
    curl "http://localhost:3000/api/search?q=Machine learning is amazing"

Response Example:
    {
      "results": [
        "Machine learning is fascinating.",
        "OpenAI APIs are powerful tools.",
        "Vector databases enable semantic search."
      ]
    }

## Project Structure
document-similarity-api/
├── dataset.json           # Dataset of text documents (sample data)
├── index.js               # Main server code
├── package.json           # Node.js dependencies and scripts
└── README.md              # Project documentation (this file)




>>>>>>> efd1c19 (Initial commit: Add project files)
