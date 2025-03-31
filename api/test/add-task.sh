#!/bin/bash

# Endpoint URL
URL="http://localhost:8080/tasks/add-task"

# Authorization token (replace with a valid token)
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RkZTBkMjk4NWJhM2ExYTA0ZmUxYTQiLCJyb2xlIjoic3RhbmRhcmQiLCJpYXQiOjE3NDI1OTU4MjMsImV4cCI6MTc0MjYxMDIyM30.PBUdDgdQoreOPnU3Qyh8ybs6ayuPjwQs2-ND_E0OQoA"

# JSON payload for a complete task with all parameters
COMPLETE_TASK_PAYLOAD='{
  "description": "ENDPOINT TEST: Project documentation for client presentation",
  "dueDate": "2023-10-30T15:00:00.000Z",
  "priority": "High",
  "status": "Pending",
  "customerId": "67dde4cc985ba3a1a04fe1db",
  "packId": "67dde6b4985ba3a9a04fe292",
  "notes": "Include all API specifications and diagrams"
}'

# JSON payload for a simple task with only required parameters
SIMPLE_TASK_PAYLOAD='{
  "description": "ENDPOINT TEST: Weekly team meeting",
  "priority": "Medium",
  "status": "Pending"
}'

# Test a complete task creation 
echo "Testing creation of a complete task with all parameters:"
curl -X POST $URL \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d "$COMPLETE_TASK_PAYLOAD" -v

echo -e "\n\n"

# Test a simple task creation
echo "Testing creation of a simple task with only required parameters:"
curl -X POST $URL \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d "$SIMPLE_TASK_PAYLOAD" -v

# Note: To test an invalid case (task with pack not owned by user), 
# you would need to modify the packId in the payload to one that 
# doesn't belong to the user associated with the auth token. 