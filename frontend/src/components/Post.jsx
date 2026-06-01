import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Post = ({ 
  id,
  image_url, 
  caption, 
  comments = [], 
  username ,
  onAddComment,
  onDeletePost
}) => {
  const { user } = useAuth()
  const [commentText, setCommentText] = useState("")
  const [showMenu, setShowMenu] = useState(false)

  // Get the first character of the username for a clean avatar fallback
  const avatarLetter = username ? username.charAt(0).toUpperCase() : "U"

  const handlePostComment = async (e) => {
    if (e) e.preventDefault()
    if (!commentText.trim()) return

    if (!user) {
      alert("Please log in to add a comment!")
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          username: user.username,
          text: commentText,
          post_id: id
        })
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      const newComment = await response.json()
      if (onAddComment) {
        onAddComment(newComment)
      }
      setCommentText("")
    } catch (err) {
      console.error('Error posting comment:', err)
      alert(err.message || "Failed to add comment")
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`${BACKEND_URL}/post/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.access_token}`    
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      alert("Post deleted successfully!")
      if (onDeletePost) {
        onDeletePost(id)
      }
    } catch (err) {
      console.error('Error deleting post:', err)
      alert(err.message || "Failed to delete post")
    } finally {
      setShowMenu(false)
    }
  }

  return (
    <div className="w-full max-w-[470px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col font-['Poppins',sans-serif] mb-6">
      
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3 select-none">
        <div className="flex items-center gap-3">
          {/* Circular Avatar */}
          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-gray-200 flex items-center justify-center font-bold text-sm text-neutral-600 uppercase select-none">
            {avatarLetter}
          </div>
          {/* Username */}
          <span className="text-sm font-semibold text-neutral-800 hover:text-neutral-600 transition-colors cursor-pointer">
            {username}
          </span>
        </div>
        
        {/* Header Action Menu Button (Dots) */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => setShowMenu(!showMenu)}
            className="text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer select-none p-1 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-10 font-['Poppins',sans-serif]">
              {user && user.username === username ? (
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Delete Post
                </button>
              ) : (
                <span className="block px-4 py-2 text-xs text-neutral-400 select-none text-center">
                  No Actions
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Image Container */}
      <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-t border-b border-gray-100 select-none">
        <img 
          src={image_url} 
          alt={caption} 
          className="w-full h-full object-cover select-none"
          loading="lazy"
        />
      </div>

      {/* Caption & Comments Content Area */}
      <div className="px-4 py-2 flex flex-col gap-2">
        {/* Caption */}
        <div className="text-sm">
          <span className="font-bold text-neutral-900 mr-2 hover:underline cursor-pointer">{username}</span>
          <span className="text-neutral-700 whitespace-pre-wrap">{caption}</span>
        </div>

        {/* Comments Feed */}
        {comments && comments.length > 0 && (
          <div className="mt-1 flex flex-col gap-1 border-t border-gray-50 pt-2">
            {comments.map((comment, index) => {
              // Gracefully handle both string inputs and comment objects
              const isObject = typeof comment === "object" && comment !== null;
              const commentUser = isObject ? comment.username : "anonymous";
              const commentText = isObject ? comment.text : comment;

              return (
                <div key={index} className="text-xs">
                  <span className="font-bold text-neutral-900 mr-2 hover:underline cursor-pointer">
                    {commentUser}
                  </span>
                  <span className="text-neutral-700">
                    {commentText}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add a Comment Bar */}
      <form onSubmit={handlePostComment} className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-white mt-1">
        <input 
          type="text" 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="text-xs w-full bg-transparent focus:outline-none placeholder-gray-400 text-gray-800 border-none p-0 focus:ring-0"
        />
        <button 
          type="submit" 
          disabled={!commentText.trim()}
          className={`text-xs font-bold transition-colors duration-150 cursor-pointer pl-2 select-none ${
            commentText.trim() ? "text-blue-500 hover:text-blue-600" : "text-blue-300 cursor-not-allowed"
          }`}
        >
          Post
        </button>
      </form>

    </div>
  )
}

export default Post