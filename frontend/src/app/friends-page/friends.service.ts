import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  pid: number;
  onyen: string;
  first_name: string;
  last_name: string;
  email: string;
  pronouns: string;
  github: string;
  github_id: number | null;
  github_avatar: string | null;
}

interface Friend {
  id: number;
  pid: number;
  first_name: string;
  last_name: string;
  isWorking: boolean;
  isFavorite: boolean;
  pending?: boolean;
}

// New interface for FriendRequest
interface FriendRequest {
  id: number;
  first_name: string;
  last_name: string;
  sender_id: number;
  receiver_id: number;
  receiver_pid: number;
  is_accepted: boolean;
  pending: true;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private apiUrl = 'https://team-d6-comp423-23f.apps.cloudapps.unc.edu/api';

  // Dummy data for friends
  private friends = [
    { id: 123456789, name: 'John Doe', isWorking: false, isFavorite: false },
    { id: 987654321, name: 'Jane Smith', isWorking: false, isFavorite: false }
  ];

  constructor(private http: HttpClient) {}

  // Method to get user profile details
  getProfile(): Observable<any> {
    // Replace 'any' with a more specific type if available
    return this.http.get<User[]>(`${this.apiUrl}/profile`);
  }

  // Fetch all friends
  getAllFriends(): Observable<Friend[]> {
    return this.http.get<Friend[]>(`${this.apiUrl}/user`);
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
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/friend-requests/`);
  }

  // New method to accept a friend request
  acceptFriendRequest(request_id: number) {
    return this.http.put<FriendRequest>(
      `${this.apiUrl}/friend-requests/accept/${request_id}`,
      {}
    );
  }

  // New method to decline a friend request
  declineFriendRequest(request_id: number) {
    return this.http.put<FriendRequest>(
      `${this.apiUrl}/friend-requests/reject/${request_id}`,
      {}
    );
  }

  // Method to search for friends by name
  searchFriends(query: string): Observable<Friend[]> {
    return this.http.get<Friend[]>(`${this.apiUrl}/user`, {
      params: { q: query }
    });
  }

  sendFriendRequest(
    senderID: number,
    receiverId: number,
    receiverPID: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/friend-requests/${senderID}/${receiverId}/${receiverPID}`,
      {}
    );
  }
}
