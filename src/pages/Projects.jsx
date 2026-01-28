// src/components/ProjectsSection.jsx
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/Projects.css'; // 引入样式
import small_bg from '../assets/sm_bg.jpg'; // 导入背景图片

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

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
        title: 'Randomized Meal Generator',
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

const Projects = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const scrollWrapperRef = useRef(null);
    const scrollHintRef = useRef(null);
    const [showScrollHint, setShowScrollHint] = useState(true);

    useEffect(() => {
        // Scroll Me 提示文字的淡出动画
        if (scrollHintRef.current && showScrollHint) {
            // 如果页面不在顶部，不显示提示
            if (window.scrollY > 50) {
                setShowScrollHint(false);
                return;
            }

            let hasScrolled = false;

            const handleScroll = () => {
                if (!hasScrolled && scrollHintRef.current) {
                    hasScrolled = true;
                    gsap.to(scrollHintRef.current, {
                        opacity: 0,
                        duration: 0.2,
                        ease: "power2.out",
                        onComplete: () => {
                            setShowScrollHint(false);
                        }
                    });
                }
            };

            // 监听滚动事件
            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('wheel', handleScroll, { passive: true });
            window.addEventListener('touchmove', handleScroll, { passive: true });

            // 确保元素存在后再设置动画
            const initTimeout = setTimeout(() => {
                if (scrollHintRef.current) {
                    // 设置初始状态
                    gsap.set(scrollHintRef.current, {
                        opacity: 0,
                        y: 20
                    });

                    // 延迟后执行淡入动画
                    setTimeout(() => {
                        if (scrollHintRef.current && showScrollHint) {
                            gsap.to(scrollHintRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power2.out"
                            });
                        }
                    }, 500);
                }
            }, 100);

            return () => {
                clearTimeout(initTimeout);
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('wheel', handleScroll);
                window.removeEventListener('touchmove', handleScroll);
            };
        }
    }, [showScrollHint]);

    useEffect(() => {
        const pinSection = sectionRef.current;
        const horizontalScroll = scrollWrapperRef.current;

        if (!pinSection || !horizontalScroll) return;

        // 等待 DOM 完全渲染
        const projectItems = gsap.utils.toArray('.project-item', pinSection);

        // 为每个 project-item 设置基于 content-layer 高度的展开距离
        const updatePanelOffsets = () => {
            projectItems.forEach((item) => {
                const contentLayer = item.querySelector('.content-layer');
                if (contentLayer) {
                    const contentHeight = contentLayer.offsetHeight;
                    // 设置 CSS 变量，用于控制面板展开距离
                    item.style.setProperty('--content-height', `${contentHeight}px`);
                    // 展开距离为内容高度的一半（因为上下各展开一半）
                    item.style.setProperty('--panel-offset', `${contentHeight / 2}px`);
                }
            });
        };

        // 初始设置
        if (projectItems.length > 0) {
            updatePanelOffsets();
        }

        // 监听窗口大小变化，更新展开距离
        const resizeObserver = new ResizeObserver(() => {
            updatePanelOffsets();
        });

        projectItems.forEach((item) => {
            const contentLayer = item.querySelector('.content-layer');
            if (contentLayer) {
                resizeObserver.observe(contentLayer);
            }
        });

        let ctx = gsap.context(() => {
            if (projectItems.length === 0) return;

            // 检测是否为移动端（768px 以下）
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                // 移动端：使用垂直滚动，禁用横向滚动
                // 重置横向滚动容器的 transform
                gsap.set(horizontalScroll, { x: 0 });

                // 为每个项目项添加简单的淡入动画和自动展开效果
                projectItems.forEach((item, index) => {
                    // 淡入动画
                    gsap.fromTo(item,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            ease: "power2.out",
                            duration: 0.6,
                            delay: index * 0.1,
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 85%',
                                end: 'top 50%',
                                toggleActions: 'play none none reverse',
                            }
                        }
                    );

                    // 当元素到达屏幕中间时，自动展开面板
                    ScrollTrigger.create({
                        trigger: item,
                        start: 'top 60%',  // 当元素顶部到达视口60%位置时开始
                        end: 'bottom 40%',  // 当元素底部到达视口40%位置时结束
                        onEnter: () => {
                            item.classList.add('is-centered');
                        },
                        onEnterBack: () => {
                            item.classList.add('is-centered');
                        },
                        onLeave: () => {
                            item.classList.remove('is-centered');
                        },
                        onLeaveBack: () => {
                            item.classList.remove('is-centered');
                        },
                    });
                });
            } else {
                // 桌面端：使用横向滚动
                // 使用 scrollWidth 获取实际内容宽度（更准确）
                const totalWidth = horizontalScroll.scrollWidth;

                // 获取固定标题的宽度
                const titleElement = pinSection.querySelector('.section-title-fixed');
                const titleWidth = titleElement ? titleElement.offsetWidth : 250;

                // 可用宽度 = 视口宽度 - 标题宽度
                const availableWidth = window.innerWidth - titleWidth;

                // 计算需要滚动的距离
                const scrollDistance = Math.max(0, totalWidth - availableWidth);

                // 设置 section 的高度，使其正好等于需要滚动的距离
                // 这样横向滚动完成后，pin 释放，不会有额外的垂直滚动
                // 但如果滚动距离太小（小于视口高度），至少设置为视口高度，确保 section 可见
                const sectionHeight = Math.max(window.innerHeight, 0);
                gsap.set(pinSection, { height: sectionHeight });

                // 背景动画相关变量
                let currentBgOffset = 0;
                let targetBgOffset = 0;
                let rafId = null;
                const maxOffset = 200; // 总共移动的距离

                // 使用 requestAnimationFrame 来平滑插值，让背景立即跟随滚动
                const updateBackground = () => {
                    // 使用线性插值（lerp）来平滑过渡，但仍然立即响应滚动
                    const lerpFactor = 0.15; // 插值因子，值越小越平滑，值越大响应越快
                    currentBgOffset += (targetBgOffset - currentBgOffset) * lerpFactor;

                    // 如果差值很小，直接设置目标值
                    if (Math.abs(targetBgOffset - currentBgOffset) < 0.1) {
                        currentBgOffset = targetBgOffset;
                    }

                    pinSection.style.backgroundPositionX = `calc(40% - ${currentBgOffset}px)`;
                    pinSection.style.setProperty('--bg-offset', `${currentBgOffset}px`);

                    // 如果还没到达目标，继续动画
                    if (Math.abs(targetBgOffset - currentBgOffset) > 0.1) {
                        rafId = requestAnimationFrame(updateBackground);
                    } else {
                        rafId = null;
                    }
                };

                // 创建横向滚动动画
                const scrollTriggerConfig = {
                    trigger: pinSection,
                    pin: true,
                    start: 'top top',
                    end: () => `+=${scrollDistance}`,
                    scrub: 1,
                    anticipatePin: 1,
                    pinSpacing: true,
                    // markers: true, // 取消注释用于调试
                    onUpdate: (self) => {
                        const progress = self.progress;
                        // 立即更新目标位置
                        targetBgOffset = progress * maxOffset;

                        // 如果动画还没运行，启动它
                        if (!rafId) {
                            rafId = requestAnimationFrame(updateBackground);
                        }
                    },
                    onLeave: () => {
                        // 当横向滚动完成，pin 释放后，将 section 高度设置为实际内容高度
                        // 这样可以避免额外的垂直滚动
                        const actualHeight = pinSection.scrollHeight;
                        gsap.set(pinSection, { height: actualHeight });
                    },
                    onEnterBack: () => {
                        // 当向上滚动回到 section 时，恢复高度以支持横向滚动
                        gsap.set(pinSection, { height: sectionHeight });
                    }
                };

                const horizontalScrollAnimation = gsap.to(horizontalScroll, {
                    x: -scrollDistance,
                    ease: 'none',
                    scrollTrigger: scrollTriggerConfig
                });

                // 对每个项目项的动画
                projectItems.forEach((item, index) => {
                    gsap.fromTo(item,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            ease: "power2.out",
                            duration: 0.8,
                            scrollTrigger: {
                                trigger: item,
                                containerAnimation: horizontalScrollAnimation,
                                start: 'left 90%',
                                end: 'left 10%',
                                toggleActions: 'play none none reverse',
                                // markers: true, // 取消注释用于调试
                            }
                        }
                    );
                });
            }

        }, sectionRef);

        return () => {
            ctx.revert();
            resizeObserver.disconnect();
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
            <section ref={sectionRef} className="projects-section ak-style" style={{ '--small-bg-url': `url(${small_bg})` }}>
                <div className="section-title-fixed part-container">
                    <span className="section-number">// 03</span>
                    <h2><span className="tw:font-geo tw:text-5xl tw:text-day-accent title-line">Projects</span> <br />
                        <span className="tw:text-3xl tw:font-noto title-line tw:text-day-text">项目经历</span></h2>
                    <p className="subtitle tw:font-geo tw:text-md tw:text-day-secondary">My creative and technical works</p>
                </div>

                <div ref={scrollWrapperRef} className="horizontal-scroll-wrapper">
                    {projects.map(project => (
                        <div key={project.id} className="project-item tw:font-mono">
                            {/* 内容层 - 最底层 */}
                            <div className="project-details content-layer">
                                <div className="project-details-content">
                                    {project.longDescription.map((point, i) => (
                                        <p key={i} className="description">{point}</p>
                                    ))}
                                </div>
                            </div>

                            {/* 上装饰面板 */}
                            <div className="panel-top project-details">
                                <div className="year-line">
                                    <span className="year-dot"></span>
                                    <span className="year-text tw:text-day-accent ">{project.year}</span>
                                </div>
                                <h3 className="title-line tw:leading-2">{project.title}</h3>
                                <p className="company tw:flex tw:justify-between tw:align-bottom">{project.subTitle}</p>
                                <p className="time-location">{project.time} | {project.location}</p>

                            </div>

                            {/* 下装饰面板 */}
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
                    {/* 添加一个占位符，确保滚动结束时最后一个元素能完全显示 */}
                    <div className="end-spacer"></div>
                </div>
            </section>
        </>
    );
};

export default Projects;
