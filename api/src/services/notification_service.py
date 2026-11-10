import logging
import uuid
from typing import Sequence

from src.db.notification import NotificationDB
from src.exceptions import EntityNotFound, UnprocessableEntity
from src.models import User, UserNotification, utcnow
from src.services.group_service import GroupService
from src.services.user_service import UserService

logger = logging.getLogger("uvicorn.error")


class NotificationService:
    def __init__(self):
        self._notification_db = NotificationDB()

    def list_user_notifications(
        self, user_id: uuid.UUID, skip: int = 0, limit: int | None = None
    ) -> list[UserNotification]:
        return self._notification_db.list_for_receiver(user_id, skip=skip, limit=limit)

    def list_department_notifications(
        self, department_id: uuid.UUID, skip: int = 0, limit: int | None = None
    ) -> list[UserNotification]:
        """Everything sent inside a department, one row per recipient."""
        sender_ids = [user.id for user in UserService().get_users(department_id)]
        return self._notification_db.list_for_senders(sender_ids, skip=skip, limit=limit)

    def notify_users(
        self,
        sender: User,
        title: str,
        message: str,
        user_ids: Sequence[uuid.UUID] = (),
        group_ids: Sequence[uuid.UUID] = (),
    ) -> list[UserNotification]:
        """Store one notification per recipient and push it to their devices. Groups are
        expanded to their members now, so later membership changes don't alter who was told."""
        title, message = title.strip(), message.strip()
        if not title or not message:
            raise UnprocessableEntity("A notification needs a title and a message.")

        roster = {user.id: user for user in UserService().get_users(sender.department_id)}
        receiver_ids = list(dict.fromkeys([*user_ids, *GroupService().get_member_ids(list(group_ids))]))
        recipients = [roster[receiver_id] for receiver_id in receiver_ids if receiver_id in roster]
        if not recipients:
            raise UnprocessableEntity("A notification needs at least one recipient in this department.")

        sent_at = utcnow()
        notifications = self._notification_db.create_notifications(
            [
                UserNotification(
                    title=title, message=message, sender_id=sender.id, receiver_id=recipient.id, created_at=sent_at
                )
                for recipient in recipients
            ]
        )
        self.send_push_notification(recipients, title, message)
        return notifications

    def send_push_notification(
        self, recipients: Sequence[User], title: str, message: str, data: dict | None = None
    ) -> None:
        """Stands in for the push provider. Production sends to each recipient's device token."""
        for recipient in recipients:
            logger.info("push -> %s: %s | %s %s", recipient.email, title, message, data or "")

    def set_read(self, notification_id: uuid.UUID, user_id: uuid.UUID, read: bool) -> UserNotification:
        self._get_own(notification_id, user_id)
        return self._notification_db.set_read(notification_id, read)

    def delete_user_notification(self, notification_id: uuid.UUID, user_id: uuid.UUID) -> None:
        self._get_own(notification_id, user_id)
        self._notification_db.delete_notification(notification_id)

    def _get_own(self, notification_id: uuid.UUID, user_id: uuid.UUID) -> UserNotification:
        notification = self._notification_db.get_notification(notification_id)
        if notification.receiver_id != user_id:
            raise EntityNotFound("Notification not found")
        return notification
