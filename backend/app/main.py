from fastapi import FastAPI

from app.api.health import router as health_router

app = FastAPI(
    title="Sentinel AI v2",
    version="2.0.0",
)

app.include_router(health_router)


@app.get("/")
def root():

    return {
        "message": "Sentinel AI v2 API",
    }