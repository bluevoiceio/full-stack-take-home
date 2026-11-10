import uuid

from sqlmodel import col, select

from src.db import get_session
from src.exceptions import EntityNotFound
from src.models import UserNotification


class NotificationDB:
    def list_for_receiver(
        self, receiver_id: uuid.UUID, skip: int = 0, limit: int | None = None
    ) -> list[UserNotification]:
        with get_session() as session:
            query = (
                select(UserNotification)
                .where(UserNotification.receiver_id == receiver_id)
                .order_by(col(UserNotification.created_at).desc())
                .offset(skip)
            )
            if limit is not None:
                query = query.limit(limit)
            return list(session.exec(query).all())

    def list_for_senders(
        self, sender_ids: list[uuid.UUID], skip: int = 0, limit: int | None = None
    ) -> list[UserNotification]:
        with get_session() as session:
            query = (
                select(UserNotification)
                .where(col(UserNotification.sender_id).in_(sender_ids))
                .order_by(col(UserNotification.created_at).desc())
                .offset(skip)
            )
            if limit is not None:
                query = query.limit(limit)
            return list(session.exec(query).all())

    def get_notification(self, notification_id: uuid.UUID) -> UserNotification:
        with get_session() as session:
            notification = session.get(UserNotification, notification_id)
            if notification is None:
                raise EntityNotFound("Notification not found")
            return notification

    def create_notifications(self, notifications: list[UserNotification]) -> list[UserNotification]:
        with get_session() as session:
            session.add_all(notifications)
            session.commit()
            return notifications

    def set_read(self, notification_id: uuid.UUID, read: bool) -> UserNotification:
        with get_session() as session:
            notification = session.get(UserNotification, notification_id)
            if notification is None:
                raise EntityNotFound("Notification not found")
            notification.read = read
            session.commit()
            return notification

    def delete_notification(self, notification_id: uuid.UUID) -> None:
        with get_session() as session:
            notification = session.get(UserNotification, notification_id)
            if notification is None:
                raise EntityNotFound("Notification not found")
            session.delete(notification)
            session.commit()
