from fastapi import APIRouter, Depends, HTTPException
from ..services.friend import FriendRequestService
from ..models.friend import FriendRequest as FriendRequestModel
from ..models.user import User
from .authentication import registered_user

api = APIRouter(prefix="/api/friend-requests")
openapi_tags = {
    "name": "Friend Requests",
    "description": "Operations related to managing friend requests.",
}


@api.post("/{receiver_id}", response_model=FriendRequestModel, tags=["Friend Requests"])
def send_friend_request(
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
        return friend_request_svc.send_request(subject.id, receiver_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api.put(
    "/accept/{request_id}", response_model=FriendRequestModel, tags=["Friend Requests"]
)
def accept_friend_request(
    request_id: int,
    subject: User = Depends(registered_user),
    friend_request_svc: FriendRequestService = Depends(),
):
    """
    Accept a friend request.
    """
    try:
        return friend_request_svc.accept_request(request_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api.put(
    "/reject/{request_id}", response_model=FriendRequestModel, tags=["Friend Requests"]
)
def reject_friend_request(
    request_id: int,
    subject: User = Depends(registered_user),
    friend_request_svc: FriendRequestService = Depends(),
):
    """
    Reject a friend request.
    """
    try:
        return friend_request_svc.reject_request(request_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api.get("/", response_model=list[FriendRequestModel], tags=["Friend Requests"])
def list_friend_requests(
    subject: User = Depends(registered_user),
    friend_request_svc: FriendRequestService = Depends(),
):
    """
    List all friend requests for the logged-in user.
    """
    if subject.id is None:
        raise HTTPException(status_code=400, detail="User ID is missing.")

    try:
        return friend_request_svc.list_requests(subject.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
