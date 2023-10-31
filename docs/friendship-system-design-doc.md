# Friendship System XML

### Authors: Amit Garine, Jasper Ou, Wilson Haynie, Nikhil Sarin

## Overview

This feature will allow students to connect with and make friends within other students/peers in the CS program. Students can send friend requests to other students. The student receiving the friend request can accept/decline the request and if they are already friends the student can unadd the friend as well. Once friendship connections are established, students can identify which friends are currently available at the XL coworking space and where they're seated. This system will make the overall experience of group study and collaboration more seamless and efficient.

## Key Personas

**Sally Student**
**Persona Description** Sally is a student and wants to friend request her peers in the computer science program and be able to see which students are checked into the XL and where they are sitting at. Sally's main needs and goals of this feature are to be able to connect with other students and find out when and where they will be in the XL and possibly collaborate with them on various projects and assignments. She also wants to be able to remove friends from her friend list.

## User Stories

**Story A**
As Sally Student, I want to be able to send friends requests to my peers and see a list of all of my friends.

**Story B**
As Sally Student, I want to be notified of when someone else friends me and have the option to accept/reject pending requests.

**Story C**
As Sally Student, I want to be able to view which of my friends are already checked into the XL. This way, I will be able to see who is currently working in the XL.

**Story D**
As Sally Student, I want to have option to see where my friends are sitting. This way, I can easily find them.

## Wireframe

**Home Page**

![Wireframe_Home](images/wireframe0.png)

**Friends Page**

![Wireframe_friends](images/wireframe1.png)

**Edit Friends Page**

![Wireframe_editFriends](images/wireframe2.png)

## Technical Implementation Opportunities and Planning

**What specific areas of the existing code base will you directly depend upon, extend, or integrate with?**
In the backend we plan to expand and depend upon the User Profiles, User Models, Reservation API routing, and Profile. In the frontend we will expand upon the navigation and side navigation bar.

**What planned page components and widgets, per the assigned reading, do you anticipate needing in your feature’s frontend?**
In the frontend we will need to add a Friend Management page/dashboard where the user can manage all their friends. We will also need to have a search bar component and add friend button so the user can search by name or onyen to find and request friends. We intend to have another component for displaying friends and also having a friend status indicator that will indicate if the friend is currently checked into the XL coworking space. In the Friends Porfile page we will show the friends list and also have an unadd button that cna be used to remove a friend. We will have a consistent search bar and button widget for consistent use throughout the website and through these pages.

**What additional models, or changes to existing models, do you foresee needing (if any)?**
To create this friendship system we will need to add a Friendship Model that will represent a relationship between the requested user and the receiving user. Also we will need another model for FriendRequests to display pending, accepted, or declined requests. In addition we will need to expand upon both the User Model and the Reservation Model to include the friends and friends requests.

**Considering your most-frequently used and critical user stories, what API / Routes do you foresee modifying or needing to add?**
We forsee adding a couple different API routes. Here are the main ones:
**Add**
POST /friends/request: Used to send friend requests
PUT /friends/accept/{requester_id}: To accept friend requests
PUT /friends/declines/{requester_id}: To decline a friend request
DELETE /friends/{friend_id}: to unadd a friend.
GET Friends API request to search for users based on query
**Modifying**
We intend to modify User routes to include a list of friends/friend requests for the user. Also we intend to modify reservation routes to include friends that are in the reserved time slot.

**What concerns exist for security and privacy of data? Should the capabilities you are implementing be specific to only certaain users or roles? (For example: When Sally Student makes a reservation, only Sally Student or Amy Ambassador should be able to cancel the reservation. Another student, such as Sam Student, should not be able to cancel Sally’s reservation.)**
We have to make sure to keep data privacy in check and ensure that friends lists are only visible to each user. Also we have to limit the amount of friend requests one is able to send so limit spamming. We have to implement specific error handling on the backend as well to ensure that users can only perform actions they're supposed to.
