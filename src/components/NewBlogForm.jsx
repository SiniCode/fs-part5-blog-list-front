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

  return (
    <div>
      <h3>Add new blog</h3>
      <form onSubmit={handleSubmit}>
                Title:
        <input
          data-testid='title'
          type='text'
          value={title}
          name='Title'
          onChange={event => setTitle(event.target.value)}
        />
        <br />
                Author:
        <input
          data-testid='author'
          type='text'
          value={author}
          name='Author'
          onChange={event => setAuthor(event.target.value)}
        />
        <br />
                Url:
        <input
          data-testid='url'
          type='text'
          value={url}
          name='Url'
          onChange={event => setUrl(event.target.value)}
        />
        <br />
        <button type='submit' className='blueButton'>Add blog</button>
      </form>
    </div>
  )
}

NewBlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default NewBlogForm
