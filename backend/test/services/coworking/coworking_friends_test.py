from unittest.mock import Mock, create_autospec
from backend.services.friend import FriendRequestService
from backend.models.user import User
from backend.services.coworking.reservation import ReservationService


def test_get_friends_check_in_status():
    # Mock dependencies
    reservation_service = create_autospec(ReservationService)
    friend_request_service = FriendRequestService()

    # Mock the list_friends and _get_reservation_id_for_friend methods
    friend_request_service.list_friends = Mock()
    friend_request_service._get_reservation_id_for_friend = Mock()

    # Setup test data
    user_id = 1
    friends = [User(id=2), User(id=3)]
    friend_request_service.list_friends.return_value = friends
    friend_request_service._get_reservation_id_for_friend.side_effect = [
        10,
        None,
    ]  # Assuming friend 2 has a reservation

    # Configure reservation service mock
    reservation_service.is_user_checked_in.side_effect = [
        True,
        False,
    ]  # Assuming friend 2 is checked in

    # Call the method
    friend_statuses = friend_request_service.get_friends_check_in_status(
        user_id, reservation_service
    )

    # Assertions
    assert len(friend_statuses) == 2
    assert friend_statuses[0]["friend"].id == 2
    assert friend_statuses[0]["is_checked_in"] == True
    assert friend_statuses[1]["friend"].id == 3
    assert friend_statuses[1]["is_checked_in"] == False
