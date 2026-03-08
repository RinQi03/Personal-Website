// import React from "react";

// const Experience = () => {
//     return (
//         <div>
//             <h1>Experience</h1>
//         </div>
//     )
// }

// export default Experience;


// src/components/ExperienceSection.jsx
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/Experience.css'; // 引入样式
import small_bg from '../assets/sm_bg.jpg'; // 导入背景图片
import home_bg from '../assets/home_bg.png'; // 导入背景图片

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        id: 1,
        year: '2025',
        title: 'CS & Math Tutor',
        company: 'University Learning Center, New York University',
        time: '2024.09 - 2025.12',
        location: 'New York, NY',
        description: 'Conducted in-person one-on-one sessions helping students learn data structures and accounting',
        detailedDescriptions: [
            'Facilitated weekly structured study sessions, helping ~110 students in time management and effective study;',
            'Explained key concepts, problem-solving strategies, and coding exercises to reinforce students\' understanding; Improved their understanding by 30% +'
        ],
        tech: ['Communication', 'Time Management', 'Active Adaption']
    },
    {
        id: 2,
        year: '2025',
        title: 'Marketing Intern',
        company: 'Lingxi Games, Alibaba Group',
        time: '2025.06 - 2025.08',
        location: 'Guangzhou, China',
        description: 'Produced AIGC research reports with 90%+ positive feedback and managed Douyin content using Hailuo and Dreamina to gain 800+ followers in 3 weeks',
        detailedDescriptions: [
            'Researched AIGC images, videos, and games platforms; produced two 6000+ word reports; listed as project introduction documents group-wise and received 90%+ positive feedback',
            'Managed company-owned Douyin account, using Hailuo and Dreamina (AIGC platforms) to produce content; analyzed performance data to refine content, achieving 800+ followers in 3 weeks',
            'Supported 9Game (mobile game downloading platform)\'s summer KOL campaign by crafting ad copy and reviewing promotional videos; resulted in +9.55% exposure UV and +11.56% interaction UV'
        ],
        tech: ['AIGC Video Platforms', 'Data Analysis', 'KOL Campaign Review']
    },
    {
        id: 3,
        year: '2024',
        title: 'Research Intern',
        company: 'Ascent Partners Foundation',
        time: '2024.07 - 2024.08',
        location: 'Remote',
        description: 'Conducted literature reviews on climate change effects and investigated Doughnut Economics as a framework for the Tropical Belt Initiative.',
        detailedDescriptions: [
            'Investigated Doughnut Economics; produced an analysis of the possibilities of using Doughnut Economics as the final framework for the research done by Tropical Belt Initiative, which advocates for greater recognition and financial support',
            'Assisted on the International Union for Conservation of Nature (IUCN) visit to Hong Kong and Sri Lanka’s representative’s visit to Beijing, China; managed detailed note taking, translating, and travel logistics'
        ],
        tech: ['Literature Review', 'Doughnut Economics', 'Translation', 'Logistics']
    },
    {
        id: 4,
        year: '2023',
        title: 'Summer Analyst',
        company: 'Cypress Capital International Ltd.',
        time: '2023.05 - 2023.08',
        location: 'Shanghai, China',
        description: 'Drafted due diligence checklists for logistics and EV battery industries and performed equity research on CATL.',
        detailedDescriptions: [
            'Drafted pre-investment due diligence checklist on a logistic company; requested documents including business registration, patents, & financial plans from the target company for company valuation',
            'Enhanced investment team\'s Southeast Asia due diligence through detailed documentation and meeting minutes for team use in quarterly reports',
            'Conducted industrial research on electric vehicle battery industry and equity research on Contemporary Amperex Technology Co. Limited; gave a 1-hour report in the investment committee meeting, for which I received recognition'
        ],
        tech: ['Equity Research', 'Due Diligence', 'Industry Analysis']
    }
];

/** 滚轮/触摸换算为虚拟滚动位置的系数，越大滚动越快 */
const SCROLL_SENSITIVITY = 0.0025;

