import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const loginForm = () => {
    const errorStyle = {
      color: 'red'
    }

    return (
      <div>
        <h2>Log in to see the blogs</h2>
        <h3 style={errorStyle}><i>{message}</i></h3>
        <form onSubmit={handleLogin}>
          <div>
            Username: 
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password: 
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Log in</button>
        </form>
      </div>
    )
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    const blog = {
      title: title,
      author: author,
      url: url
    }
    const savedBlog = await blogService.createBlog({newBlog: blog, token: user.token})
    setMessage(`${savedBlog.title} by ${savedBlog.author} was added to blog list`)
    setTimeout(() => setMessage(null), 5000)
    setBlogs(blogs.concat(savedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const newBlogForm = () => (
    <form onSubmit={handleCreate}>
      Title:
      <input
        type="text"
        value={title}
        name="Title"
        onChange={({ target }) => setTitle(target.value)}
      />
      <br />
      Author:
      <input
        type="text"
        value={author}
        name="Author"
        onChange={({ target }) => setAuthor(target.value)}
      />
      <br />
      Url:
      <input
        type="text"
        value={url}
        name="Url"
        onChange={({ target }) => setUrl(target.value)}
      />
      <br />
      <button type='submit'>Add blog</button>
    </form>
  )


  const blogList = () => {
    const successStyle = {
      color: 'green'
    }

    return(
      <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>Log out</button>
        <h2>Add new blog</h2>
        <h3 style={successStyle}><i>{message}</i></h3>
        {newBlogForm()}
        <h2>Blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    <div>
      <h1>Blog List App</h1>
      {!user && loginForm()}
      {user && blogList()}
    </div>
  )
}

export default App