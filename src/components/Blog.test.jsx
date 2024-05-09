import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {
    const blog = {
        title: 'Sweets & Socks',
        author: 'Maarit',
        url: 'https://lankakerablogi.blogspot.com/',
        likes: 8,
        user: { name: 'Piglet' }
    }

    const mockDelete = vi.fn()
    const mockLike = vi.fn()

    render(<Blog blog={blog} likeBlog={mockLike} deleteBlog={mockDelete} deletable={true} />)

    const element = screen.getByText('Sweets & Socks by Maarit')
    expect(element).toBeDefined()

    const notVisibleUrl = screen.queryByText('https://lankakerablogi.blogspot.com/')
    expect(notVisibleUrl).toBeNull()

    const notVisibleLikes = screen.queryByText('Likes: 8')
    expect(notVisibleLikes).toBeNull()
})

test('renders all info after clicking show button', async () => {
    const blog = {
        title: 'Sweets & Socks',
        author: 'Maarit',
        url: 'https://lankakerablogi.blogspot.com/',
        likes: 8,
        user: { name: 'Piglet' }
    }

    const mockDelete = vi.fn()
    const mockLike = vi.fn()

    render(<Blog blog={blog} likeBlog={mockLike} deleteBlog={mockDelete} deletable={true} />)

    const user = userEvent.setup()
    const button = screen.getByText('Show')
    await user.click(button)

    const urlTitle = screen.getByText('Url:')
    expect(urlTitle).toBeDefined()

    const urlLink = screen.getByText('https://lankakerablogi.blogspot.com/')
    expect(urlLink).toBeDefined()

    const likes = screen.getByText('Likes: 8')
    expect(likes).toBeDefined()

    const userText = screen.getByText('User: Piglet')
    expect(userText).toBeDefined()
})

test('renders all info after clicking show button', async () => {
    const blog = {
        title: 'Sweets & Socks',
        author: 'Maarit',
        url: 'https://lankakerablogi.blogspot.com/',
        likes: 8,
        user: { name: 'Piglet' }
    }

    const mockDelete = vi.fn()
    const mockLike = vi.fn()

    render(<Blog blog={blog} likeBlog={mockLike} deleteBlog={mockDelete} deletable={true} />)

    const user = userEvent.setup()
    const showButton = screen.getByText('Show')
    await user.click(showButton)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
})
