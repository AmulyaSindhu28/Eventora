# Eventora

### A Full-Stack Web Application for Managing Events and Registrations

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)
![Spring
Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Language-Java-ED8B00?logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)

------------------------------------------------------------------------

## Overview

Eventora is a full-stack web application that allows
users to explore events and register for them. Organizers can create,
update, and manage events and view registrations.

The frontend is built with React, the backend uses Java and Spring Boot,
and MySQL is used for data storage.

## Technology Stack

**Frontend** - React.js - JavaScript - HTML5 - CSS3 - Vite

**Backend** - Java - Spring Boot - Spring Web - Spring Data JPA -
Hibernate

**Security** - Spring Security - JWT Authentication

**Database** - MySQL

**Tools** - Eclipse - VS Code - Postman - Git and GitHub

## Features

### User Features

- User registration and login
- Browse and view available events
- View event details
- Register for events

### Organizer Features

- Create and manage events
- Update event details
- View event registrations
- Manage registrations

### Application Features

- REST API integration between React and Spring Boot
- JWT-based authentication
- Role-based access for users and organizers
- MySQL database integration

## Project Structure

``` text
EventManagementPortal/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Java JDK
- Maven (or use the included Maven Wrapper)
- Node.js and npm
- MySQL

### 1. Clone the Repository

``` bash
git clone https://github.com/AmulyaSindhu28/Eventora.git
cd Eventora
```

### 2. Set Up the Database

Start MySQL and create the database:

``` sql
CREATE DATABASE event_management;
```

Configure these environment variables for the backend: - `DB_USERNAME` -
`DB_PASSWORD` - `JWT_SECRET`

### 3. Run the Backend

Open a terminal in the backend folder:

``` powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend runs at `http://localhost:9090`.

### 4. Run the Frontend

Open another terminal in the frontend folder:

``` bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Configuration

The backend reads database credentials and the JWT signing secret from
environment variables. Do not commit actual passwords, tokens, or secret
keys to the repository.

The MySQL database `event_management` should be available before
starting the backend.

## Author

**Amulya Sindhu Bejjanki**

GitHub: [AmulyaSindhu28](https://github.com/AmulyaSindhu28)

------------------------------------------------------------------------

*Built with React, Spring Boot and MySQL.*
