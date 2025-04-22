#!/bin/bash

# Endpoint URL
URL="http://localhost:8080/calendar/add-event"

# Authorization token (replace with a valid token)
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RkZTBkMjk4NWJhM2ExYTA0ZmUxYTQiLCJyb2xlIjoic3RhbmRhcmQiLCJpYXQiOjE3NDQyODg5NTcsImV4cCI6MTc0NDMwMzM1N30.VcblMpAiGrXgAyTCt9kixKmjcUQafoZmTs2hDc0YjAg"

# JSON payload for a complete event with all parameters
COMPLETE_event_PAYLOAD='{
  "title": "titulo del evento",
  "description": " descripción del evento",
  "location": "Oficina",
  "status": "Pending",
  "attendees": ["67dde4cc985ba3a1a04fe1db", "67dde5cc985ba6a1a04fe9db"],
  "startDateTime": "2025-03-25T15:00:00.000Z",
  "endDateTime": "2025-03-25T18:00:00.000Z"
}'

# Test a complete event creation 
echo "Testing creation of a complete event with all parameters:"
curl -X POST $URL \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d "$COMPLETE_event_PAYLOAD" -v

echo -e "\n\n"