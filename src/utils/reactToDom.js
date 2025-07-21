import React from 'react'
import { createRoot } from 'react-dom/client'

// Utility function to convert React component to DOM element
export const reactToDom = (ReactComponent, props = {}) => {
  const container = document.createElement('div')
  
  // Create root and render React component to DOM
  const root = createRoot(container)
  root.render(React.createElement(ReactComponent, props))
  
  // Return the first child (the actual component DOM)
  return container.firstChild || container
}

// Alternative: Convert JSX string to DOM
export const jsxToDom = (jsxString) => {
  const container = document.createElement('div')
  container.innerHTML = jsxString
  return container.firstChild || container
}

// Enhanced version that handles styled-jsx
export const reactToDomWithStyles = (ReactComponent, props = {}) => {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    
    // Create root and render React component to DOM
    const root = createRoot(container)
    root.render(React.createElement(ReactComponent, props))
    
    // Wait for styled-jsx to process
    setTimeout(() => {
      resolve(container.firstChild || container)
    }, 10)
  })
} 