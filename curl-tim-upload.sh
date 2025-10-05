#!/bin/bash

# Test client-upload with Tim's real files using cURL
echo "🎵 Testing client-upload with Tim's files via cURL..."

# Supabase project details
SUPABASE_URL="https://shktirpoweaqcvvleldo.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3RpcnBvd2VhcWN2dmxlbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ4MzMsImV4cCI6MjA3NTE3MDgzM30.SJDU3hDL4N7jbhT7Kqp6JuNKjIXWAG3nKMoMk5wuz8w"

# File paths
AUDIO_FILE="/Users/fanzhao/projects/yc_hackathon/tim.MP3"
IMAGE_FILE="/Users/fanzhao/projects/yc_hackathon/tim.jpeg"

# Check if files exist
if [ ! -f "$AUDIO_FILE" ]; then
  echo "❌ Audio file not found: $AUDIO_FILE"
  exit 1
fi

if [ ! -f "$IMAGE_FILE" ]; then
  echo "❌ Image file not found: $IMAGE_FILE"
  exit 1
fi

echo "📁 File details:"
echo "  - Audio file: $AUDIO_FILE ($(stat -f%z "$AUDIO_FILE") bytes)"
echo "  - Image file: $IMAGE_FILE ($(stat -f%z "$IMAGE_FILE") bytes)"

# Encode files to base64
echo "🔄 Encoding files to base64..."
AUDIO_BASE64=$(base64 < "$AUDIO_FILE" | tr -d '\n')
IMAGE_BASE64=$(base64 < "$IMAGE_FILE" | tr -d '\n')

echo "📊 Base64 lengths:"
echo "  - Audio: ${#AUDIO_BASE64} characters"
echo "  - Image: ${#IMAGE_BASE64} characters"

# Create JSON payload
echo "📦 Creating JSON payload..."
JSON_PAYLOAD=$(cat <<EOF
{
  "audio_file": "$AUDIO_BASE64",
  "profile_url": "https://www.linkedin.com/in/tim-p-962859221/",
  "profile_name": "Tim P",
  "profile_image": "$IMAGE_BASE64"
}
EOF
)

# Make the request
echo "🚀 Sending request to client-upload..."
curl -X POST "${SUPABASE_URL}/functions/v1/client-upload" \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  --data-raw "$JSON_PAYLOAD" \
  --write-out "\n📊 HTTP Status: %{http_code}\n📊 Total Time: %{time_total}s\n"

echo "✅ Request completed!"
