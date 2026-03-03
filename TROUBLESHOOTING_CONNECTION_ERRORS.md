# Troubleshooting Connection Errors

This document provides comprehensive instructions for resolving the `net::ERR_CONNECTION_REFUSED` error, along with proper setup instructions for running both frontend and backend servers for the school biometric system.

## Overview
`net::ERR_CONNECTION_REFUSED` is a common error that occurs when a connection attempt is made to a server that is either not running or not accepting connections on the specified port.

## Steps to Troubleshoot `net::ERR_CONNECTION_REFUSED`
1. **Check if the servers are running**: Ensure that both the frontend and backend servers are active. 
   - For Flask backend, run the following command in your terminal:  
     ```bash
     flask run
     ```
   - For the frontend, ensure it is also started, e.g., using npm or yarn.

2. **Confirm the correct port**: Verify that your frontend is trying to connect to the correct backend port. The default Flask server runs on port 5000. Ensure your frontend's API calls are pointing to `http://localhost:5000` (or the correct port).

3. **Firewall and Security Settings**: Make sure that your firewall settings are not blocking the incoming or outgoing connections to the server ports used by the frontend and backend.

4. **Network Configuration**: Check if your network configuration (like VPNs or proxies) may be affecting the connection to the servers.

5. **Check logs**: Inspect the console logs of both frontend and backend for errors that might indicate why the connection is being refused.

## Setting Up the Frontend
1. Ensure you have Node.js and npm installed. If not, download and install them from [Node.js official website](https://nodejs.org/).
2. Clone the repository if not already done:
   ```bash
   git clone https://github.com/IanOtollo/school-biometric-system.git
   cd school-biometric-system/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the frontend server:
   ```bash
   npm start
   ```

## Setting Up the Flask Backend
1. Ensure you have Python and pip installed. Install Flask if it is not already installed:
   ```bash
   pip install Flask
   ```
2. Navigate to the backend directory:
   ```bash
   cd school-biometric-system/backend
   ```
3. Set up the Flask application by setting environment variables (if necessary):
   ```bash
   export FLASK_APP=app.py
   export FLASK_ENV=development
   ```
4. Run the Flask application:
   ```bash
   flask run
   ```

By following these steps, you should be able to resolve connection issues and successfully run both the frontend and backend servers for the school biometric system.