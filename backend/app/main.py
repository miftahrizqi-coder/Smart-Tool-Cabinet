from fastapi import FastAPI
from app.routers.tools import router as tools_router
from app.routers.employees import router as employees_router
from app.routers.cabinets import router as cabinets_router
from app.routers.transaction import router as transaction_router
from app.routers.event import router as event_router
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.core.mqtt import (
    mqtt_subscriber,
    mqtt_publisher
)


from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.mqtt import (
    mqtt_subscriber,
    mqtt_publisher,
    mqtt_message_handler
)


@asynccontextmanager
async def lifespan(app: FastAPI):

    print("========================================")
    print("FASTAPI STARTUP")
    print("========================================")

    try:
        mqtt_subscriber.start()
        print("MQTT SUBSCRIBER START CALLED")
    except Exception as e:
        print("MQTT SUBSCRIBER START ERROR:")
        print(repr(e))

    try:
        mqtt_publisher.connect()
        print("MQTT PUBLISHER CONNECT CALLED")
    except Exception as e:
        print("MQTT PUBLISHER CONNECT ERROR:")
        print(repr(e))

    yield

    print("========================================")
    print("FASTAPI SHUTDOWN")
    print("========================================")

    try:
        mqtt_subscriber.stop()
    except Exception as e:
        print("MQTT SUBSCRIBER STOP ERROR:")
        print(repr(e))

    try:
        mqtt_publisher.disconnect()
    except Exception as e:
        print("MQTT PUBLISHER DISCONNECT ERROR:")
        print(repr(e))

app = FastAPI(
    title="Smart Tool Cabinet API",
    version="1.0.0",
    description="Backend API for Smart Tool Cabinet",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tools_router)
app.include_router(employees_router)
app.include_router(cabinets_router)
app.include_router(transaction_router)

app.include_router(
    event_router,
    prefix="/api/v1"
)

@app.get("/")
def root():
    return {
        "message": "Smart Tool Cabinet API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok"
    }