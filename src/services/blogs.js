import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const comparator = (blog1, blog2) => {
    if (blog1.likes < blog2.likes) {
      return 1
    } else if (blog1.likes > blog2.likes) {
      return -1
    }
    return 0
  }

  const response = await axios.get(baseUrl)
  const blogs = response.data
  return blogs.sort(comparator)
}

const createBlog = async ({ newBlog, token }) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const like = async (blog) => {
  const url = `${baseUrl}/${blog.id}`

  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    likes: blog.likes+1,
    user: blog.user
  }

  const response = await axios.put(url, updatedBlog)
  return response.data
}

const deleteBlog = async (blog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const url = `${baseUrl}/${blog.id}`
  await axios.delete(url, config)
}

export default { getAll, createBlog, like , deleteBlog }