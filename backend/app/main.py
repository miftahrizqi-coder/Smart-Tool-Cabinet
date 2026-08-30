from fastapi import FastAPI
from app.routers.tools import router as tools_router
from app.routers.employees import router as employees_router
from app.routers.cabinets import router as cabinets_router
from app.routers.transaction import router as transaction_router

app = FastAPI(
    title="Smart Tool Cabinet API",
    version="1.0.0",
    description="Backend API for Smart Tool Cabinet"
)

app.include_router(tools_router)
app.include_router(employees_router)
app.include_router(cabinets_router)
app.include_router(transaction_router)

@app.get("/")
def root():
    return {
        "message": "Smart Tool Cabinet API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }