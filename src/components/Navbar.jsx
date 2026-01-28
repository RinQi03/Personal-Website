import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 431);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 431;
            setIsMobile(mobile);
            // 如果切换到桌面视图，关闭菜单
            if (!mobile) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="header" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'var(--font-geo)',
                ...(isMobile && {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(2px)',
                }),
            }}>
                <Link
                    to="/"
                    className="tw:text-2xl tw:font-bold tw:text-orange-600"
                    style={{ textDecoration: 'none' }}
                    onClick={closeMenu}
                >
                    Rin
                </Link>

                {/* 桌面端导航 */}
                {!isMobile && (
                    <nav style={{ display: 'flex', gap: '2rem' }} className="tw:text-xl">
                        <NavLink
                            to="/experience"
                            className="tw:font-bold tw:text-orange-600"
                            style={{ textDecoration: 'none' }}
                        >
                            Experience
                        </NavLink>
                        <NavLink
                            to="/projects"
                            className="tw:font-bold tw:text-orange-600"
                            style={{ textDecoration: 'none' }}
                        >
                            Projects
                        </NavLink>
                        <NavLink
                            to="/about"
                            className="tw:font-bold tw:text-orange-600"
                            style={{ textDecoration: 'none' }}
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/life"
                            className="tw:font-bold tw:text-orange-600"
                            style={{ textDecoration: 'none' }}
                        >
                            Life
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className="tw:font-bold tw:text-orange-600"
                            style={{ textDecoration: 'none' }}
                        >
                            Contact
                        </NavLink>
                    </nav>
                )}

                {/* 移动端汉堡菜单按钮 */}
                {isMobile && (
                    <button
                        onClick={toggleMenu}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            zIndex: 10000,
                        }}
                        aria-label="Toggle menu"
                    >
                        <span
                            style={{
                                width: '24px',
                                height: '3px',
                                backgroundColor: '#ea580c',
                                borderRadius: '2px',
                                transition: 'all 0.3s ease',
                                transform: isMenuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none',
                            }}
                        />
                        <span
                            style={{
                                width: '24px',
                                height: '3px',
                                backgroundColor: '#ea580c',
                                borderRadius: '2px',
                                transition: 'all 0.3s ease',
                                opacity: isMenuOpen ? 0 : 1,
                            }}
                        />
                        <span
                            style={{
                                width: '24px',
                                height: '3px',
                                backgroundColor: '#ea580c',
                                borderRadius: '2px',
                                transition: 'all 0.3s ease',
                                transform: isMenuOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none',
                            }}
                        />
                    </button>
                )}
            </header>

            {/* 移动端折叠菜单 */}
            {isMobile && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 9998,
                        transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.3s ease-in-out',
                        paddingTop: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '2rem',
                        padding: '80px 2rem 2rem 2rem',
                    }}
                >
                    <NavLink
                        to="/experience"
                        className="tw:font-bold tw:text-orange-600 tw:text-2xl"
                        style={{ textDecoration: 'none', width: '100%', textAlign: 'center', padding: '1rem' }}
                        onClick={closeMenu}
                    >
                        Experience
                    </NavLink>
                    <NavLink
                        to="/projects"
                        className="tw:font-bold tw:text-orange-600 tw:text-2xl"
                        style={{ textDecoration: 'none', width: '100%', textAlign: 'center', padding: '1rem' }}
                        onClick={closeMenu}
                    >
                        Projects
                    </NavLink>
                    <NavLink
                        to="/about"
                        className="tw:font-bold tw:text-orange-600 tw:text-2xl"
                        style={{ textDecoration: 'none', width: '100%', textAlign: 'center', padding: '1rem' }}
                        onClick={closeMenu}
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/life"
                        className="tw:font-bold tw:text-orange-600 tw:text-2xl"
                        style={{ textDecoration: 'none', width: '100%', textAlign: 'center', padding: '1rem' }}
                        onClick={closeMenu}
                    >
                        Life
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className="tw:font-bold tw:text-orange-600 tw:text-2xl"
                        style={{ textDecoration: 'none', width: '100%', textAlign: 'center', padding: '1rem' }}
                        onClick={closeMenu}
                    >
                        Contact
                    </NavLink>
                </div>
            )}

            {/* 菜单打开时的背景遮罩 */}
            {isMobile && isMenuOpen && (
                <div
                    onClick={closeMenu}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 9997,
                        opacity: isMenuOpen ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                />
            )}
        </>
    );
};

export default Navbar;