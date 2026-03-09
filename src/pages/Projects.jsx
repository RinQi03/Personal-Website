// src/components/ProjectsSection.jsx
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/Projects.css';
import small_bg from '../assets/sm_bg.jpg';
import home_bg from '../assets/home_bg.png';

gsap.registerPlugin(ScrollTrigger);

const progressBar = [
    {
        id: 1,
        title: 'AI Knowledge Organization',
        dot: '●'
    },

    {
        id: 2,
        title: 'Musical Tickets Info Exchange Platform',
        dot: '●'
    },
    
    {
        id: 3,
        title: 'AI-powered Randomized Meal Generator',
        dot: '●'
    },
    {
        id: 4,
        title: 'Financial News Crawler',
        dot: '●'
    }
    
    
]

const projects = [
    {
        id: 1,
        year: '2026',
        title: 'AI Knowledge Organization — Product Exploration',
        subTitle: 'Product Exploration',
        time: '2026.01',
        location: 'Remote',
        shortDescription: 'Explored the feasibility of using AI to organize knowledge in a knowledge-heavy team',
        longDescription: [
            'Framed an internal product problem around information overload in knowledge-heavy teams, where critical context is fragmented across tools and quickly lost',
            'Authored a PRD defining system-level responsibilities for centralized knowledge capture, automated structuring, and proactive resurfacing, with clear scope boundaries and assumptions'
        ],
        tech: ['Product Management', 'PRD', 'Information Organization']
    },
    {
        id: 2,
        year: '2025',
        title: 'Information Exchange Platform for Used Musical Tickets in China',
        subTitle: 'Group Project',
        time: '2025.01 - Present',
        location: 'Remote',
        shortDescription: 'Developed a web application for buying and selling used musical tickets in China',
        longDescription: [
            'Developing a WeChat app for potential clients who sell musical used tickets in China to publish information',
            'Built a Notion-based project management resource site as the programming group project manager'
        ],
        tech: ['WeChat App', 'Notion', 'Project Management', 'JavaScript']
    },
    {
        id: 5,
        year: '2024',
        title: 'AI-powered Randomized Meal Generator',
        subTitle: 'Personal Project',
        time: '2024.11',
        location: 'New York, NY',
        shortDescription: 'AI-powered website that generates personalized recipes or restaurant recommendations',
        longDescription: [
            'Designed and developed an AI-powered website that generates personalized recipes or restaurant recommendations based on user preferences',
            'Built a dynamic frontend with React and implemented a JavaScript and Express-based backend',
            'Integrated multiple APIs, including Gemini (source-based results), Google Maps (restaurant addresses), Google Places (detailed restaurant information), and YouTube Data (recipe video tutorials) to enhance functionality and user experience',
        ],
        tech: ['AI Integration', 'CSS', 'HTML', 'JavaScript', 'API Integration', 'MongoDB']
    },
    {
        id: 4,
        year: '2024',
        title: 'Financial News Crawler',
        subTitle: 'Personal Project',
        time: '2024.02',
        location: 'Remote',
        shortDescription: 'A tool that crawls, parses, and outputs the information on FinSMEs in a uniform format',
        longDescription: [
            'Developed a tool that crawls, parses, and outputs the information on FinSMEs (a financial news website focused on small and medium enterprises) in a uniform format; Used by employees in LXL Capital to collect news of a list of companies efficiently',
            'Self-taught the implementation and application of Selenium (an automation tool), BeautifulSoup (a Python library for pulling data out of HTML and XML files), and docx (MSFT Word format) library to open Chrome browser as search engine, scrape and parse web data, and write in MSFT Word respectively',
            'Located the target information leveraging developer mode in Chrome'
        ],
        tech: ['Python', 'Selenium', 'BeautifulSoup', 'docx', 'Chrome Developer Mode']
    }
];

const SCROLL_SENSITIVITY = 0.0025;

