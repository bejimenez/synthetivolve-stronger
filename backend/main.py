# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# import the central API router
from app.api.router import api_router
from app.core.config import settings

# Create the main FastAPI application instance
# Add metadata here that will be used in the OpenAPI docs
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# set up CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        # origins the frontend is hosted at
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"], # allows all methods
        allow_headers=["*"]  # allows all headers
    )

# Include the main router into the application
# All routes defined in endpoints will be available under the /api/v1 prefix
app.include_router(api_router, prefix=settings.API_V1_STR)

# A simple root endpoint to confirm the API is running
@app.get("/", tags=["Root"])
async def read_root():
    """
    A simple health check endpoint to confirm the API is running
    """
    return {"message": f"Welcome to the {settings.PROJECT_NAME} API!"}