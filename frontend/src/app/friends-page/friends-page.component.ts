import { Component, OnInit } from '@angular/core';
import { FriendsService } from './friends.service';

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
  isWorking?: boolean;
}

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent implements OnInit {
  currentProfile: User | null = null;
  friends: User[] = [];
  incomingFriendRequests: User[] = [];
  outgoingFriendRequests: User[] = [];
  searchQuery: string = '';
  searchResults: User[] = [];
  showSearchBar: boolean = false;

  constructor(private friendsService: FriendsService) {}

  ngOnInit() {
    this.loadCurrentUserProfile();
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }

  loadCurrentUserProfile() {
    this.friendsService.getProfile().subscribe(
      (profile: User) => {
        this.currentProfile = profile;
        console.log('Received user profile:', profile); // Log the received profile data
        this.loadFriends();
        this.loadIncomingFriendRequests();
        this.loadOutgoingFriendRequests();
      },
      (error) => {
        console.error('Error fetching current user profile:', error);
      }
    );
  }

  loadFriends() {
    if (this.currentProfile && this.currentProfile.id) {
      this.friendsService.getAllFriends(this.currentProfile.id).subscribe(
        (friends) => {
          friends.forEach((friend) => {
            this.friendsService.getWorkingStatus(friend.id).subscribe(
              (isWorking) => {
                friend.isWorking = isWorking;
              },
              (error) =>
                console.error(
                  `Error fetching working status for user ${friend.id}:`,
                  error
                )
            );
          });
          this.friends = friends;
          console.log('Friends loaded:', this.friends);
        },
        (error) => console.error('Error fetching friends:', error)
      );
    } else {
      console.error('Current user profile is not loaded. Cannot load friends.');
    }
  }

  loadIncomingFriendRequests() {
    if (this.currentProfile && this.currentProfile.id !== undefined) {
      const userId = this.currentProfile.id;
      this.incomingFriendRequests = []; // Clear existing requests
      this.friendsService.getIncomingFriendRequests(userId).subscribe(
        (requests) => {
          requests.forEach((request) => {
            this.friendsService.getUserInfo(request.sender_id).subscribe(
              (userInfo) => {
                this.incomingFriendRequests.push(userInfo);
              },
              (error) => console.error('Error fetching user info:', error)
            );
          });
        },
        (error) =>
          console.error('Error fetching incoming friend requests:', error)
      );
    } else {
      console.error(
        'Current user profile is not loaded or user ID is undefined. Cannot load incoming friend requests.'
      );
    }
  }

  loadOutgoingFriendRequests() {
    if (this.currentProfile && this.currentProfile.id !== undefined) {
      const userId = this.currentProfile.id;
      this.outgoingFriendRequests = [];
      this.friendsService.getOutgoingFriendRequests(userId).subscribe(
        (requests) => {
          requests.forEach((request) => {
            this.friendsService.getUserInfo(request.receiver_id).subscribe(
              (userInfo) => {
                this.outgoingFriendRequests.push(userInfo);
              },
              (error) => console.error('Error fetching user info:', error)
            );
          });
        },
        (error) =>
          console.error('Error fetching incoming friend requests:', error)
      );
    } else {
      console.error(
        'Current user profile is not loaded or user ID is undefined. Cannot load incoming friend requests.'
      );
    }
  }

  acceptFriendRequest(sender_id: number) {
    if (this.currentProfile && this.currentProfile.id !== undefined) {
      this.friendsService
        .acceptFriendRequest(sender_id, this.currentProfile.id)
        .subscribe({
          next: (response) => {
            console.log('Friend request accepted:', response);
            this.loadFriends(); // Reload friends list
            this.loadIncomingFriendRequests(); // Reload incoming requests
          },
          error: (error) => {
            console.error('Error accepting friend request:', error);
          }
        });
    } else {
      console.error(
        'Current user profile is not loaded or user ID is undefined.'
      );
    }
  }

  rejectFriendRequest(sender_id: number) {
    if (this.currentProfile && this.currentProfile.id !== undefined) {
      this.friendsService
        .rejectFriendRequest(sender_id, this.currentProfile.id)
        .subscribe({
          next: (response) => {
            console.log('Friend request rejected:', response);
            this.loadIncomingFriendRequests(); // Reload incoming requests
          },
          error: (error) => {
            console.error('Error rejecting friend request:', error);
          }
        });
    } else {
      console.error(
        'Current user profile is not loaded or user ID is undefined.'
      );
    }
  }

  cancelFriendRequest(receiver_id: number) {
    if (this.currentProfile && this.currentProfile.id !== undefined) {
      this.friendsService
        .rejectFriendRequest(this.currentProfile.id, receiver_id)
        .subscribe({
          next: (response) => {
            console.log('Friend request canceled:', response);
            this.loadOutgoingFriendRequests(); // Reload incoming requests
          },
          error: (error) => {
            console.error('Error canceling friend request:', error);
          }
        });
    } else {
      console.error(
        'Current user profile is not loaded or user ID is undefined.'
      );
    }
  }

  sendFriendRequest(receiverUser: User) {
    if (this.currentProfile && this.currentProfile.id !== undefined) {
      this.friendsService
        .sendFriendRequest(this.currentProfile.id, receiverUser.id)
        .subscribe({
          next: (response) => {
            if (response.id === -1) {
              console.log('Friendship automatically created');
              this.loadFriends();
              this.loadIncomingFriendRequests();
            } else {
              console.log('Friend request sent:', response);
              this.loadOutgoingFriendRequests();
            }
          },
          error: (error) => {
            console.error('Error sending friend request:', error);
          }
        });
    } else {
      console.error(
        'Current user profile is not loaded or user ID is undefined.'
      );
    }
  }

  removeFriend(friendId: number) {
    if (this.currentProfile && this.currentProfile.id !== undefined) {
      this.friendsService
        .removeFriend(this.currentProfile.id, friendId)
        .subscribe({
          next: (response) => {
            console.log('Friend removed:', response);
            this.loadFriends();
          },
          error: (error) => {
            console.error('Error removing friend:', error);
          }
        });
    } else {
      console.error(
        'Current user profile is not loaded or user ID is undefined.'
      );
    }
  }

  searchFriends() {
    if (this.searchQuery) {
      this.friendsService.searchFriends(this.searchQuery).subscribe(
        (results) => {
          // Filter out the current user, existing friends, and users with outgoing requests
          this.searchResults = results.filter(
            (user) =>
              user.id !== this.currentProfile?.id &&
              !this.friends.some((friend) => friend.id === user.id) &&
              !this.outgoingFriendRequests.some(
                (request) => request.id === user.id
              )
          );
        },
        (error) => {
          console.error('Error searching for friends:', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }
}
