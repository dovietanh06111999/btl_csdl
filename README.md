# MERN Stack Project

This is a MERN (MongoDB, Express, React, Node.js) stack project.

## Prerequisites

- Node:18 (for development)
- Mongodb (for development)

## Getting Started

To start the project manually or want to develope more feature, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/dovietanh06111999/btl_csdl.git
   cd btl_csdl
   ```

2. Start your local MongoDB server and add database name `office_management`

3. Start the backend server:

   ```sh
   cd backend
   npm install
   node src/index.js
   node src/seedData.js
   ```

4. Start the frontend server:

   ```sh
   cd frontend
   npm install
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the application running.
## Project Structure

- `frontend/` - React frontend
- `backend/` - Express backend
- `database/` - Store MongoDB data
