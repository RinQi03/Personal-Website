import React from 'react'
import { reactToDom, reactToDomWithStyles} from '../utils/reactToDom'
import '../css/RhsPanel.css'

// React component version
const RhsPanel = () => {
  return (
    <div className="rhs-panel-3d">
      <div className="nav-container">
        <div className="line-container">
            <div className="experience-container part-container">
                <div className="title-container">
                    <div className="title-line tw:font-geo tw:pt">Experience</div>
                    <div className="title-line tw:font-noto tw:text-lg">实习经历</div>
                </div>
                <img src="/an_sanity.png" alt="Experience Icon" className="experience-icon part-icon" />
                <svg viewBox="0 0 220 100" className="accent-rect">
                    <rect width="500" height="30" fill="#e46a13"/>
                 </svg>
            </div>
        </div>
        <div className="line-container">
            <div className="projects-container part-container">
            <div className="title-container">
                    <div className="title-line tw:font-geo tw:pt">Projects</div>
                    <div className="title-line tw:font-noto tw:text-lg">项目经历</div>
                </div>
                <img src="/an_projects.png" alt="Experience Icon" className="projects-icon part-icon" />
            </div>
            <div className="about-container part-container">
                <div className="title-container">
                    <div className="title-line tw:font-geo tw:pt">About</div>
                    <div className="title-line tw:font-noto tw:text-lg">关于我</div>
                </div>
                <img src="/an_about.png" alt="Experience Icon" className="about-icon part-icon" />
            </div>
        </div>
        <div className="line-container">
            <div className="life-container part-container">
                <div className="title-container">
                    <div className="title-line tw:font-geo tw:pt">Life</div>
                    <div className="title-line tw:font-noto tw:text-lg">生活日常</div>
                </div>
                <img src="/an_life.png" alt="Experience Icon" className="life-icon part-icon" />
            </div>
            <div className="contact-container part-container">
                <div className="title-container">
                    <div className="title-line tw:font-geo tw:pt">Contact</div>
                    <div className="title-line tw:font-noto tw:text-lg">联系方式</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

// DOM element version using reactToDom utility
export const createRhsPanelDom = () => {
  return reactToDom(RhsPanel)
}

// Async version that properly handles styled-jsx
export const createRhsPanelDomAsync = async () => {
  return await reactToDomWithStyles(RhsPanel)
}

export default RhsPanel 