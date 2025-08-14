# backend/app/api/router.py
# A central router that includes all the domain-specific routers

from fastapi import APIRouter

# Import domain-specific routers
from app.api.endpoints import nutrition, fitness, biometrics
# Note: also provide auth router here, typically provided by FastAPI-Users

# Create the main API router
api_router = APIRouter()

# Include each domain specific router with a prefix and tags
# Helps keep endpoints in OpenAPI documentation organized
api_router.include_router(
    biometrics.router,
    prefix="/biometrics",
    tags=["Biometrics"]
)
api_router.include_router(
    nutrition.router,
    prefix="/nutrition",
    tags=["Nutrition"]
)
api_router.include_router(
    fitness.router,
    prefix="/fitness",
    tags=["Fitness"]
)

# Note: also include the FastAPI-Users authentication routes here
# For example:
# from app.core.security import auth_backend, fastapi_users
# api_router.include_router(
#     fastapi_users.get_auth_router(auth_backend), 
#     prefix="/auth/jwt", 
#     tags=["Auth"]
# )
# api_router.include_router(
#     fastapi_users.get_register_router(UserRead, UserCreate),
#     prefix="/auth",
#     tags=["Auth"],
# )