const Projects = () => {
    const sectionRef = useRef(null);
    const scrollWrapperRef = useRef(null);
    const itemsTrackRef = useRef(null);
    const scrollHintRef = useRef(null);
    const goToIndexRef = useRef(null);
    const scrollPositionRef = useRef(0);
    const activeIndexRef = useRef(0);
    const currentTrackYRef = useRef(0);
    const rafIdRef = useRef(null);
    const [showScrollHint, setShowScrollHint] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!scrollHintRef.current || !showScrollHint) return;
        const hideHint = () => {
            setShowScrollHint(false);
            gsap.to(scrollHintRef.current, { opacity: 0, duration: 0.25 });
        };
        const opts = { passive: false };
        const onWheel = (e) => {
            if (showScrollHint) {
                e.preventDefault();
                hideHint();
            }
        };
        window.addEventListener('wheel', onWheel, opts);
        window.addEventListener('touchstart', hideHint, { once: true });
        return () => window.removeEventListener('wheel', onWheel, opts);
    }, [showScrollHint]);

    useEffect(() => {
        const section = sectionRef.current;
        const track = itemsTrackRef.current;
        const contentArea = scrollWrapperRef.current;

        if (!section || !track || !contentArea) return;

        const projectItems = gsap.utils.toArray('.project-item', track);
        const maxIndex = projectItems.length - 1;

        const updatePanelOffsets = () => {
            projectItems.forEach((item) => {
                const contentLayer = item.querySelector('.content-layer');
                if (contentLayer) {
                    const contentHeight = contentLayer.offsetHeight;
                    item.style.setProperty('--content-height', `${contentHeight}px`);
                    item.style.setProperty('--panel-offset', `${contentHeight / 2}px`);
                }
            });
        };
        updatePanelOffsets();

        const resizeObserver = new ResizeObserver(() => {
            updatePanelOffsets();
            const pos = scrollPositionRef.current;
            const targetY = getYForPosition(pos);
            currentTrackYRef.current = targetY;
            gsap.set(track, { y: targetY });
        });
        projectItems.forEach((item) => {
            const contentLayer = item.querySelector('.content-layer');
            if (contentLayer) resizeObserver.observe(contentLayer);
        });

        const contentHeight = () => contentArea.clientHeight;

        const getYForIndex = (index) => {
            if (index < 0 || index >= projectItems.length) return 0;
            const item = projectItems[index];
            const top = item.offsetTop;
            const halfItem = item.offsetHeight / 2;
            const halfView = contentHeight() / 2;
            return halfView - top - halfItem;
        };

        const getYForPosition = (pos) => {
            const i = Math.max(0, Math.min(maxIndex, pos));
            const lo = Math.floor(i);
            const hi = Math.min(maxIndex, Math.ceil(i));
            if (lo === hi) return getYForIndex(lo);
            const t = i - lo;
            return getYForIndex(lo) * (1 - t) + getYForIndex(hi) * t;
        };

        const applyScrollPosition = (pos) => {
            const clamped = Math.max(0, Math.min(maxIndex, pos));
            scrollPositionRef.current = clamped;
            const rounded = Math.round(clamped);
            if (rounded !== activeIndexRef.current) {
                activeIndexRef.current = rounded;
                setActiveIndex(rounded);
            }
            projectItems.forEach((el, i) => {
                el.classList.toggle('is-centered', i === rounded);
            });
        };

        const updateTrackY = (y) => {
            gsap.set(track, { y });
        };

        const tick = () => {
            const targetY = getYForPosition(scrollPositionRef.current);
            const current = currentTrackYRef.current;
            const next = current + (targetY - current) * 0.14;
            currentTrackYRef.current = next;
            updateTrackY(next);
            const rounded = Math.round(scrollPositionRef.current);
            if (rounded !== activeIndexRef.current) {
                activeIndexRef.current = rounded;
                setActiveIndex(rounded);
                projectItems.forEach((el, i) => {
                    el.classList.toggle('is-centered', i === rounded);
                });
            }
            rafIdRef.current = requestAnimationFrame(tick);
        };

        const goToIndex = (nextIndex) => {
            if (nextIndex < 0 || nextIndex > maxIndex) return;
            scrollPositionRef.current = nextIndex;
            activeIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
            projectItems.forEach((el, i) => {
                el.classList.toggle('is-centered', i === nextIndex);
            });
            const targetY = getYForIndex(nextIndex);
            currentTrackYRef.current = targetY;
            gsap.to(track, {
                y: targetY,
                duration: 0.55,
                ease: 'power2.out',
                overwrite: true,
            });
        };
        goToIndexRef.current = goToIndex;

        const isInitialMount = !track._projectsInitialized;
        if (isInitialMount) {
            track._projectsInitialized = true;
            const y0 = getYForIndex(0);
            currentTrackYRef.current = y0;
            updateTrackY(y0);
            applyScrollPosition(0);
        }

        rafIdRef.current = requestAnimationFrame(tick);

        const opts = { passive: false };
        const onWheel = (e) => {
            e.preventDefault();
            const next = scrollPositionRef.current + e.deltaY * SCROLL_SENSITIVITY;
            scrollPositionRef.current = Math.max(0, Math.min(maxIndex, next));
        };

        let touchStartY = 0;
        const onTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };
        const onTouchMove = (e) => {
            e.preventDefault();
            const y = e.touches[0].clientY;
            const dy = touchStartY - y;
            touchStartY = y;
            const next = scrollPositionRef.current - dy * SCROLL_SENSITIVITY * 2;
            scrollPositionRef.current = Math.max(0, Math.min(maxIndex, next));
        };

        section.addEventListener('wheel', onWheel, opts);
        contentArea.addEventListener('touchstart', onTouchStart, { passive: true });
        contentArea.addEventListener('touchmove', onTouchMove, { passive: false });

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            goToIndexRef.current = null;
            resizeObserver.disconnect();
            section.removeEventListener('wheel', onWheel, opts);
            contentArea.removeEventListener('touchstart', onTouchStart);
            contentArea.removeEventListener('touchmove', onTouchMove);
        };
    }, []);

    return (
        <>
            {showScrollHint && (
                <div ref={scrollHintRef} className="scroll-hint">
                    Scroll Me ↓
                </div>
            )}
            <section
                ref={sectionRef}
                className="projects-section ak-style"
                style={{ '--small-bg-url': `url(${small_bg})`, '--home-bg-url': `url(${home_bg})` }}
            >
                <div className="section-title-fixed part-container">
                    <span className="section-number">// 03</span>
                    <h2><span className="tw:font-geo tw:text-5xl tw:text-day-accent title-line">Projects</span> <br />
                        <span className="tw:text-3xl tw:font-noto title-line tw:text-day-text">项目经历</span></h2>
                    <p className="subtitle tw:font-geo tw:text-md tw:text-day-secondary">My creative and technical works</p>
                </div>

                <div className="projects-content-area">
                    <div ref={scrollWrapperRef} className="horizontal-scroll-wrapper">
                        <div ref={itemsTrackRef} className="projects-items-track">
                            {projects.map((project) => (
                                <div key={project.id} className="project-item tw:font-mono">
                                    <div className="project-details content-layer">
                                        <div className="project-details-content">
                                            {project.longDescription.map((point, i) => (
                                                <p key={i} className="description">{point}</p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="panel-top project-details">
                                        <div className="year-line">
                                            <span className="year-dot"></span>
                                            <span className="year-text tw:text-day-accent ">{project.year}</span>
                                        </div>
                                        <h3 className="title-line tw:leading-2">{project.title}</h3>
                                        <p className="company tw:flex tw:justify-between tw:align-bottom">{project.subTitle}</p>
                                        <p className="time-location">{project.time} | {project.location}</p>
                                    </div>

                                    <div className="panel-bottom">
                                        <p className="description">{project.shortDescription}</p>
                                        <div className="tech-tags">
                                            {project.tech.map((t, i) => (
                                                <span key={i} className="tech-tag">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <nav className="projects-progress-bar" aria-label="Project sections">
                    {projects.map((project, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`projects-progress-segment ${index === activeIndex ? 'is-active' : ''}`}
                            onClick={() => goToIndexRef.current?.(index)}
                            aria-label={`Go to ${project.title}`}
                            aria-current={index === activeIndex ? 'true' : undefined}
                        >
                            <span className="projects-progress-title">{progressBar[index].title}</span>
                            <span className="projects-progress-dot" aria-hidden />
                        </button>
                    ))}
                </nav>
            </section>
        </>
    );
};

export default Projects;
