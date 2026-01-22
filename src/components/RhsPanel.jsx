import React from 'react'
import { reactToDom, reactToDomWithStyles } from '../utils/reactToDom'
import '../css/RhsPanel.css'

// React component version
const RhsPanel = () => {
    return (
        <div className="rhs-panel-3d">

            <div className="nav-container">
                <div className="line-container">
                    <a className="experience-container part-container" href="/experience">
                        <svg viewBox="0 0 520 20" className="accent-rect" id="experience-accent-rect">
                            <rect width="320" height="9" fill="#e46a13" fillOpacity={0.8} />
                        </svg>
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-5xl">Experience</div>
                            <div className="title-line tw:font-noto tw:text-xl">实习经历</div>
                            <div className="title-line tw:font-geo tw:text-base tw:m-3 tw:pt-3 tw:flex tw:flex-row tw:gap-1">
                                <span className="title-line tw:font-geo tw:text-lg tw:leading-4 tw:bg-day-accent tw:font-normal tw:px-1.5 tw:py-1 tw:rounded-xs tw:tracking-tighter">Current</span>
                                <span className="title-line tw:font-geo tw:text-base tw:leading-4 tw:px-1.5 tw:py-1 tw:font-light tw:tracking-tighter">Lingxi Games</span>
                            </div>
                        </div>
                        <img src="/an_sanity.png" alt="Experience Icon" className="experience-icon part-icon" />
                    </a>


                </div>
                <div className="line-container">
                    <a className="projects-container part-container" href="/projects">
                        <svg viewBox="0 0 20 300" className="accent-rect" id="projects-accent-rect">
                            <rect width="0.2" height="4.5" fill="#e46a13" fillOpacity={0.8} />
                        </svg>
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-3xl">Projects</div>
                            <div className="title-line tw:font-noto tw:text-base">项目经历</div>
                        </div>
                        <img src="/an_projects.png" alt="Experience Icon" className="projects-icon part-icon" />
                    </a>
                    <a className="about-container part-container" href="/about">
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-2xl">About</div>
                            <div className="title-line tw:font-noto tw:text-sm">关于我</div>
                        </div>
                        <img src="/an_about.png" alt="Experience Icon" className="about-icon part-icon" />
                    </a>
                </div>
                <div className="line-container" id="life-contact-container">
                    <a className="life-container part-container" href="/life">
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-3xl">Life</div>
                            <div className="title-line tw:font-noto tw:text-base">生活日常</div>
                        </div>
                        <img src="/an_life.png" alt="Experience Icon" className="life-icon part-icon" />
                    </a>
                    <a className="contact-container part-container" href="/contact">
                        <div className="title-container">
                            <div className="title-line tw:font-geo tw:text-lg tw:font-light tw:tracking-tighter">Contact</div>
                            <div className="title-line tw:font-noto tw:text-xs tw:font-light">联系方式</div>
                        </div>
                    </a>
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