# EduStore Frontend - Complete UI Implementation

## Overview
This document describes the comprehensive UI implementation for the EduStore frontend, covering all backend functionalities with React components, services, and styling.

---

## 🏗️ Project Structure

```
frontend/src/
├── services/
│   ├── api.js              # Axios instance with interceptors
│   ├── userService.js      # User API calls (auth, profile)
│   └── courseService.js    # Course API calls
├── pages/
│   ├── Login.jsx           # User login page
│   ├── Register.jsx        # User registration page
│   ├── Profile.jsx         # User profile & settings
│   ├── Courses.jsx         # Course listing with filters
│   ├── CourseDetailPage.jsx # Course detail view
│   ├── CreateCourse.jsx    # Create new course
│   ├── EditCourse.jsx      # Edit course details
│   ├── InstructorDashboard.jsx # Instructor's course list
│   └── SectionManagement.jsx   # Manage course sections
├── components/
│   ├── Header.jsx          # Navigation header
│   └── (other existing components)
├── styles/
│   ├── Auth.css
│   ├── Profile.css
│   ├── CreateCourse.css
│   ├── EditCourse.css
│   ├── InstructorDashboard.css
│   ├── Courses.css
│   ├── CourseDetail.css
│   └── SectionManagement.css
└── App.jsx                 # Main app with routing
```

---

## 🔐 Authentication Features

### Login Page (`/login`)
- Username and password authentication
- Error handling and validation
- Automatic redirect to dashboard on success
- Link to registration page

### Register Page (`/register`)
- User registration with fields:
  - Username
  - Email
  - Full Name
  - Password
  - Role selection (Student/Instructor)
  - Optional avatar upload
- Avatar preview before upload
- Form validation
- Cloudinary integration for image upload

### Profile Page (`/profile`)
- View user information
- Edit profile (full name, email)
- Change password
- Update avatar
- Success/error notifications

### Authentication Flow
- JWT tokens stored in localStorage
- Automatic token refresh on 401 response
- Protected routes redirect to login if not authenticated
- Logout clears all auth data and cookies

---

## 📚 Course Management Features

### Course Listing (`/courses`)
**Features:**
- Display all published courses in a responsive grid
- Filter by:
  - Category
  - Level (Beginner/Intermediate/Advanced)
  - Price (Free/Paid)
- Sort by:
  - Newest
  - Most Popular
  - Price (Low to High)
- Search functionality
- Pagination
- Course cards show:
  - Thumbnail
  - Title
  - Instructor name
  - Rating
  - Price
  - Level

### Course Detail (`/course/:courseId`)
**Displays:**
- Course hero section with thumbnail
- Course title and subtitle
- Enrollment button
- Course description
- Course structure (expandable sections/lectures)
- What you'll learn
- Instructor details
- Course metadata (level, language, category)
- Course statistics
- Enrollment info

### Create Course (`/create-course`)
**Form Fields:**
- Title (required)
- Subtitle
- Description (required)
- Price
- Level (required)
- Language (required)
- Category:
  - Category Name (required)
  - Category Description
- Thumbnail upload (required)

**Process:**
- File preview before upload
- Creates course in draft status
- Redirects to edit page after creation

### Edit Course (`/course/:courseId/edit`)
**Tabs:**
1. **Course Details**
   - Edit all course information
   - Save changes
   
2. **Thumbnail**
   - View current thumbnail
   - Upload new thumbnail
   
3. **Publish**
   - Publish course to make it visible to students
   - Validation checks for:
     - Title, description, thumbnail
     - At least one section
     - At least one lecture per section
     - Category with description

### Instructor Dashboard (`/dashboard`)
**Features:**
- List of instructor's courses
- Course cards showing:
  - Thumbnail
  - Title
  - Status (Draft/Published)
  - Level and price
- Actions:
  - Edit course
  - Delete course
- Create new course button
- Empty state when no courses

---

