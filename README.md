# **NestJS Backend: User Management, Document Management, and Ingestion APIs**

## **📌 Project Overview**

This project is a **backend service** built using **NestJS** for managing:

- **User Authentication & Role-Based Access Control (RBAC)**
- **Document Management (CRUD + Uploads with Role Restrictions)**
- **Ingestion Process Control (Trigger & Management with RBAC)**

## **🚀 Key Features & APIs**

### **1️⃣ Authentication & Role-Based Access Control (RBAC)**

- **Register** new users.
- **Login** and receive JWT tokens.
- **Logout** by invalidating tokens.
- **RBAC with `admin`, `editor`, and `viewer` roles.**

### **2️⃣ User Management APIs (RBAC)**

- **Admin-only functionality** to manage users.
- **Update user roles and permissions (Admin).**
- **View all registered users (Admin, Editor, Viewer only).**

### **3️⃣ Document Management APIs (RBAC)**

- **Upload Documents (Admin, Editor only).**
- **CRUD operations for document handling (Admin, Editor only).**
- **Users can fetch documents (Viewer role).**
- **Serve static files using `ServeStaticModule`.**

### **4️⃣ Ingestion Trigger API (RBAC: Admin Only)**

- **Trigger the ingestion process** in an external Python service(fow now with mock api).
- **Send requests to a dummy online API** for testing.
- **Log ingestion requests and their statuses.**

### **5️⃣ Ingestion Management API (RBAC: Admin Only)**

- **Track ongoing ingestion processes.**
- **Monitor status updates (pending, in-progress, completed, failed).**

### **6️⃣ Bulk Seeding API**

- **Seed large datasets with Users & Documents efficiently.**
- **Use `bulkCreate()` for batch inserts.**
- **Seeding script to insert 1000+ users and 100,000+ documents.**

---

## **🛠️ Tech Stack & Tools**

| **Technology**        | **Purpose**                     |
| --------------------- | ------------------------------- |
| **NestJS**            | Backend framework               |
| **TypeScript**        | Strict type management          |
| **PostgreSQL**        | Relational database             |
| **Sequelize ORM**     | Database ORM for TypeScript     |
| **JWT**               | Authentication & Authorization  |
| **RBAC Middleware**   | Role-based access control       |
| **Multer**            | File upload handling            |
| **ServeStaticModule** | Serves static files (documents) |

---

## **📂 Project Structure**

```
nestjs-backend/
│── src/
│   ├── auth/             # Authentication & RBAC Module
│   ├── user/             # User Management Module
│   ├── document/         # Document Management Module (RBAC Applied)
│   ├── ingestion/        # Ingestion Management Module (RBAC Applied)
│   ├── config/           # Configurations (Database, Multer, etc.)
│   ├── utils/            # Utility files (constants, decorators, error handling)
│   ├── main.ts           # Entry point
│   ├── app.module.ts     # Root module
│── seeders/              # ""Seeding scripts directory
│   ├── seeder.ts         # ""Bulk seeding script
│── uploads/              # Storage for uploaded documents
│── .env                  # Environment variables
│── README.md             # Project documentation
```

---

## **⚙️ Setup & Installation**

### **1️⃣ Clone the Repository**

using git clone command

### **2️⃣ Install Dependencies**

node version --> v20.15.1

```sh
npm install
```

### **3️⃣ Configure Environment Variables**

Create a `.env` file and add the necessary values:

```
# Database Configuration
DB_HOST={{value}}
DB_PORT={{value}}
DB_USER={{value}}
DB_PASS={{value}}
DB_NAME={{value}}
APP_PORT={{value}}
NODE_ENV=development
JWT_SECRET={{value}}
EXTERNAL_INGESTION_API={{value}}
```

### **4️⃣ Run Migrations (If Using Sequelize CLI)**

```sh
npx sequelize-cli db:migrate
```

### **5️⃣ Run Seeder Script (Bulk Data Insertion)**

To insert **1000+ Users and 100,000+ Documents**:

```sh
npx ts-node seeders/seeder.ts
```

**Expected Output:**

```
📌 Starting Database Seeding...
🌱 Seeding Users...
""1000 Users Created
🌱 Seeding Documents...
""10000 Documents Seeded...
""50000 Documents Seeded...
""100000 Documents Created
""Database Seeding Completed!
```

### **6️⃣ Start the Server**

```sh
npm run start:dev
```

---

## **🔍 API Documentation (RBAC Applied)**

### **Authentication API**

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login`    | Login & get JWT |
| `GET`  | `/auth/logout`   | Logout user     |

### **User Management API (Admin Only)**

| Method   | Endpoint            | Description                         |
| -------- | ------------------- | ----------------------------------- |
| `GET`    | `/user/all`         | List all users (Admin, Editor)      |
| `GET`    | `/user/fetch/:id`   | Get user details                    |
| `PATCH`  | `/user/update/:id`  | Update user details (Admin, Editor) |
| `DELETE` | `/user/delete/:id`  | Remove user (Admin)                 |
| `POST`   | `/user/bulk-create` | Bulk create users (Admin)           |

### **Document Management API (RBAC Applied)**

| Method   | Endpoint               | Description                                |
| -------- | ---------------------- | ------------------------------------------ |
| `POST`   | `/document/upload`     | Upload a document (Admin, Editor)          |
| `GET`    | `/document/fetch`      | List all documents (Viewer, Editor, Admin) |
| `GET`    | `/document/fetch/:id`  | Get document details                       |
| `PATCH`  | `/document/update/:id` | Update document (Admin, Editor)            |
| `DELETE` | `/document/delete/:id` | Delete document (Admin, Editor)            |

---

## **⚙️ API Documentation (RBAC Applied)**

### **Ingestion API (Admin Only)**

| Method   | Endpoint                | Description                         |
| -------- | ----------------------- | ----------------------------------- |
| `POST`   | `/ingestion/trigger`    | Trigger ingestion process           |
| `GET`    | `/ingestion/fetch/:id`  | Fetch ingestion details             |
| `POST`   | `/ingestion/webhook`    | Update ingestion status via webhook |
| `GET`    | `/ingestion/status/:id` | Get ingestion status                |
| `GET`    | `/ingestion/all`        | List all ingestion processes        |
| `DELETE` | `/ingestion/delete/:id` | Delete ingestion process            |

---
