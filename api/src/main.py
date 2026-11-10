from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.api.auth import views as auth
from src.api.departments import views as departments
from src.api.error_handlers import COMMON_ERROR_RESPONSES, register_error_handlers
from src.api.groups import views as groups
from src.api.notifications import views as notifications
from src.api.units import views as units
from src.api.users import views as users
from src.db import init_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_engine()
    yield


router = APIRouter()
router.include_router(departments.router, prefix="/departments")
router.include_router(units.router, prefix="/units")
router.include_router(users.router, prefix="/users")
router.include_router(groups.router, prefix="/groups")
router.include_router(notifications.router, prefix="/notifications")

app = FastAPI(title="Take-home API", lifespan=lifespan)
app.include_router(router, prefix="/api/v1", responses=COMMON_ERROR_RESPONSES)
app.include_router(auth.router)
register_error_handlers(app)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class HealthResponse(BaseModel):
    status: str


@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok")
