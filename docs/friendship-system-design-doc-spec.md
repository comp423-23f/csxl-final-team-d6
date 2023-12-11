# Technical Specifification Documentation

## 1. Descriptions and representations of new/modified model representation(s) and API routes supporting your feature’s stories

### Models:

For our feature, there are two new models — one for a friend request and one for a frienship. 

For the friend request model, it was designed such that it only contained the neccessery details of a friend request. These details include a person who recieves a request, an ID for the person who sends a request,  an acceptance status, and a timestamp of creation.

The friendship model was similarly designed to contain the neccessery details needed for a friendship. These details include a user ID and a friend ID.

These two models can be found in `/backend/models/friends.py`. Here is a representation of each model:

1. `FriendRequest` Model
```python
class FriendRequest(BaseModel):

    id: int | None = None
    sender_id: int
    receiver_id: int
    created_at: datetime | None = None

    class Config:
        orm_mode = True
```

2. `Friendship` Model

```python
class FriendshipModel(BaseModel):

    user_id: int
    friend_id: int

    class Config:
        orm_mode = True
```

### API Routes:

From these models, there are new API routes. There are API routes for friend requests that allow the user to send a friend request, accept a friend request, and reject a friend request. Additionally, there are routes that allow the user to see a list of their incoming and outgoing friend requests. And finally, there are routes that give the user information about their friends, see their friend's working status, and the option to delete a friend.

These routes canbe found in `/backend/api/friends.py`. Here is a representation of the API routes:
  - Send Request:  `POST /api/friends/{sender_id}/{receiver_id}`
  - Accept Request: `PUT /api/friends/accept/{sender_id}/{request_id}`
  - Reject Request: `DELETE /api/friends/reject/{sender_id}/{request_id}`
  - List Incoming Requests: `GET /api/friends/incoming-requests/{user_id}`
  - List Outgoing Requests: `GET /api/friends/outgoing-requests/{user_id}`
  - List User Friends: `GET /api/friends/friends-list/{user_ud}`
  - Remove Friend: `DELETE /api/friends/remove-friend/{user_id}/{friend_id}`
  - Get Friend Information: `GET /api/friends/friend-info/{friend_id}`
  - Get Friend Status: `GET /api/friends/friends-status/{user_id}`

## 2. Description of underlying database/entity-level representation decisions

1. Friend Request Entity

A database can be found in `/backend/entities/friend_request_entity.py`. This file is a SQLAlchemy ORM entity that extends `EntityBase` and maps to a table named `friend_requests` in the database. 

The key attributes of this database include:
 - `id`: An auto-incrementing primary key
 - `sender_id` and `receiver_id`: Foreign keys that reference the users id for the sender and receiver
 - `is_accepted`: A boolean that denotes whether or not a friend request has been accepted
 - `created_at`: A timestamp that records when a friend request was made
 - `from_model` and `to_model`: Methods that allows this class to work with the Pydantic model

 This class establishes relationships with the `UserEntity` for both the sender and receiver. This, in turn, allows the `FriendRequest` instance to directly access associated user data.

2. Friendship Entity

Another database can be found in `/backend/entities/friendship_entity.py`. This file is also a  SQLAlchemy ORM entity that extends `EntityBase` and maps to a table named `friendships` in the database. 

The key attributes of this database include:
 - `user_id` and `friend_id`: Foreign keys that references the user's id for creating a friendship
 - `from_model` and `to_model`: Methods that allows this class to work with the Pydantic model

## 3. At least one technical and one user experience design choice your team weighed the trade-offs with justification for the decision

### Technical Design Choice

For our model, we decided to only include the neccesery details for a friend request. These details include IDs, a acceptance status, and a creation date. We could have added other details to the friends request but we decided against it due to time restrictions. Instead, we wanted to make sure that we had functional minimum viable product so we tried to streamline the details to only what was neccesery.

### User Experience Design Choice

For the user experience, we decided to have the `Coworking Status` widget to be at the top of the application rather than `Friend Requests` and `Edit Friends`. This is because we thought that the application's widgets should be sorted based on importance. When a user navigates to their `Friends` page, we figured that the first thing that they would want to know is if their friends are also working in the CSXL so they would have someone else that they could work with. Because of this, we thought that the `Coworking Status` widget should be first.

## 4. Development concerns: How does a new developer get started on your feature? Brief guide/tour of the files and concerns they need to understand to get up-to-speed.

### Frontend

In the frontend, navigate to `/frontend/src/app/friends-page`. Here, all of the important files needed for this feature such as the angular component and service needed to for a friendship system in the CSXL.

The component manages the display and interaction of the friends within the frontend. Getting familiar with the components and event handling with regards to friend requests is particularly important for this feature. 

The service handles the logic for sending, accepting/rejecting, and listing friend requests and friends on the frontend. In order to get started on this feature, it is crucial to understand how this service works with the backend API routes.

### Backend

In the backend, it is important to understand the database, API routes, and the models that have been created.

For the database, navigate to `/backend/entities/friend_request_entity.py` and `/backend/entities/friendship_entity.py`. These are the databases that this feature works with.

For the API routes, navigate to `/backend/api/friend.py`. Here, there will be all of the API routes that the service works with.

For the model, navigate to `/backend/models/friend.py`. Here, there will be the two models that this feature uses.
