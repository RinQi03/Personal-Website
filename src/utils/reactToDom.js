import React from 'react'
import ReactDOM from 'react-dom'

// Utility function to convert React component to DOM element
export const reactToDom = (ReactComponent, props = {}) => {
  const container = document.createElement('div')
  
  // Render React component to DOM
  ReactDOM.render(React.createElement(ReactComponent, props), container)
  
  // Return the first child (the actual component DOM)
  return container.firstChild || container
}

// Alternative: Convert JSX string to DOM
export const jsxToDom = (jsxString) => {
  const container = document.createElement('div')
  container.innerHTML = jsxString
  return container.firstChild || container
} 