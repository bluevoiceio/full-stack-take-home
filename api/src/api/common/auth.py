import uuid
from typing import Optional, Sequence

from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from starlette.status import HTTP_401_UNAUTHORIZED

from src.exceptions import EntityNotFound, UserNotAllowedToPerformAction
from src.models import AuthUser, User, UserRole
from src.services.user_service import UserService

credentials_scheme = HTTPBearer()

ADMIN_ROLES = (UserRole.ADMIN,)


def issue_access_token(user: User) -> str:
    """Stands in for the identity provider's signed JWT. The token is only the user's ID, so
    treat everything about sign-in as out of scope."""
    return str(user.id)


def user_from_auth_creds(
    creds: HTTPAuthorizationCredentials, allowed_roles: Optional[Sequence[UserRole]] = None
) -> AuthUser:
    """Resolve the bearer token to the caller. Handlers call this directly, passing the roles
    the endpoint allows."""
    try:
        user = UserService().get_user(uuid.UUID(creds.credentials))
    except (ValueError, EntityNotFound) as e:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid auth token") from e
    if allowed_roles is not None and user.role not in allowed_roles:
        raise UserNotAllowedToPerformAction()
    return AuthUser(sub=user.id, email=user.email, role=user.role, department_id=user.department_id)
