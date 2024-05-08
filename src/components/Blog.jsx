import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog, deletable }) => {
  const [allInfo, setAllInfo] = useState(false)

  const changeVisibility = () => {
    setAllInfo(!allInfo)
  }

  const blogStyle = {
    margin: 10,
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    backgroundColor: 'Lavender',
    borderRadius: 10
  }

  const buttonStyle = {
    margin: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'LightSteelBlue'
  }

  const deleteButton = () => {
    const deleteStyle = {
      margin: 5,
      padding: 5,
      borderRadius: 5,
      backgroundColor: 'LightSalmon'
    }

    return (
      <button onClick={deleteBlog} style={deleteStyle}>Delete blog</button>
    )
  }


  const completeInfo = () => (
    <div>
      <p>Url: <a href={blog.url}>{blog.url}</a></p>
      <p>
        Likes: {blog.likes}
        <button onClick={likeBlog} style={buttonStyle}>Like</button>
      </p>
      <p>User: {blog.user.name}</p>
      {deletable && deleteButton()}
    </div>
  )

  return (
    <div style={blogStyle}>
      <b>{blog.title} by {blog.author}</b>
      <button onClick={changeVisibility} style={buttonStyle}>{allInfo ? 'Hide' : 'Show'}</button>
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
