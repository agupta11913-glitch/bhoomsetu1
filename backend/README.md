# BhoomiSetu Spring Boot Backend

Enterprise Spring Boot backend powering BhoomiSetu (National Land Acquisition & Management System).

## Key Features
- **Stateless JWT Security**: HMAC-SHA512 token generation and parsing with Spring Security 6 filter chain.
- **BCrypt Encryption**: 10-round salted password hashing.
- **Role-Based Access Control (RBAC)**: Enforced endpoint security across `CITIZEN`, `GOVERNMENT_OFFICER`, `DISTRICT_AUTHORITY`, `STATE_GOVERNMENT`, `CENTRAL_MINISTRY`, `PROJECT_AGENCY`, and `ADMIN`.
- **Spring Data JPA**: MySQL Connector/J with Hibernate ORM.
- **Global Error Handling**: Standardized error responses with appropriate HTTP status codes.

## Run Backend
```bash
mvn spring-boot:run
```
Service runs on port `8080`.
