# Running DrNow with Docker

This project has been configured to run both the Vite React Client and the Node.js Server easily using Docker and Docker Compose. 

## Prerequisites
- You must have [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running on your machine.

## How to Start the Application
1. Open your terminal in the root `DrNow` directory.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Docker will automatically:
   - Build the Node environment for the **server**.
   - Build the Node environment for the **client**.
   - Install all required `npm` dependencies for both.
   - Start the backend server on port `5000`.
   - Start the frontend client on port `5173`.

## Accessing the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## How to Stop the Application
When you are done testing, press `Ctrl + C` in the terminal to gracefully stop the containers.
To completely remove the containers (your code will remain untouched), run:
```bash
docker-compose down
```

## Hot Reloading
Because we are using volume mounts in `docker-compose.yml`, any changes you make to your local code in `client/src` or `server/src` will automatically trigger hot-reloads inside the Docker containers! You do not need to restart Docker when making code changes.
