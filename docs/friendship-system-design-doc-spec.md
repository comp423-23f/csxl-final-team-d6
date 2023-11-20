# Technical Specifification Documentation

## 1. Descriptions and sample data representations of new or modified model representation(s) and API routes supporting your feature’s stories

### Models:

We created a new model to represent a friend request within the program. Specifically, this model was designed such that it only has the neccessery details of a friend request. These details include the ID of the person who sends a request, a person who recieves a request, an acceptance status, and a timestamp of creation.

This model can be found in `/backend/models/friends.py`. Here is a representation of the model:

```python
class FriendRequest(BaseModel):
    """
    Pydantic model to represent a `FriendRequest`.

Descriptions and sample data representations of new or modified model representation(s) and API routes supporting your feature’s stories:

Friend Request Model :

The model represents a friend request within the program. It was designed to have only the necessary details of a friend request; which includes the IDs of the sender and the reciever as well as the acceptance status and the timestamp of creation.

representation:

class FriendRequest(BaseModel):
"""
Pydantic model to represent a `FriendRequest`.

    This model is based on the `FriendRequest` entity, which defines the shape
    of the `friend_requests` table in the database.
    """

    id: int | None = None
    sender_id: int
    receiver_id: int
    is_accepted: bool = False
    pending: bool = True


    created_at: datetime | None = None

    class Config:
        orm_mode = True
```

### API Routes

We created a new API route for the friend request model. Specifically, this API route allows for friend requests to be sent, accepted, rejected, and allows for the user to see a list of all of their friend requests.

The API route can be found in `/backend/api/friends.py`. Here is a representation of the API route:
  - Send Request:  `POST /api/friend-requests/{receiver_id}` 
  - Accept Request: `PUT /api/friend-requests/accept/{request_id}`
  - Reject Request: `PUT /api/friend-requests/reject/{request_id}`
  - List Requests: `GET /api/friend-requests/`

## 2. Description of underlying database/entity-level representation decisions

The underlying database can be found in `/backend/entities/friend_request_entity.py`. This file is a SQLAlchemy ORM entity that extends `EntityBase` and maps to a table named `friend_requests` in the database. 

The key attributes of this database include:
 - `id`: An auto-incrementing primary key
 - `sender_id` and `receiver_id`: Foreign keys that reference the users id for the sender and receiver
 - `is_accepted`: A boolean that denotes whether or not a friend request has been accepted
 - `created_at`: A timestamp that records when a friend request was made
 - `from_model` and `to_model`: Methods that allows this class to work with the Pydantic model

 This class establishes relationships with the `UserEntity` for both the sender and receiver. This, in turn, allows the `FriendRequest` instance to directly access associated user data. 

## 3. At least one technical and one user experience design choice your team weighed the trade-offs with justification for the decision (we chose X over Y, because…)

### Technical Design Choice

For our model, we decided to only include the neccesery details for a friend request. These details include IDs, a acceptance status, and a creation date. We could have added other details to the friends request but we decided against it due to time restrictions. Instead, we wanted to make sure that we had functional minimum viable product so we tried to streamline the details to only what was neccesery.

### User Experience Design Choice

For the user experience, we decided to have the `Coworking Status` widget to be at the top of the application rather than `Friend Requests` and `Edit Friends`. This is because we thought that the application's widgets should be sorted based on importance. When a user navigates to their `Friends` page, we figured that the first thing that they would want to know is if their friends are also working in the CSXL so they would have someone else that they could work with. Because of this, we thought that the `Coworking Status` widget should be first.

## 4. Development concerns: How does a new developer get started on your feature? Brief guide/tour of the files and concerns they need to understand to get up-to-speed.

If a new developer were to get started on our feature, they would need to review these files:

### Frontend

In the frontend, you need to navigate to `/frontend/src/app/friends-page`. Here, you will find the all of the important files needed for this feature such as the angular component and service needed to for a friendship system in the CSXL.

The component manages the display and interaction of the friends within the frontend. Getting familiar with the components and event handling with regards to friend requests is particularly important for this feature. 

The service handles the logic for sending, accepting, rejecting, and listing friend request on the frontend. Importantly, you must understand how this service works with the backend API routes.

### Backend

In the backend, it is crucial that you understand the database, API routes, and the models that have been created.

For the database, navigate to `/backend/entities/friend_request_entity.py`. This is the database that this feature works with

For the API routes, navigate to `/backend/api/friend.py`. Here you will find the API routes that the service works with.

For the model, navigate to `/backend/models/friend.py`. Here you will find the friend model that this feature uses.

Backend API routes that were added:

file: backend/api/friend.py

- Send Friend Request: POST /api/friend-requests/{receiver_id}
  Allows a user to send a friend request

- Accept Friend Request: PUT /api/friend-requests/accept/{request_id}
  Allows the user to accept a friend request

- Reject Friend Request: PUT /api/friend-requests/reject/{request_id}
  Allows the user to deny a friends request.

- List Friend Requests: GET /api/friend-requests/
  List all friend requests to the user

Description of underlying database/entity-level representation decisions

The fields within the FriendRequest model are chosen to represent the basic details of a friend request. Including who sent it, who is recieving it, the acceptance status and the when the request was created. The model contains 'orm_mode = True' to allow for ORM compatability.

At least one technical and one user experience design choice your team weighed the trade-offs with justification for the decision (we chose X over Y, because…)

# come back to this once sprint is finalized

Development concerns: How does a new developer get started on your feature? Brief guide/tour of the files and concerns they need to understand to get up-to-speed.

The friend request feature allows users to send, recieve, accept and decline friend requests. There are frontend and backend aspects that allow for user interaction and handle the requests.

For the backend:
Understand the model:

class FriendRequest(BaseModel):
"""
Pydantic model to represent a `FriendRequest`.

    This model is based on the `FriendRequest` entity, which defines the shape
    of the `friend_requests` table in the database.
    """

    id: int | None = None
    sender_id: int
    receiver_id: int
    is_accepted: bool = False
    created_at: datetime | None = None

    class Config:
        orm_mode = True

The friend request model represents the structure of the friend requests within the database. Get familiar with the fields of and understand the ORM.

API Routes:

Contains the API endpoints for managing firend requests. Understand how each endpoint interacts with the database and the expected responses.

Front end:

Friends Page component:

Manages the display and interaction with the friend requests within the frontend. Get familiar with Angular components and event handling related to friend requests.

Friends service:

Handles the logic for sending, accepting, rejecting and listing friend requests on the front end. Unserstand how the service interacts with the backend API.
