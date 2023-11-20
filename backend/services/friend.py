"""
The FriendRequest Service allows the API to manipulate friend request data in the database.
"""

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.models.user import User
from ..database import db_session
from ..models.friend import FriendRequest as FriendRequestModel
from ..entities import FriendRequest
from .exceptions import ResourceNotFoundException

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

    def send_request(self, sender_id: int, receiver_id: int) -> FriendRequestModel:
        """
        Creates a friend request and adds it to the table.

        Parameters:
            sender_id: ID of the user sending the request
            receiver_id: ID of the user receiving the request

        Returns:
            FriendRequestModel: The created friend request
        """
        friend_request = FriendRequest(sender_id=sender_id, receiver_id=receiver_id)
        self._session.add(friend_request)
        self._session.commit()
        return friend_request.to_model()

    def accept_request(self, request_id: int) -> FriendRequestModel:
        """
        Accepts a friend request.

        Parameters:
            request_id: ID of the friend request to accept

        Returns:
            FriendRequestModel: The updated friend request
        """
        friend_request = self._session.get(FriendRequest, request_id)
        if friend_request is None:
            raise ResourceNotFoundException(
                f"No friend request found with ID: {request_id}"
            )

        friend_request.is_accepted = True
        friend_request.pending = False
        self._session.commit()
        return friend_request.to_model()

    def reject_request(self, request_id: int) -> FriendRequestModel:
        """
        Rejects a friend request.

        Parameters:
            request_id: ID of the friend request to reject

        Returns:
            FriendRequestModel: The updated friend request
        """
        friend_request = self._session.get(FriendRequest, request_id)
        if friend_request is None:
            raise ResourceNotFoundException(
                f"No friend request found with ID: {request_id}"
            )

        friend_request.is_accepted = False
        friend_request.pending = False
        self._session.commit()
        return friend_request.to_model()

    def list_requests(self, user_id: int) -> list[FriendRequestModel]:
        """
        Lists all friend requests for a user.

        Parameters:
            user_id: ID of the user to list friend requests for

        Returns:
            list[FriendRequestModel]: List of friend requests
        """
        query = select(FriendRequest).where(
            (FriendRequest.sender_id == user_id)
            | (FriendRequest.receiver_id == user_id)
        )
        requests = self._session.scalars(query).all()
        return [request.to_model() for request in requests]
