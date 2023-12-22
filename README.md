# Apartment Finder

## How to run locally
Clone the project locally using `git clone` <br /><br />
In the `/react-client` directory:
  - Use the command `npm install` to install client-side packages
  - Use the command `npm run build` to build the React code for production
  - Use the command `npm run dev` to to start the Vite server
 
In the `/server` directory:
  - Use the command `npm install` to install server-side packages
  - Use the command `npm start` to start the GraphQL server
 
Additional commands:
- Use `npm run seed` in the `/server` directory to drop the current Firebase and MongoDB databases and then seed them with sample users (renters, landlords, and admins), apartments, and reviews

## How to run via Docker

Clone the project locally using `git clone` <br /><br />
Install Docker: https://www.docker.com/get-started/ <br /><br />
Run ```docker compose up --build -d``` in the root project directory <br /><br />
#### Site will run on http://localhost:5173/
