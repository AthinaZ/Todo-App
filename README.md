# Todo-App

> This is a full-stack Todo application built with React on the front end and NestJS on the back end. It allows users to create an account, sign in, and manage their todos. The back end uses authentication with username and password validation, and the passwords are securely encrypted using bcrypt. The application utilizes PostgreSQL as the database, which is containerized with Docker. TypeORM is used for creating and managing the database tables.

## Features

- **User Registration and Authentication**:
  - Users can create an account with a username, name, and password.
  - The backend validates the username and password for authentication.
- **Todo Management**:
  - Users can create new todos by entering todo text and selecting a category from a dropdown menu.
  - Todos can be edited, allowing users to modify the text and/or category.
  - Todos can be marked as completed by checking a checkbox.
  - Users can delete todos they no longer need.
  - Todos can be prioritized by dragging and dropping them to change their position in the list using the react-beautiful-dnd library.
- **Session Management**:
  - If the app remains inactive for more than one hour, the user must sign in again to continue using the app.

## Project Structure

- Frontend: React components, API services, and TypeScript types
- Backend: Controllers, services, and DTOs for todos and authentication
- Database: PostgreSQL with TypeORM

## Screenshots
