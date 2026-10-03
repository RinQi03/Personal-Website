import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import resumePdf from '../assets/Rin_Qi_Resume.pdf';
import profilePhoto from '../assets/About_Profile.png';
import portraitOutline from '../assets/about_profile_side_border_only.svg';
import outsidePhoto from '../assets/life_photos_webp/DSC_2931.webp';
import { experienceTimeline, portfolioProfile, selectedWork } from '../data/portfolioData';
import '../css/Portfolio.css';

const scrollToSection = (id) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
    });
};

const skipToSection = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: 'auto', block: 'start' });
    target?.focus({ preventScroll: true });
};

const Portfolio = () => {
    const [expandedRole, setExpandedRole] = useState(0);
    const portraitRef = useRef(null);

    const resetPortraitMotion = () => {
        const portrait = portraitRef.current;
        if (!portrait) return;

        portrait.style.setProperty('--portrait-x', '0px');
        portrait.style.setProperty('--portrait-y', '0px');
        portrait.style.setProperty('--outline-front-x', '0px');
        portrait.style.setProperty('--outline-front-y', '0px');
    };

    const handlePortraitMove = (event) => {
        const portrait = portraitRef.current;
        const supportsPointerMotion = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!portrait || !supportsPointerMotion || reduceMotion) return;

        const bounds = portrait.getBoundingClientRect();
        const horizontal = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
        const vertical = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));

        portrait.style.setProperty('--portrait-x', `${horizontal * 16}px`);
        portrait.style.setProperty('--portrait-y', `${vertical * 12}px`);
        portrait.style.setProperty('--outline-front-x', `${horizontal * 5}px`);
        portrait.style.setProperty('--outline-front-y', `${vertical * 4}px`);
    };

    return (
        <div className="portfolio-shell">
            <a
                className="portfolio-skip-link"
                href="#selected-work"
                onClick={(event) => skipToSection(event, 'selected-work')}
            >
                Skip to selected work
            </a>

            <header className="portfolio-nav" aria-label="Primary navigation">
                <button className="portfolio-brand" type="button" onClick={() => scrollToSection('top')}>
                    Rin Qi
                </button>
                <nav className="portfolio-nav-links" aria-label="Portfolio sections">
                    <button type="button" onClick={() => scrollToSection('selected-work')}>Work</button>
                    <button type="button" onClick={() => scrollToSection('experience')}>Experience</button>
                    <button type="button" onClick={() => scrollToSection('about')}>About</button>
                    <a href={resumePdf} target="_blank" rel="noreferrer">Resume</a>
                </nav>
                <Link className="portfolio-space-link" to="/space">Playground</Link>
            </header>

            <main>
                <section className="portfolio-hero" id="top" aria-labelledby="portfolio-title">
                    <div className="portfolio-hero-copy">
                        <p className="portfolio-overline">{portfolioProfile.hero.eyebrow}</p>
                        <h1 id="portfolio-title">{portfolioProfile.hero.title}</h1>
                        <p className="portfolio-hero-summary">{portfolioProfile.hero.summary}</p>
                        <div className="portfolio-actions">
                            <button type="button" onClick={() => scrollToSection('selected-work')}>
                                View my work
                            </button>
                            <a href={resumePdf} target="_blank" rel="noreferrer">Resume <span aria-hidden="true">↗</span></a>
                        </div>
                    </div>
                    <figure
                        ref={portraitRef}
                        className="portfolio-hero-portrait"
                        onPointerMove={handlePortraitMove}
                        onPointerLeave={resetPortraitMotion}
                    >
                        <span className="portfolio-portrait-index" aria-hidden="true">R / 01</span>
                        <img
                            className="portfolio-portrait-outline portfolio-portrait-outline--front"
                            src={portraitOutline}
                            alt=""
                            aria-hidden="true"
                        />
                        <img
                            className="portfolio-portrait-cutout"
                            src={profilePhoto}
                            alt="Rin Qi wearing a red winter jacket outdoors"
                        />
                    </figure>
                </section>

                <section
                    className="portfolio-section portfolio-work"
                    id="selected-work"
                    aria-labelledby="work-title"
                    tabIndex="-1"
                >
                    <div className="portfolio-section-heading">
                        <p>01 / Work</p>
                        <div>
                            <h2 id="work-title">Selected work</h2>
                        </div>
                    </div>
                    <div className="portfolio-work-grid">
                        {selectedWork.map((project) => (
                            <Link
                                className={`portfolio-work-card portfolio-work-card--${project.prominence}`}
                                to={`/work/${project.slug}`}
                                key={project.slug}
                            >
                                <header>
                                    <span>{project.index}</span>
                                    <p>{project.label}</p>
                                </header>
                                {project.caseType === 'systems' && (
                                    <div className="portfolio-work-preview" aria-label="From a daily task through an AI skill to an output">
                                        <span>Daily task</span><i aria-hidden="true">→</i>
                                        <strong>AI skill<small>Team knowledge + tools</small></strong><i aria-hidden="true">→</i>
                                        <span>Output</span>
                                    </div>
                                )}
                                <div className="portfolio-work-copy">
                                    <h3>{project.title}</h3>
                                    <p>{project.summary}</p>
                                </div>
                                <p className="portfolio-work-meta">{project.metadata}</p>
                                <span className="portfolio-work-cta">View case study <span aria-hidden="true">↗</span></span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="portfolio-section portfolio-experience" id="experience" aria-labelledby="experience-title">
                    <div className="portfolio-section-heading">
                        <p>Experience / 02</p>
                        <div><h2 id="experience-title">Where I’ve worked</h2></div>
                    </div>
                    <div className="portfolio-timeline">
                        {experienceTimeline.map((role, index) => {
                            const isExpanded = expandedRole === index;
                            const detailId = `role-details-${index}`;

                            return (
                                <article className="portfolio-role" key={`${role.time}-${role.title}`}>
                                    <button
                                        className="portfolio-role-trigger"
                                        type="button"
                                        aria-expanded={isExpanded}
                                        aria-controls={detailId}
                                        onClick={() => setExpandedRole(isExpanded ? -1 : index)}
                                    >
                                        <time>{role.time}</time>
                                        <span className="portfolio-role-identity">
                                            <strong>{role.title}</strong>
                                            <small>{role.company}</small>
                                        </span>
                                        <span className="portfolio-role-type">{role.employmentType}</span>
                                        <span className="portfolio-role-toggle" aria-hidden="true">{isExpanded ? '−' : '+'}</span>
                                    </button>
                                    {isExpanded && (
                                        <div className="portfolio-role-details" id={detailId}>
                                            <p>{role.summary}</p>
                                            <ul>{role.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                                            {role.relatedWorkSlug && (
                                                <Link to={`/work/${role.relatedWorkSlug}`}>View related case <span aria-hidden="true">↗</span></Link>
                                            )}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="portfolio-section portfolio-why" id="about" aria-labelledby="why-title">
                    <p className="portfolio-section-label">About / 03</p>
                    <div className="portfolio-why-copy">
                        <h2 id="why-title">{portfolioProfile.why.title}</h2>
                        {portfolioProfile.why.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                </section>

                <section className="portfolio-section portfolio-outside" aria-labelledby="outside-title">
                    <figure className="portfolio-outside-photo">
                        <img src={outsidePhoto} alt="Kites flying above the United States Capitol, photographed by Rin" />
                    </figure>
                    <div className="portfolio-outside-copy">
                        <p className="portfolio-section-label">Outside work / 04</p>
                        <h2 id="outside-title">A little more of me.</h2>
                        <div className="portfolio-outside-links">
                            <Link to="/life"><span>Photography</span><span aria-hidden="true">↗</span></Link>
                            <Link to="/space"><span>Playground</span><span aria-hidden="true">↗</span></Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="portfolio-footer">
                <p>Let’s build something useful.</p>
                <div className="portfolio-footer-links">
                    <a href="mailto:rinqi26@126.com">Email</a>
                    <a href="https://www.linkedin.com/in/rin-qi" target="_blank" rel="noreferrer">LinkedIn</a>
                    <a href="https://github.com/RinQi03" target="_blank" rel="noreferrer">GitHub</a>
                    <a href={resumePdf} target="_blank" rel="noreferrer">Resume</a>
                </div>
            </footer>
        </div>
    );
};

export default Portfolio;
