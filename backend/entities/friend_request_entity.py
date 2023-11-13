from sqlalchemy import Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .entity_base import EntityBase
from datetime import datetime
from ..models.friend import (
    FriendRequest as FriendRequestModel,
)  # Import your Pydantic model


class FriendRequest(EntityBase):
    __tablename__ = "friend_requests"

    # Properties (columns in the database table)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    is_accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    sender: Mapped["User"] = relationship("User", foreign_keys=[sender_id])
    receiver: Mapped["User"] = relationship("User", foreign_keys=[receiver_id])

    @classmethod
    def from_model(cls, model: FriendRequestModel) -> "FriendRequest":
        """
        Class method that converts a FriendRequest Pydantic model into a FriendRequest entity
        """
        return cls(
            sender_id=model.sender_id,
            receiver_id=model.receiver_id,
            is_accepted=model.is_accepted,
        )

    def to_model(self) -> FriendRequestModel:
        """
        Converts a FriendRequest entity into a FriendRequest Pydantic model
        """
        return FriendRequestModel(
            id=self.id,
            sender_id=self.sender_id,
            receiver_id=self.receiver_id,
            is_accepted=self.is_accepted,
            created_at=self.created_at,
        )
