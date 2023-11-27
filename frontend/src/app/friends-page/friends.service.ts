import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  id: number;
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

interface FriendRequest {
  id: number;
  sender_id: number;
  receiver_id: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  // https://team-d6-comp423-23f.apps.cloudapps.unc.edu/api
  // http://localhost:1560/api
  private apiUrl = 'http://localhost:1560/api';
  
  constructor(private http: HttpClient) {}

  // Method to get user profile details
  getProfile(): Observable<any> {
    // Replace 'any' with a more specific type if available
    return this.http.get<User[]>(`${this.apiUrl}/profile`);
  }

  getUserInfo(friendId: number): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/friends/friend-info/${friendId}`
    );
  }

  getAllFriends(userId: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiUrl}/friends/friends-list/${userId}`
    );
  }

  getIncomingFriendRequests(userId: number): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(
      `${this.apiUrl}/friends/incoming-requests/${userId}`
    );
  }

  getOutgoingFriendRequests(userId: number): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(
      `${this.apiUrl}/friends/outgoing-requests/${userId}`
    );
  }

  acceptFriendRequest(senderId: number, receiverId: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/friends/accept/${senderId}/${receiverId}`,
      {}
    );
  }

  rejectFriendRequest(senderId: number, receiverId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/friends/reject/${senderId}/${receiverId}`
    );
  }

  sendFriendRequest(senderId: number, receiverId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/friends/${senderId}/${receiverId}`,
      {}
    );
  }

  removeFriend(userId: number, friendId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/friends/remove-friend/${userId}/${friendId}`,
      {}
    );
  }

  searchFriends(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/user`, {
      params: { q: query }
    });
  }
}
