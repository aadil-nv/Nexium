#!/bin/bash

# Paths to services and frontend
FRONTEND_PATH="../frontend"
API_GATEWAY_PATH="./gateway"
AUTH_SERVICE_PATH="./services/authenticationService"
MANAGER_SERVICE_PATH="./services/manageService"
SUPER_ADMIN_SERVICE_PATH="./services/superAdminService"
BUSINESS_OWNER_SERVICE_PATH="./services/businessOwnerService"

# Function to start a service
start_service() {
  SERVICE_NAME=$1
  SERVICE_PATH=$2

  echo "Starting $SERVICE_NAME..."
  (cd "$SERVICE_PATH" && npm run dev) &
}

# Starting frontend and services
start_service "Frontend" "$FRONTEND_PATH"
start_service "API Gateway" "$API_GATEWAY_PATH"
start_service "Authentication Service" "$AUTH_SERVICE_PATH"
start_service "Manager Service" "$MANAGER_SERVICE_PATH"
start_service "Super Admin Service" "$SUPER_ADMIN_SERVICE_PATH"
start_service "Business Owner Service" "$BUSINESS_OWNER_SERVICE_PATH"

# Wait for all background processes to complete
wait
echo "All services and the frontend are now running."
# awsedrawsdkughaskudhuikaseHBIKDLUHGBASLUIKDEBFLBDASJKGHBJADSHJFGDAS