class EntityNotFound(Exception):
    def __init__(self, message: str = "Entity not found"):
        super().__init__(message)


class EntityAlreadyExists(Exception):
    def __init__(self, message: str = "Entity already exists"):
        super().__init__(message)


class UnprocessableEntity(Exception):
    def __init__(self, message: str = "Unprocessable entity"):
        super().__init__(message)


class UserNotAllowedToPerformAction(Exception):
    def __init__(self, message: str = "User is not allowed to perform this action"):
        super().__init__(message)
