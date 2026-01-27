import React from 'react'
import { reactToDom, reactToDomWithStyles } from '../utils/reactToDom'
import '../css/RhsPanel.css'
import an_sanity from '../assets/an_sanity.png'
import an_projects from '../assets/an_projects.png'
import an_about from '../assets/an_about.png'
import an_life from '../assets/an_life.png'

// Custom Link component that updates window.location.hash to work with main app's HashRouter
const CustomLink = ({ to, className, children }) => {
    const handleClick = (e) => {
        e.preventDefault()
        window.location.hash = `#${to}`
    }

    return (
        <a href={`#${to}`} className={className} onClick={handleClick}>
            {children}
        </a>
    )
}

// React component version
const RhsPanel = () => {
    return (
        <div className="rhs-panel-3d">

            <div className="nav-container">
                <div className="line-container">
                    <CustomLink to="/experience" className="experience-container part-container">
                        <svg viewBox="0 0 520 20" className="accent-rect" id="experience-accent-rect">
                            <rect width="320" height="9" fill="#e46a13" fillOpacity={0.8} />
                        </svg>
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-5xl">Experience</div>
                            <div className="title-line tw:font-noto tw:text-xl">实习经历</div>
                            <div className="title-line tw:font-geo tw:text-base tw:m-3 tw:pt-3 tw:flex tw:flex-row tw:gap-1">
                                <span className="tw:font-geo tw:text-lg tw:leading-4 tw:bg-day-accent tw:font-normal tw:px-1.5 tw:py-1 tw:rounded-xs tw:tracking-tighter">Current</span>
                                <span className="tw:font-geo tw:text-base tw:leading-4 tw:px-1.5 tw:py-1 tw:font-light tw:tracking-tighter">NYU Senior</span>
                            </div>
                        </div>
                        <img src={an_sanity} alt="Experience Icon" className="experience-icon part-icon" />
                    </CustomLink>


                </div>
                <div className="line-container">
                    <CustomLink to="/projects" className="projects-container part-container">
                        <svg viewBox="0 0 20 300" className="accent-rect" id="projects-accent-rect">
                            <rect width="0.2" height="4.5" fill="#e46a13" fillOpacity={0.8} />
                        </svg>
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-3xl">Projects</div>
                            <div className="title-line tw:font-noto tw:text-base">项目经历</div>
                        </div>
                        <img src={an_projects} alt="Experience Icon" className="projects-icon part-icon" />
                    </CustomLink>
                    <CustomLink to="/about" className="about-container part-container">
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-2xl">About</div>
                            <div className="title-line tw:font-noto tw:text-sm">关于我</div>
                        </div>
                        <img src={an_about} alt="Experience Icon" className="about-icon part-icon" />
                    </CustomLink>
                </div>
                <div className="line-container" id="life-contact-container">
                    <CustomLink to="/life" className="life-container part-container">
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-3xl">Life</div>
                            <div className="title-line tw:font-noto tw:text-base">生活日常</div>
                        </div>
                        <img src={an_life} alt="Experience Icon" className="life-icon part-icon" />
                    </CustomLink>
                    <CustomLink to="/contact" className="contact-container part-container">
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-lg tw:font-light tw:tracking-tighter">Contact</div>
                            <div className="title-line tw:font-noto tw:text-xs tw:font-light">联系方式</div>
                        </div>
                    </CustomLink>
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