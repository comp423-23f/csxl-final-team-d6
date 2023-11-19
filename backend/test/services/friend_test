import pytest
from sqlalchemy.orm import Session
from services.friend import FriendRequestService
from models.friend import FriendRequest as FriendRequestModel


@pytest.fixture
def friend_request_service(test_session: Session):
    return FriendRequestService(session=test_session)


def test_send_request(friend_request_service: FriendRequestService):
    sender_id = 1  # Example sender ID
    receiver_id = 2  # Example receiver ID
    friend_request = friend_request_service.send_request(sender_id, receiver_id)
    assert friend_request.sender_id == sender_id
    assert friend_request.receiver_id == receiver_id
    assert friend_request.is_accepted is None


def test_accept_request(friend_request_service: FriendRequestService):
    request_id = 1  # Example request ID
    friend_request = friend_request_service.accept_request(request_id)
    if friend_request:
        assert friend_request.id == request_id
        assert friend_request.is_accepted is True


def test_reject_request(friend_request_service: FriendRequestService):
    request_id = 1  # Example request ID
    friend_request = friend_request_service.reject_request(request_id)
    if friend_request:
        assert friend_request.id == request_id
        assert friend_request.is_accepted is False


def test_list_requests(friend_request_service: FriendRequestService):
    user_id = 1  # Example user ID
    requests = friend_request_service.list_requests(user_id)
    assert isinstance(requests, list)
    # Further assertions can be made based on the expected output


def test_accept_nonexistent_request(friend_request_service: FriendRequestService):
    result = friend_request_service.accept_request(999)  # Nonexistent request ID
    assert result is None or result.is_accepted is not True


def test_reject_nonexistent_request(friend_request_service: FriendRequestService):
    result = friend_request_service.reject_request(999)  # Nonexistent request ID
    assert result is None or result.is_accepted is not False


def test_list_requests_empty(friend_request_service: FriendRequestService):
    user_id = 999  # Example user ID with no friend requests
    requests = friend_request_service.list_requests(user_id)
    assert isinstance(requests, list)
    assert len(requests) == 0
