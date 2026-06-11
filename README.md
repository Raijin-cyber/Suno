<h1 align="center">ORBI</h1>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</p>

<p align="center">
  A modern real-time messaging platform built with React, Node.js, Socket.IO, and MongoDB.
</p>

---

## About

ORBI is a full-stack real-time messaging application focused on simplicity, privacy, and reliability. It enables users to communicate through one-to-one and group conversations while providing a smooth and responsive user experience.

The platform uses WebSockets for instant communication, supports conversation requests for user consent, and is designed with scalability and security in mind.

---

## Features

### Authentication

* User registration and login
* Unique username system
* JWT-based authentication
* Protected routes and socket connections

### Real-Time Messaging

* One-to-one conversations
* Group conversations
* Instant message delivery using Socket.IO
* Read receipts
* Typing indicators
* Online/offline presence

### Privacy & Security

* Conversation request system
* User blocking
* Encrypted message storage
* Secure authentication flow

### Notifications

* Persistent notifications
* Real-time notification delivery
* Request and conversation updates

### Planned Features

* Progressive Web App (PWA)
* Media and file sharing
* Offline synchronization
* End-to-End Encryption (E2EE)
* Multi-device support

---

## Tech Stack

### Frontend

* React
* Tailwind CSS
* React Router
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO

### Database

* MongoDB

### Authentication

* JWT
* bcrypt

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Raijin-Cyber/orbi.git
```

Install dependencies:

```bash
npm install
```

---

## Running the Project

Open two terminals from the project root.

### Frontend

```bash
cd Frontend
npm run dev
```

### Backend

```bash
cd Backend
npm run dev
```

---

## Demo

https://orbi-beryl.vercel.app

---

## Project Structure

```text
Backend/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── sockets/
├── utilities/
└── index.js

Frontend/
├── components/
├── pages/
├── hooks/
├── services/
├── sockets/
├── store/
└── main.jsx
```

---

## Author

**Ujjwal Sharma**

* Portfolio: https://ujjwalportfolio-lime.vercel.app
* GitHub: https://github.com/Raijin-Cyber
* LinkedIn: https://www.linkedin.com/in/ujjwal-sharma-518039301
* X (Twitter): https://x.com/raijinsigma

---

## Support

If you like this project, consider giving it a ⭐ on GitHub.

---

## License

This project is licensed under the MIT License.
