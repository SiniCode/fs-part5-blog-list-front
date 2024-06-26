import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import NewBlogForm from './components/NewBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Invalid credentials')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleCreate = async (blog) => {
    try {
      const savedBlog = await blogService.createBlog({ newBlog: blog, token: user.token })
      blogFormRef.current.toggleVisibility()
      setMessage(
        `${savedBlog.title} by ${savedBlog.author || 'Unknown author'} was added to blog list`
      )
      setTimeout(() => setMessage(null), 5000)
      setBlogs(blogs.concat(savedBlog))
    } catch (exception) {
      setMessage('A blog must have a title and a url')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleLike = (blog) => {
    const comparator = (blog1, blog2) => {
      if (blog1.likes < blog2.likes) {
        return 1
      } else if (blog1.likes > blog2.likes) {
        return -1
      }
      return 0
    }

    const handler = async () => {
      const updatedBlog = await blogService.like(blog)
      updatedBlog.user = blog.user
      const blogIdx = blogs.indexOf(blog)
      const updatedBlogs = blogs.slice(0, blogIdx).concat(updatedBlog).concat(blogs.slice(blogIdx+1))
      setBlogs(updatedBlogs.sort(comparator))
    }

    return handler
  }

  const handleDelete = (blog) => {
    const handler = async () => {
      if (window.confirm(`Delete ${blog.title} by ${blog.author || 'Unknown author'}?`)) {
        await blogService.deleteBlog(blog, user.token)
        const updatedBlogs = blogs.filter(b => b !== blog)
        setBlogs(updatedBlogs)
      }
    }

    return handler
  }

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to see the blogs</h2>
        <h3 className='message'>{message}</h3>
        <form onSubmit={handleLogin} className='loginForm'>
          <div>
            Username:
            <input
              data-testid='username'
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password:
            <input
              data-testid='password'
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit' className='orangeButton'>Log in</button>
        </form>
      </div>
    )
  }

  const blogList = () => {
    return(
      <div>
        <p>
          <b>{user.name} logged in</b>
          <button onClick={handleLogout} className='orangeButton'>Log out</button>
        </p>
        <Togglable buttonLabel='Add new blog' ref={blogFormRef}>
          <NewBlogForm addBlog={handleCreate} />
        </Togglable>
        <h3 className='message'>{message}</h3>
        <h2>Blogs</h2>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={handleLike(blog)}
            deleteBlog={handleDelete(blog)}
            deletable={blog.user.username===user.username}
          />
        )}
      </div>
    )
  }

  return (
    <div className='content'>
      <h1>Blog List App</h1>
      {!user && loginForm()}
      {user && blogList()}
    </div>
  )
}

export default App
