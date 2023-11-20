import { Component, OnInit } from '@angular/core';
import { FriendsService } from './friends.service';

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
  first_name: string;
  last_name: string;
  isWorking: boolean;
  isFavorite: boolean;
  pending?: boolean;
}

interface FriendRequest {
  id: number;
  sender_id: number;
  receiver_id: number;
  is_accepted: boolean;
  pending: true;
  created_at: string;
}

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent implements OnInit {
  currentProfile: User | null = null;
  friends: Friend[] = [];
  friendRequests: FriendRequest[] = []; // Array to store pending friend requests
  newFriendId: number | null = null;
  newFriendName: string = '';

  searchQuery: string = '';
  searchResults: Friend[] = [];
  showSearchBar: boolean = false;

  constructor(private friendsService: FriendsService) {}

  ngOnInit() {
    // this.loadAllFriends();
    this.loadCurrentUserProfile();
    this.loadFriendRequests(); // Load friend requests on initialization
  }

  // loadAllFriends() {
  //   this.friends = this.friendsService.getAllFriends();
  // }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }

  loadCurrentUserProfile() {
    console.log('hey');
    // Implement this method to fetch the current user's profile
    // For example, if you have a method `getCurrentUserProfile` in your service:
    this.friendsService.getProfile().subscribe(
      (profile: User) => {
        this.currentProfile = profile;
        console.log('Received user profile:', profile); // Log the received profile data
      },
      (error) => {
        console.error('Error fetching current user profile:', error);
      }
    );
  }

  loadFriendRequests() {
    // this.friendsService.getFriendRequests().subscribe(
    //   (friendRequests) => {
    //     // Use optional chaining to safely access pid
    //     const currentProfilePid = this.currentProfile?.pid;
    //     if (currentProfilePid != null) {
    //       this.friendRequests = friendRequests.filter(
    //         (request) =>
    //           // request.receiver_id === this.currentProfile.pid && request.pending
    //       );
    //       console.log('Filtered Friend Requests:', this.friendRequests);
    //     } else {
    //       console.log(
    //         'Current profile is null or undefined, unable to load friend requests'
    //       );
    //       // Handle the case where currentProfile is null or undefined
    //     }
    //   },
    //   (error) => {
    //     console.error('Error fetching friend requests:', error);
    //   }
    // );
  }

  loadFriends() {
    this.friendsService.getFriendRequests().subscribe(
      (friendRequests) => {
        // Filter out requests that are not pending
        this.friendRequests = friendRequests.filter(
          (request) => request.is_accepted
        );
        console.log('Filtered Friends:', this.friendRequests);
      },
      (error) => {
        console.error('Error fetching friends:', error);
      }
    );
  }

  addFriend() {
    if (this.newFriendId !== null) {
      this.friendsService.addFriend(this.newFriendId, this.newFriendName);
      this.newFriendId = null;
      this.newFriendName = '';
      // this.loadAllFriends();
    }
  }

  deleteFriend(id: number) {
    const friend = this.friends.find((f) => f.id === id);
    if (friend) {
      alert(`Removing ${friend.first_name} from your friends list`);
      this.friendsService.deleteFriend(id);
      // this.loadAllFriends();
    }
  }

  toggleWorkingStatus(id: number) {
    this.friendsService.toggleWorkingStatus(id);
    // this.loadAllFriends();
  }

  acceptFriendRequest(id: number) {
    this.friendsService.acceptFriendRequest(id).subscribe(
      (updatedRequest) => {
        console.log('Friend request accepted:', updatedRequest);
        this.loadFriendRequests(); // Reload friend requests
      },
      (error) => {
        console.error('Error accepting friend request:', error);
      }
    );
  }

  declineFriendRequest(id: number) {
    this.friendsService.declineFriendRequest(id).subscribe(
      (updatedRequest) => {
        console.log('Friend request declined:', updatedRequest);
        this.loadFriendRequests(); // Reload friend requests
      },
      (error) => {
        console.error('Error declining friend request:', error);
      }
    );
  }

  toggleFavorite(id: number) {
    const friend = this.friends.find((f) => f.id === id);
    if (friend) {
      friend.isFavorite = !friend.isFavorite; // Toggle the isFavorite property
    }
  }

  searchFriends() {
    if (this.searchQuery) {
      this.friendsService.searchFriends(this.searchQuery).subscribe(
        (results) => {
          this.searchResults = results;
        },
        (error) => {
          console.error('Error searching for friends:', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  addFriendFromSearch(friend: Friend) {
    if (friend.id) {
      this.friendsService.sendFriendRequest(friend.id).subscribe(
        (response) => {
          // Handle the success response, e.g., show a success message
          console.log('Friend request sent successfully:', response); // Optionally, clear search results

          this.searchQuery = '';
          this.searchResults = []; // Optionally, you can reload the list of friend requests or friends here
          this.loadFriendRequests(); // Reload friend requests after sending a request
          // this.loadAllFriends(); // Reload friends list if needed
        },
        (error) => {
          // Handle any errors that may occur during the request
          console.error('Error sending friend request:', error);
        }
      );
    }
  }

  sendFriendRequest() {
    if (this.newFriendId !== null) {
      this.friendsService.sendFriendRequest(this.newFriendId).subscribe(
        (response) => {
          // Handle the success response, e.g., show a success message
          console.log('Friend request sent successfully:', response);

          // Optionally, you can reload the friend requests list or perform any other actions here
          this.loadFriendRequests(); // Reload friend requests after sending a request
        },
        (error) => {
          // Handle any errors that may occur during the request
          console.error('Error sending friend request:', error);
        }
      );

      this.newFriendId = null;
      this.newFriendName = '';
    }
  }
}
