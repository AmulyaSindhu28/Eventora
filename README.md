\# Event Management Portal



A full-stack web application that allows users to explore events, register for events, and enables organizers to manage events and registrations.



\## Tech Stack



\*\*Frontend\*\*

\- React.js

\- JavaScript

\- HTML5

\- CSS3

\- Vite



\*\*Backend\*\*

\- Java

\- Spring Boot

\- Spring Data JPA

\- Spring Security

\- JWT Authentication



\*\*Database\*\*

\- MySQL



\## Features



\- User registration and login

\- JWT-based authentication

\- Browse and view available events

\- Event creation and management

\- Event registration

\- Manage event registrations

\- Role-based access for users and organizers

\- REST API integration between frontend and backend



\## Project Structure



```text

EventManagementPortal/

├── backend/

│   ├── src/

│   └── pom.xml

├── frontend/

│   ├── src/

│   └── package.json

├── .gitignore

└── README.md

```



\## Running the Project Locally



\### Backend Setup



1\. Open the backend folder in Eclipse.

2\. Configure your MySQL database and environment variables.

3\. Create the `event\_management` database.

4\. Run the Spring Boot application.



Backend runs at: `http://localhost:9090`



\### Frontend Setup



1\. Open the frontend folder in VS Code.

2\. Install dependencies:



```bash

npm install

```



3\. Start the development server:



```bash

npm run dev

```



\## Database Configuration



Configure the following environment variables before running the backend:



\- `DB\_USERNAME`

\- `DB\_PASSWORD`

\- `JWT\_SECRET`



\## Author



Developed as a full-stack development project using React, Spring Boot and MySQL.



