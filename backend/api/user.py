"""User operations open to registered users such as searching for fellow user profiles."""

from fastapi import APIRouter, Depends
from ..services import UserService
from ..models import User
from .authentication import registered_user
from ..models.user import (
    FriendRequestResponse,
    FriendStatus,
)  # This line imports the models
from typing import List

api = APIRouter(prefix="/api/user")
openapi_tags = {
    "name": "Users",
    "description": "User profile search and related operations.",
}


@api.get("", response_model=list[User], tags=["Users"])
def search(
    q: str, subject: User = Depends(registered_user), user_svc: UserService = Depends()
):
    """Search for users based on a query string which matches against name, onyen, and email address."""
    return user_svc.search(subject, q)


@api.post(
    "/friend-requests/{target_user_id}",
    response_model=FriendRequestResponse,
    tags=["Users"],
)
def create_friend_request(
    target_user_id: int,
    subject: User = Depends(registered_user),
    user_svc: UserService = Depends(),
):
    """
    Send a friend request to another user.
    """
    # This would be replaced with the actual logic to send a friend request
    # Need to connect to front end
    return user_svc.send_friend_request(subject, target_user_id)


@api.get("/friends/status", response_model=List[FriendStatus], tags=["Users"])
def get_friends_status(
    subject: User = Depends(registered_user), user_svc: UserService = Depends()
):
    """
    Get the coworking status of friends.
    """
    # This would be replaced with the actual logic to retrieve friends' statuses
    # Need to connect to front end
    return user_svc.get_friends_status(subject)


@api.delete(
    "/friends/{friend_id}", response_model=FriendRequestResponse, tags=["Users"]
)
def remove_friend(
    friend_id: int,
    subject: User = Depends(registered_user),
    user_svc: UserService = Depends(),
):
    """
    Remove a friend from the user's friend list.
    """
    # This would be replaced with the actual logic to remove a friend
    # The UserService should have a corresponding method, e.g., user_svc.remove_friend
    return user_svc.remove_friend(subject, friend_id)


@api.post(
    "/friends/{friend_id}/favorite",
    response_model=FriendRequestResponse,
    tags=["Users"],
)
def favorite_friend(
    friend_id: int,
    subject: User = Depends(registered_user),
    user_svc: UserService = Depends(),
):
    """
    Mark a friend as a favorite.
    """
    return user_svc.favorite_friend(subject, friend_id)
