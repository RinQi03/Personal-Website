import React from 'react'

// React component version
const RhsPanel = () => {
  return (
    <div className="rhs-panel">
      <div className="nav-container">
        <div className="nav-item">
          <div className="nav-inner">
            <span>About</span>
          </div>
        </div>
        <div className="nav-item">
          <div className="nav-inner">
            <span>Projects</span>
          </div>
        </div>
        <div className="nav-item">
          <div className="nav-inner">
            <span>Experience</span>
          </div>
        </div>
        <div className="nav-item">
          <div className="nav-inner">
            <span>Contact</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .rhs-panel {
          position: fixed;
          top: 50%;
          right: 50px;
          transform: translateY(-50%);
          z-index: 1000;
          pointer-events: none;
        }
        
        .nav-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .nav-item {
          width: 120px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          pointer-events: auto;
        }
        
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        
        .nav-inner {
          width: 80%;
          height: 80%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

// DOM element version for CSS3D
export const createRhsPanelDom = () => {
  const panelDiv = document.createElement('div')
  panelDiv.className = 'rhs-panel-3d'
  panelDiv.innerHTML = `
    <div class="nav-container">
      <div class="nav-item">
        <div class="nav-inner">
          <span>About</span>
        </div>
      </div>
      <div class="nav-item">
        <div class="nav-inner">
          <span>Projects</span>
        </div>
      </div>
      <div class="nav-item">
        <div class="nav-inner">
          <span>Experience</span>
        </div>
      </div>
      <div class="nav-item">
        <div class="nav-inner">
          <span>Contact</span>
        </div>
      </div>
    </div>
  `
  
  // Add styles
  const style = document.createElement('style')
  style.textContent = `
    .rhs-panel-3d {
      width: 200px;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .rhs-panel-3d .nav-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .rhs-panel-3d .nav-item {
      width: 120px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .rhs-panel-3d .nav-item:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
    
    .rhs-panel-3d .nav-inner {
      width: 80%;
      height: 80%;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: white;
      font-weight: 500;
    }
  `
  document.head.appendChild(style)
  
  return panelDiv
}

export default RhsPanel 