import { Injectable } from '@angular/core';

interface Friend {
  id: number;
  name: string;
  isWorking: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  // Dummy data for friends
  private friends = [
    { id: 123456789, name: 'John Doe', isWorking: false },
    { id: 987654321, name: 'Jane Smith', isWorking: false }
  ];

  constructor() {}

  // Fetch all friends
  getAllFriends() {
    alert('Fetching all friends...');
    return this.friends;
  }

  // Add a new friend
  addFriend(id: number, name: string) {
    alert(`Adding friend: ${name}`);
    let newId = this.friends.length + 1;
    this.friends.push({ id, name, isWorking: false });
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
    alert(`Deleting friend with id ${id}`);
    this.friends = this.friends.filter((f) => f.id !== id);
  }

  toggleWorkingStatus(id: number): void {
    const friend = this.friends.find((f) => f.id === id);
    if (friend) {
      friend.isWorking = !friend.isWorking;
    }
  }
}
