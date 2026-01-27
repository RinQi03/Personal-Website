import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../css/About.css';

const About = () => {
    const containerRef = useRef(null);

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
                            <img src="/download.png" alt="Download" className="download-icon" />
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
                            I am a <span className="highlight-text">product manager</span> who aims to build technical products that solve real-world problems.
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
                    <img src="/About_Profile.png" alt="Rin Qi" className="profile-img" />
                    <div className="bg-slash">
                        <img src="/about_profile_side_border_only.svg" alt="SVG Image" className="bg-slash-img" />
                    </div>
                    <div className="bg-slash-bottom">
                        <img src="/about_profile_side_border_only.svg" alt="SVG Image" className="bg-slash-img-bottom" />

                    </div>
                </div>
            </div>

            {/* 底部斜切背景 */}


        </div>
    );
};

export default About;