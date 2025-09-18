# SewerWatch SA API Documentation

## Overview
The SewerWatch SA API is a RESTful backend service built with Node.js, Express.js, and MongoDB (via Mongoose). It manages user registration, authentication, and incident (ticket) reporting for sewer maintenance issues. Incidents can be reported via WhatsApp webhooks using Twilio, with support for text, media, and location sharing. The system supports dynamic group member addition from reporters and broadcasts notifications to the group.

Key features:
- User management (Citizen, Manager, Admin roles) with geospatial location from address geocoding.
- Incident CRUD focused on sewage issues (categories: manhole_overflow, toilet_backup, pipe_burst, other).
- JWT-based authentication for protected routes.
- WhatsApp integration for public incident creation with automatic group member addition.
- Geospatial queries (2dsphere indexes on User and Incident locations).
- Incident numbering (INC00001 format) for reference.
- Notifications via Twilio WhatsApp to reporters and group members.

**Base URL:** `http://localhost:2000` (development; update for staging/prod).

**Version:** 1.0.0 (updated).

**Headers:**
- `Content-Type: application/json` for JSON payloads.
- `Authorization: Bearer <token>` for protected routes (JWT from login).

**Error Responses:** Standard JSON `{ success: false, message: "Error description" }` with HTTP status (400, 401, 404, 500).

**Dependencies:** Mongoose, bcryptjs, jsonwebtoken, twilio, express-validator, axios (for geocoding).

## Authentication
All protected routes require a JWT token in the `Authorization` header as `Bearer <token>`. Tokens expire in 24 hours.

