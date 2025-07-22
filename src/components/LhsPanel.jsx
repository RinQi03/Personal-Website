import React from 'react'
import { reactToDom, reactToDomWithStyles } from '../utils/reactToDom'
import '../css/RhsPanel.css'

// React component version
const LhsPanel = () => {
  return (
    <div className="rhs-panel-3d">
      <div className="nav-container">
        <div className="line-container">
            <div className="basic-info-container">
                Rin
            </div>
        </div>
      </div>
    </div>
  )
}

// DOM element version using reactToDom utility
export const createLhsPanelDom = () => {
  return reactToDom(LhsPanel)
}

// Async version that properly handles styled-jsx
export const createLhsPanelDomAsync = async () => {
  return await reactToDomWithStyles(LhsPanel)
}

export default LhsPanel 