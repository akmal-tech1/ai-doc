from fastapi import FastAPI, UploadFile, File
from PyPDF2 import PdfReader
from transformers import AutoTokenizer, AutoModel, pipeline
import torch
import io
from pymongo import MongoClient
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Embedding model (Hugging Face E5-base-v2)
embed_tokenizer = AutoTokenizer.from_pretrained("intfloat/e5-base-v2")
embed_model = AutoModel.from_pretrained("intfloat/e5-base-v2")
def get_embedding(text: str):
    inputs = embed_tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        embeddings = embed_model(**inputs).last_hidden_state.mean(dim=1)
    return embeddings[0].tolist()

# NLP Question Answering model (Phi-3-mini)
generator = pipeline(
    "text-generation",
    model="microsoft/Phi-3-mini-4k-instruct"
)

# MongoDB connection0
MONGO_URI = "mongodb+srv://mini_chatbot:mini123@cluster0.byacaui.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["miniproject"]
collection = db["ai chatbot"]

# Split text into chunks
def chunk_text(text, chunk_size=500):
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

# Upload PDF API
@app.post("/file_upload")
async def data_uploading(file: UploadFile = File(...)):
    pdf_data = await file.read()
    pdf_file = io.BytesIO(pdf_data)
    reader = PdfReader(pdf_file)

    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"

    chunks = chunk_text(text)
    documents = []

    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)
        doc = {
            "filename": file.filename,
            "chunk_number": i + 1,
            "text": chunk,
            "embedding": embedding
        }
        documents.append(doc)

    collection.insert_many(documents)

    return {
        "message": "PDF embedded and stored successfully",
        "filename": file.filename,
        "chunks_stored": len(documents) 
    }

# Chat API with NLP Answer
@app.post("/chat")
async def chat(query: str):
    query_embedding = get_embedding(query)

    results = collection.aggregate([
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": 10,
                "limit": 3
            }
        },
        {
            "$project": {
                "_id": 0,
                "filename": 1,
                "chunk_number": 1,
                "text": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ])

    output = list(results)
    context = " ".join([doc["text"] for doc in output])

    prompt = f"""
    Context:
    {context}

    Question:
    {query}

    Answer:
    """

    response = generator(prompt, max_new_tokens=80, truncation=True)
    generated_text = response[0]["generated_text"]
    final_answer = generated_text.split("Answer:")[-1].strip()

    return {
        "query": query,
        "answer": final_answer,
        "matched_chunks": output
    }
