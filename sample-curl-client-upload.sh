#!/bin/bash

# Sample cURL call for client-upload endpoint
# This example shows how to upload an AAC audio file with profile information

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
