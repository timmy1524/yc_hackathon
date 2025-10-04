# cURL Examples for client-upload Endpoint

## Basic cURL Command

```bash
curl -X POST 'https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3RpcnBvd2VhcWN2dmxlbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ4MzMsImV4cCI6MjA3NTE3MDgzM30.SJDU3hDL4N7jbhT7Kqp6JuNKjIXWAG3nKMoMk5wuz8w' \
  --data-raw '{
    "user_name": "Amber",
    "user_email": "amber@gmail.com",
    "audio_file": "SUQzAwAAAAAAACxUUzUxLjEwMABUaGUgYXVkaW8gZmlsZSBjb250ZW50IGluIGJhc2U2NCBlbmNvZGVkIGZvcm1hdC4gVGhpcyBpcyBhIHNhbXBsZSBhdWRpbyBmaWxlIHRoYXQgd291bGQgYmUgc2VudCBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlci4gVGhlIGF1ZGlvIGZpbGUgaXMgZW5jb2RlZCBpbiBiYXNlNjQgZm9ybWF0IGFuZCB3aWxsIGJlIGNvbnZlcnRlZCB0byBNUDMgZm9ybWF0IGZvciBEaWZ5Lg==",
    "profile_url": "https://www.linkedin.com/in/yilun-s/",
    "profile_name": "Yilun Sun",
    "profile_image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  }'
```

## Expected Success Response

```json
{
  "status": "success",
  "message": "Audio uploaded successfully"
}
```

## Expected Error Response

```json
{
  "status": "error",
  "message": "Audio file required"
}
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_name` | string | Yes | Name of the user uploading the audio |
| `user_email` | string | Yes | Email address of the user |
| `audio_file` | string | Yes | Base64 encoded AAC audio file (will be converted to MP3) |
| `profile_url` | string | Yes | LinkedIn profile URL of the person in the conversation |
| `profile_name` | string | Yes | Name of the person in the conversation |
| `profile_image` | string | No | Base64 encoded profile image (JPEG/PNG format) |

## Notes

- The audio file should be in AAC format and base64 encoded
- The function will automatically convert AAC to MP3 before sending to Dify
- The profile_image is optional but recommended for better AI analysis
- All base64 strings in the example are placeholders - replace with actual encoded data

## Testing with Real Audio File

To test with a real AAC audio file:

1. Convert your AAC file to base64:
   ```bash
   base64 -i your_audio.aac
   ```

2. Replace the `audio_file` value in the curl command with the base64 output

3. Convert your profile image to base64:
   ```bash
   base64 -i your_profile.jpg
   ```

4. Replace the `profile_image` value with the base64 output
