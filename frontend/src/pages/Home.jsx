import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Post from "../components/Post"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/post/all`)
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data = await response.json()
        
        // Sort posts dynamically in reverse-chronological order (newest first)
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.timestamp || a.timestamps || 0)
          const dateB = new Date(b.timestamp || b.timestamps || 0)
          return dateB - dateA
        })
        
        setPosts(sorted)
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // Helper to format image URLs
  const getImageUrl = (post) => {
    if (!post.image_url) return ""
    return post.image_url
  }

  if (loading) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900 mb-4"></div>
        <p className="text-sm font-medium text-neutral-500 font-['Poppins',sans-serif]">Loading your feed...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center p-8 min-h-[60vh] font-['Poppins',sans-serif]">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 max-w-md text-center shadow-sm">
          <svg className="w-8 h-8 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="font-bold text-sm mb-1">Could not load feed</h3>
          <p className="text-xs text-red-500/80">{error}</p>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center p-8 min-h-[60vh] text-center font-['Poppins',sans-serif]">
        <div className="max-w-md p-8 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-neutral-50 border border-gray-100 flex items-center justify-center mb-4 text-neutral-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-neutral-800 mb-2">No Posts Yet</h2>
          <p className="text-sm text-neutral-500 mb-6 max-w-xs">
            Be the first to share a moment! Create a beautiful new post and show it on the feed.
          </p>
          <Link
            to="/create"
            className="text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl transition-all duration-150 shadow-sm"
          >
            Create a Post
          </Link>
        </div>
      </div>
    )
  }

  const handleAddCommentToPost = (postId, newComment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      )
    )
  }

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
  }

  return (
    <div className="w-full flex-grow flex flex-col items-center p-4">
      {posts.map((post) => (
        <Post
          key={post.id || post.image_url}
          id={post.id}
          image_url={getImageUrl(post)}
          caption={post.caption}
          comments={post.comments}
          username={post.user?.username}
          onAddComment={(newComment) => handleAddCommentToPost(post.id, newComment)}
          onDeletePost={handleDeletePost}
        />
      ))}
    </div>
  )
}

export default Home