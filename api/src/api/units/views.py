from typing import Annotated, List

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials

from src.api.common.auth import credentials_scheme, user_from_auth_creds
from src.api.units.schemas import UnitResponseModel
from src.services.department_service import DepartmentService

router = APIRouter(tags=["units"])


@router.get("", response_model=List[UnitResponseModel])
def list_units(credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)]):
    user = user_from_auth_creds(credentials)
    return [UnitResponseModel.from_unit(unit) for unit in DepartmentService().list_units(user.department_id)]
