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

            // 2.5. 简历下载按钮动画
            gsap.from(".resume-download-tag", {
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

        // 图片鼠标跟随效果
        const profileImg = profileImgRef.current;
        if (profileImg) {
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
                        <a
                            href="/Rin Qi AI PM Resume.pdf"
                            download="Rin Qi AI PM Resume.pdf"
                            className="resume-download-tag"
                        >
                            <img src={download} alt="Download" className="download-icon" />
                            Resume
                        </a>
                    </div>

                    <div className="about-text name-section">
                        <p>
                            Hi, I'm Rin Qi, <br />
                            a senior majoring in <strong>Computer Science and Economics</strong>
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