const Experience = () => {
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

    // Scroll 提示：第一次滚轮后隐藏
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

        const experienceItems = gsap.utils.toArray('.experience-item', track);
        const maxIndex = experienceItems.length - 1;

        const updatePanelOffsets = () => {
            experienceItems.forEach((item) => {
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
        experienceItems.forEach((item) => {
            const contentLayer = item.querySelector('.content-layer');
            if (contentLayer) resizeObserver.observe(contentLayer);
        });

        const contentHeight = () => contentArea.clientHeight;

        const getYForIndex = (index) => {
            if (index < 0 || index >= experienceItems.length) return 0;
            const item = experienceItems[index];
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
            experienceItems.forEach((el, i) => {
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
                experienceItems.forEach((el, i) => {
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
            experienceItems.forEach((el, i) => {
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

        const isInitialMount = !track._experienceInitialized;
        if (isInitialMount) {
            track._experienceInitialized = true;
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
        const onTouchEnd = () => {};

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
            {/* Scroll Me 提示文字 - 放在 section 外面确保不被遮挡 */}
            {showScrollHint && (
                <div ref={scrollHintRef} className="scroll-hint">
                    Scroll Me ↓
                </div>
            )}
            <section
                ref={sectionRef}
                className="experience-section ak-style"
                style={{ '--small-bg-url': `url(${small_bg})`, '--home-bg-url': `url(${home_bg})` }}
            >

                <div className="section-title-fixed part-container">
                    <span className="section-number">// 02</span>
                    <h2><span className="tw:font-geo tw:text-5xl tw:text-day-accent title-line">Experience</span> <br />
                        <span className="tw:text-3xl tw:font-noto title-line tw:text-day-text">实习经历</span></h2>
                    <p className="subtitle tw:font-geo tw:text-md tw:text-day-secondary">My journey in career development</p>
                </div>

                <div className="experience-content-area">
                    <div ref={scrollWrapperRef} className="horizontal-scroll-wrapper">
                        <div ref={itemsTrackRef} className="experience-items-track">
                    {experiences.map((exp, index) => (
                        <div key={exp.id} className="experience-item">
                            {/* 内容层 - 最底层 */}
                            <div className="experience-details content-layer">
                                <div className="experience-details-content">
                                    {exp.detailedDescriptions.map((point, i) => (
                                        <p key={i} className="description">{point}</p>
                                    ))}
                                    {/* <p className="description">{exp.detailedDescription}</p> */}
                                </div>
                            </div>

                            {/* 上装饰面板 */}
                            <div className="panel-top experience-details">
                                <div className="year-line">
                                    <span className="year-dot"></span>
                                    <span className="year-text tw:text-day-accent ">{exp.year}</span>
                                </div>
                                <h3 className="title-line tw:leading-2">{exp.title}</h3>
                                <p className="company tw:flex tw:justify-between tw:align-bottom">{exp.company}</p>
                                <p className="time-location">{exp.time} | {exp.location}</p>

                            </div>

                            {/* 下装饰面板 */}
                            <div className="panel-bottom">
                                <p className="description">{exp.description}</p>
                                <div className="tech-tags">
                                    {exp.tech.map((t, i) => (
                                        <span key={i} className="tech-tag">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                        </div>
                    </div>
                </div>

                <nav className="experience-progress-bar" aria-label="Experience sections">
                    {experiences.map((exp, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`experience-progress-segment ${index === activeIndex ? 'is-active' : ''}`}
                            onClick={() => goToIndexRef.current?.(index)}
                            aria-label={`Go to ${exp.title}`}
                            aria-current={index === activeIndex ? 'true' : undefined}
                        >
                            <span className="experience-progress-title">{exp.title}</span>
                            <span className="experience-progress-dot" aria-hidden />
                        </button>
                    ))}
                </nav>
            </section>
        </>
    );
};

export default Experience;