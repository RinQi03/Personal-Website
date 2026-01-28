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
                // 刷新 ScrollTrigger
                ScrollTrigger.refresh();
            }, 200);
        };
        window.addEventListener('resize', handleResize, { passive: true });

        // GSAP 动画 - 在布局完成后应用（批量创建，减少 ScrollTrigger 数量）
        const animationTimeout = setTimeout(() => {
            if (!sectionRef.current) return;

            // 清理之前的 context
            if (gsapContextRef.current) {
                gsapContextRef.current.revert();
            }

            gsapContextRef.current = gsap.context(() => {
                const photos = gsap.utils.toArray('.life-photo-item');

                // 批量设置初始状态
                gsap.set(photos, { opacity: 0, y: 30 });

                // 使用批量动画，减少 ScrollTrigger 实例
                photos.forEach((photo, index) => {
                    gsap.to(photo, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: index * 0.03, // 减少延迟
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: photo,
                            start: 'top 85%',
                            end: 'top 50%',
                            toggleActions: 'play none none reverse',
                            // 优化性能
                            once: false,
                            refreshPriority: -1,
                        }
                    });
                });

                // 批量刷新 ScrollTrigger
                ScrollTrigger.refresh();
            }, sectionRef);
        }, 400);

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
