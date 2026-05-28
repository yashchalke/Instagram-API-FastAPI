# 📸 Instagram Clone API

A modern, highly-scalable, and secure backend API for an Instagram-like social media application. Built using **FastAPI**, **SQLAlchemy ORM**, **PostgreSQL** (via Supabase), and **SQLite** (for testing), featuring OAuth2/JWT security and local media storage/serving.

---

## 🚀 Features

*   **🔒 Secure Authentication:** Registration & JWT token-based login via FastAPI OAuth2.
*   **📝 Post Management:** Create posts with captions, handle custom image types (absolute/relative), and fetch post feeds.
*   **🖼️ Image Upload Engine:** Upload files securely using standard `multipart/form-data` with automatic collision-safe unique filenames.
*   **📂 Static Asset Serving:** Embedded server-side static routing to deliver uploaded photos.
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
      }
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
        }
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

---

### 📁 Static Assets
*   **Endpoint:** `GET /images/{filename}`
*   **Description:** Serves uploaded files stored in the server's local storage.
