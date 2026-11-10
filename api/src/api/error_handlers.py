from typing import Optional

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_409_CONFLICT,
)

from src.exceptions import (
    EntityAlreadyExists,
    EntityNotFound,
    UnprocessableEntity,
    UserNotAllowedToPerformAction,
)


class ErrorResponse(BaseModel):
    message: str
    code: Optional[str] = None


STATUS_BY_EXCEPTION: dict[type[Exception], int] = {
    UnprocessableEntity: HTTP_400_BAD_REQUEST,
    UserNotAllowedToPerformAction: HTTP_403_FORBIDDEN,
    EntityNotFound: HTTP_404_NOT_FOUND,
    EntityAlreadyExists: HTTP_409_CONFLICT,
}

COMMON_ERROR_RESPONSES: dict[int | str, dict] = {
    status: {"model": ErrorResponse} for status in STATUS_BY_EXCEPTION.values()
}


def _body(exc: Exception) -> dict[str, str]:
    """Clients branch on `code`, never on the text of `message`. An exception class opts in by
    setting an `error_code` attribute."""
    body = {"message": str(exc)}
    code = getattr(exc, "error_code", None)
    if code is not None:
        body["code"] = code
    return body


def register_error_handlers(app: FastAPI) -> None:
    for exception_class, status_code in STATUS_BY_EXCEPTION.items():

        def handler(request: Request, exc: Exception, status_code: int = status_code) -> JSONResponse:
            return JSONResponse(status_code=status_code, content=_body(exc))

        app.add_exception_handler(exception_class, handler)
