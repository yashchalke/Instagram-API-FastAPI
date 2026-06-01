import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Createpostform = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [caption, setCaption] = useState("")
  const [isSharing, setIsSharing] = useState(false)

  const handleDivClick = () => {
    if (!isSharing) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handlesubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      alert("Please select an image first")
      return
    }

    setIsSharing(true)

    try {
      // Step 1: Upload image file to `/post/image`
      const formData = new FormData()
      formData.append('file', image)

      const imgResponse = await fetch(`${BACKEND_URL}/post/image`, {
        method: 'POST',
        headers:{
          'Authorization':`Bearer ${user.access_token}`
        },
        body: formData
      })

      if (!imgResponse.ok) {
        const errorData = await imgResponse.json()
        throw new Error(errorData.detail || "Failed to upload image")
      }

      const imgData = await imgResponse.json()
      const imageUrl = imgData.Image_URL

      // Step 2: Create post using `/post/create` with the S3 URL
      const createResponse = await fetch(`${BACKEND_URL}/post/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          image_url: imageUrl,
          image_url_type: 'absolute',
          caption: caption,
          creator_id: user.user_id
        })
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(errorData.detail || "Failed to create post")
      }

      alert("Post shared successfully!")
      navigate("/")
    } catch (err) {
      console.error('Error sharing post:', err)
      alert(err.message || "Failed to share post")
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div
      className="border w-120 min-h-[420px] rounded-2xl px-8 py-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col justify-between font-['Poppins',sans-serif] text-neutral-800"
    >
      {/* Brand Header using standard structure */}
      <div className="w-full pb-4 justify-center border-b border-gray-100 flex text-lg font-bold tracking-tight text-neutral-800 select-none">
        <h1>New Post</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col justify-center my-4">
        <form onSubmit={handlesubmit} className="space-y-4">
          <div className="space-y-3">

            {/* Image Selection Upload Field */}
            <div className="space-y-1">
              <h1 className="text-xs font-bold text-gray-500 tracking-wide uppercase select-none">Upload Photo</h1>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={isSharing}
              />

              <div
                onClick={handleDivClick}
                className={`border border-gray-300 rounded-lg p-1 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-150 relative group ${imagePreview ? 'aspect-square h-64 mx-auto' : 'p-6 hover:bg-gray-100/50'
                  } ${isSharing ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    {!isSharing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1.5 rounded-full select-none">
                          Change Photo
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-neutral-600 select-none">Select Image from Computer</span>
                  </>
                )}
              </div>
            </div>

            {/* Caption Textarea Field */}
            <div className="space-y-1">
              <h1 className="text-xs font-bold text-gray-500 tracking-wide uppercase select-none">Caption</h1>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                rows={3}
                disabled={isSharing}
                className="border border-gray-300 w-full px-3 py-2 text-sm rounded-lg bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 text-gray-800 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                required
              />
            </div>

          </div>

          {/* Action Share Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSharing}
              className={`w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all duration-150 text-center shadow-sm ${isSharing
                  ? "bg-neutral-500 cursor-not-allowed opacity-75"
                  : "bg-neutral-900 hover:bg-neutral-800 cursor-pointer"
                }`}
            >
              {isSharing ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default Createpostform