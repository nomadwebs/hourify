#!/bin/bash

# Endpoint URL
URL="http://localhost:8080/users/createByProvider"

# Authorization token (replace with a valid token)
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzgwZjhmZTU4MjU1ZDIwNTYzZDZhNWYiLCJyb2xlIjoic3RhbmRhcmQiLCJpYXQiOjE3NDE4NTM4MzUsImV4cCI6MTc0MTg2ODIzNX0.lwHFPdLOFe0LyMalKVRF5d_Jf_WUUW5wzqlNzXpuEvs"

# JSON payload
PAYLOAD='{
  "name": "carmen de mairena",
  "email": "togora6298@framitag.com",
  "username": "carmenmairena"
}'

# Make the POST request
curl -X POST $URL \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d "$PAYLOAD" -v