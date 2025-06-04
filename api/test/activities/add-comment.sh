#!/bin/bash

# Endpoint URL
URL="http://localhost:8080/activities/add-comment/6834d1a166b33a6df62f9274"

# Authorization token (replace with a valid token)
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RkZTBkMjk4NWJhM2ExYTA0ZmUxYTQiLCJyb2xlIjoic3RhbmRhcmQiLCJpYXQiOjE3NDgyODk3MzYsImV4cCI6MTc0ODMwNDEzNn0.wPV62GYarL3fYsudEfWBPxekfY_Qp1CuxeUW-Trl-kA"

# JSON payload for the comment
COMMENT_PAYLOAD='{
  "comment": "This is a test comment"
}'

# Test comment creation
echo "Testing adding a comment to an activity:"
curl -X PUT $URL \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d "$COMMENT_PAYLOAD" -v

echo -e "\n\n" 