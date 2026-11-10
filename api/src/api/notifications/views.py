import uuid
from typing import Annotated, List

from fastapi import APIRouter, Depends, Query
from fastapi.security import HTTPAuthorizationCredentials
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT

from src.api.common.auth import ADMIN_ROLES, credentials_scheme, user_from_auth_creds
from src.api.notifications.schemas import (
    NotificationCreateModel,
    NotificationReadModel,
    NotificationResponseModel,
    NotificationSentResponseModel,
)
from src.services.notification_service import NotificationService
from src.services.user_service import UserService

router = APIRouter(tags=["notifications"])

NOTIFICATION_LIST_LIMIT = 200


@router.get("", response_model=List[NotificationResponseModel])
def list_my_notifications(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    skip: int = Query(0, ge=0),
    limit: int = Query(NOTIFICATION_LIST_LIMIT, ge=1, le=NOTIFICATION_LIST_LIMIT),
):
    user = user_from_auth_creds(credentials)
    notifications = NotificationService().list_user_notifications(user.sub, skip=skip, limit=limit)
    return [NotificationResponseModel.from_notification(notification) for notification in notifications]


@router.get("/history", response_model=List[NotificationResponseModel])
def list_notification_history(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    skip: int = Query(0, ge=0),
    limit: int = Query(NOTIFICATION_LIST_LIMIT, ge=1, le=NOTIFICATION_LIST_LIMIT),
):
    user = user_from_auth_creds(credentials, allowed_roles=ADMIN_ROLES)
    department_id = UserService().get_user(user.sub).department_id
    notifications = NotificationService().list_department_notifications(department_id, skip=skip, limit=limit)
    return [NotificationResponseModel.from_notification(notification) for notification in notifications]


@router.post("", response_model=NotificationSentResponseModel, status_code=HTTP_201_CREATED)
def send_notification(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    create_model: NotificationCreateModel,
):
    user = user_from_auth_creds(credentials, allowed_roles=ADMIN_ROLES)
    notifications = NotificationService().notify_users(
        sender=UserService().get_user(user.sub),
        title=create_model.title,
        message=create_model.message,
        user_ids=create_model.userIds,
        group_ids=create_model.groupIds,
    )
    return NotificationSentResponseModel(recipientCount=len(notifications))


@router.patch("/{notificationId}", response_model=NotificationResponseModel)
def set_notification_read(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    notificationId: uuid.UUID,
    read_model: NotificationReadModel,
):
    user = user_from_auth_creds(credentials)
    notification = NotificationService().set_read(notificationId, user.sub, read_model.read)
    return NotificationResponseModel.from_notification(notification)


@router.delete("/{notificationId}", status_code=HTTP_204_NO_CONTENT)
def delete_notification(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    notificationId: uuid.UUID,
):
    user = user_from_auth_creds(credentials)
    NotificationService().delete_user_notification(notificationId, user.sub)
