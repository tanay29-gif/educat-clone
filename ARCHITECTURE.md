# 🏗️ EduStore Frontend Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         REACT FRONTEND                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              USER INTERFACE LAYER                         │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐  │   │
│  │  │   LOGIN    │  │  REGISTER    │  │     PROFILE      │  │   │
│  │  │   (Auth)   │  │   (Auth)     │  │    (Settings)    │  │   │
│  │  └────────────┘  └──────────────┘  └──────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │        COURSE MANAGEMENT (Instructors)            │  │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │  │   │
│  │  │  │  Create  │  │   Edit   │  │   Dashboard      │ │  │   │
│  │  │  │ Course   │  │  Course  │  │   (My Courses)   │ │  │   │
│  │  │  └──────────┘  └──────────┘  └──────────────────┘ │  │   │
│  │  │                                                     │  │   │
│  │  │  ┌──────────────────────────────────────────────┐  │  │   │
│  │  │  │      Manage Sections & Lectures              │  │  │   │
│  │  │  └──────────────────────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │      COURSE DISCOVERY (All Users)                 │  │   │
│  │  │  ┌──────────────┐  ┌──────────────────────────┐   │  │   │
│  │  │  │   Browse     │  │    Course Detail         │   │  │   │
│  │  │  │  Courses     │  │    View + Enroll         │   │  │   │
│  │  │  │              │  │                          │   │  │   │
│  │  │  │  - Filters   │  │  - Course info           │   │  │   │
│  │  │  │  - Search    │  │  - Sections/Lectures     │   │  │   │
│  │  │  │  - Sorting   │  │  - Instructor details    │   │  │   │
│  │  │  │  - Pagination│  │  - Statistics            │   │  │   │
│  │  │  └──────────────┘  └──────────────────────────┘   │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │                 NAVIGATION HEADER                     │ │   │
│  │  │     Logo | Search | Links | User Menu | Dropdown     │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│              APPLICATION STATE & LOGIC LAYER                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │          REACT COMPONENTS & STATE                      │    │
│  │                                                        │    │
│  │  - User State (auth, profile)                         │    │
│  │  - Course State (listing, details)                    │    │
│  │  - Form State (validation, loading)                   │    │
│  │  - Filter State (category, level, price)              │    │
│  │  - Loading States (buttons, pages)                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                 API SERVICE LAYER (axios)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────┐    │
│  │  User Service   │  │ Course Serv. │  │   API Config   │    │
│  │                 │  │              │  │                │    │
│  │ - register()    │  │ - create()   │  │ - axios setup  │    │
│  │ - login()       │  │ - update()   │  │ - interceptors │    │
│  │ - logout()      │  │ - publish()  │  │ - token mgmt   │    │
│  │ - getProfile()  │  │ - search()   │  │ - error handle │    │
│  │ - updateProfile │  │ - list()     │  │ - auto refresh │    │
│  │ - changePassword│  │ - delete()   │  │                │    │
│  │ - updateAvatar()│  │ - getDetail()│  │                │    │
│  └─────────────────┘  └──────────────┘  └────────────────┘    │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                      HTTP/AXIOS LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Authentication Interceptors:                          │    │
│  │  - Add JWT token to all requests                       │    │
│  │  - Handle 401 errors with token refresh                │    │
│  │  - Redirect to login on auth failure                   │    │
│  │  - Maintain CORS credentials                           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                      BACKEND API (Node.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              REST API ENDPOINTS                      │       │
│  │                                                      │       │
│  │  Users:                   Courses:                   │       │
│  │  POST   /users/register   POST   /courses           │       │
│  │  POST   /users/login      GET    /courses           │       │
│  │  POST   /users/logout     GET    /courses/:id       │       │
│  │  GET    /users/profile    PUT    /courses/:id       │       │
│  │  PUT    /users/profile    PUT    /courses/:id/...   │       │
│  │  PUT    /users/avatar     POST   /courses/:id/...   │       │
│  │  POST   /users/change-pw  DELETE /courses/:id       │       │
│  │  POST   /users/refresh-token                        │       │
│  │  DELETE /users/:id                                  │       │
│  │                                                      │       │
│  │  Search:                                             │       │
│  │  GET    /search/courses                              │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐       │
│  │           DATABASE & STORAGE LAYER                   │       │
│  │                                                      │       │
│  │  - MongoDB (Users, Courses, Sections, Lectures)     │       │
│  │  - Cloudinary (Image Storage)                        │       │
│  │  - JWT Tokens (Authentication)                       │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### User Registration Flow
```
┌────────────────┐
│  Register Page │
└────────┬───────┘
         │ Form submission
         ▼
┌────────────────────┐
│  Form Validation   │
│  - Check required  │
│  - Verify email    │
│  - File handling   │
└────────┬───────────┘
         │ Valid?
         ├─── No ──→ Show error
         │
         ├─── Yes ──┐
         │          ▼
         │   ┌──────────────────┐
         │   │ userService.     │
         │   │ register()       │
         │   └────────┬─────────┘
         │            │ API call
         │            ▼
         │   ┌──────────────────┐
         │   │ Backend validates│
         │   │ & uploads avatar │
         │   └────────┬─────────┘
         │            │
         │            ├─── Error ──→ Show error message
         │            │
         │            ├─── Success ──┐
         │            │              ▼
         │            │   ┌──────────────────────┐
         │            │   │ Save tokens to       │
         │            │   │ localStorage         │
         │            │   └────────┬─────────────┘
         │            │            │
         │            │            ▼
         │            │   ┌──────────────────────┐
         │            │   │ Redirect to          │
         │            │   │ Dashboard/Profile    │
         │            │   └──────────────────────┘
         │            │
         └────────────┴──→ Flow complete
```

### Course Creation Flow
```
┌──────────────────┐
│  Create Course   │
│      Form        │
└────────┬─────────┘
         │ Fill form + Upload thumbnail
         ▼
┌──────────────────┐
│   Validation     │
│   - Required     │
│   - File size    │
│   - File type    │
└────────┬─────────┘
         │ Valid?
         ├─── No ──→ Show error
         │
         ├─── Yes ──┐
         │          ▼
         │   ┌──────────────────────┐
         │   │courseService.        │
         │   │createCourse()        │
         │   └────────┬─────────────┘
         │            │ FormData with file
         │            ▼
         │   ┌──────────────────────┐
         │   │ Backend creates      │
         │   │ course (draft)       │
         │   │ Uploads thumbnail    │
         │   └────────┬─────────────┘
         │            │
         │            ├─── Error ──→ Show error message
         │            │
         │            ├─── Success ──┐
         │            │              ▼
         │            │   ┌──────────────────────┐
         │            │   │ Save course ID       │
         │            │   │ Redirect to          │
         │            │   │ EditCourse page      │
         │            │   └──────────────────────┘
         │            │
         └────────────┴──→ Continue editing
```

### Course Browsing Flow
```
┌────────────────┐
│  Browse Courses│
│     Page       │
└────────┬───────┘
         │
         ├─ Set filters (optional)
         │  - Category, Level, Price, Sort
         │
         ├─ Search courses (optional)
         │  - Type query in search bar
         │
         ▼
┌────────────────────────┐
│ courseService.         │
│ listCourses() / search()
└────────┬───────────────┘
         │ API call with params
         ▼
┌────────────────────┐
│ Backend processes: │
│ - Filter          │
│ - Search          │
│ - Sort            │
│ - Paginate        │
└────────┬───────────┘
         │ Returns course list
         ▼
┌────────────────────┐
│ Display courses    │
│ in grid format     │
│ with pagination    │
└────────┬───────────┘
         │
         ├─ Click course ──→ [CourseDetailPage]
         │
         ├─ Change filters ──→ Reload
         │
         └─ Change page ──→ Reload
```

---

## Component Hierarchy

```
App
├── Header
│   ├── Navigation Links
│   ├── Search Bar
│   └── User Menu (conditional)
│
└── Routes
    ├── Public Routes
    │   ├── Home
    │   ├── Login
    │   ├── Register
    │   ├── Courses
    │   │   ├── Filters Sidebar
    │   │   ├── Search Form
    │   │   └── Course Grid
    │   │       └── Course Cards
    │   └── CourseDetailPage
    │       ├── Hero Section
    │       ├── Course Info
    │       ├── Course Structure
    │       └── Sidebar
    │
    └── Protected Routes
        ├── Profile
        │   ├── Avatar Section
        │   ├── Profile Info
        │   └── Forms
        │
        ├── InstructorDashboard
        │   └── Course Cards (Edit/Delete)
        │
        ├── CreateCourse
        │   └── Course Form
        │
        ├── EditCourse
        │   ├── Tab Navigation
        │   ├── Details Tab
        │   ├── Thumbnail Tab
        │   └── Publish Tab
        │
        └── SectionManagement
            ├── Section Form
            └── Section List
                └── Lecture Items
```

---

## State Management

```
App State
├── user
│   ├── id
│   ├── username
│   ├── email
│   ├── fullName
│   ├── role (student/instructor)
│   ├── avatar
│   └── isAuthenticated
│
├── Loading States
│   ├── isLoading (pages)
│   ├── isSubmitting (forms)
│   └── isFetching (lists)
│
└── UI States
    ├── errors (display errors)
    ├── success (display success)
    └── notifications (toast messages)
```

---

## Technology Stack

```
Frontend Layer
├── React 18+ (UI Framework)
├── React Router v6 (Navigation)
└── Material-UI (Component Library)

HTTP Layer
├── Axios (HTTP Client)
└── Interceptors (Auth Management)

Data Persistence
├── localStorage (Tokens)
└── React State (Application Data)

Styling
├── CSS3 (Modern Features)
├── Flexbox (Layouts)
├── Grid (Responsive)
└── Gradients (Design)

Backend Integration
├── REST API
├── JWT Authentication
└── Image Upload (Cloudinary)
```

---

## Security Flow

```
1. User Registration
   │
   └─→ Password hashed on backend
       │
       └─→ JWT token generated

2. User Login
   │
   └─→ Credentials validated
       │
       └─→ JWT token issued
           │
           └─→ Stored in localStorage

3. API Requests
   │
   └─→ Token added to headers
       │
       └─→ Backend validates token
           │
           ├─→ Valid: Process request
           │
           └─→ Invalid: Return 401
               │
               └─→ Frontend attempts refresh
                   │
                   ├─→ Refresh valid: Get new token
                   │
                   └─→ Refresh invalid: Redirect to login

4. Token Expiration
   │
   └─→ Automatic refresh on next request
       │
       └─→ Or manual refresh when needed
           │
           └─→ Seamless user experience
```

---

## Error Handling

```
Error Occurs
│
├─ Network Error
│  └─→ Display: "Network error. Please try again"
│
├─ API Error (4xx)
│  ├─ 400: Invalid data
│  │  └─→ Display specific field errors
│  │
│  ├─ 401: Unauthorized
│  │  └─→ Attempt token refresh
│  │      ├─ Success: Retry request
│  │      └─ Fail: Redirect to login
│  │
│  ├─ 403: Forbidden
│  │  └─→ Display: "You don't have permission"
│  │
│  └─ 404: Not found
│     └─→ Display: "Resource not found"
│
├─ API Error (5xx)
│  └─→ Display: "Server error. Please try again later"
│
├─ Form Validation Error
│  └─→ Display validation messages inline
│
└─ Upload Error
   └─→ Display file type/size errors
```

---

**Architecture is modular, scalable, and production-ready!** 🚀
