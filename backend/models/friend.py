from pydantic import BaseModel
from datetime import datetime

__authors__ = ["Nikhil Sarin", "Wilson Haynie", "Amit Garine", "Jasper Ou"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


class FriendRequest(BaseModel):
    """
    Pydantic model to represent a `FriendRequest`.

    This model is based on the `FriendRequest` entity, which defines the shape
    of the `friend_requests` table in the database.
    """

    id: int | None = None
    sender_id: int
    receiver_id: int
    is_accepted: bool = False
    pending: bool = True

    created_at: datetime | None = None

    class Config:
        orm_mode = True