## 🎓 Course Structure Management

### Section Management (`/course/:courseId/sections`)
**Features:**
- Add new sections
- Edit section details:
  - Title
  - Description
  - Order
- Delete sections
- View lectures in each section
- Expandable section view

**Section Form:**
- Section title
- Description
- Order number

---

## 🛠️ API Services

### User Service (`services/userService.js`)
```javascript
- register(formData)           // Register new user
- login(credentials)           // Login user
- logout()                     // Logout user
- getCurrentUser()             // Get logged-in user data
- updateProfile(data)          // Update profile info
- updateAvatar(file)           // Upload new avatar
- changePassword(passwords)    // Change password
- deleteUser()                 // Delete account
- refreshAccessToken()         // Refresh JWT token
```

### Course Service (`services/courseService.js`)
```javascript
- createCourse(courseData)          // Create new course
- updateCourseDetails(id, data)     // Update course details
- updateCourseThumbnail(id, file)   // Update thumbnail
- publishCourse(id)                 // Publish course
- listCourses(params)               // Get all published courses
- getCourseDetail(id)               // Get single course
- searchCourses(query, page, limit) // Search courses
- getMyCourses()                    // Get instructor's courses
- deleteCourse(id)                  // Delete course
```

### API Configuration (`services/api.js`)
- Axios instance with baseURL
- Request interceptor adds Bearer token
- Response interceptor handles 401 errors
- Automatic token refresh on expiration
- Cookie-based authentication support

---

## 🎨 Styling

All components use modern CSS with:
- Gradient backgrounds
- Responsive grid layouts
- Smooth transitions and animations
- Consistent color scheme (Purple #667eea, Dark Purple #764ba2)
- Mobile-responsive design
- Error/success message styling

### Color Scheme
- Primary: #667eea (Purple)
- Secondary: #764ba2 (Dark Purple)
- Error: #c33 (Red)
- Success: #3c3 (Green)
- Background: #f9f9f9 (Light Gray)

---

## 🔀 Routing Map

```
Public Routes:
  /                    → Home page
  /courses             → Course listing with filters
  /course/:courseId    → Course detail view
  /login               → Login page
  /register            → Registration page

Protected Routes (Require Login):
  /profile             → User profile
  /dashboard           → Instructor courses
  /create-course       → Create new course
  /course/:courseId/edit      → Edit course
  /course/:courseId/sections  → Manage sections
```

---

## 📦 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install axios react-router-dom
   ```

2. **Environment Variables:**
   Create `.env.local` in frontend root:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

3. **Run the application:**
   ```bash
   npm run dev
   ```

---

## 🔗 Backend Integration

All frontend components are connected to the backend via:
- **User endpoints**: `/api/users/*`
- **Course endpoints**: `/api/courses/*`
- **Search endpoints**: `/api/search/*`

JWT token is automatically included in all requests.

---

## 🚀 Features Implemented

✅ User Authentication (Register, Login, Logout)
✅ User Profile Management
✅ Course Creation & Management
✅ Course Publishing with Validation
✅ Course Listing & Search
✅ Course Filtering & Sorting
✅ Course Details View
✅ Instructor Dashboard
✅ Section Management
✅ Responsive Design
✅ Error Handling
✅ Success Notifications
✅ Protected Routes
✅ Token Refresh Logic

---

## 📝 Notes

- Avatar uploads use Cloudinary for image storage
- Courses support multiple languages and difficulty levels
- Thumbnail images are optimized for web display
- All forms include validation before submission
- Error messages provide specific feedback
- Loading states prevent multiple submissions

---

## 🤝 Contributing

To add new features:
1. Create service methods in `/services/`
2. Create corresponding page/component in `/pages/`
3. Add CSS styling to `/styles/`
4. Update routing in `App.jsx`
5. Update Header navigation if needed

---

**Last Updated:** January 19, 2026
**Version:** 1.0.0
