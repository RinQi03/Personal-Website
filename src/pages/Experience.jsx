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
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/Experience.css'; // 引入样式

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        id: 1,
        year: '2025',
        title: 'CS, Math, & Accounting Tutor',
        company: 'University Learning Center, New York University',
        time: '2024.09 - 2025.12',
        location: 'New York, NY',
        description: 'Conducted in-person one-on-one sessions helping students learn data structures and accounting',
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
        tech: ['AIGC Platforms', 'Data Analysis', 'Content Strategy', 'Ad Copywriting']
    },
    {
        id: 3,
        year: '2024',
        title: 'Research Intern',
        company: 'Ascent Partners Foundation',
        time: '2024.07 - 2024.08',
        location: 'Remote',
        description: 'Conducted literature reviews on climate change effects and investigated Doughnut Economics as a framework for the Tropical Belt Initiative.',
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
        tech: ['Equity Research', 'Due Diligence', 'Industry Analysis']
    }
];

const Experience = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const scrollWrapperRef = useRef(null);

    useEffect(() => {
        const pinSection = sectionRef.current;
        const horizontalScroll = scrollWrapperRef.current;

        if (!pinSection || !horizontalScroll) return;

        let ctx = gsap.context(() => {
            // 等待 DOM 完全渲染
            const experienceItems = gsap.utils.toArray('.experience-item', pinSection);

            if (experienceItems.length === 0) return;

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

                pinSection.style.backgroundPositionX = `calc(20% - ${currentBgOffset}px)`;
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

            // 对每个经验项的动画
            experienceItems.forEach((item, index) => {
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

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="experience-section ak-style">
            <div className="section-title-fixed part-container">
                <span className="section-number">// 02</span>
                <h2><span className="tw:font-geo tw:text-5xl tw:text-day-accent title-line">Experience</span> <br />
                    <span className="tw:text-3xl tw:font-noto title-line tw:text-day-text">实习经历</span></h2>
                <p className="subtitle tw:font-geo tw:text-md tw:text-day-secondary">My journey in career development</p>
            </div>

            <div ref={scrollWrapperRef} className="horizontal-scroll-wrapper">
                {experiences.map(exp => (
                    <div key={exp.id} className="experience-item">
                        <div className="year-line">
                            <span className="year-dot"></span>
                            <span className="year-text tw:text-day-accent">{exp.year}</span>
                        </div>
                        <div className="experience-details">
                            <h3 className="title-line">{exp.title}</h3>
                            <p className="company tw:flex tw:justify-between tw:align-bottom">{exp.company} </p>
                            <p className="time-location">{exp.time} | {exp.location}</p>
                            <p className="description">{exp.description}</p>
                            <div className="tech-tags">
                                {exp.tech.map((t, i) => (
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
    );
};

export default Experience;