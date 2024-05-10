import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('addBlock function is called with correct arguments', async () => {
  const user = userEvent.setup()
  const handler = vi.fn()

  render(<NewBlogForm addBlog={handler} />)

  const inputs = screen.getAllByRole('textbox')
  const button = screen.getByText('Add blog')

  await user.type(inputs[0], 'Sweets & Socks')
  await user.type(inputs[1], 'Maarit')
  await user.type(inputs[2], 'https://lankakerablogi.blogspot.com/')
  await user.click(button)

  const blog = {
    title: 'Sweets & Socks',
    author: 'Maarit',
    url: 'https://lankakerablogi.blogspot.com/'
  }

  expect(handler.mock.calls).toHaveLength(1)
  expect(handler.mock.calls[0][0]).toEqual(blog)
})