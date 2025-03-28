#!/bin/bash

# Configuration
API_URL="http://localhost:8080"
TASK_ID="67e1e727ccbb1890ea2f4cc7"  # Replace with your test task ID

# JWT token (for authentication)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RkZTBkMjk4NWJhM2ExYTA0ZmUxYTQiLCJyb2xlIjoic3RhbmRhcmQiLCJpYXQiOjE3NDMxNTExODIsImV4cCI6MTc0MzE2NTU4Mn0.8_K6CzxmMXK6gBA4-tTxVpgQRN_UBqg6kI9UCrJo0gs"

# Task data to update (customize as needed)
read -r -d '' TASK_DATA << EOM
{
  "description": "Updated task description",
  "dueDate": "2025-06-30T00:00:00.000Z",
  "priority": "Low",
  "status": "On Hold",
  "customer": "67dde4cc985ba3a1a04fe1db",
  "notes": "These are updated notes for the task"
}
EOM

# Display information about what we're doing
echo "===== Task Update Test ====="
echo "URL: $API_URL/tasks/update/$TASK_ID"
echo "Data to send:"
echo "$TASK_DATA"
echo "=========================="

# Execute the API call
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$TASK_DATA" \
  "$API_URL/tasks/update/$TASK_ID" \
  -v

echo # Add a newline after the response