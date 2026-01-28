import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/Life.css';
import small_bg from '../assets/sm_bg.jpg';
import home_bg from '../assets/home_bg.png';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

// 动态导入 life-photos 目录中的所有照片
// const photoModules = import.meta.glob('../assets/life_photos/*', { eager: true });
const photoModules = import.meta.glob('../assets/life_photos_webp/*', { eager: true });

const lifePhotos = Object.entries(photoModules).map(([path, module], index) => {
    // 从路径中提取文件名作为 alt 文本
    const fileName = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || `Life Photo ${index + 1}`;
    return {
        id: index + 1,
        src: module.default,
        alt: fileName
    };
});

const Life = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);
    const photoRefs = useRef([]);
    const layoutMasonryRef = useRef(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);
    const modalImageRef = useRef(null);
    const layoutRafRef = useRef(null);
    const loadedImagesRef = useRef(new Set());
    const gsapContextRef = useRef(null);

    useEffect(() => {
        // 瀑布流布局函数（使用 requestAnimationFrame 优化）
        const layoutMasonry = () => {
            if (layoutRafRef.current) {
                cancelAnimationFrame(layoutRafRef.current);
            }

            layoutRafRef.current = requestAnimationFrame(() => {
                if (!gridRef.current) return;

                const grid = gridRef.current;
                const items = Array.from(grid.children);
                if (items.length === 0) return;

                // 获取列数（根据屏幕宽度）
                const getColumnCount = () => {
                    const width = window.innerWidth;
                    if (width <= 431) return 1;
                    if (width <= 768) return 2;
                    if (width <= 1200) return 3;
                    return 4;
                };

                const columnCount = getColumnCount();
                const gap = 30; // 统一的间距（像素）- 用于上下和左右间距

                // 单列布局：使用正常文档流排列
                if (columnCount === 1) {
                    items.forEach((item) => {
                        // 清除所有定位样式，使用正常文档流
                        item.style.position = 'static';
                        item.style.left = 'auto';
                        item.style.top = 'auto';
                        item.style.width = '100%';
                        item.style.margin = `0 0 ${gap}px 0`;
                        // 清除 transform
                        if (item.style.transform) {
                            gsap.set(item, { clearProps: "transform" });
                        }
                    });
                    // 容器高度自动适应内容
                    grid.style.height = 'auto';
                    return;
                }

                // 多列布局：使用瀑布流布局（绝对定位）
                const columnHeights = new Array(columnCount).fill(0);

                // 批量清除 transform（只在第一次布局时清除）
                const needsReset = items.some(item => item.style.position !== 'absolute');
                if (needsReset) {
                    items.forEach((item) => {
                        // 只在需要时清除 transform
                        if (item.style.transform) {
                            gsap.set(item, { clearProps: "transform" });
                        }
                        item.style.position = 'relative';
                        item.style.left = 'auto';
                        item.style.top = 'auto';
                        item.style.width = '';
                        item.style.margin = '0';
                    });
                    // 强制重排
                    grid.offsetHeight;
                }

                // 计算每列的宽度（考虑左右间距）
                const columnWidth = 100 / columnCount;
                const itemWidth = `calc(${columnWidth}% - ${gap}px)`;

                // 现在计算并设置位置
                items.forEach((item) => {
                    const img = item.querySelector('img');
                    if (!img || !img.complete) return;

                    // 获取实际高度
                    const itemHeight = item.offsetHeight;
                    if (itemHeight === 0) return;

                    // 找到最短的列
                    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

                    // 计算左侧位置（考虑左右间距）
                    const leftOffset = shortestColumnIndex * columnWidth;
                    const left = `calc(${leftOffset}% + ${gap / 2}px)`;

                    // 设置绝对定位
                    item.style.position = 'absolute';
                    item.style.left = left;
                    const topPosition = columnHeights[shortestColumnIndex] === 0
                        ? 0
                        : columnHeights[shortestColumnIndex] + gap;
                    item.style.top = `${topPosition}px`;
                    item.style.width = itemWidth;
                    item.style.margin = '0';

                    // 更新列高度
                    columnHeights[shortestColumnIndex] = topPosition + itemHeight;
                });

                // 设置容器高度
                const maxHeight = Math.max(...columnHeights);
                if (maxHeight > 0) {
                    grid.style.height = `${maxHeight}px`;
                }

                layoutRafRef.current = null;
            });
        };

        layoutMasonryRef.current = layoutMasonry;

        // 优化的图片加载处理（使用防抖）
        let layoutTimeout;
        const scheduleLayout = () => {
            clearTimeout(layoutTimeout);
            layoutTimeout = setTimeout(() => {
                layoutMasonry();
                // 布局完成后刷新 ScrollTrigger
                setTimeout(() => {
                    if (gsapContextRef.current) {
                        ScrollTrigger.refresh();
                    }
                }, 50);
            }, 100);
        };

        const handleImageLoad = (img) => {
            if (!loadedImagesRef.current.has(img.src)) {
                loadedImagesRef.current.add(img.src);
                scheduleLayout();
            }
        };

        // 初始布局（延迟以确保 DOM 已渲染）
        const initialLayoutTimeout = setTimeout(() => {
            const images = Array.from(gridRef.current?.querySelectorAll('img') || []);

            // 为未加载的图片添加事件监听
            images.forEach(img => {
                if (img.complete && img.naturalHeight !== 0) {
                    handleImageLoad(img);
                } else {
                    const onLoad = () => {
                        handleImageLoad(img);
                        img.removeEventListener('load', onLoad);
                        img.removeEventListener('error', onLoad);
                    };
                    img.addEventListener('load', onLoad);
                    img.addEventListener('error', onLoad);
                }
            });

            // 如果所有图片都已加载，立即布局
            if (images.length > 0 && images.every(img => img.complete && img.naturalHeight !== 0)) {
                layoutMasonry();
            }
        }, 200);

        // 监听窗口大小变化（使用防抖）
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                layoutMasonry();
                // 布局完成后刷新 ScrollTrigger
                setTimeout(() => {
                    if (gsapContextRef.current) {
                        ScrollTrigger.refresh();
                    }
                }, 100);
            }, 200);
        };
        window.addEventListener('resize', handleResize, { passive: true });

        // 监听滚动事件，确保 ScrollTrigger 正确工作
        const handleScroll = () => {
            if (gsapContextRef.current) {
                ScrollTrigger.update();
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // GSAP 动画 - 在布局完成后应用（确保在布局和图片加载完成后创建）
        const initAnimations = () => {
            if (!sectionRef.current || !gridRef.current) return;

            // 清理之前的 context
            if (gsapContextRef.current) {
                gsapContextRef.current.revert();
            }

            gsapContextRef.current = gsap.context(() => {
                const photos = gsap.utils.toArray('.life-photo-item');
                if (photos.length === 0) return;

                // 检查照片是否已经在视口内
                const checkIfInViewport = (element) => {
                    const rect = element.getBoundingClientRect();
                    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
                    return (
                        rect.top >= 0 &&
                        rect.left >= 0 &&
                        rect.bottom <= windowHeight + (windowHeight * 0.15) && // 85% threshold
                        rect.right <= windowWidth
                    );
                };

                // 批量设置初始状态
                gsap.set(photos, { opacity: 0, y: 30 });

                // 使用批量动画，减少 ScrollTrigger 实例
                photos.forEach((photo, index) => {
                    // 检查照片是否已经在视口内
                    const isInViewport = checkIfInViewport(photo);

                    if (isInViewport) {
                        // 如果已经在视口内，立即显示（不需要 ScrollTrigger）
                        gsap.to(photo, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            delay: index * 0.03,
                            ease: "power2.out"
                        });
                    } else {
                        // 如果不在视口内，使用 ScrollTrigger
                        gsap.to(photo, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            delay: index * 0.03,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: photo,
                                start: 'top 85%',
                                end: 'top 50%',
                                toggleActions: 'play none none reverse',
                                // 优化性能
                                once: false,
                                refreshPriority: -1,
                                // 确保在布局完成后正确计算位置
                                invalidateOnRefresh: true,
                            }
                        });
                    }
                });

                // 批量刷新 ScrollTrigger（延迟刷新确保布局完成）
                setTimeout(() => {
                    ScrollTrigger.refresh();
                    // 再次检查视口内的照片
                    photos.forEach((photo) => {
                        if (checkIfInViewport(photo)) {
                            const currentOpacity = gsap.getProperty(photo, "opacity");
                            if (currentOpacity === 0) {
                                gsap.to(photo, {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.6,
                                    ease: "power2.out"
                                });
                            }
                        }
                    });
                }, 100);
            }, sectionRef);
        };

        // 等待布局和图片加载完成后再创建动画
        const animationTimeout = setTimeout(() => {
            // 确保布局已完成
            if (layoutMasonryRef.current) {
                layoutMasonryRef.current();
            }

            // 等待布局完成后再初始化动画
            setTimeout(() => {
                initAnimations();
            }, 200);
        }, 600);

        return () => {
            clearTimeout(initialLayoutTimeout);
            clearTimeout(layoutTimeout);
            clearTimeout(resizeTimeout);
            clearTimeout(animationTimeout);

            if (layoutRafRef.current) {
                cancelAnimationFrame(layoutRafRef.current);
            }

            if (gsapContextRef.current) {
                gsapContextRef.current.revert();
                gsapContextRef.current = null;
            }

            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            loadedImagesRef.current.clear();
        };
    }, []); // 移除 lifePhotos 依赖，避免不必要的重新渲染

    // 处理照片点击
    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    // 关闭浮窗
    const handleCloseModal = useCallback(() => {
        if (modalRef.current && modalImageRef.current) {
            gsap.to(modalRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    setIsModalOpen(false);
                    setSelectedPhoto(null);
                }
            });
            gsap.to(modalImageRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in"
            });
        } else {
            setIsModalOpen(false);
            setSelectedPhoto(null);
        }
    }, []);

    // 浮窗打开时的动画（优化：避免重复创建动画）
    useEffect(() => {
        if (!isModalOpen || !modalRef.current || !modalImageRef.current) return;

        const modal = modalRef.current;
        const image = modalImageRef.current;

        // 清理之前的动画
        gsap.killTweensOf([modal, image]);

        // 设置初始状态
        gsap.set(modal, { opacity: 0 });
        gsap.set(image, { scale: 0.8, opacity: 0 });

        // 创建动画
        gsap.to(modal, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });
        gsap.to(image, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.1
        });

        return () => {
            // 清理动画
            gsap.killTweensOf([modal, image]);
        };
    }, [isModalOpen]);

    // 按 ESC 键关闭浮窗
    useEffect(() => {
        if (!isModalOpen) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleCloseModal();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isModalOpen, handleCloseModal]);

    // 确保所有照片在页面加载后都能正确显示（fallback）
    useEffect(() => {
        const ensurePhotosVisible = () => {
            if (!gridRef.current || !gsapContextRef.current) return;

            const photos = Array.from(gridRef.current.querySelectorAll('.life-photo-item'));
            photos.forEach((photo) => {
                const opacity = gsap.getProperty(photo, "opacity");
                const rect = photo.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

                // 如果照片在视口内但不可见，强制显示
                if (isInViewport && opacity === 0) {
                    gsap.to(photo, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                }
            });

            // 刷新 ScrollTrigger
            ScrollTrigger.refresh();
        };

        // 页面加载完成后检查
        const timeout = setTimeout(ensurePhotosVisible, 1000);

        // 滚动时也检查
        const handleScrollCheck = () => {
            ensurePhotosVisible();
        };
        window.addEventListener('scroll', handleScrollCheck, { passive: true });

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('scroll', handleScrollCheck);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="life-section"
            style={{ '--small-bg-url': `url(${small_bg})`, '--home-bg-url': `url(${home_bg})` }}
        >
            <div className="section-title-fixed part-container">
                <span className="section-number">// 04</span>
                <h2>
                    <span className="tw:font-geo tw:text-5xl tw:text-day-accent title-line">Life</span> <br />
                    <span className="tw:text-3xl tw:font-noto title-line tw:text-day-text">生活</span>
                </h2>
                <p className="subtitle tw:font-geo tw:text-md tw:text-day-secondary">Moments captured in time</p>
            </div>

            <div ref={gridRef} className="life-photos-grid">
                {lifePhotos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="life-photo-item"
                        ref={el => photoRefs.current[index] = el}
                        onClick={() => handlePhotoClick(photo)}
                    >
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            className="life-photo"
                            loading="lazy"
                            decoding="async"
                            onLoad={(e) => {
                                // 图片加载后重新布局（使用防抖）
                                if (layoutMasonryRef.current) {
                                    const img = e.target;
                                    if (!loadedImagesRef.current.has(img.src)) {
                                        loadedImagesRef.current.add(img.src);
                                        setTimeout(() => {
                                            if (layoutMasonryRef.current) {
                                                layoutMasonryRef.current();
                                            }
                                        }, 50);
                                    }
                                }
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* 照片浮窗 */}
            {isModalOpen && selectedPhoto && (
                <div
                    ref={modalRef}
                    className="life-photo-modal"
                    onClick={handleCloseModal}
                >
                    <div
                        ref={modalImageRef}
                        className="life-photo-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* <button
                            className="life-photo-modal-close"
                            onClick={handleCloseModal}
                            aria-label="Close"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button> */}
                        <img
                            src={selectedPhoto.src}
                            alt={selectedPhoto.alt}
                            className="life-photo-modal-image"
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default Life;
