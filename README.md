# 📸 Instagram Clone - Full-Stack Social Application

Welcome to the Instagram Clone! This repository contains a modern, highly-scalable, and secure full-stack application featuring a powerful **FastAPI** backend and a responsive, beautiful **React (Vite)** frontend. 

The application supports robust OAuth2/JWT security, interactive feed generation, comments, user registration, and secure media storage utilizing **AWS S3** cloud services.

---

## 📂 Project Architecture & Directory Mapping

The workspace is organized into two primary micro-services:

```
Instagram-FastApi/
├── Backend/                 # FastAPI RESTful backend service
│   ├── Auth/                # OAuth2 and JWT authentication logic
│   ├── database/            # SQLAlchemy database models, connections, and CRUD methods
│   ├── routers/             # API Endpoint routers and Pydantic schemas
│   ├── requirements.txt     # Python backend dependencies list
│   └── main.py              # Backend entry point and middleware configuration
│
└── frontend/                # React single-page frontend application
    ├── public/              # Static public assets
    ├── src/                 # React source code (components, pages, context)
    ├── package.json         # Node.js dependencies list
    └── vite.config.js       # Vite bundler configuration
```

---

## 🚀 Key Features

*   **🔒 Secure JSON JWT Authentication:** Registration & JWT token-based session persistence using standard FastAPI OAuth2 and React Context API.
*   **📝 Dynamic Post Feed:** Modern, dynamic reverse-chronological feed with clean UI layouts, glassmorphism card components, and subtle hover animations.
*   **💬 Interactive Comments:** Create and read comments for individual posts under user-authentication.
*   **🖼️ S3-Powered Image Upload:** Integrated with AWS S3 bucket to securely host post media, automatically generating unique collision-safe filenames and returning public S3 URLs.
*   **🗑️ Cascaded Cloud Deletion:** Securely delete your own posts. Deleting a post removes it from the database and automatically cleanses/purges the corresponding media asset directly from the AWS S3 bucket.
*   **🌐 CORS Optimized:** Pre-configured Cross-Origin Resource Sharing (CORS) to connect frontend and backend seamlessly.

---

## 🛠️ Tech Stack

