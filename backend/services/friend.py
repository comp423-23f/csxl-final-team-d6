"""
The FriendRequest Service allows the API to manipulate friend request data in the database.
"""

from typing import Optional
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.models.user import User as UserModel
from ..database import db_session
from ..models.friend import FriendRequest as FriendRequestModel
from ..models.friend import FriendshipModel
from ..entities import FriendRequest
from ..entities import Friendship
from .exceptions import ResourceNotFoundException
from ..entities import UserEntity

__authors__ = ["Your Name", "Other Contributors"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


class FriendRequestService:
    """Service that performs all of the actions on the `FriendRequest` table"""

    def __init__(
        self,
        session: Session = Depends(db_session),
    ):
        """Initializes the `FriendRequestService` session"""
        self._session = session

    def send_request(
        self, sender_id: int, receiver_id: int
    ) -> Optional[FriendRequestModel]:
        """
        Creates a friend request and adds it to the table.

        Parameters:
            sender_id: ID of the user sending the request
            receiver_id: ID of the user receiving the request

        Returns:
            FriendRequestModel: The created friend request
        """

        if sender_id == receiver_id:
            raise ValueError("Cannot send a friend request to oneself.")

        # Check if a friendship already exists
        existing_friendship = (
            self._session.query(Friendship)
            .filter(
                (
                    (Friendship.user_id == sender_id)
                    & (Friendship.friend_id == receiver_id)
                )
                | (
                    (Friendship.user_id == receiver_id)
                    & (Friendship.friend_id == sender_id)
                )
            )
            .first()
        )

        if existing_friendship:
            raise ValueError("A friendship already exists between these users.")

        # Check if a friend request already exists
        existing_request = (
            self._session.query(FriendRequest)
            .filter(
                (FriendRequest.sender_id == sender_id)
                & (FriendRequest.receiver_id == receiver_id)
            )
            .first()
        )

        if existing_request:
            raise ValueError("A pending friend request already exists.")

        # Check if a reciprocal friend request already exists
        reciprocal_request = (
            self._session.query(FriendRequest)
            .filter(
                (FriendRequest.sender_id == receiver_id)
                & (FriendRequest.receiver_id == sender_id)
            )
            .first()
        )

        if reciprocal_request:
            # Accept the friend request, creating a friendship
            self.accept_request(receiver_id, sender_id)
            friend_request = FriendRequest(
                id=-1, sender_id=sender_id, receiver_id=receiver_id
            )
            return friend_request.to_model()

        friend_request = FriendRequest(sender_id=sender_id, receiver_id=receiver_id)
        self._session.add(friend_request)
        self._session.commit()
        return friend_request.to_model()

    def accept_request(self, sender_id: int, receiver_id: int) -> None:
        """
        Accepts a friend request and creates a bidirectional friendship.

        Parameters:
            sender_id: ID of the user who sent the friend request
            receiver_id: ID of the user who received the friend request
        """
        # Check if the friend request exists
        friend_request = (
            self._session.query(FriendRequest)
            .filter_by(sender_id=sender_id, receiver_id=receiver_id)
            .first()
        )

        if friend_request is None:
            raise ResourceNotFoundException(
                f"No pending friend request found between users {sender_id} and {receiver_id}"
            )

        # Create two Friendship entries for bidirectional relationship
        friendship1 = Friendship(user_id=sender_id, friend_id=receiver_id)
        friendship2 = Friendship(user_id=receiver_id, friend_id=sender_id)

        self._session.add_all([friendship1, friendship2])

        # Delete the FriendRequest
        self._session.delete(friend_request)

        # Commit the changes
        self._session.commit()

    def reject_request(self, sender_id: int, receiver_id: int) -> None:
        """
        Rejects a friend request.

        Parameters:
            sender_id: ID of the user who sent the friend request
            receiver_id: ID of the user who received the friend request
        """
        # Check if the friend request exists
        friend_request = (
            self._session.query(FriendRequest)
            .filter_by(sender_id=sender_id, receiver_id=receiver_id)
            .first()
        )

        if friend_request is None:
            raise ResourceNotFoundException(
                f"No pending friend request found between users {sender_id} and {receiver_id}"
            )

        # Delete the FriendRequest
        self._session.delete(friend_request)

        # Commit the changes
        self._session.commit()

    def list_incoming_requests(self, user_id: int) -> list[FriendRequestModel]:
        """
        Lists all incoming friend requests for a user.

        Parameters:
            user_id: ID of the user to list incoming friend requests for

        Returns:
            list[FriendRequestModel]: List of incoming friend requests
        """
        query = select(FriendRequest).where(FriendRequest.receiver_id == user_id)
        requests = self._session.scalars(query).all()
        return [request.to_model() for request in requests]

    def list_outgoing_requests(self, user_id: int) -> list[FriendRequestModel]:
        """
        Lists all outgoing friend requests for a user.

        Parameters:
            user_id: ID of the user to list outgoing friend requests for

        Returns:
            list[FriendRequestModel]: List of outgoing friend requests
        """
        query = select(FriendRequest).where(FriendRequest.sender_id == user_id)
        requests = self._session.scalars(query).all()
        return [request.to_model() for request in requests]

    def list_friends(self, user_id: int) -> list[UserModel]:
        """
        Lists all friends for a given user.

        Parameters:
            user_id: ID of the user to list friends for

        Returns:
            list[UserModel]: List of friend user models
        """
        # Query to find all friendships where the user is the user
        query = select(Friendship).where(Friendship.user_id == user_id)
        friendships = self._session.scalars(query).all()

        # Extract friend IDs
        friend_ids = [f.friend_id for f in friendships]

        # Fetch friend user details
        friends = self._session.scalars(
            select(UserEntity).where(UserEntity.id.in_(friend_ids))
        ).all()

        # Convert to UserModels (assuming you have a method like to_model in UserEntity)
        return [friend.to_model() for friend in friends]

    def remove_friend(self, user_id: int, friend_id: int) -> None:
        """
        Removes a friend for a given user.

        Parameters:
            user_id: ID of the user who wants to remove a friend
            friend_id: ID of the friend to be removed
        """
        # Find and delete the friendship entries
        friendships = (
            self._session.query(Friendship)
            .filter(
                ((Friendship.user_id == user_id) & (Friendship.friend_id == friend_id))
                | (
                    (Friendship.user_id == friend_id)
                    & (Friendship.friend_id == user_id)
                )
            )
            .all()
        )

        if not friendships:
            raise ResourceNotFoundException(
                f"No friendship found between users {user_id} and {friend_id}"
            )

        for friendship in friendships:
            self._session.delete(friendship)

        # Commit the changes
        self._session.commit()

    def get_friend_info(self, friend_id: int) -> UserModel:
        friend = self._session.scalars(
            select(UserEntity).where(UserEntity.id == friend_id)
        ).first()

        return friend.to_model()
