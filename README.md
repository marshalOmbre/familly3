# Family Tree SaaS
A full-stack web application for creating and managing family trees.

## Features
- **User Authentication**: Secure login and registration.
- **Dashboard**: Manage multiple family trees.
- **Tree Visualization**: Interactive D3.js based family tree.
- **Person Management**: Add, edit, and delete people with detailed profiles.
- **Media Support**: Upload photos and documents for each person.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, D3.js
- **Backend**: Node.js, Express, Prisma, SQLite
- **Storage**: Local file system (uploads directory)

## Prerequisites
- Node.js (v18+)
- npm

## Setup & Running

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npx prisma migrate dev --name init
    cd ..
    ```

3.  **Run the Application**
    From the root directory, run:
    ```bash
    npm run dev
    ```
    This will start both the backend (port 3000) and frontend (port 5173).

4.  **Access the App**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
- `client/`: React frontend application.
- `server/`: Node.js/Express backend application.
- `server/prisma/`: Database schema and migrations.
- `server/uploads/`: Stored media files.
