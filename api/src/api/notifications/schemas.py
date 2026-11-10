import uuid
from datetime import datetime
from typing import Self

from pydantic import BaseModel

from src.models import UserNotification


class NotificationCreateModel(BaseModel):
    title: str
    message: str
    userIds: list[uuid.UUID] = []
    groupIds: list[uuid.UUID] = []


class NotificationReadModel(BaseModel):
    read: bool


class NotificationSentResponseModel(BaseModel):
    recipientCount: int


class NotificationResponseModel(BaseModel):
    id: uuid.UUID
    title: str
    message: str
    senderId: uuid.UUID
    receiverId: uuid.UUID
    createdAt: datetime
    read: bool

    @classmethod
    def from_notification(cls, notification: UserNotification) -> Self:
        return cls(
            id=notification.id,
            title=notification.title,
            message=notification.message,
            senderId=notification.sender_id,
            receiverId=notification.receiver_id,
            createdAt=notification.created_at,
            read=notification.read,
        )
