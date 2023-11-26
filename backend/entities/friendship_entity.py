from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .entity_base import EntityBase
from .user_entity import UserEntity
from ..models.friend import FriendshipModel


class Friendship(EntityBase):
    __tablename__ = "friendships"

    # Properties (columns in the database table)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("user.id"), primary_key=True
    )
    friend_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("user.id"), primary_key=True
    )

    # Relationships
    user: Mapped[UserEntity] = relationship("UserEntity", foreign_keys=[user_id])
    friend: Mapped[UserEntity] = relationship("UserEntity", foreign_keys=[friend_id])

    @classmethod
    def from_model(cls, user_id: int, friend_id: int) -> "Friendship":
        """
        Class method that creates a Friendship entity from user IDs
        """
        return cls(user_id=user_id, friend_id=friend_id)

    def to_model(self):
        """
        Converts a Friendship entity into a simple model (if needed)
        """

        return FriendshipModel(user_id=self.user_id, friend_id=self.friend_id)
