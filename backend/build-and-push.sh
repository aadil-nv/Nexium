#!/bin/bash

services=(
  "nexium-api-gateway ./gateway"
  "nexium-authenticationservice ./services/authenticationService/src"
  "nexium-businessownerservice ./services/businessOwnerService/src"
  "nexium-superadminservice ./services/superAdminService/src"
  "nexium-managerservice ./services/managerService/src"
  "nexium-employeeservice ./services/employeeService/src"
  "nexium-paymentservice ./services/paymentService/src"
  "nexium-communicationservice ./services/communicationService/src"
)

for service in "${services[@]}"; do
  name=$(echo $service | cut -d' ' -f1)
  path=$(echo $service | cut -d' ' -f2)

  echo "🚀 Building $name from $path..."
  docker build -t aadilnv/$name:v1 $path

  echo "📤 Pushing $name to Docker Hub..."
  docker push aadilnv/$name:v1

  echo "✅ Done: $name"
  echo "-----------------------------"
done
