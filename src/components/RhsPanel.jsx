import React from 'react'
import { reactToDom, reactToDomWithStyles } from '../utils/reactToDom'
import '../css/RhsPanel.css'
import an_sanity from '../assets/an_sanity.png'
import an_projects from '../assets/an_projects.png'
import an_about from '../assets/an_about.png'
import an_life from '../assets/an_life.png'
// Custom NavLink that forces a hard refresh and clears cache
const CustomNavLink = ({ to, className, children }) => {
    const currentHash = window.location.hash.replace('#', '') || '/'
    const isActive = currentHash === to

    const handleClick = (e) => {
        e.preventDefault()

        // Get base URL without hash and query parameters
        const baseUrl = window.location.origin + window.location.pathname

        // Add cache-busting timestamp to force reload from server
        const cacheBuster = `?t=${Date.now()}`
        const newUrl = `${baseUrl}${cacheBuster}#${to}`

        // Method 1: Use location.replace to avoid adding to history
        // This forces browser to bypass cache and reload all resources from server
        window.location.replace(newUrl)

        // Method 2: Fallback - if replace doesn't trigger reload, use reload with cache bypass
        // Note: This is a more aggressive approach that ensures cache is cleared
        setTimeout(() => {
            // Double-check if navigation happened, if not force reload
            if (window.location.hash !== `#${to}`) {
                window.location.hash = `#${to}`
                // Force reload with cache bypass (deprecated API but still effective)
                // This ensures all resources (images, scripts, stylesheets) are reloaded from server
                try {
                    // Modern browsers: use location.reload() which respects cache headers
                    // But we'll add cache-busting query param to force reload
                    window.location.reload()
                } catch (e) {
                    // Fallback: direct navigation with cache-busting
                    window.location.href = `${baseUrl}?t=${Date.now()}#${to}`
                }
            }
        }, 50)
    }

    return (
        <a
            href={`#${to}`}
            className={`${className} ${isActive ? 'active' : ''}`}
            onClick={handleClick}
        >
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
                    <CustomNavLink to="/experience" className="experience-container part-container">
                        <svg viewBox="0 0 520 20" className="accent-rect" id="experience-accent-rect">
                            <rect width="320" height="9" fill="#e46a13" fillOpacity={0.8} />
                        </svg>
                        <div className="title-container">
                            <div className="title-line english-title tw:font-geo tw:text-5xl" id="experience-english-title">Experience</div>
                            <div className="title-line tw:font-noto tw:text-xl">实习经历</div>
                            <div className="title-line tw:font-geo tw:text-base tw:m-3 tw:pt-3 tw:flex tw:flex-row tw:gap-1">
                                <span className="tw:font-geo tw:text-lg tw:leading-4 tw:bg-day-accent tw:font-normal tw:px-1.5 tw:py-1 tw:rounded-xs tw:tracking-tighter">Current</span>
                                <span className="tw:font-geo tw:text-base tw:leading-4 tw:px-1.5 tw:py-1 tw:font-light tw:tracking-tighter">NYU Senior</span>
                            </div>
                        </div>
                        <img src={an_sanity} alt="Experience Icon" className="experience-icon part-icon" />
                    </CustomNavLink>


                </div>
                <div className="line-container">
                    <CustomNavLink to="/projects" className="projects-container part-container">
                        {/* <svg viewBox="0 0 20 300" className="accent-rect" id="projects-accent-rect">
                            <rect width="0.2" height="4.5" fill="#e46a13" fillOpacity={0.8} />
                        </svg> */}
                        <div className="title-container">
                            <div className="title-line english-title tw:font-geo tw:text-3xl" id="projects-english-title">Projects</div>
                            <div className="title-line tw:font-noto tw:text-base" id="projects-chinese-title">项目经历</div>
                        </div>
                        <img src={an_projects} alt="Experience Icon" className="projects-icon part-icon" />
                    </CustomNavLink>
                    <CustomNavLink to="/about" className="about-container part-container">
                        <div className="title-container">
                            <div className="title-line english-title tw:font-geo tw:text-2xl" id="about-english-title">About</div>
                            <div className="title-line tw:font-noto tw:text-sm" id="about-chinese-title">关于我</div>
                        </div>
                        <img src={an_about} alt="Experience Icon" className="about-icon part-icon" />
                    </CustomNavLink>
                </div>
                <div className="line-container" id="life-contact-container">
                    <CustomNavLink to="/life" className="life-container part-container">
                        <div className="title-container">
                            <div className="title-line english-title tw:font-geo tw:text-3xl" id="life-english-title">Life</div>
                            <div className="title-line tw:font-noto tw:text-base" id="life-chinese-title">生活日常</div>
                        </div>
                        <img src={an_life} alt="Experience Icon" className="life-icon part-icon" />
                    </CustomNavLink>
                    <CustomNavLink to="/contact" className="contact-container part-container">
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-lg tw:font-light tw:tracking-tighter">Contact</div>
                            <div className="title-line tw:font-noto tw:text-xs tw:font-light" id="contact-chinese-title">联系方式</div>
                        </div>
                    </CustomNavLink>
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