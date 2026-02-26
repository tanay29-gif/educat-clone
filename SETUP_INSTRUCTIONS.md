# 🚀 Setup & Installation Guide

## Prerequisites

Make sure you have installed:
- Node.js (v16+)
- npm or yarn
- Git
- Code Editor (VS Code recommended)

---

## Step 1: Frontend Setup (10 minutes)

### 1.1 Install Dependencies

```bash
cd "h:\Coding\React new\main\frontend"
npm install axios
```

### 1.2 Create Environment File

Create `.env.local` in the frontend root directory:

```bash
REACT_APP_API_URL=http://localhost:8000/api
```

### 1.3 Verify Installation

```bash
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Step 2: Backend Verification (5 minutes)

Make sure your backend is running:

```bash
cd "h:\Coding\React new\main\backend"
npm run dev
```

Expected output:
```
Server running on port 8000
```

---

## Step 3: Test the Application (20 minutes)

### Test 1: Registration
1. Open `http://localhost:5173/register`
2. Fill in registration form
3. Select role (Student or Instructor)
4. Upload an avatar (optional)
5. Click Register
6. Should redirect to `/dashboard`

### Test 2: Login
1. Go to `http://localhost:5173/login`
2. Enter username and password
3. Click Login
4. Should redirect to `/dashboard`
5. Check localStorage for tokens (F12 → Application → localStorage)

### Test 3: Browse Courses
1. Go to `http://localhost:5173/courses`
2. Try filters (category, level, price)
3. Try sorting
4. Try search
5. Click on course → View details

### Test 4: Create Course (Instructor Only)
1. Login as instructor
2. Go to `/dashboard`
3. Click "Create New Course"
4. Fill form with course details
5. Upload thumbnail
6. Click Create Course
7. Should redirect to edit page

### Test 5: Edit Course
1. On edit page (`/course/:id/edit`)
2. Go to "Course Details" tab
3. Edit information
4. Click "Save Changes"
5. Check success message

### Test 6: Publish Course
1. On edit page
2. Go to "Publish" tab
3. Ensure all requirements met
4. Click "Publish Course"
5. Check success message

### Test 7: Profile
1. Click user avatar in header
2. Click "My Profile"
3. Edit profile information
4. Change avatar
5. Change password
6. Verify success messages

---

## Step 4: Troubleshooting

### Issue: "Failed to fetch" or CORS errors

**Solution:**
- Check REACT_APP_API_URL in .env.local
- Ensure backend is running on port 8000
- Check backend CORS settings
- Restart both servers

```bash
# Frontend
npm run dev

# Backend (in another terminal)
npm run dev
```

### Issue: Login not working

**Solution:**
- Check backend login endpoint
- Verify user exists in database
- Check token generation
- Clear localStorage and try again

```javascript
// Clear in browser console
localStorage.clear()
sessionStorage.clear()
```

### Issue: Styles not loading

**Solution:**
- Check CSS file paths
- Verify files are in `/styles/` folder
- Restart dev server
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Images not uploading

**Solution:**
- Check Cloudinary configuration in backend
- Verify file size (< 5MB recommended)
- Supported formats: JPG, PNG, GIF, WebP
- Check console for upload errors

### Issue: Token refresh not working

**Solution:**
- Verify refresh endpoint exists in backend
- Check JWT secrets in .env
- Ensure tokens are being saved to localStorage
- Check interceptor logic in `api.js`

---

## Step 5: Environment Variables

### Required Variables

**Frontend (.env.local)**
```
REACT_APP_API_URL=http://localhost:8000/api
```

**Backend (.env)**
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/edustore
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:5173
```

---

## Step 6: Database Seeding (Optional)

To populate with test data:

```bash
cd backend
npm run seed
```

Or manually add users/courses through the API.

---

## Step 7: Running in Production

### Build Frontend

```bash
cd frontend
npm run build
```

Output: `dist/` folder ready to deploy

### Deploy

Options:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **AWS S3**: Upload to bucket
- **Traditional hosting**: Upload files via FTP

### Environment Variables (Production)

```
REACT_APP_API_URL=https://api.yourdomain.com
```

---

## Step 8: Development Workflow

### Start Both Servers

```bash
# Terminal 1: Frontend
cd "h:\Coding\React new\main\frontend"
npm run dev

