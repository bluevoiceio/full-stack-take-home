import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials

from src.api.common.auth import credentials_scheme, user_from_auth_creds
from src.api.departments.schemas import DepartmentResponseModel
from src.api.utils import user_can_access_department_id
from src.exceptions import UserNotAllowedToPerformAction
from src.services.department_service import DepartmentService

router = APIRouter(tags=["departments"])


@router.get("/{departmentId}", response_model=DepartmentResponseModel)
def get_department(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    departmentId: uuid.UUID,
):
    user = user_from_auth_creds(credentials)
    if not user_can_access_department_id(user, departmentId):
        raise UserNotAllowedToPerformAction()
    return DepartmentResponseModel.from_department(DepartmentService().get_department(departmentId))
