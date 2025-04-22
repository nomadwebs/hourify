#!/bin/bash

# Endpoint base
BASE_URL="http://localhost:8080/calendar/update"

# ID del evento a actualizar
EVENT_ID="67f7c1e2d308eebf1a3be876"

# Token JWT para autenticación (ajusta si es necesario)
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RkZTBkMjk4NWJhM2ExYTA0ZmUxYTQiLCJyb2xlIjoic3RhbmRhcmQiLCJpYXQiOjE3NDQyODg5NTcsImV4cCI6MTc0NDMwMzM1N30.VcblMpAiGrXgAyTCt9kixKmjcUQafoZmTs2hDc0YjAg"

# Payload del evento a actualizar
EVENT_UPDATE_PAYLOAD='{
  "title": "Updated title from test",
  "description": "Updated description from bash test",
  "location": "Barcelona",
  "attendees": [],
  "startDateTime": "2025-04-25T10:00:00.000Z",
  "endDateTime": "2025-04-25T12:30:00.000Z"
}'

# Ejecutar la petición
curl -X PUT "$BASE_URL/$EVENT_ID" \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d "$EVENT_UPDATE_PAYLOAD" \
     -v

echo -e "\n\n"
