Descriptions and sample data representations of new or modified model representation(s) and API routes supporting your feature’s stories:

Friend Request Model :

The model represents a friend request within the program. It was designed to have only the necessary details of a friend request; which includes the IDs of the sender and the reciever as well as the acceptance status, if the request is pending, and the timestamp of creation.

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

Sample API route usage:

POST /api/friend-requests/456

Response:
{
"id": 789,
"sender_id": 123,
"receiver_id": 456,
"is_accepted": false,
"pending": True,
"created_at": "2023-11-20T12:00:00"

}

Description of underlying database/entity-level representation decisions

The fields within the FriendRequest model are chosen to represent the basic details of a friend request.

Fields within the 'FriendRequest' Model:

- id: a unique ID for each friend request
- sender_id : the ID of the user who is sending the request
- reciever_id: the ID of the User who is recieving the request
- is_acccepted: A boolean that indicates whether the friend request has been accepted
- pending: A boolean that indicates whether the friend request is still pending
- created_at: The timestamp of when the friend request was made

At least one technical and one user experience design choice your team weighed the trade-offs with justification for the decision (we chose X over Y, because…)

# come back to this once sprint is finalized

The team chose to implement a friendship management system, that includes features such as accepting and declining requests, making friends favorite, and a search functionallity to add freinds. This decision was made because it will allow for greater user engagement and interaction within the application. By allowing users to have 'friends', the application becomes more socially interactive. As a team we chose this option of a more 'bare boned' approach because we thought that the more user friendly the application could be would result in individuals wanting to work and study at the CSXL more frequently.

The layout of the friends page was redesinged with an interactive interfacwe, including friend requests and friend list management. The team chose this design to enchance the user expierence by making the interface simple and easy to understand and navigate. The seperation of sections as well as interactive elements like buttons for accepting/declining request make the interface more engaging.

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
    pending: bool = True
    created_at: datetime | None = None

    class Config:
        orm_mode = True

The friend request model represents the structure of the friend requests within the database. Get familiar with the fields of and understand the ORM.

API Routes:

Contains the API endpoints for managing friend requests. Understand how each endpoint interacts with the database and the expected responses.

Front end:

Friends Page component:

Manages the display and interaction with the friend requests within the frontend. Get familiar with Angular components and event handling related to friend requests.

Friends service:

Handles the logic for sending, accepting, rejecting and listing friend requests on the front end. Unserstand how the service interacts with the backend API.