*   **Backend Core:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
*   **Database Tooling:** [SQLAlchemy ORM](https://www.sqlalchemy.org/)
*   **Database:** PostgreSQL (via Supabase) / SQLite (Testing)
*   **Security & Hashing:** JWT (via `python-jose`), Password Hashing (via `argon2-cffi` / `passlib`)
*   **Media Storage:** AWS S3 (via `boto3`) and Python-multipart for secure cloud-based image hosting
*   **Frontend Core:** [React 18+](https://react.dev/) (Vite-powered for rapid development & hot reloading)
*   **Routing:** [React Router DOM v6](https://reactrouter.com/)
*   **Styling:** Modern utility styling (TailwindCSS / Vanilla CSS)

---

## 📝 Recent Backend Improvements & Updates

We recently refactored the Backend API to align with modern SPA (Single Page Application) standards and enhance cloud security:

1.  **🔑 JSON-Based Authentication Flow (`POST /auth/login`)**:
    *   *Change:* Transitioned from standard URL-encoded form data (`OAuth2PasswordRequestForm`) to a JSON request body using the `UserLogin` Pydantic model.
    *   *Why:* Simplifies API interaction for the React frontend, allowing standard JSON payloads (`application/json`) rather than form-data.
2.  **🗑️ Automated AWS S3 Purging on Post Deletion**:
    *   *Change:* Updated the deletion logic in [db_post.py](file:///d:/Projects/FastAPI/Instagram-FastApi/Backend/database/db_post.py) to extract the file key from the `image_url` and delete the matching object from the AWS S3 bucket using `s3_client.delete_object`.
    *   *Why:* Prevents orphaned files from consuming unnecessary space and costing resources in your AWS S3 bucket.
3.  **🛡️ Upload Endpoint Protection (`POST /post/image`)**:
    *   *Change:* Enforced authentication dependencies (`Depends(get_current_user)`) on the image upload router.
    *   *Why:* Secures S3 bucket uploads so only authenticated users with valid JWT tokens can write media to your cloud storage.
4.  **🌐 Dynamic CORS Configuration via Environment Variables**:
    *   *Change:* Replaced hardcoded origins in [main.py](file:///d:/Projects/FastAPI/Instagram-FastApi/Backend/main.py) with dynamic fetching from the environment via `os.getenv("ORIGIN_URLS")`.
    *   *Why:* Promotes environment separation and security, allowing you to seamlessly configure allowed origins for staging, production, or local development without modifying the codebase.
    *   *Change:* Removed legacy server-side static image mounting (`/images`), as all images are now served exclusively from cloud S3 buckets.
5.  **🆔 Post Scheme Refinement**:
    *   *Change:* Exposed the post `id` field inside the `PostDisplay` schema, allowing the frontend to track specific database entries for operations like deleting posts and creating comments.

---

## 📦 Local Setup & Installation Manual

### Part 1: Backend Service
1.  Navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    # Create virtual environment
    python -m venv env
    
    # Activate (Windows PowerShell)
    .\env\Scripts\Activate.ps1
    
    # Activate (Linux/macOS)
    source env/bin/activate
    ```
3.  Install python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure your environment in `Backend/.env`:
    ```env
    DB_URL="YOUR_POSTGRESQL_CONNECTION_STRING_OR_LOCAL_SQLITE_URL"
    ORIGIN_URLS="['http://localhost:5173']"
    SECRET_KEY="YOUR_SUPER_SECRET_JWT_KEY"
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    
    # AWS S3 Configuration
    AWS_ACCESS_KEY="YOUR_AWS_ACCESS_KEY"
    AWS_ACCESS_SECRET_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
    AWS_REGION="YOUR_AWS_REGION"
    AWS_BUCKET_NAME="YOUR_AWS_BUCKET_NAME"
    ```
5.  Launch the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
    *   **Base URL:** `http://127.0.0.1:8000/`
    *   **Swagger UI Docs:** `http://127.0.0.1:8000/docs`

---

### Part 2: Frontend Client
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install JavaScript dependencies:
    ```bash
    npm install
    ```
3.  Configure your environment in `frontend/.env`:
    ```env
    VITE_BACKEND_URL="http://127.0.0.1:8000"
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    *   **Local URL:** `http://localhost:5173/`

---

## 📖 API Endpoint Reference

All protected endpoints require a valid JWT bearer token. Include the header `Authorization: Bearer <TOKEN>` in your requests.

### 🔑 Authentication

#### 1. Register a New User
*   **Endpoint:** `POST /auth/register`
*   **Authentication:** `None`
*   **Request Body (`application/json`):**
    ```json
    {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "strongpassword123"
    }
    ```
*   **Success Response (`201 Created`)**

#### 2. User Login & Token Generation
*   **Endpoint:** `POST /auth/login`
*   **Authentication:** `None`
*   **Request Body (`application/json`):**
    ```json
    {
      "username": "john_doe",
      "password": "strongpassword123"
    }
    ```
*   **Success Response (`200 OK`):**
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer",
      "user_id": 1,
      "username": "john_doe"
    }
    ```

---

### 📝 Posts

#### 1. Create a New Post
*   **Endpoint:** `POST /post/create`
*   **Authentication:** `Required (Bearer Token)`
*   **Request Body (`application/json`):**
    ```json
    {
      "image_url": "https://your-bucket-name.s3.your-region.amazonaws.com/unique-uuid.png",
      "image_url_type": "absolute",
      "caption": "Enjoying the sunset! 🌅",
      "creator_id": 1
    }
    ```
*   **Success Response (`201 Created`)**

#### 2. Retrieve All Posts
*   **Endpoint:** `GET /post/all`
*   **Authentication:** `None`
*   **Success Response (`200 OK`)**

#### 3. Upload Post Image
*   **Endpoint:** `POST /post/image`
*   **Authentication:** `Required (Bearer Token)`
*   **Request Body (`multipart/form-data`):**
    *   `image`: `[File Binary]`
*   **Success Response (`201 Created`):**
    ```json
    {
      "success": true,
      "Image_URL": "https://your-bucket-name.s3.your-region.amazonaws.com/unique-uuid.png"
    }
    ```

#### 4. Delete a Post
*   **Endpoint:** `DELETE /post/delete/{id}`
*   **Authentication:** `Required (Bearer Token)`
*   **URL Path Parameter:** `id` (integer, Post ID)
*   **Success Response (`200 OK`):** `"ok"`
    > [!WARNING]
    > Only the creator of the post is authorized to delete it. Attempting to delete someone else's post returns a `403 Forbidden` response. Deletion also triggers the automatic removal of the file from your AWS S3 bucket.

---

### 💬 Comments

#### 1. Create a Comment on a Post
*   **Endpoint:** `POST /comment/create`
*   **Authentication:** `Required (Bearer Token)`
*   **Request Body (`application/json`):**
    ```json
    {
      "username": "jane_doe",
      "text": "This is an amazing post!",
      "post_id": 1
    }
    ```

#### 2. Retrieve All Comments for a Post
*   **Endpoint:** `GET /comment/all/{post_id}`
*   **Authentication:** `None`
*   **URL Path Parameter:** `post_id` (integer, Post ID)
