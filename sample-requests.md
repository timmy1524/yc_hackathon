# API Sample Requests & Responses

## Client Upload Endpoint

### Request
**Endpoint:** `POST https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "user_name": "Amber",
  "user_email": "amber@gmail.com",
  "audio_file": "SUQzAwAAAAAAACxUUzUxLjEwMABUaGUgYXVkaW8gZmlsZSBjb250ZW50IGluIGJhc2U2NCBlbmNvZGVkIGZvcm1hdC4gVGhpcyBpcyBhIHNhbXBsZSBhdWRpbyBmaWxlIHRoYXQgd291bGQgYmUgc2VudCBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlci4gVGhlIGF1ZGlvIGZpbGUgaXMgZW5jb2RlZCBpbiBiYXNlNjQgZm9ybWF0IGFuZCB3aWxsIGJlIGNvbnZlcnRlZCB0byBNUDMgZm9ybWF0IGZvciBEaWZ5Lg==",
  "profile_url": "https://www.linkedin.com/in/yilun-s/",
  "profile_name": "Yilun Sun",
  "profile_image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

**Field Descriptions:**
- `user_name`: Name of the user uploading the audio
- `user_email`: Email address of the user
- `audio_file`: Base64 encoded AAC audio file (will be converted to MP3 for Dify)
- `profile_url`: LinkedIn profile URL of the person in the conversation
- `profile_name`: Name of the person in the conversation
- `profile_image`: Base64 encoded profile image (JPEG/PNG format)

### Success Response
**Status Code:** `200 OK`

**Response Body:**
```json
{
  "status": "success",
  "message": "Audio uploaded successfully"
}
```

### Error Response
**Status Code:** `400 Bad Request`

**Response Body:**
```json
{
  "status": "error",
  "message": "Missing required fields"
}
```

**Status Code:** `500 Internal Server Error`

**Response Body:**
```json
{
  "status": "error",
  "message": "Audio upload failed"
}
```

## Chrome Get Contacts Endpoint

### Request
**Endpoint:** `GET https://shktirpoweaqcvvleldo.supabase.co/functions/v1/chrome-get-contacts`

**Query Parameters:**
- `user_name`: Amber
- `user_email`: amber@gmail.com

**Full URL:**
```
https://shktirpoweaqcvvleldo.supabase.co/functions/v1/chrome-get-contacts?user_name=Amber&user_email=amber@gmail.com
```

### Success Response
**Status Code:** `200 OK`

**Response Body:**
```json
{
  "status": "success",
  "message": "Contacts fetched successfully",
  "contacts": [
    {
      "name": "Yilun Sun",
      "profile_url": "https://www.linkedin.com/in/yilun-s/",
      "conversation_summary": "Discussed AI innovations and career growth.",
      "follow_up_text": "Hi Yilun, it was great meeting you at the conference. I'd love to continue our conversation about AI collaboration opportunities.",
      "date_met": "2023-10-15",
      "meeting_event": "Networking Conference",
      "future_potential": "High potential for collaboration on AI projects.",
      "follow_up_priority": "High",
      "follow_up_suggestion": "Reach out to discuss potential AI collaboration."
    },
    {
      "name": "Sarah Johnson",
      "profile_url": "https://www.linkedin.com/in/sarah-johnson/",
      "conversation_summary": "Talked about marketing strategies and digital transformation.",
      "follow_up_text": "Hi Sarah, thanks for the insightful discussion about marketing trends. Let's connect to explore potential partnerships.",
      "date_met": "2023-10-10",
      "meeting_event": "Marketing Summit 2023",
      "future_potential": "Medium potential for business collaboration.",
      "follow_up_priority": "Medium",
      "follow_up_suggestion": "Send a follow-up message about marketing collaboration."
    }
  ]
}
```

### Error Response
**Status Code:** `400 Bad Request`

**Response Body:**
```json
{
  "status": "error",
  "message": "Missing required parameters: user_name and user_email"
}
```

**Status Code:** `500 Internal Server Error`

**Response Body:**
```json
{
  "status": "error",
  "message": "Contacts fetch failed"
}
```

## Testing with cURL

### Test Client Upload
```bash
curl -X POST 'https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "Amber",
    "user_email": "amber@gmail.com",
    "audio_file": "SUQzAwAAAAAAACxUUzUxLjEwMABUaGUgYXVkaW8gZmlsZSBjb250ZW50IGluIGJhc2U2NCBlbmNvZGVkIGZvcm1hdC4gVGhpcyBpcyBhIHNhbXBsZSBhdWRpbyBmaWxlIHRoYXQgd291bGQgYmUgc2VudCBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlci4gVGhlIGF1ZGlvIGZpbGUgaXMgZW5jb2RlZCBpbiBiYXNlNjQgZm9ybWF0IGFuZCB3aWxsIGJlIGNvbnZlcnRlZCB0byBNUDMgZm9ybWF0IGZvciBEaWZ5Lg==",
    "profile_url": "https://www.linkedin.com/in/yilun-s/",
    "profile_name": "Yilun Sun"
  }'
```

### Test Chrome Get Contacts
```bash
curl -X GET 'https://shktirpoweaqcvvleldo.supabase.co/functions/v1/chrome-get-contacts?user_name=Amber&user_email=amber@gmail.com'
```

## JavaScript Example

### Client Upload
```javascript
const uploadAudio = async (audioFile, userInfo, contactInfo) => {
  // Convert audio file to base64
  const base64Audio = await fileToBase64(audioFile);
  
  const response = await fetch('https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_name: userInfo.name,
      user_email: userInfo.email,
      audio_file: base64Audio,
      profile_url: contactInfo.linkedinUrl,
      profile_name: contactInfo.name
    })
  });
  
  const result = await response.json();
  return result;
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
};
```

### Get Contacts
```javascript
const getContacts = async (userInfo) => {
  const url = new URL('https://shktirpoweaqcvvleldo.supabase.co/functions/v1/chrome-get-contacts');
  url.searchParams.append('user_name', userInfo.name);
  url.searchParams.append('user_email', userInfo.email);
  
  const response = await fetch(url);
  const result = await response.json();
  return result;
};
```
