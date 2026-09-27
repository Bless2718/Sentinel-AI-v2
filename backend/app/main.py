from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.intelligence import router as intelligence_router
from app.api.health import router as health_router
from app.api.upload import router as upload_router
from app.api.forecast import router as forecast_router
from app.api import geospatial
from app.api import ai
from app.api.risk import router as risk_router


app = FastAPI(
    title="Sentinel AI v2",
    version="2.0.0",
)


# -------------------------------------------------
# CORS
# -------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://sentinel-ai-v2-4w54.onrender.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------
# API Routers
# -------------------------------------------------

app.include_router(health_router)
app.include_router(upload_router)
app.include_router(forecast_router)
app.include_router(risk_router)
app.include_router(intelligence_router)
app.include_router(geospatial.router)
app.include_router(ai.router)


# -------------------------------------------------
# Root
# -------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Sentinel AI v2 API",
    }