#!/bin/bash

# Endpoint URL
URL="http://localhost:8080/contacts/create-contact"

# Authorization token (replace with a valid token)
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RkZTBkMjk4NWJhM2ExYTA0ZmUxYTQiLCJyb2xlIjoic3RhbmRhcmQiLCJpYXQiOjE3NDg1MTg1NjgsImV4cCI6MTc0ODUzMjk2OH0.Pi787Cj1iPsKuVFxoPnpH12B5HpA2VXH5dIw30kO_0Y"

# JSON payload for a complete task with all parameters
COMPLETE_TASK_PAYLOAD='{
  "name": "Unai",
  "email": "herculesbenat@elmasfuerte.com",
  "phone": "666876521",
  "contactType": "lead",
  "notes": "Le interesa entrenarse para la Maratón"
}'

# Test a complete task creation 
echo "Testing creation of a complete task with all parameters:"
curl -X POST $URL \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d "$COMPLETE_TASK_PAYLOAD" -v

echo -e "\n\n"