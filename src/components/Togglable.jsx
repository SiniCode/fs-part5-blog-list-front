import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = {
    display: visible ? '' : 'none',
    margin: 10,
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    backgroundColor: 'Lavender',
    borderRadius: 10
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  const buttonStyle = {
    marginTop: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'Lavender'
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility} style={buttonStyle}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility} style={buttonStyle}>Cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable
