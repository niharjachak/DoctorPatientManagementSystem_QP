# Doctor Patient Management System

A full stack Doctor Patient Management System / Appointment Booking System built with React and Spring Boot. The platform allows patients to discover doctors, view availability, and book appointments, while doctors manage consultation slots and admins manage hospital doctors and analytics.

## Project Description

This system is designed to streamline doctor discovery and appointment scheduling for hospitals or clinics.

### Main Capabilities

- Public users can browse doctors, filter by speciality, gender, fee range, hospital, and available date.
- Patients can register, log in, book appointments, view their bookings, and cancel appointments based on the platform rules.
- Doctors can log in, change their temporary password on first login, create available time slots, view slots, and delete unbooked slots.
- Admins can register under a hospital, create doctor accounts, activate or deactivate doctors, and monitor hospital analytics.

### User Roles

- `Admin`
  Manages doctors for a hospital, creates doctor accounts, controls doctor activation status, and reviews analytics.
- `Doctor`
  Manages available appointment slots and must change the temporary password on first login.
- `Patient`
  Registers independently, books appointments, and manages personal bookings.

## Tech Stack

### Frontend

- React JS
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Recharts

### Backend

- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Bean Validation
- Lombok

### Database

- MySQL

### Tools Used

- Maven
- npm
- Git / GitHub
- IntelliJ IDEA / VS Code
- Postman or similar API testing tool

## Project Folder Structure

Note: the frontend folder in this repository is named `doctor-frontend`.

```text
DoctorPatientSystem/
+-- backend/
|   +-- pom.xml
|   `-- src/
|       +-- main/
|       |   +-- java/com/questpro/doctor_patient_system/
|       |   |   +-- config/
|       |   |   +-- controller/
|       |   |   +-- dtos/
|       |   |   +-- entities/
|       |   |   +-- enums/
|       |   |   +-- exceptions/
|       |   |   +-- repository/
|       |   |   +-- scheduler/
|       |   |   +-- security/
|       |   |   +-- service/
|       |   |   `-- specification/
|       |   `-- resources/
|       |       `-- application.properties
|       `-- test/
+-- doctor-frontend/
|   +-- package.json
|   +-- vite.config.js
|   +-- public/
|   `-- src/
|       +-- api/
|       |   +-- client/
|       |   +-- constants/
|       |   +-- modules/
|       |   `-- utils/
|       +-- auth/
|       |   +-- auth-context/
|       |   +-- auth-guards/
|       |   `-- auth-store/
|       +-- components/
|       |   +-- auth/
|       |   `-- public/
|       +-- pages/
|       |   +-- admin/
|       |   +-- auth/
|       |   +-- doctor/
|       |   +-- patient/
|       |   `-- public/
|       `-- routes/
`-- README.md
```

## How to Run the Project Locally

### Prerequisites

- Java 17
- Maven
- Node.js and npm
- MySQL Server

### Backend Setup

1. Create or start a MySQL server instance.
2. Open `backend/src/main/resources/application.properties`.
3. Update the database and JWT values with your local configuration.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/doctor_patient_db?createDatabaseIfNotExist=true
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=your_secure_jwt_secret
```

4. Start the backend:

```bash
cd backend
mvn spring-boot:run
```

5. The backend will run by default at:

```text
http://localhost:8080
```

6. On first startup, the application seeds sample hospitals automatically if none exist.

### Frontend Setup

1. Open the frontend directory:

```bash
cd doctor-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Optional: set the API base URL in a `.env` file if needed.

```env
VITE_API_BASE_URL=http://localhost:8080
```

If `VITE_API_BASE_URL` is not set, the frontend already defaults to `http://localhost:8080`.

4. Start the frontend:

```bash
npm run dev
```

5. Open the local Vite URL shown in the terminal, typically:

```text
http://localhost:5173
```

## API Documentation

Base URL:

```text
http://localhost:8080
```

### Authentication APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register/patient` | Public | Register a new patient account |
| `POST` | `/auth/register/admin` | Public | Register a new admin account linked to a hospital |
| `POST` | `/auth/login` | Public | Authenticate user and return JWT token with role details |
| `POST` | `/auth/logout` | Authenticated user | Logout by blacklisting the current JWT |

### Public APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/public/getHospitals` | Public | Fetch all hospitals |
| `GET` | `/public/getDoctors` | Public | Search doctors using filters like keyword, speciality, gender, fee, hospital, and date |
| `GET` | `/public/getDoctorDetails/{doctorId}` | Public | Get doctor profile and available slots |
| `GET` | `/public/doctors/getImage/{doctorId}` | Public | Fetch doctor profile image |

### Patient APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/patient/bookappointments` | Patient | Book an appointment for a selected doctor slot |
| `GET` | `/patient/getappointments` | Patient | Fetch logged-in patient appointments |
| `DELETE` | `/patient/deleteappointments/{appointmentId}` | Patient | Cancel a booked appointment |

### Doctor APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/doctor/change-password` | Doctor | Change temporary password on first login |
| `POST` | `/doctor/addslots` | Doctor | Add a future appointment slot |
| `GET` | `/doctor/getslots` | Doctor | Fetch all slots created by the logged-in doctor |
| `DELETE` | `/doctor/deleteslots/{slotId}` | Doctor | Delete an unbooked slot |

### Admin APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/admin/createDoctor` | Admin | Create a doctor account with profile image upload and temporary password generation |
| `GET` | `/admin/getHospitalDoctors` | Admin | Fetch doctors belonging to the admin's hospital |
| `PUT` | `/admin/updatedoctorstatus/{doctorId}?isActive=true` or `false` | Admin | Activate or deactivate a doctor |
| `GET` | `/admin/analytics` | Admin | Fetch admin analytics such as total patients, active doctors, appointments, cancellation rate, and booking trends |

## Features

- JWT-based authentication and stateless authorization.
- Role-based access control for `ADMIN`, `DOCTOR`, and `PATIENT`.
- Patient registration and admin registration.
- Doctor account creation by hospital admin.
- Temporary password generation for doctors.
- Forced first-login password change for doctor accounts.
- Public doctor discovery with advanced filtering.
- Doctor detail page with real-time slot availability.
- Appointment booking workflow for patients.
- Appointment cancellation with business rules.
- Slot management for doctors with overlap prevention.
- Doctor activation/deactivation by hospital admin.
- Analytics dashboard with charts for appointments and doctor/speciality insights.
- Doctor image upload and retrieval.
- Global exception handling for cleaner API responses.
- Token blacklisting on logout.
- Seeded hospital data for first-time setup.

## Screenshots

Add project screenshots here.

Suggested screenshots:

- Landing page
- Doctor listing page
- Doctor details and slot booking page
- Login / registration pages
- Patient dashboard
- Doctor dashboard and slot management
- Admin dashboard
- Analytics dashboard

## Future Improvements

- Add email notifications for appointment booking and cancellation.
- Add appointment rescheduling support.
- Add doctor-side appointment history and patient list views.
- Add patient profile management.
- Add pagination and sorting to doctor search results.
- Add Swagger / OpenAPI documentation.
- Add unit and integration tests for frontend and backend modules.
- Add Docker support for easier local setup and deployment.
- Add refresh token support for stronger authentication flow.
- Add deployment instructions for cloud hosting.

---

If you like this project, consider giving it a star on GitHub.
