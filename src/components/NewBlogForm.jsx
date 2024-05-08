import { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const blog = {
      title: title,
      author: author,
      url: url
    }
    addBlog(blog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const buttonStyle = {
    marginTop: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'LightSteelBlue'
  }

  const inputStyle = {
    margin: 5,
    padding: 5
  }

  return (
    <div>
      <h3>Add new blog</h3>
      <form onSubmit={handleSubmit}>
                Title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={event => setTitle(event.target.value)}
          style={inputStyle}
        />
        <br />
                Author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={event => setAuthor(event.target.value)}
          style={inputStyle}
        />
        <br />
                Url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={event => setUrl(event.target.value)}
          style={inputStyle}
        />
        <br />
        <button type='submit' style={buttonStyle}>Add blog</button>
      </form>
    </div>
  )
}

NewBlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default NewBlogForm
