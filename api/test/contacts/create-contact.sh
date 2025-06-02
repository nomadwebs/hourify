#!/bin/bash

# Endpoint URL
URL="http://localhost:8080/contacts/create-contact"

# Authorization token (replace with a valid token)
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RkZTBkMjk4NWJhM2ExYTA0ZmUxYTQiLCJyb2xlIjoic3RhbmRhcmQiLCJpYXQiOjE3NDg4NTU2ODEsImV4cCI6MTc0ODg3MDA4MX0.hnwOHEhlaQ_ADiDepfyVy5nJwhSMD2e-65VyyBxjjdw"

# JSON payload for a complete task with all parameters
COMPLETE_TASK_PAYLOAD='{
  "name": "Graciela",
  "email": "graciela@gmail.com",
  "phone": "666876521",
  "contactType": "lead",
  "nif": "12345678V", 
  "address": "Calle de la Princesa 123", 
  "city": "Madrid", 
  "postalCode": "28001", 
  "website": "https://www.google.com", 
  "linkedUserId": null, 
  "numberOfSessions": "1", 
  "sessionsRecurrency": "weekly", 
  "timeSchedule": "10:00-12:00", 
  "notes": "Le interesa entrenarse para la Maratón"
}'

# Test a complete task creation 
echo "Testing creation of a complete task with all parameters:"
curl -X POST $URL \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d "$COMPLETE_TASK_PAYLOAD" -v

echo -e "\n\n"