# 🗺️ Complete Routes & Navigation Map

## All Available Routes

### 🏠 Public Routes (No Authentication Required)

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Home | Home page |
| `/login` | Login | User login |
| `/register` | Register | User registration |
| `/courses` | Courses | Browse all courses |
| `/course/:courseId` | CourseDetailPage | View course details |

---

### 🔐 Protected Routes (Authentication Required)

| Path | Component | Purpose | Role |
|------|-----------|---------|------|
| `/profile` | Profile | User profile & settings | All |
| `/dashboard` | InstructorDashboard | My courses | Instructor |
| `/create-course` | CreateCourse | Create new course | Instructor |
| `/course/:courseId/edit` | EditCourse | Edit course details | Instructor |
| `/course/:courseId/sections` | SectionManagement | Manage sections | Instructor |

---

## 📱 Header Navigation Structure

```
EduStore Logo (links to /)
│
├─ Search Bar (searches courses)
├─ Explore Button → /courses
│
├─ For Logged Out Users:
│  ├─ Sign In → /login
│  └─ Sign Up → /register
│
└─ For Logged In Users:
   ├─ Avatar Dropdown Menu
   │  ├─ My Profile → /profile
   │  ├─ [If Instructor] My Courses → /dashboard
   │  ├─ [If Instructor] Create Course → /create-course
   │  └─ Logout → /
```

---

## 🔀 Navigation Flow Diagrams

### Student Journey
```
Landing (/home)
    ↓
Browse Courses (/courses)
    ↓
View Course Details (/course/:id)
    ↓
Login/Register (/login or /register)
    ↓
Profile (/profile)
```

### Instructor Journey
```
Register as Instructor (/register)
    ↓
Dashboard (/dashboard)
    ↓
Create Course (/create-course)
    ↓
Edit Course Details (/course/:id/edit)
    ↓
Manage Sections (/course/:id/sections)
    ↓
Publish Course (/course/:id/edit → Publish Tab)
```

### Authentication Flow
```
User Action
    ↓
API Call with JWT Token
    ↓
Token Valid? → Yes → Continue
    ↓            No → Refresh Token
                        ↓
                    Token Expired? → Yes → Redirect to /login
                                      No → Continue
```

---

## 🎯 Route Hierarchy

```
App.jsx (Root)
├── Public Routes
│   ├── Home (/)
│   ├── Login (/login)
│   ├── Register (/register)
│   ├── Courses (/courses)
│   └── Course Detail (/course/:courseId)
│
├── Protected Routes (ProtectedRoute Component)
│   ├── Profile (/profile)
│   ├── Dashboard (/dashboard)
│   ├── Create Course (/create-course)
│   ├── Edit Course (/course/:courseId/edit)
│   └── Sections (/course/:courseId/sections)
│
└── Header (appears on all routes)
    ├── Navigation Links
    ├── Search Bar
    └── User Menu (conditional)
```

---

## 📊 Route Parameters

| Route | Parameters | Description |
|-------|-----------|-------------|
| `/course/:courseId` | courseId (UUID) | Specific course to view |
| `/course/:courseId/edit` | courseId (UUID) | Course to edit |
| `/course/:courseId/sections` | courseId (UUID) | Course sections to manage |

---

## 🔗 Query Parameters (Optional)

| Parameter | Route | Purpose |
|-----------|-------|---------|
| `?search=query` | `/courses` | Search courses |
| `?category=name` | `/courses` | Filter by category |
| `?level=beginner` | `/courses` | Filter by level |
| `?price=free` | `/courses` | Filter by price |
| `?sort=popular` | `/courses` | Sort courses |
| `?page=2` | `/courses` | Pagination |

---

## 🚦 Route Guard Logic

### ProtectedRoute Component
```javascript
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" />;
}
```

### Redirect Rules
1. If user not logged in → Redirect to `/login`
2. If token expired → Refresh token automatically
3. If refresh fails → Redirect to `/login`
4. If user accesses `/login` while logged in → Can access (no block)

---

## 📱 Mobile Navigation

On mobile devices:
- Header menu collapses to hamburger (existing implementation)
- All routes remain the same
- Navigation drawer slides from left
- Search remains available
- User menu dropdown still accessible

---

## 🎯 Redirect on Login

After successful login, user is redirected to:
- `/dashboard` - If they have courses to manage
- `/profile` - First-time setup
- Last visited page (can be implemented)

---

## 🛑 Page Not Found

Routes not defined will show:
- React Router default behavior
- Can be customized with catch-all route

Example to add 404 page:
```jsx
<Route path="*" element={<NotFound />} />
```

---

## 🔄 Dynamic Route Generation

Routes are dynamically generated based on:
- User authentication status
- User role (student/instructor)
- Course availability
- JWT token validity

---

## 📋 Route Groups by Feature

### Authentication Routes
- `/login` - Login
- `/register` - Register
- `/profile` - Profile (protected)

### Course Discovery Routes
- `/courses` - Browse all
- `/course/:id` - Single course

### Course Management Routes (Protected)
- `/dashboard` - List my courses
- `/create-course` - New course
- `/course/:id/edit` - Edit course
- `/course/:id/sections` - Manage sections

---

## 🎨 Route-Based Styling

Each route has dedicated CSS:
- Auth routes: `Auth.css`
- Profile: `Profile.css`
- Courses: `Courses.css`, `CourseDetail.css`
- Course creation: `CreateCourse.css`
- Course editing: `EditCourse.css`
- Management: `InstructorDashboard.css`, `SectionManagement.css`

---

## 🔐 Security Considerations

1. **Protected Routes**: Use `ProtectedRoute` wrapper
2. **Token Validation**: API interceptor validates on each request
3. **Auto Logout**: Redirect to login on token expiration
4. **CORS**: Configured in backend
5. **HttpOnly Cookies**: Used for token storage (optional)

---

## 📞 Common Navigation Patterns

### From Course Detail → Create Course
1. User logs in as instructor
2. Views courses
3. Clicks "Create Course" → `/create-course`
4. Fills form → Creates course
5. Redirected → `/course/:id/edit`

### From Dashboard → Edit Course
1. User at `/dashboard`
2. Clicks "Edit" on course card
3. Navigates → `/course/:id/edit`
4. Makes changes and saves
5. Stays on page or returns to `/dashboard`

### Search → View Course
1. User searches at top
2. Redirected → `/courses?search=query`
3. Results display
4. Clicks course → `/course/:courseId`

---

**All routes are fully integrated and ready to use!** 🚀
