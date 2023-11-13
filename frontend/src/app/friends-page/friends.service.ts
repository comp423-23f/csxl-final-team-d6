import { Injectable } from '@angular/core';

interface Friend {
  id: number;
  name: string;
  isWorking: boolean;
  isFavorite: boolean;
}

// New interface for FriendRequest
interface FriendRequest {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  // Dummy data for friends
  private friends = [
    { id: 123456789, name: 'John Doe', isWorking: false, isFavorite: false },
    { id: 987654321, name: 'Jane Smith', isWorking: false, isFavorite: false }
  ];

  // Dummy data for friend requests
  private friendRequests: FriendRequest[] = [
    { id: 123456788, name: 'Spongebob' },
    { id: 887654321, name: 'Patrick' }
  ];

  constructor() {}

  // Fetch all friends
  getAllFriends() {
    return this.friends;
  }

  // Add a new friend
  addFriend(id: number, name: string) {
    alert(`${name} has been added as a friend!`);
    let newId = this.friends.length + 1;
    this.friends.push({
      id,
      name,
      isWorking: false,
      isFavorite: false
    });
  }

  // Update friend by id
  updateFriend(id: number, name: string) {
    alert(`Updating friend with id ${id} to name ${name}`);
    const friend = this.friends.find((f) => f.id === id);
    if (friend) {
      friend.name = name;
    }
  }

  // Delete friend by id
  deleteFriend(id: number) {
    this.friends = this.friends.filter((f) => f.id !== id);
  }

  toggleWorkingStatus(id: number): void {
    const friend = this.friends.find((f) => f.id === id);
    if (friend) {
      friend.isWorking = !friend.isWorking;
    }
  }

  // New method to fetch friend requests
  getFriendRequests() {
    return this.friendRequests;
  }

  // New method to accept a friend request
  acceptFriendRequest(id: number) {
    const requestIndex = this.friendRequests.findIndex((req) => req.id === id);
    if (requestIndex > -1) {
      // Assuming accepting a friend request adds them to your friends list
      const request = this.friendRequests[requestIndex];
      this.addFriend(request.id, request.name);
      this.friendRequests.splice(requestIndex, 1);
    }
  }

  // New method to decline a friend request
  declineFriendRequest(id: number) {
    this.friendRequests = this.friendRequests.filter((req) => req.id !== id);
  }

  // Method to search for friends by name
  searchFriends(name: string): Friend[] {
    return this.friends.filter((friend) =>
      friend.name.toLowerCase().includes(name.toLowerCase())
    );
  }
}
