from fastapi import APIRouter, Depends, HTTPException, Response, status

from backend.services.exceptions import ResourceNotFoundException
from ..services.friend import FriendRequestService
from ..models.friend import FriendRequest as FriendRequestModel
from ..models.user import User
from .authentication import registered_user

api = APIRouter(prefix="/api/friends")
openapi_tags = {
    "name": "Friends",
    "description": "Operations related to managing friend requests and friends.",
}


@api.post(
    "/{sender_id}/{receiver_id}",
    response_model=FriendRequestModel,
    tags=["Friends"],
)
def send_friend_request(
    sender_id: int,
    receiver_id: int,
    subject: User = Depends(registered_user),
    friend_request_svc: FriendRequestService = Depends(),
):
    """
    Send a friend request to another user.
    """
    if subject.id is None:
        raise HTTPException(status_code=400, detail="User ID is missing.")

    try:
        return friend_request_svc.send_request(sender_id, receiver_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api.put("/accept/{sender_id}/{receiver_id}", tags=["Friends"])
def accept_friend_request(
    sender_id: int,
    receiver_id: int,
    subject: User = Depends(registered_user),
    friend_request_svc: FriendRequestService = Depends(),
):
    """
    Accept a friend request.
    """
    try:
        friend_request_svc.accept_request(sender_id, receiver_id)
        return {"message": "Friend request accepted successfully."}
    except ResourceNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api.delete("/reject/{sender_id}/{receiver_id}", tags=["Friends"])
def reject_friend_request(
    sender_id: int,
    receiver_id: int,
    subject: User = Depends(registered_user),
    friend_request_svc: FriendRequestService = Depends(),
):
    """
    Reject a friend request.
    """
    try:
        friend_request_svc.reject_request(sender_id, receiver_id)
        return {"message": "Friend request rejected successfully."}
    except ResourceNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api.get(
    "/incoming-requests/{user_id}",
    response_model=list[FriendRequestModel],
    tags=["Friends"],
)
def list_incoming_friend_requests(
    user_id: int,
    friend_request_svc: FriendRequestService = Depends(),
    subject: User = Depends(registered_user),
):
    """
    List all incoming friend requests for a user.

    - **user_id**: ID of the user to list incoming friend requests for.
    """
    try:
        return friend_request_svc.list_incoming_requests(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api.get(
    "/outgoing-requests/{user_id}",
    response_model=list[FriendRequestModel],
    tags=["Friends"],
)
def list_outgoing_friend_requests(
    user_id: int,
    friend_request_svc: FriendRequestService = Depends(),
    subject: User = Depends(registered_user),
):
    """
    List all outgoing friend requests for a user.

    - **user_id**: ID of the user to list outgoing friend requests for.
    """
    try:
        return friend_request_svc.list_outgoing_requests(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api.get(
    "/friends-list/{user_id}",
    response_model=list[User],
    tags=["Friends"],
)
def list_user_friends(
    user_id: int,
    friend_request_svc: FriendRequestService = Depends(),
    subject: User = Depends(registered_user),
):
    """
    List all friends for a given user.

    - **user_id**: ID of the user to list friends for.
    """
    try:
        return friend_request_svc.list_friends(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api.delete(
    "/remove-friend/{user_id}/{friend_id}",
    tags=["Friends"],
)
def remove_friend(
    user_id: int,
    friend_id: int,
    subject: User = Depends(registered_user),
    friend_request_svc: FriendRequestService = Depends(),
):
    """
    Remove a friend from the user's friends list.

    - **user_id**: ID of the user who wants to remove a friend.
    - **friend_id**: ID of the friend to be removed.
    """

    try:
        friend_request_svc.remove_friend(user_id, friend_id)
        return {"message": "Friend successfully removed."}
    except ResourceNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api.get(
    "/friend-info/{friend_id}",
    response_model=User,
    tags=["Friends"],
)
def get_friend_information(
    friend_id: int,
    friend_request_svc: FriendRequestService = Depends(),
    subject: User = Depends(registered_user),
):
    """
    Get information about a specific friend of a user.

    - **user_id**: ID of the user requesting the friend's information.
    - **friend_id**: ID of the friend whose information is being requested.
    """
    try:
        return friend_request_svc.get_friend_info(friend_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
