from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import engine, Base
from app.core.config import settings
from app.api import auth, courses, enrollments, billing, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Online Learning API...")
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    print("🛑 Shutting down Online Learning API...")

app = FastAPI(
    title="Online Learning SaaS API",
    description="A subscription-based online learning platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(courses.router, prefix="/courses", tags=["Courses"])
app.include_router(enrollments.router, prefix="/enrollments", tags=["Enrollments"])
app.include_router(billing.router, prefix="/billing", tags=["Billing"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/")
def root():
    return {"message": "Online Learning SaaS API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}