import { Component, OnInit } from '@angular/core';
import { FriendsService } from './friends.service';

interface Friend {
  id: number;
  name: string;
  isWorking: boolean;
  isFavorite?: boolean; // Optional property to track favorite status
}

interface FriendRequest {
  id: number;
  name: string;
}

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent implements OnInit {
  friends: Friend[] = [];
  friendRequests: FriendRequest[] = []; // Array to store pending friend requests
  newFriendId: number | null = null;
  newFriendName: string = '';

  constructor(private friendsService: FriendsService) {}

  ngOnInit() {
    this.loadAllFriends();
    this.loadFriendRequests(); // Load friend requests on initialization
  }

  loadAllFriends() {
    this.friends = this.friendsService.getAllFriends();
  }

  loadFriendRequests() {
    // Assume that your FriendsService has a method to get friend requests
    this.friendRequests = this.friendsService.getFriendRequests();
  }

  addFriend() {
    if (this.newFriendId !== null) {
      this.friendsService.addFriend(this.newFriendId, this.newFriendName);
      this.newFriendId = null;
      this.newFriendName = '';
      this.loadAllFriends();
    }
  }

  deleteFriend(id: number) {
    const friend = this.friends.find((f) => f.id === id);
    if (friend) {
      alert(`Removing ${friend.name} from your friends list`);
      this.friendsService.deleteFriend(id);
      this.loadAllFriends();
    }
  }

  toggleWorkingStatus(id: number) {
    this.friendsService.toggleWorkingStatus(id);
    this.loadAllFriends();
  }

  acceptFriendRequest(id: number) {
    // Method to accept a friend request
    this.friendsService.acceptFriendRequest(id);
    this.loadFriendRequests();
  }

  declineFriendRequest(id: number) {
    // Method to decline a friend request
    this.friendsService.declineFriendRequest(id);
    this.loadFriendRequests();
  }

  toggleFavorite(id: number) {
    const friend = this.friends.find((f) => f.id === id);
    if (friend) {
      friend.isFavorite = !friend.isFavorite; // Toggle the isFavorite property
    }
  }
}
