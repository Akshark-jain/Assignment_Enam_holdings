"""
FINN: Financial Investment Agent - FastAPI Backend.
Designed for ENAM Holdings AI Engineer Build Challenge.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.portfolio_routes import router as portfolio_router
from app.api.push_routes import router as push_router
from app.api.pull_routes import router as pull_router

app = FastAPI(
    title="FINN: Financial Investment Agent",
    description="Mobile-first financial intelligence layer for public-markets investors. Push mode proactive intelligence & Pull mode primary-source grounded fundamental research.",
    version="1.0.0"
)

# CORS configuration for seamless local dev and mobile previews
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount feature routers
app.include_router(portfolio_router)
app.include_router(push_router)
app.include_router(pull_router)

@app.get("/")
def root():
    return {
        "app": "FINN: Financial Investment Agent",
        "status": "online",
        "description": "ENAM Holdings Build Challenge - Mobile-First Investment Agent",
        "modules": {
            "portfolio": "/api/portfolio",
            "push_digest": "/api/push/digest",
            "push_alerts": "/api/push/alerts",
            "pull_research": "/api/pull/research/{ticker}"
        }
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "finn-backend"}
