#!/bin/bash

# Endpoint URL
URL="http://localhost:8080/users/created-users"

# Authorization token (replace with a valid token)
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RkZTBkMjk4NWJhM2ExYTA0ZmUxYTQiLCJyb2xlIjoic3RhbmRhcmQiLCJpYXQiOjE3NDg1MTE2MjUsImV4cCI6MTc0ODUyNjAyNX0.YI_cMa-1w5e0FGFmK2yJ8kWVhpi5-iP8bAi5DRCgbXA"

# Make the GET request
curl -X GET $URL \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" -v