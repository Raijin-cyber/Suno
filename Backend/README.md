<h1 align="center">ORBI Backend</h1>

<p align="center">
  <strong>Scalable real-time messaging backend built with Node.js, Express, Socket.IO, and MongoDB.</strong>
</p>

<p align="center">
  Authentication • Real-Time Communication • Clean Architecture • Secure Messaging
</p>

---

## Overview

ORBI Backend powers the ORBI messaging platform by providing secure authentication, real-time communication, conversation management, notification handling, and persistent message storage.

The system is designed using Clean Architecture principles, separating business logic, transport layers, persistence, and real-time communication into dedicated modules.

The backend combines REST APIs with Socket.IO to provide a reliable and scalable messaging experience while maintaining database persistence for every critical operation.

---

## Core Features

### Authentication

* Access Token + Refresh Token architecture
* JWT-based authentication
* Secure password hashing using bcrypt
* Protected REST endpoints
* Protected Socket.IO connections
* Email verification system (Planned)
* Password reset workflow (Planned)

---

### Real-Time Communication

* Socket.IO powered communication
* Conversation-based room architecture
* Automatic room joining using conversation IDs
* Instant message delivery
* Real-time notification delivery
* Online/offline user presence

---

### Messaging System

* One-to-one conversations
* Group conversations
* Persistent message storage
* Delivery tracking
* Read receipts
* Typing indicators
* Conversation synchronization

Current Support:

* Text Messages

Planned Support:

* Images
* Videos
* Documents
* Voice Notes
* Audio Files
* Stickers

---

### Request-Based Conversation Model

ORBI uses a consent-based conversation system.

Users cannot directly start conversations with others.

Before a conversation is created:

```text
User A
   ↓
Send Request
   ↓
User B Accepts
   ↓
Conversation Created
```

Request States:

```text
pending
accepted
rejected
cancelled
expired
```

This design significantly reduces spam and unwanted communication.

---

### Notification System

Persistent notifications are stored in MongoDB and delivered through WebSockets when users are online.

Current Notification Types:

* Conversation Requests

Planned Notification Types:

* Request Accepted
* Request Rejected
* New Messages
* Group Invites
* Mentions
* Administrative Events

---

## Architecture

The backend follows a Clean Architecture approach.

```text
Client
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models / Database
```

Socket communication follows a similar pattern.

```text
Client
   ↓
Socket Event
   ↓
Socket Handler
   ↓
Service Layer
   ↓
Database
   ↓
Realtime Event Response
```

---

## Technology Stack

### Runtime

* Node.js

### Framework

* Express.js

### Realtime Layer

* Socket.IO

### Database

* MongoDB Atlas

### Authentication

* JWT
* bcrypt

### File Storage

Current:

* Cloudinary

Future:

* User-owned cloud storage integrations

### Deployment

* Render

---

## Project Structure

```text
src/
├── config/
│
├── controllers/
│
├── middlewares/
│
├── models/
│   ├── user.model.js
│   ├── conversation.model.js
│   ├── userConversation.model.js
│   ├── message.model.js
│   ├── request.model.js
│   └── notification.model.js
│
├── routes/
│
├── services/
│
├── sockets/
│   ├── index.js
│   ├── middleware.socket.js
│   ├── chat.socket.js
│   ├── notification.socket.js
│   ├── request.socket.js
│   ├── typing.socket.js
│   └── presence.socket.js
│
├── utilities/
│
└── index.js
```

---

## Database Design

### User

```text
User
├── username
├── email
├── password
├── publicKey
├── blockedUsers
└── timestamps
```

---

### Conversation

```text
Conversation
├── type
├── participants
├── admins
└── timestamps
```

Types:

```text
1-on-1
group
```

---

### UserConversation

Stores user-specific metadata related to conversations.

Examples:

* unread count
* pinned status
* archived status
* muted conversations

---

### Message

```text
Message
├── conversationId
├── senderId
├── encryptedText
├── createdAt
├── deliveredAt
└── readAt
```

---

### Request

```text
Request
├── sender
├── receiver
├── status
└── expirationTime
```

---

### Notification

```text
Notification
├── recipient
├── type
├── metadata
├── isRead
└── timestamps
```

---

## Socket Architecture

After successful authentication:

```text
User Login
    ↓
JWT Verification
    ↓
Socket Connection
    ↓
User Opens Conversation
    ↓
Join Conversation Room
```

Room Naming Strategy:

```text
roomId = conversationId
```

Example:

```text
conversation_abc123
```

Every participant joins the same room, allowing efficient message broadcasting.

---

## Active Socket Events

### Connection Events

```text
connection
disconnect
```

### Conversation Events

```text
join_conversation
leave_conversation
```

### Message Events

```text
send_message
receive_message
mark_as_read
```

### Typing Events

```text
typing_start
typing_stop
```

### Presence Events

```text
user_online
user_offline
```

### Notification Events

```text
new_notification
```

### Request Events

```text
request_received
request_accepted
request_rejected
```

---

## Security Considerations

### Current

* Password hashing using bcrypt
* JWT authentication
* Protected Socket.IO connections
* Consent-based conversation system
* User blocking system

### Planned

* End-to-End Encryption (E2EE)
* Secure key management
* Encrypted media storage
* Multi-device key synchronization

Private key management will be handled entirely on the frontend.

---

## File Upload Limits

Maximum upload size:

```text
10 MB
```

This limitation helps maintain predictable storage usage and reduces abuse vectors.

---

## Reliability Goals

Planned Improvements:

* Offline message queue
* Retry mechanisms
* Message synchronization
* Delivery guarantees
* Reconnection recovery

---

## API Modules

### Auth

* Register
* Login
* Refresh Token
* Logout

### Users

* Search Users
* User Profile
* Block User
* Unblock User

### Conversations

* Create Conversation
* Fetch Conversations
* Conversation Details

### User Conversations

* Conversation Metadata
* Unread Counts
* User Preferences

### Messages

* Send Message
* Fetch Messages
* Read Status

### Requests

* Send Request
* Accept Request
* Reject Request
* Cancel Request

### Notifications

* Fetch Notifications
* Mark Notification Read

---

## Deployment

Production backend is deployed on Render.

Database services are hosted using MongoDB Atlas.

---

## Author

**Ujjwal Sharma**

GitHub:
https://github.com/Raijin-Cyber

LinkedIn:
https://www.linkedin.com/in/ujjwal-sharma-518039301

Portfolio:
https://ujjwalportfolio-lime.vercel.app

X:
https://x.com/raijinsigma

---

## License

MIT License
