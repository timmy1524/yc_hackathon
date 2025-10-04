#!/bin/bash

# Test with real files: tim.MP3, tim.jpeg, and Tim's LinkedIn profile
# This script converts the files to base64 and makes the API call

echo "🎵 Testing with real files: tim.MP3, tim.jpeg..."

# Check if files exist
if [ ! -f "tim.MP3" ]; then
    echo "❌ Audio file tim.MP3 not found"
    exit 1
fi

if [ ! -f "tim.jpeg" ]; then
    echo "❌ Image file tim.jpeg not found"
    exit 1
fi

echo "📁 Converting files to base64..."

# Convert files to base64 (this might take a moment for large files)
AUDIO_BASE64=$(base64 -i tim.MP3)
IMAGE_BASE64=$(base64 -i tim.jpeg)

echo "📦 File sizes:"
echo "  - Audio: $(wc -c < tim.MP3) bytes"
echo "  - Image: $(wc -c < tim.jpeg) bytes"
echo "  - Audio base64: ${#AUDIO_BASE64} characters"
echo "  - Image base64: ${#IMAGE_BASE64} characters"

echo "🚀 Making API call..."

curl -X POST 'https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3RpcnBvd2VhcWN2dmxlbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ4MzMsImV4cCI6MjA3NTE3MDgzM30.SJDU3hDL4N7jbhT7Kqp6JuNKjIXWAG3nKMoMk5wuz8w' \
  --data-raw "{
    \"user_name\": \"Test User\",
    \"user_email\": \"test@example.com\",
    \"audio_file\": \"$AUDIO_BASE64\",
    \"profile_url\": \"https://www.linkedin.com/in/tim-p-962859221/\",
    \"profile_name\": \"Tim P\",
    \"profile_image\": \"$IMAGE_BASE64\"
  }"

echo ""
echo "✅ Test completed!"