# Terminal 2: Backend
cd "h:\Coding\React new\main\backend"
npm run dev
```

### Code Changes

- Frontend changes: Auto-refresh (HMR)
- Backend changes: Use nodemon for auto-restart
- CSS changes: Auto-apply without refresh
- API changes: Restart server if needed

### Testing

```bash
# Frontend testing
npm test

# Backend testing
npm test
```

---

## Step 9: API Testing (Optional)

Use Postman or similar tool:

### Register User
```
POST http://localhost:8000/api/users/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User",
  "password": "password123",
  "role": "student"
}
```

### Login
```
POST http://localhost:8000/api/users/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### Create Course
```
POST http://localhost:8000/api/courses
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form data:
- title: "Test Course"
- description: "A test course"
- price: 0
- level: "beginner"
- language: "english"
- category: {"name": "Test"}
- thumbnail: <file>
```

---

## Step 10: Monitoring & Debugging

### Browser DevTools

1. **Console Tab**: Check for JavaScript errors
2. **Network Tab**: Monitor API requests/responses
3. **Application Tab**: Check localStorage tokens
4. **Elements Tab**: Inspect CSS and HTML
5. **React DevTools**: Inspect component state

### Backend Logs

Check terminal output for:
- Server startup messages
- API request logs
- Error messages
- Database queries (if enabled)

### Common Log Messages

```
✅ "Server running on port 8000" - Backend ready
✅ "Connected to MongoDB" - Database ready
✅ "Token refreshed" - Auth working
❌ "Cannot find module" - Missing dependency
❌ "EADDRINUSE" - Port already in use
```

---

## Step 11: Performance Optimization

### Frontend

```bash
# Analyze bundle size
npm run build
npm run preview

# Check performance
npm run analyze
```

### Backend

- Enable caching
- Optimize database queries
- Implement pagination
- Use compression middleware

---

## Step 12: Security Checklist

- ✅ Use HTTPS in production
- ✅ Set secure JWT secrets
- ✅ Enable CORS properly
- ✅ Validate all user inputs
- ✅ Use environment variables
- ✅ Don't commit .env files
- ✅ Implement rate limiting
- ✅ Use HttpOnly cookies (optional)
- ✅ Add CSRF protection
- ✅ Sanitize error messages

---

## Step 13: Useful Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm test            # Run tests
npm run lint        # Check code quality
```

### Backend
```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm start          # Start production server
npm test           # Run tests
```

---

## Step 14: Getting Help

### Resources
1. Read `INDEX.md` - Overview
2. Check `QUICK_START_GUIDE.md` - Common issues
3. Review `ARCHITECTURE.md` - System design
4. Check component comments - Code documentation

### Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| 404 errors | Check API URL in .env.local |
| Auth fails | Verify login endpoint |
| Styles break | Check CSS file paths |
| Images fail | Check Cloudinary config |
| Slow pages | Check Network tab |
| Console errors | Check browser console |

---

## Step 15: Next Steps

1. ✅ Setup complete
2. ✅ Tests passing
3. ✅ Features working
4. ⏭️ Customize styling
5. ⏭️ Add more features
6. ⏭️ Deploy to production

---

## Quick Reference

### URLs
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API: `http://localhost:8000/api`

### Folders
- Frontend code: `h:\Coding\React new\main\frontend\src`
- Backend code: `h:\Coding\React new\main\backend\src`
- API endpoints: `backend/src/routes`

### Key Files
- `frontend/src/App.jsx` - Main app
- `frontend/src/services/` - API calls
- `backend/src/app.js` - Express app
- `backend/src/controllers/` - Business logic

---

**You're all set! Happy coding!** 🚀

If you encounter any issues:
1. Check the browser console
2. Review the documentation
3. Check the code comments
4. Verify API endpoints match

Good luck! 💪
