# **Backend - Express Application**

This is the **backend** part of the monorepo, built with **Express**, **TypeScript**, and **Sequelize**.

---

## **Project Structure**

```
backend/
├── src/
│   ├── controllers/       # Controller logic for handling API requests
│   ├── models/            # Sequelize models for database tables
│   ├── routes/            # API route definitions
│   ├── config/            # Configuration files (e.g., database, environment)
│   ├── index.ts             # Main application entry point
│   ├── migrations/        # Sequelize migrations for database schema
├── package.json           # Backend-specific dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── .env                   # Environment variables (e.g., database connection)
```

---

## **Getting Started**

### Prerequisites

Ensure you have the following installed:

- **pnpm**: A fast, disk-space-efficient package manager.
- **PostgreSQL**: The database used for this application.
- **pgAdmin**: (Optional) A GUI for managing PostgreSQL.

To install **pnpm** globally:
```bash
npm install -g pnpm
```

---

### Installation

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up the environment variables:

   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=chatspace
   DATABASE_USER=your_username
   DATABASE_PASSWORD=your_password
   ```

---

### **Database Setup**

#### 1. Start PostgreSQL
Ensure your PostgreSQL service is running locally.

#### 2. Set up the database:
   - If you don't have a database, create one using pgAdmin or the PostgreSQL CLI:
     ```sql
     CREATE DATABASE chatspace;
     ```

#### 3. Run migrations:
   ```bash
   pnpm run migrate
   ```

#### 4. Seed the database (optional):
   ```bash
   pnpm run seed
   ```

---

### **Available Scripts**

- **Start Development Server**:
  ```bash
  pnpm run dev
  ```

- **Run Migrations**:
  ```bash
  pnpm run migrate
  ```


- **Build for Production**:
  ```bash
  pnpm run build
  ```

- **Start Production Server**:
  ```bash
  pnpm run start
  ```

---

## **Setting Up pgAdmin**

1. Download and install **pgAdmin** from the [official website](https://www.pgadmin.org/).
2. Open pgAdmin and create a new server:
   - **Name**: Localhost
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Username**: Your PostgreSQL username
   - **Password**: Your PostgreSQL password
3. Connect to the server and verify your database.

---

## **Technologies Used**

- **Express**: Web framework for Node.js.
- **TypeScript**: Strongly typed JavaScript for improved developer experience.
- **Sequelize**: ORM for managing PostgreSQL database operations.
- **PostgreSQL**: Relational database system.
- **dotenv**: Environment variable management.

---

## **API Endpoints**

### **Users**
- **`GET /api/users`**: Get all users.
- **`POST /api/users`**: Create or log in a user.
- **`DELETE /api/users/:id`**: Delete a user by ID.

### **Messages**
- **`GET /api/messages`**: Get all messages (optional limit via query).
- **`POST /api/messages`**: Create a new message.
- **`PUT /api/messages/:id`**: Edit a message.
- **`PUT /api/messages/:id/delete`**: Mark a message as deleted.

### **Participants**
- **`GET /api/participants`**: Get all participants
- **`POST /api/participants`**: Create a new participant.
- **`DELETE /api/participants/:id`**: Delete a participant by ID.
- **`GET /api/participants/user/:userId`**: Get participant by userId

---

## **Customization**

To add a new dependency for the backend:
```bash
pnpm add <package-name>
```

To add a development dependency:
```bash
pnpm add -D <package-name>
```

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## **Contact**

For questions or collaboration, feel free to contact:

- **Name**: [Mirjana Milosevic]
- **Email**: [mira.milosevic@gmail.com]
- **GitHub**: [[GitHub Profile](https://github.com/programira)]
