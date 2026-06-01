# 📸 Instagram Clone - Frontend Application

A beautiful, modern, and highly interactive **React** single-page application built using **Vite** and **TailwindCSS**, connected to the FastAPI backend. It features dynamic state management, full user authentication, and seamless media upload directly to AWS S3 via the API.

---

## ✨ Features

*   **🔒 Complete Authentication Flow:** Seamless login and registration pages, leveraging a custom React Context for persistent JWT session management.
*   **🏡 Dynamic Post Feed:** Fetches all posts from the API and displays them in a gorgeous, responsive reverse-chronological feed.
*   **🖼️ S3 Media Uploads:** Interactive post creator with file drag-and-drop, instant image previewing, and secure API upload to AWS S3.
*   **💬 Interactive Comments:** Read and submit comments on individual posts in real-time under authenticated state.
*   **🗑️ Safe Post Deletion:** Users can securely delete posts they created. The system automatically handles deleting the database record and purging the media asset from the AWS S3 bucket.
*   **📱 Responsive & Modern UI:** Stunning glassmorphism components, smooth hover state animations, and professional layout optimized for both desktop and mobile screens.

---

## 🛠️ Tech Stack

*   **Framework:** [React 18+](https://react.dev/) (Vite-powered for rapid development & hot reloading)
*   **Routing:** [React Router DOM v6](https://reactrouter.com/)
*   **Styling:** Modern utility styling (TailwindCSS / Vanilla CSS)
*   **State Management:** React Context API (`AuthContext`)
*   **Icons:** Custom SVG Icon sprite system

---

## 📂 Project Structure

```
frontend/
├── public/                # Static assets (Favicons, SVG Sprites)
├── src/
│   ├── assets/            # App specific static assets (Hero illustrations, SVGs)
│   ├── components/        # Reusable UI Components
│   │   ├── Authcomponent.jsx    # Tabbed Login / Registration form
│   │   ├── Createpostform.jsx   # Form with S3 image uploading and previews
│   │   ├── Navbar.jsx           # Sticky, modern navigation bar
│   │   └── Post.jsx             # Feed post with comments and delete action
│   ├── context/           # React context providers
│   │   └── AuthContext.jsx      # Authentication & session persistence
│   ├── pages/             # Route-level pages
│   │   ├── Auth.jsx             # Authentication page wrapper
│   │   ├── Home.jsx             # Main posts feed page
│   │   └── Newpost.jsx          # Protected route for posting
│   ├── App.jsx            # Routing and global layout container
│   ├── index.css          # Global styling tokens
│   └── main.jsx           # App entry point
├── package.json           # Scripts and dependencies
└── vite.config.js         # Vite configuration settings
```

---

## 🚀 Setup & Launch Manual

### 1. Prerequisites
Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed.

### 2. Navigate to Frontend Directory
From the root of the workspace, move into the `frontend` folder:
```bash
cd frontend
```

### 3. Install Dependencies
Install all packages and developer dependencies:
```bash
npm install
```

### 4. Environment Configuration
Create a `.env` file in the `frontend` directory:
```env
# frontend/.env
VITE_BACKEND_URL="http://127.0.0.1:8000"
```

### 5. Start the Development Server
Launch the Vite hot-reloading dev server:
```bash
npm run dev
```
Once started, the application will be running at **`http://localhost:5173`**.

---

## 💡 Architecture & Key Modules

### 🔐 Authentication Context (`src/context/AuthContext.jsx`)
Exposes state and controls for managing the user session:
- **`user`**: Stores details of the currently logged-in user (token, username, user ID).
- **`login(userData)`**: Stores credentials and persists them securely inside `localStorage`.
- **`logout()`**: Purges `localStorage` and resets authenticated state.
- **`useAuth()`**: Custom React hook for clean context utilization.

### 🛡️ Protected Routes (`src/App.jsx`)
Ensures pages like the post creator (`/create`) are protected from unauthenticated access:
```jsx
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/auth" replace />
  return children
}
```

### 🖼️ Image Upload Flow (`src/components/Createpostform.jsx`)
1. User selects a local image (drag-and-drop or file selector).
2. The browser generates a temporary local URL for an **instant client preview**.
3. Upon clicking submit, the file is sent as a `multipart/form-data` request to `POST /post/image` along with the user's JWT bearer token.
4. The backend uploads the image to **AWS S3** and returns a permanent public S3 URL.
5. The frontend submits a second request to `POST /post/create` with the S3 URL and post caption to save the post to the database.
