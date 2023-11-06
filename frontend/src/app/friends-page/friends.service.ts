import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  // Dummy data for friends
  private friends = [
    { id: 123456789, name: 'John Doe' },
    { id: 987654321, name: 'Jane Smith' }
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
    this.friends.push({ id: newId, name: name });
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
}