### Login (Obtain Token)
- **Endpoint:** `POST /login`
- **Description:** Authenticate user and return JWT.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f...abc",
      "email": "user@example.com",
      "role": "Citizen"
    }
  }
  ```
- **Errors:**
  - 400: Validation failed (missing email/password).
  - 401: Invalid credentials.
  - 500: Server error.

### Register User
- **Endpoint:** `POST /submit`
- **Description:** Create a new user (Citizen by default).
- **Request Body:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+27123456789",
    "password": "password123",
    "role": "Citizen",
    "address": "123 Main St, Johannesburg"
  }
  ```
  - `role`: Optional (Citizen/Manager/Admin; defaults to Citizen).
  - `address`: Required; used for geocoding location (no map/coordinates needed).
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Welcome, John! Your account has been created with role: Citizen."
  }
  ```
- **Errors:**
  - 400: Validation failed or duplicate email.
  - 500: Server error (e.g., DB save, geocoding).

### Get All Users (Protected)
- **Endpoint:** `GET /users`
- **Description:** Fetch all users (excludes passwords).
- **Auth:** Required (JWT).
- **Response (200):**
  ```json
  [
    {
      "_id": "64f...abc",
      "userId": "USR001",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+27123456789",
      "address": "123 Main St",
      "location": { "type": "Point", "coordinates": [28.0473, -26.2041] },
      "role": "Citizen",
      "createdAt": "2025-09-18T12:00:00.000Z"
    }
  ]
  ```
- **Errors:**
  - 401: No/invalid token.
  - 500: Fetch error.

## Incidents (Tickets)
Incidents represent sewer issues with geospatial data, media, and automatic notifications.

### User Model Schema (Reference)
```javascript
{
  userId: String (unique),
  first_name: String (req),
  last_name: String (req),
  email: String (unique, req),
  phone: String,
  address: String (req),
  location: { type: 'Point', coordinates: [Number, Number] } // [lng, lat] from address geocoding
  role: String (Citizen/Manager/Admin),
  password: String (req, hashed),
  createdAt: Date
}
```
- Index: `{ location: '2dsphere' }` for geospatial queries.

### Incident Model Schema (Reference)
```javascript
{
  incidentNumber: String (req, unique, INC00001 format),
  reporters: [{
    phone: String (req),
    reportedAt: Date,
    description: String
  }],
  description: String,
  category: String (manhole_overflow/toilet_backup/pipe_burst/other; default: 'other'),
  priority: String (P0/P1/P2; default: 'P2'),
  status: String (open/in_progress/allocated/verified/closed; default: 'open'),
  location: { type: 'Point', coordinates: [Number, Number] } // [lng, lat]
  verifiedBy: ObjectId (ref: 'Users'),
  mediaUrls: [String],
  sewageLossEstimate: Number (default: 0), // liters
  createdAt: Date,
  updatedAt: Date
}
```
- Index: `{ location: '2dsphere' }` for geospatial queries (deduplication, assignment).
- Reporters array supports multiple reports for same incident (deduplication by 10m radius).

### GroupMember Model Schema (Reference)
```javascript
{
  phone: String (req, unique),
  location: { type: 'Point', coordinates: [Number, Number] },
  addedAt: Date
}
```
- Used for group chat members; reporters are automatically added.

### WhatsApp Webhook (Public)
- **Endpoint:** `POST /whatsapp`
- **Description:** Handles text, location shares, media; deduplicates/updates existing open incidents. Automatically adds reporters to GroupMember.
- **Auth:** None.
- **Request Body:** Twilio form-encoded.
  - `Body`: Message text.
  - `From`: Sender (whatsapp:+...).
  - `Latitude`/`Longitude`: For location shares.
  - `MediaUrl0`: Optional media.
- **Processing:**
  - Text: Create incident with default location, add reporter to GroupMember, prompt for location.
  - Location: Update latest open incident for reporter, notify reporters and broadcast to group.
  - Replies guide user; notifications sent after location provided.
- **Response:** XML TwiML with guidance/confirmation using incidentNumber.

### Get Open Incidents (Protected)
- **Endpoint:** `GET /api/incidents`
- **Description:** Fetch unresolved incidents (status != 'resolved').
- **Auth:** Required.
- **Query Params:** None.
- **Response (200):**
  ```json
  [
    {
      "_id": "64f...def",
      "incidentNumber": "INC00001",
      "reporters": [...],
      "description": "Manhole overflow",
      "category": "manhole_overflow",
      "priority": "P1",
      "status": "open",
      "location": { "type": "Point", "coordinates": [28.0473, -26.2041] },
      "verifiedBy": null,
      "mediaUrls": ["https://..."],
      "sewageLossEstimate": 500,
      "createdAt": "2025-09-18T12:00:00.000Z",
      "updatedAt": "2025-09-18T12:10:00.000Z"
    }
  ]
  ```
- **Errors:**
  - 401: Unauthorized.
  - 500: Fetch error.

### Update Incident (Protected)
- **Endpoint:** `PUT /api/incidents/:id`
- **Description:** Update incident (e.g., status, verifiedBy, location).
- **Auth:** Required.
- **Path Param:** `id` (Mongo ObjectId).
- **Request Body:**
  ```json
  {
    "status": "in_progress",
    "verifiedBy": "64f...abc",
    "priority": "P0",
    "sewageLossEstimate": 1000,
    "location": { "type": "Point", "coordinates": [28.0473, -26.2041] }
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "incident": { ...updated incident... }
  }
  ```
- **Errors:**
  - 401: Unauthorized.
  - 404: Incident not found.
  - 500: Update error.

### Verify Incident (Protected - Manager/Admin)
- **Endpoint:** `PUT /api/incidents/verify/:id`
- **Description:** Manager verifies incident, sets status 'verified', updates location/description, notifies reporters (72h resolution).
- **Auth:** Required (Manager/Admin role).
- **Path Param:** `id` (Mongo ObjectId).
- **Request Body:**
  ```json
  {
    "lat": -26.2041,
    "lng": 28.0473,
    "description": "Verified manhole overflow at precise location"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "incident": { ...verified incident... }
  }
  ```
- **Processing:** Updates verifiedBy, triggers notifications to reporters via Twilio WhatsApp.
- **Errors:**
  - 401: Unauthorized.
  - 403: Insufficient role.
  - 404: Incident not found.
  - 400: Already verified.
  - 500: Update/notification error.

## Additional Notes
- **Geospatial Features:** Use MongoDB $geoNear for location-based deduplication (10m radius).
- **Notifications:** Automatic via Twilio WhatsApp to reporters (individual) and group members (broadcast).
- **Validation:** All inputs validated (required fields, enums, phone formats).
- **Security:** Passwords hashed (bcrypt); JWT secret in `.env`. Webhook validates Twilio signature.
- **Enhancements:** Multi-reporter support, automatic group addition, incident numbering, address geocoding for users.
- **Future:** Full bot flow with NLP, advanced queries, API for group management.
- **Testing:** Use Postman/Swagger. Local: `npm start` (assumes server.js runs app).
- **Environment:** MongoDB URI in `.env` (MONGO_URI); Twilio creds (TWILIO_ACCOUNT_SID, etc.).

For full code, see `src/` (models, controllers, services, routes). Contact for OpenAPI/Swagger integration.
