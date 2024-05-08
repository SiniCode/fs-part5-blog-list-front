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

  const pageStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    marginLeft: 250,
    marginRight: 250,
    padding: 50,
    backgroundColor: 'LightSteelBlue',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10
  }

  const buttonStyle = {
    margin: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'LightSalmon'
  }

  const formStyle = {
    margin: 10,
    padding: 5,
    border: 'solid',
    borderWidth: 1,
    backgroundColor: 'Lavender',
    borderRadius: 10
  }

  const inputStyle = {
    margin: 5,
    padding: 5
  }

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
      if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
        await blogService.deleteBlog(blog, user.token)
        const updatedBlogs = blogs.filter(b => b !== blog)
        setBlogs(updatedBlogs)
      }
    }

    return handler
  }

  const loginForm = () => {
    const errorStyle = {
      color: 'White'
    }

    return (
      <div>
        <h2>Log in to see the blogs</h2>
        <h3 style={errorStyle}><i>{message}</i></h3>
        <form onSubmit={handleLogin} style={formStyle}>
          <div>
            Username:
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            Password:
            <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
              style={inputStyle}
            />
          </div>
          <button type='submit' style={buttonStyle}>Log in</button>
        </form>
      </div>
    )
  }

  const handleCreate = async (blog) => {
    const savedBlog = await blogService.createBlog({ newBlog: blog, token: user.token })
    blogFormRef.current.toggleVisibility()
    setMessage(`${savedBlog.title} by ${savedBlog.author} was added to blog list`)
    setTimeout(() => setMessage(null), 5000)
    setBlogs(blogs.concat(savedBlog))
  }

  const blogList = () => {
    const successStyle = {
      color: 'White'
    }

    return(
      <div>
        <p>
          <b>{user.name} logged in</b>
          <button onClick={handleLogout} style={buttonStyle}>Log out</button>
        </p>
        <Togglable buttonLabel='Add new blog' ref={blogFormRef}>
          <NewBlogForm addBlog={handleCreate} />
        </Togglable>
        <h3 style={successStyle}><i>{message}</i></h3>
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
    <div style={pageStyle}>
      <h1>Blog List App</h1>
      {!user && loginForm()}
      {user && blogList()}
    </div>
  )
}

export default App