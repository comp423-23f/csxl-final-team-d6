import { Component, OnInit } from '@angular/core';
import { FriendsService } from './friends.service';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent implements OnInit {
  friends: { id: number; name: string }[] = [];
  newFriendId: number | null = null; // <-- Updated this line
  newFriendName: string = '';

  constructor(private friendsService: FriendsService) {}

  ngOnInit() {
    this.loadAllFriends();
  }

  loadAllFriends() {
    this.friends = this.friendsService.getAllFriends();
  }

  addFriend() {
    if (this.newFriendId !== null) {
      // Make sure to add this check
      this.friendsService.addFriend(this.newFriendId, this.newFriendName);
      this.newFriendId = null;
      this.newFriendName = '';
      this.loadAllFriends();
    }
  }

  deleteFriend(id: number) {
    this.friendsService.deleteFriend(id);
    this.loadAllFriends();
  }
}
