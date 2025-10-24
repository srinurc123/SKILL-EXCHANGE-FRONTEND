Skill Exchange Platform
Overview
Skill Exchange is a full-stack web application designed to enable users to exchange skills through peer-to-peer matching. The project showcases modern software development practices using Spring Boot for the backend and React for the frontend, with secure JWT-based authentication and real-time messaging features.

This project also includes gamification elements, with multiple games accessible via a sidebar after login.

Features
User registration and login with JWT authentication

User profile management

Skill management: add, list, and delete skills

Skill exchange requests: send, receive, accept, and reject requests

Real-time messaging system between users

Games section accessible from sidebar with multiple games

Responsive and user-friendly UI using Material-UI

Secure backend with Spring Security and JWT

RESTful APIs with error handling and validation

CORS configuration for frontend-backend communication

Technologies Used
Backend: Java 21, Spring Boot 3.5.7, Spring Security, JWT, Spring Data JPA, MySQL, Lombok, ModelMapper, WebSocket

Frontend: React, React Router v6, Material-UI, Axios

Build Tools: Maven (backend), npm/yarn (frontend)

Getting Started
Prerequisites
Java 21 or higher

Maven 3.x

Node.js 16+

MySQL server running locally (or accessible remotely)

IDE or code editor of choice

Backend Setup
Clone this repository.

Configure MySQL database and update application.properties with your DB credentials.

Ensure tables and roles are created automatically by Hibernate (spring.jpa.hibernate.ddl-auto=update).

Run the backend Spring Boot application:

bash
mvn clean install
mvn spring-boot:run
The backend runs on http://localhost:8080.

Frontend Setup
Navigate to the frontend directory:

bash
cd skill-exchange-frontend
Install dependencies:

bash
npm install
Start the React development server:

bash
npm start
The frontend runs on http://localhost:3000 and communicates with the backend.

Project Structure
backend/ - Spring Boot REST APIs, security, database entities, services

frontend/ - React SPA, API integration, UI components, routing

api/ - Axios API calls

auth/ - Authentication pages (login/register)

dashboard/ - User dashboard and skill management

match/ - Skill exchange request UI

message/ - Real-time messaging UI

context/ - React auth state management

utils/ - API client and helpers

Usage
Register a new user and login.

Manage your skills from the dashboard.

Send and respond to skill exchange requests.

Chat with matched users.

Access games from the sidebar menu.

Known Issues & Enhancements
Add more robust error handling and validations.

Improve game implementations.

Add user search and skill search features.

Support file uploads for profile images.

Enhance UI with animations and accessibility improvements.
