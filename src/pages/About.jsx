import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../css/About.css';
import about_profile_side_border_only from '../assets/about_profile_side_border_only.svg'
import about_profile from '../assets/About_Profile.png'
import download from '../assets/download.png'

const About = () => {
    const containerRef = useRef(null);
    const profileImgRef = useRef(null);
    const bgSlashImgRef = useRef(null);
    const bgSlashImgBottomRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 4. 图片缩放进入
            gsap.from(".profile-img", {
                scale: 0.8,
                opacity: 0,
                xPercent: -300,
                duration: 1.3,
                ease: "power4.out"
            });
            // 1. 右侧斜切背景进入
            gsap.from(".bg-slash-bottom", {
                xPercent: -300,
                duration: 1.5,
                ease: "power4.out",
                delay: 0.1
            });
            gsap.from(".bg-slash", {
                xPercent: -300,
                duration: 1.5,
                ease: "power4.out",
                delay: 0.05

            });
            // 2. 名字文字拆分动画
            gsap.from(".about-name", {
                y: 100,
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: "back.out(1.7)"
            });

            // 2.5. 简历下载按钮和社交图标动画
            gsap.from(".resume-download-tag, .social-icon-link", {
                y: 100,
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: "back.out(1.7)"
            });

            // 3. 正文段落渐显
            gsap.from(".about-text p", {
                opacity: 0,
                x: -30,
                duration: 0.8,
                stagger: 0.2,
                delay: 0.8
            });

        }, containerRef);

        // 图片鼠标跟随效果（仅在桌面端启用）
        const profileImg = profileImgRef.current;
        if (profileImg) {
            // 检测是否为移动端
            const isMobile = window.innerWidth <= 768;

            if (!isMobile) {
                let targetX = 0;
                let targetY = 0;
                const maxMove = 50; // 最大移动距离（像素）
                let rafId = null;

                const handleMouseMove = (e) => {
                    const rect = profileImg.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    // 计算鼠标相对于图片中心的位置（-1 到 1）
                    const mouseX = (e.clientX - centerX) / (rect.width / 2);
                    const mouseY = (e.clientY - centerY) / (rect.height / 2);

                    // 计算目标位置
                    targetX = mouseX * maxMove;
                    targetY = mouseY * maxMove;

                    // 使用 GSAP 平滑移动到目标位置
                    if (!rafId) {
                        rafId = requestAnimationFrame(() => {
                            // profile-img 立即跟随
                            gsap.to(profileImg, {
                                x: targetX,
                                y: targetY,
                                duration: 0.5,
                                ease: "power2.out"
                            });

                            // bg-slash-img 延迟跟随（较小的移动距离）
                            if (bgSlashImgRef.current) {
                                gsap.to(bgSlashImgRef.current, {
                                    x: targetX * 0.6,
                                    y: targetY * 0.6,
                                    duration: 0.7,
                                    delay: 0.1,
                                    ease: "power2.out"
                                });
                            }

                            // bg-slash-img-bottom 延迟跟随（更小的移动距离，更多延迟）
                            if (bgSlashImgBottomRef.current) {
                                gsap.to(bgSlashImgBottomRef.current, {
                                    x: targetX * 0.4,
                                    y: targetY * 0.4,
                                    duration: 0.8,
                                    delay: 0.2,
                                    ease: "power2.out"
                                });
                            }

                            rafId = null;
                        });
                    }
                };

                const handleMouseLeave = () => {
                    targetX = 0;
                    targetY = 0;
                    gsap.to(profileImg, {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });

                    // bg-slash-img 也回到原位置
                    if (bgSlashImgRef.current) {
                        gsap.to(bgSlashImgRef.current, {
                            x: 0,
                            y: 0,
                            duration: 0.7,
                            delay: 0.1,
                            ease: "power2.out"
                        });
                    }

                    // bg-slash-img-bottom 也回到原位置
                    if (bgSlashImgBottomRef.current) {
                        gsap.to(bgSlashImgBottomRef.current, {
                            x: 0,
                            y: 0,
                            duration: 0.8,
                            delay: 0.2,
                            ease: "power2.out"
                        });
                    }
                };

                profileImg.addEventListener('mousemove', handleMouseMove);
                profileImg.addEventListener('mouseleave', handleMouseLeave);

                return () => {
                    profileImg.removeEventListener('mousemove', handleMouseMove);
                    profileImg.removeEventListener('mouseleave', handleMouseLeave);
                    if (rafId) {
                        cancelAnimationFrame(rafId);
                    }
                };
            } else {
                // 移动端：重置所有 transform，确保图片在正确位置
                gsap.set(profileImg, { x: 0, y: 0 });
                if (bgSlashImgRef.current) {
                    gsap.set(bgSlashImgRef.current, { x: 0, y: 0 });
                }
                if (bgSlashImgBottomRef.current) {
                    gsap.set(bgSlashImgBottomRef.current, { x: 0, y: 0 });
                }
            }
        }

        return () => ctx.revert(); // 清理动画
    }, []);

    return (
        <div className="about-page" ref={containerRef}>
            {/* <div className="test-container">
                <div className="test-item">
                    <div className="test-item-title">
                        <h1>Test</h1>
                    </div>
                </div>
            </div> */}




            <div className="about-info-container">
                {/* 左侧文字区 */}
                <div className="text-section">
                    <div className="name-header">
                        <h1 className="about-name">Rin Qi</h1>
                        <div className="header-buttons">
                            <a
                                href="/Rin Qi AI PM Resume.pdf"
                                download="Rin Qi AI PM Resume.pdf"
                                className="resume-download-tag"
                            >
                                <img src={download} alt="Download" className="download-icon" />
                                Resume
                            </a>
                            <a
                                href="https://www.linkedin.com/in/rin-qi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon-link linkedin-link"
                                aria-label="LinkedIn"
                            >
                                <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor" />
                                </svg>
                            </a>
                            <a
                                href="https://github.com/rinqi03"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon-link github-link"
                                aria-label="GitHub"
                            >
                                <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="currentColor" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="about-text name-section">
                        <p>
                            Hi, I'm Rin Qi, <br />
                            a senior majoring in <br />
                            <strong>Computer Science and Economics</strong>
                            <br /> at New York University.
                        </p>
                    </div>
                    <div className="about-text career-section">
                        <p>
                            I am a <span className="highlight-text" data-text="product manager"> product manager </span> who aims to build technical products that solve real-world problems.
                        </p>
                    </div>
                    <div className="about-text contact-section">
                        <p>
                            Thank you for taking the time to visit my website. I hope you enjoy your stay as much as I enjoyed building it. Please feel free to contact me if you have any questions.
                            My email is <a href="mailto:rinqi26@126.com" className="email-link"> rinqi26@126.com</a>.
                        </p>
                    </div>

                    {/* 装饰元素 */}
                    <div className="deco-corner">
                        <div className="inner-corner"></div>
                    </div>
                </div>

                {/* 右侧图片区 */}
                <div className="image-section">
                    <img ref={profileImgRef} src={about_profile} alt="Rin Qi" className="profile-img" />
                    <div className="bg-slash">
                        <img ref={bgSlashImgRef} src={about_profile_side_border_only} alt="SVG Image" className="bg-slash-img" />
                    </div>
                    <div className="bg-slash-bottom">
                        <img ref={bgSlashImgBottomRef} src={about_profile_side_border_only} alt="SVG Image" className="bg-slash-img-bottom" />

                    </div>
                </div>
            </div>

            {/* 底部斜切背景 */}


        </div>
    );
};

export default About;