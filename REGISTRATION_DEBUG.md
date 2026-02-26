# 🔍 Registration Error Debugging Guide

## What I Fixed

1. **Environment Variable Name** ✅
   - Changed from: `VITE_APP_API_URL`
   - Changed to: `VITE_API_URL` (correct for Vite)

2. **Added Console Logging** ✅
   - Now logs the API base URL on startup
   - Logs detailed error information when registration fails

3. **Better Error Messages** ✅
   - Shows specific error from backend
   - Shows full error details in console

---

## How to Debug Registration Errors Now

### Step 1: Restart Your Frontend
```bash
# Stop the server (Ctrl+C)
# Then run again:
npm run dev
```

### Step 2: Open Browser Console
Press `F12` and go to the **Console** tab

### Step 3: Try Registration Again
Fill the form and click Register

### Step 4: Check Console for Messages

You'll see something like:
```
🔌 API Base URL: http://localhost:8000/api
📤 Sending registration data...
```

If it fails, you'll see:
```
❌ API Error Details: {
  status: 400,
  message: "Username already exists",
  fullData: {...},
  endpoint: "/users/register",
  method: "post"
}
```

---

## Common Registration Errors & Solutions

### Error 1: Network Error / Cannot Connect
**Message**: `API Error: Network Error` or `Cannot reach server`

**Solution**:
- Is backend running? Check terminal: `npm run dev` in backend folder
- Is backend on port 8000? Check in backend logs
- Check if `VITE_API_URL` is correct in `.env.local`

```bash
# Check what's in .env.local
cat frontend/.env.local
# Should show:
# VITE_API_URL=http://localhost:8000/api
```

### Error 2: "Username already exists"
**Message**: `Username already exists` or `Username or email already in use`

**Solution**:
- Try a different username
- Clear database if testing (contact backend dev)

### Error 3: "All fields are required"
**Message**: `All fields are required`

**Solution**:
- Fill all required fields:
  - ✅ Username
  - ✅ Email
  - ✅ Full Name
  - ✅ Password
  - ✅ Role
- Avatar is optional

### Error 4: "Invalid email format"
**Message**: `Invalid email format` or similar

**Solution**:
- Use proper email format: `user@example.com`
- Not: `user@`, `user@.`, `userexample.com`

### Error 5: "Server error" / Status 500
**Message**: `Server error. Please try again later`

**Solution**:
- Check backend console for actual error
- Restart backend: `npm run dev`
- Check database connection
- Contact backend developer

### Error 6: CORS Error
**Message**: In console: `Access to XMLHttpRequest... has been blocked by CORS policy`

**Solution**:
- Check backend CORS configuration
- Should allow: `http://localhost:5173`
- Or allow all in development

---

## Step-by-Step Debug Process

### 1. Verify Backend is Running
```bash
# Terminal 1: Check if running
curl http://localhost:8000/api/users/login -X POST
# Should NOT say "Connection refused"
```

### 2. Check Environment Variable
```bash
# In browser console (F12):
console.log(import.meta.env.VITE_API_URL)
# Should show: http://localhost:8000/api
```

### 3. Check Network Requests
In browser (F12) → **Network** tab:
- Try registration
- Look for request named `register`
- Click it and check:
  - **Status**: Should be 201 (success) or 4xx/5xx (error)
  - **Response**: Shows error details

### 4. Check Form Data Being Sent
In browser (F12) → **Network** tab → Click `register` request:
- Go to **Payload** or **Request** tab
- Should show all your form data

### 5. Check Backend Response
Same location → **Response** tab:
- Shows what backend returned
- Contains error message and reason

---

## Manual Testing with curl (Advanced)

Test registration from command line:

```bash
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User",
    "password": "password123",
    "role": "student"
  }'
```

Expected success response:
```json
{
  "status": 201,
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

## Console Messages Reference

| Message | Meaning | Action |
|---------|---------|--------|
| 🔌 API Base URL: ... | API configured | Normal startup |
| 📤 Sending registration data... | Request started | Check Network tab if it fails |
| ✅ Registration successful | Completed! | Should redirect to dashboard |
| ❌ API Error Details | Request failed | Check status and message fields |

---

## Frontend File Changes Made

### api.js
✅ Added API URL logging
✅ Added detailed error logging with status, message, endpoint
✅ Fixed environment variable name: VITE_API_URL

### Register.jsx
✅ Added console logging for debugging
✅ Better error message extraction
✅ Shows multiple error fields if available

### .env.local
✅ Changed to correct environment variable name

---

## What to Check If Still Not Working

1. ✅ **Backend running?**
   - Check `H:\Coding\React new\main\backend` terminal
   - Should show "Server running on port 8000"

2. ✅ **Frontend restarted?**
   - Stop with Ctrl+C
   - Run `npm run dev` again
   - Must restart to pick up .env.local changes

3. ✅ **.env.local has correct URL?**
   - Check frontend/.env.local
   - Should say: `VITE_API_URL=http://localhost:8000/api`

4. ✅ **Check browser console (F12)**
   - Open Console tab
   - Try registration
   - Look for error messages starting with ❌ or 🔌

5. ✅ **Check Network tab (F12)**
   - Go to Network tab
   - Click register
   - Find the "register" request
   - Check Status code
   - Check Response content

6. ✅ **Check backend console**
   - Look for error messages
   - Backend should also log errors

---

## Quick Fix Checklist

Run this checklist if registration fails:

- [ ] Stop frontend (Ctrl+C)
- [ ] Fix `.env.local` to have `VITE_API_URL=http://localhost:8000/api`
- [ ] Restart frontend: `npm run dev`
- [ ] Backend is running on port 8000
- [ ] Open F12 Console tab
- [ ] Try registration again
- [ ] Read error message in console
- [ ] Check Network tab for request details
- [ ] Check backend console for error logs

---

## Next Steps

1. **Try registering again** with this debugging setup
2. **Take a screenshot** of the error in Console (F12)
3. **Share the error message** that appears in console
4. **I can help** identify the exact issue

The error is now visible in your browser console! 🔍

---

**Backend Error Example Output:**
```
❌ API Error Details: {
  status: 400,
  message: "Username already exists",
  fullData: {
    statusCode: 400,
    message: "Username already exists",
    error: "Bad Request"
  },
  endpoint: "/users/register",
  method: "post"
}
```

**Copy this when you see an error and share it!** 📋
