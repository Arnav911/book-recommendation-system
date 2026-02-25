from fastapi import FastAPI
from app.recommender import BookRecommender
from app.schemas import QueryRequest, RecommendationResponse
from app.autocomplete import hybrid_autocomplete

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Book Recommendation API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    recommender = BookRecommender()
except Exception as e:
    recommender = None
    print(f"Failed to initialize BookRecommender: {e}")

@app.post("/recommend", response_model=RecommendationResponse)
def recommend_books(request: QueryRequest):
    from fastapi import HTTPException
    if recommender is None:
        raise HTTPException(status_code=503, detail="Recommender model not loaded. Please ensure all artifacts (like book_embeddings.npy and tfidf_matrix.pkl) are downloaded into the artifacts folder.")
    results = recommender.recommend(
        request.query,
        request.top_k
    )
    return {"results": results}

@app.get("/autocomplete")
def autocomplete(query: str):
    return hybrid_autocomplete(query)
