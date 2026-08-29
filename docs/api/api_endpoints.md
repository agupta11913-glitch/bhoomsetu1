# BhoomiSetu REST API Specification

BhoomiSetu Spring Boot backend provides secure, JWT-authenticated REST APIs for identity management, authentication, role-based workflows, and user preferences.

## Base URL
`http://localhost:8080` (Proxied via Vite development server on port `3000`)

---

## 1. System Health & Public APIs

### `GET /api/health`
Health check endpoint verifying Spring Boot server status and timestamp.
- **Access**: Public
- **Response**:
```json
{
  "service": "BhoomiSetu Backend",
  "status": "UP",
  "timestamp": 1787820045755
}
```

---

## 2. Authentication APIs

### `POST /api/auth/register`
Role-based registration for Citizen, CALA Officer, District Magistrate, State Officer, Central Officer, and Project Agency.
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Sh. Ramesh Gupta",
  "email": "ramesh@example.com",
  "mobile": "9876543210",
  "password": "Password123",
  "role": "CITIZEN",
  "state": "Uttar Pradesh",
  "district": "Agra",
  "address": "Village Fatehabad, Agra"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Registration successful. Your account is active.",
  "status": "ACTIVE",
  "applicationId": "APP-2026-08124"
}
```

### `POST /api/auth/login`
Authenticates a user, verifies BCrypt password and database status (`ACTIVE`), and issues a signed JWT token.
- **Access**: Public
- **Request Body**:
```json
{
  "email": "citizen@demo.com",
  "password": "Password123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "status": "ACTIVE",
  "user": {
    "id": 2,
    "name": "Sh. Ram Kumar",
    "email": "citizen@demo.com",
    "role": "CITIZEN",
    "status": "ACTIVE",
    "state": "Uttar Pradesh",
    "district": "Agra"
  }
}
```

### `GET /api/auth/me`
Retrieves currently authenticated user details from the JWT token.
- **Access**: Authenticated (`Bearer <token>`)

---

## 3. User Preferences APIs

### `GET /api/users/preferences`
Retrieves persistent user preferences.
- **Access**: Authenticated (`Bearer <token>`)

### `PUT /api/users/preferences`
Updates persistent language and theme preferences.
- **Access**: Authenticated (`Bearer <token>`)

---

## 4. Admin Management APIs

### `GET /api/admin/users`
Lists all registered system users across all roles.
- **Access**: `ROLE_ADMIN`

### `POST /api/admin/users/{id}/approve`
Approves a pending officer or agency registration.
- **Access**: `ROLE_ADMIN`

### `POST /api/admin/users/{id}/reject`
Rejects a registration request with an official reason.
- **Access**: `ROLE_ADMIN`
