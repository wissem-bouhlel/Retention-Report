# 💇‍♀️ Salon Retention API

A TypeScript + Express + TypeORM backend service that computes client retention per employee on a monthly basis. It also includes a Swagger UI for API documentation.

---

## 📌 Features

- 📆 Calculates monthly client retention by employee
- 📊 Reference-based client tracking (first visit)
- ⚙️ Built with Express, TypeORM, SQLite
- 🔧 Modular structure (Controllers, Services, Routes)
- 📚 Swagger documentation at `/docs`

---

## 🧱 Tech Stack

- Node.js + TypeScript
- Express.js
- TypeORM
- SQLite
- Swagger (swagger-jsdoc + swagger-ui-express)
- date-fns

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/wissem-bouhlel/Retention-Report.git
cd Retention-Report
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add SQLite Database
Make sure your SQLite file is named salon.sqlite and placed at the root of the project directory.

📌 Required Tables:
```shell

CLIENTS

EMPLOYEES

APPOINTMENTS
```

Schema example:

```shell
CREATE TABLE CLIENTS (
  client_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL
);

CREATE TABLE EMPLOYEES (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

CREATE TABLE APPOINTMENTS (
  appointment_id INTEGER PRIMARY KEY,
  employee_id INTEGER,
  client_id INTEGER,
  date TEXT NOT NULL,
  FOREIGN KEY(client_id) REFERENCES CLIENTS(client_id),
  FOREIGN KEY(employee_id) REFERENCES EMPLOYEES(employee_id)
);
```
### 4. Run the Server (Dev Mode)
```bash
npm run dev
```

The server will be available at:
http://localhost:3000

📡 API Endpoints
GET /retention/report
Returns a JSON object showing employee retention by month.

Sample Response:
```json
[
  { "employeeId": 1, "month": "2025-01", "clients": 100, "percentage": 100 },
  { "employeeId": 2, "month": "2025-01", "clients": 40, "percentage": 100 },
  { "employeeId": 1, "month": "2025-02", "clients": 60, "percentage": 60 },
  { "employeeId": 2, "month": "2025-02", "clients": 20, "percentage": 50 }
]
```

employeeId: The id of the employee

clients: how many clients returned that month

percentage: percentage vs reference month

GET /health
Returns simple 200 OK status for monitoring.

📘 API Documentation
Once running, open your browser to:

📚 http://localhost:3000/docs

This shows the auto-generated Swagger UI.

🧱 Project Structure
```shell
src/
├── index.ts               # App entry point
├── app.module.ts          # Main app and router loader
├── swagger.ts             # Swagger configuration
├── data-source.ts         # TypeORM database connection
├── routes/                # Express routes
│   └── retention.routes.ts
├── controllers/           # Route controllers
│   └── retention.controller.ts
├── services/              # Business logic layer
│   └── retention.service.ts
├── entities/              # TypeORM models
│   ├── Appointment.ts
│   ├── Client.ts
│   └── Employee.ts
```

🔧 Scripts
Command	Description
npm run dev: Start in development mode with hot reload
npm run build:	Compile TypeScript into dist/
npm run start:	Start compiled JavaScript server

✅ Environment Variables
You can use a .env file to customize environment settings.

Example .env
PORT=3000

---

## 🐳 Docker

You can containerize this project using the provided `Dockerfile` to run it anywhere with Docker installed.

### 🧱 Build the Docker Image

```bash
docker build -t retention-api .
```

### 🚀 Run the Container

```bash
docker run -p 3000:3000 retention-api
```