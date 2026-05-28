# 📸 Instagram Clone API

A modern, highly-scalable, and secure backend API for an Instagram-like social media application. Built using **FastAPI**, **SQLAlchemy ORM**, **PostgreSQL** (via Supabase), and **SQLite** (for testing), featuring OAuth2/JWT security and local media storage/serving.

---

## 🚀 Features

*   **🔒 Secure Authentication:** Registration & JWT token-based login via FastAPI OAuth2.
*   **📝 Post Management & Deletion:** Create posts with captions, support custom image types (absolute/relative), fetch post feeds, and securely delete posts.
*   **💬 Interactive Comments:** Create and read comments for individual posts under secure user-authentication.
*   **🖼️ Image Upload Engine:** Upload files securely using standard `multipart/form-data` with automatic collision-safe unique filenames.
*   **📂 Static Asset Serving:** Embedded server-side static routing to deliver uploaded photos.
*   **🌐 CORS Pre-configured:** Pre-configured Cross-Origin Resource Sharing (CORS) to easily connect with modern frontend applications (like React, Next.js, or Vue).
*   **🧪 Robust Test Suite:** Pre-configured with Pytest, testing routers and endpoints effectively.

---

## 🛠️ Tech Stack

*   **Core Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
*   **Database Tooling:** [SQLAlchemy ORM](https://www.sqlalchemy.org/)
*   **Database:** PostgreSQL (Production-ready via Supabase) / SQLite (Testing)
*   **Security & Hashing:** JWT (via `python-jose`), Password Hashing (via `argon2-cffi` / `passlib`)
*   **Media Storage:** `python-multipart` & `shutil` local storage engine

---

## 📦 Setup & Installation Manual

Follow these step-by-step instructions to get the backend service running locally on your system.

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Python 3.10 or higher](https://www.python.org/downloads/)
*   [Git](https://git-scm.com/)

### 2. Clone the Repository
Clone the project repository and navigate to the directory:
```bash
git clone https://github.com/YOUR_USERNAME/Instagram-FastApi.git
cd Instagram-FastApi
```

### 3. Create and Activate Virtual Environment
Create a clean environment for your dependencies:
```bash
# Navigate to Backend folder
cd Backend

# Create a virtual environment
python -m venv env

# Activate the virtual environment
# On Windows (PowerShell):
.\env\Scripts\Activate.ps1

# On Windows (CMD):
.\env\Scripts\activate.bat

# On Linux/macOS:
source env/bin/activate
```

### 4. Install Dependencies
Install all required dependencies using `pip`:
```bash
pip install -r requirements.txt
```

### 5. Environment Configuration
Create a `.env` file inside the `Backend/` directory and configure the environment variables:
```env
# Backend/.env
DB_URL="YOUR_POSTGRESQL_CONNECTION_STRING_OR_LOCAL_SQLITE_URL"
SECRET_KEY="YOUR_SUPER_SECRET_JWT_KEY"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
> [!TIP]
> To quickly generate a secure `SECRET_KEY`, you can run this command in your terminal:
> `python -c "import os; print(os.urandom(32).hex())"`

### 6. Run the Application
Launch the local development server using `uvicorn`:
```bash
uvicorn main:app --reload
```
Once the server has started successfully, you can access:
*   **Base API Health Check:** `http://127.0.0.1:8000/`
*   **Interactive API Docs (Swagger UI):** `http://127.0.0.1:8000/docs`
*   **Alternative Docs (ReDoc):** `http://127.0.0.1:8000/redoc`

### 🌐 CORS Configuration (Cross-Origin Resource Sharing)
By default, the backend allows requests originating from **`http://localhost:3000`** (the standard port for React/Next.js).

If your frontend is running on a different port or domain, you can easily customize this in [main.py](file:///d:/Projects/FastAPI/Instagram-FastApi/Backend/main.py) by updating the `origins` list:
```python
origins = [
    'http://localhost:3000',
    'http://localhost:5173', # Standard Vite development port
    'https://yourfrontenddomain.com', # Production domain
]
```

---

## 🧪 Running Tests

To verify code correctness and run automated tests:
```bash
pytest
```

---

## 📖 API Documentation & Endpoint Reference

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
*   **Success Response (`201 Created`):**
    ```json
    {
      "username": "john_doe",
      "email": "john@example.com"
    }
    ```

#### 2. User Login & Token Generation
*   **Endpoint:** `POST /auth/login`
*   **Authentication:** `None`
*   **Request Body (`multipart/form-data`):**
    *   `username`: `john_doe`
    *   `password`: `strongpassword123`
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
      "image_url": "/images/post_abc123.jpg",
      "image_url_type": "relative",
      "caption": "Enjoying the sunset! 🌅",
      "creator_id": 1
    }
    ```
    *(Note: `image_url_type` accepts only `'absolute'` or `'relative'`)*
*   **Success Response (`201 Created`):**
    ```json
    {
      "creator_id": 1,
      "image_url": "/images/post_abc123.jpg",
      "image_url_type": "relative",
      "caption": "Enjoying the sunset! 🌅",
      "timestamps": "2026-05-28T12:00:00",
      "user": {
        "username": "john_doe"
      },
      "comments": []
    }
    ```

#### 2. Retrieve All Posts
*   **Endpoint:** `GET /post/all`
*   **Authentication:** `None`
*   **Success Response (`200 OK`):**
    ```json
    [
      {
        "creator_id": 1,
        "image_url": "/images/post_abc123.jpg",
        "image_url_type": "relative",
        "caption": "Enjoying the sunset! 🌅",
        "timestamps": "2026-05-28T12:00:00",
        "user": {
          "username": "john_doe"
        },
        "comments": [
          {
            "text": "This is an amazing post!",
            "username": "jane_doe",
            "timestamp": "2026-05-28T13:00:00"
          }
        ]
      }
    ]
    ```

#### 3. Upload Post Image
*   **Endpoint:** `POST /post/image`
*   **Authentication:** `Required (Bearer Token)`
*   **Request Body (`multipart/form-data`):**
    *   `image`: `[File Binary]`
*   **Success Response (`201 Created`):**
    ```json
    {
      "filename": "/images/my_uploaded_image_abCDEf.png"
    }
    ```

#### 4. Delete a Post
*   **Endpoint:** `DELETE /post/delete/{id}`
*   **Authentication:** `Required (Bearer Token)`
*   **URL Path Parameter:** `id` (integer, Post ID)
*   **Success Response (`200 OK`):**
    ```json
    "ok"
    ```
    > [!WARNING]
    > Only the creator of the post is authorized to delete it. Attempting to delete someone else's post returns a `403 Forbidden` response.

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
*   **Success Response (`201 Created`):**
    ```json
    {
      "text": "This is an amazing post!",
      "username": "jane_doe",
      "timestamp": "2026-05-28T13:00:00"
    }
    ```

#### 2. Retrieve All Comments for a Post
*   **Endpoint:** `GET /comment/all/{post_id}`
*   **Authentication:** `None`
*   **URL Path Parameter:** `post_id` (integer, Post ID)
*   **Success Response (`200 OK`):**
    ```json
    [
      {
        "text": "This is an amazing post!",
        "username": "jane_doe",
        "timestamp": "2026-05-28T13:00:00"
      }
    ]
    ```

---

### 📁 Static Assets
*   **Endpoint:** `GET /images/{filename}`
*   **Description:** Serves uploaded files stored in the server's local storage.
