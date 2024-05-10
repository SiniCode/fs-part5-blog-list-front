import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog, deletable }) => {
  const [allInfo, setAllInfo] = useState(false)

  const changeVisibility = () => {
    setAllInfo(!allInfo)
  }

  const deleteButton = () => {
    return (
      <button onClick={deleteBlog} className='orangeButton'>Delete blog</button>
    )
  }

  const completeInfo = () => (
    <div>
      <p>Url: <a href={blog.url}>{blog.url}</a></p>
      <p>
        Likes: {blog.likes}
        <button onClick={likeBlog} className='blueSideButton'>Like</button>
      </p>
      <p>User: {blog.user.name}</p>
      {deletable && deleteButton()}
    </div>
  )

  return (
    <div className='blog'>
      <b>{blog.title} by {blog.author || 'Unknown author'}</b>
      <button onClick={changeVisibility} className='blueSideButton'>{allInfo ? 'Hide' : 'Show'}</button>
      {allInfo && completeInfo()}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  deletable: PropTypes.bool.isRequired
}

export default Blog
