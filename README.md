# BhoomiSetu (भूमिसेतु) — National Land Acquisition & Management System

> **Smart India Hackathon (SIH) Prototype**  
> An integrated platform digitizing the RFCTLARR Act 2013 end-to-end statutory lifecycle, featuring cadastral GIS mapping, automated Bhulekh RoR verification, DBT PFMS compensation tracking, and AI delay forecasting.

---

## 🏛️ Project Directory Structure

```text
BhoomiSetu/
│
├── frontend/                     # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── assets/               # Branding and static image assets
│   │   ├── components/           # Reusable UI component modules
│   │   │   ├── common/           # StatCard, StatusBadge, Toast, Modal, Footer
│   │   │   ├── navbar/           # Top Navbar, Sidebar navigation
│   │   │   ├── dashboard/        # DemoControlBar, AIAssistantModal, AIDocumentOCRModal
│   │   │   ├── map/              # LeafletGISMap, ParcelLegend
│   │   │   └── documents/        # GazetteNoticeModal, CompensationAwardModal
│   │   ├── pages/                # Role-segregated application views
│   │   │   ├── auth/             # Login, Role Selection, Registration forms
│   │   │   ├── citizen/          # Citizen / Landowner self-service portal
│   │   │   ├── officer/          # Field CALA / Tehsildar RoR verification
│   │   │   ├── district/         # District Magistrate Section 19 sanctions
│   │   │   ├── state/            # State Oversight & Corridor Tracking
│   │   │   ├── central/          # National PM Gati Shakti Monitoring & AI
│   │   │   ├── agency/           # Project Agency (NHAI/Railways) alignment
│   │   │   ├── admin/            # NICNET IAM & System Governance
│   │   │   └── common/           # Profile settings, reports, document analyzer
│   │   ├── services/             # API services & JWT client helpers
│   │   ├── context/              # AuthContext & LandDataContext state managers
│   │   ├── data/                 # Demo datasets & mock GIS parcels
│   │   ├── utils/                # Formatters, constants, and helpers
│   │   ├── App.jsx               # Main application router and layout shell
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Java 17 + Spring Boot 3 Backend Server
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/bhoomisetu/
│   │   │   │   ├── config/       # Spring Boot configurations & Data Initializer
│   │   │   │   ├── controller/   # REST Controllers (Auth, IAM, Users, Health)
│   │   │   │   ├── service/      # Business logic services
│   │   │   │   ├── repository/   # Spring Data JPA repositories
│   │   │   │   ├── entity/       # Hibernate JPA entity definitions
│   │   │   │   ├── dto/          # Data Transfer Objects (Requests/Responses)
│   │   │   │   ├── security/     # Spring Security, JWT Filter, BCrypt
│   │   │   │   ├── exception/    # Global Exception Handlers
│   │   │   │   └── BhoomiSetuApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── database/                     # MySQL 8.0 Database Scripts
│   ├── schema/schema.sql         # Table definitions and constraints
│   ├── seed/seed.sql             # Initial demo accounts
│   └── queries/queries.sql       # Reference operational SQL queries
│
├── docs/                         # Technical Architecture & Workflow Docs
│   ├── api/api_endpoints.md      # REST API documentation
│   ├── workflow/rfctlarr_workflow.md # 12-stage acquisition workflow
│   └── architecture/system_architecture.md # Architecture blueprint
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0+ & npm
- **Java**: JDK 17+ & Apache Maven 3.8+
- **MySQL**: MySQL Server 8.0 (running on `localhost:3306`)

### 2. Database Setup
```bash
mysql -u root -p < database/schema/schema.sql
mysql -u root -p < database/seed/seed.sql
```

### 3. Start Backend Server
```bash
cd backend
mvn spring-boot:run
```
Backend starts on **`http://localhost:8080`**. Health check: **`http://localhost:8080/api/health`**.

### 4. Start Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Frontend starts on **`http://localhost:3000`** (auto-proxied to Spring Boot backend).

---

## 👥 Demo Personas (Pre-seeded)

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Citizen (Land Owner)** | `citizen@demo.com` | `Password123` | My Land, Objections, Notices, DBT |
| **Field CALA Officer** | `officer@demo.gov.in` | `Password123` | Bhulekh RoR Search, Field Survey |
| **District Magistrate (DM)** | `district.officer@bhoomisetu.gov.in` | `Password123` | Section 19 Sanctions, Hearings |
| **State Government** | `state.officer@bhoomisetu.gov.in` | `Password123` | State Corridors Oversight |
| **Central Ministry** | `central.officer@bhoomisetu.gov.in` | `Password123` | PM Gati Shakti & AI Risk Radar |
| **Project Agency (NHAI)** | `agency@demo.gov.in` | `Password123` | Alignment & ROW Handover |
| **System Administrator** | `admin@bhoomisetu.gov.in` | `Password123` | User IAM & Forensic Logs |
