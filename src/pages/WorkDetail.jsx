import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import resumePdf from '../assets/Rin_Qi_Resume.pdf';
import { selectedWork } from '../data/portfolioData';
import '../css/WorkDetail.css';

const skipToCaseStudy = (event) => {
    event.preventDefault();
    const target = document.getElementById('case-content');
    target?.scrollIntoView({ behavior: 'auto', block: 'start' });
    target?.focus({ preventScroll: true });
};

const FlowNode = ({ node, variant = node.type || 'branch' }) => (
    <article
        className={`case-flow-node case-flow-node--${variant}`}
        tabIndex="0"
        aria-label={`${node.label}. ${node.detail}`}
    >
        {(node.kicker || node.path) && <span>{node.kicker || node.path}</span>}
        <h3>
            <span className="case-flow-label-desktop">{node.label}</span>
            <span className="case-flow-label-mobile">{node.mobileLabel || node.label}</span>
        </h3>
        {node.tags && (
            <div className="case-flow-tags" aria-hidden="true">
                {node.tags.map((tag) => <small key={tag}>{tag}</small>)}
            </div>
        )}
        <p>{node.detail}</p>
    </article>
);

const FlowConnector = ({ entersDecision = false }) => (
    <svg
        className="case-flow-connector"
        viewBox="0 0 16 42"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
    >
        {entersDecision ? (
            <path d="M8 0V42" vectorEffect="non-scaling-stroke" />
        ) : (
            <path d="M8 0V42M3.5 37.5 8 42l4.5-4.5" vectorEffect="non-scaling-stroke" />
        )}
    </svg>
);

const WorkflowDiagram = ({ visualization }) => (
    <figure className="case-flowchart" aria-labelledby="workflow-diagram-title">
        <figcaption>
            <h3 id="workflow-diagram-title">{visualization.title}</h3>
            <p>{visualization.description}</p>
            <span>Focus or hover a node for detail</span>
        </figcaption>
        <div className="case-flow-map">
            {visualization.stages.map((stage, index) => (
                <div className={`case-flow-stage case-flow-stage--${stage.type}`} key={stage.id}>
                    {stage.type === 'decision' ? (
                        <>
                            <div
                                className="case-flow-decision"
                                tabIndex="0"
                                aria-label={`${stage.question}. ${stage.detail}`}
                            >
                                <strong>
                                    <span className="case-flow-label-desktop">{stage.question}</span>
                                    <span className="case-flow-label-mobile">{stage.mobileQuestion || stage.question}</span>
                                </strong>
                                <p>{stage.detail}</p>
                            </div>
                            <span className="case-flow-split-stem" aria-hidden="true" />
                            <div className="case-flow-branches">
                                {stage.branches.map((branch) => <FlowNode key={branch.id} node={branch} variant="branch" />)}
                            </div>
                        </>
                    ) : (
                        <FlowNode node={stage} />
                    )}
                    {index < visualization.stages.length - 1 && (
                        <FlowConnector entersDecision={visualization.stages[index + 1].type === 'decision'} />
                    )}
                </div>
            ))}
        </div>
    </figure>
);

const SystemsCase = ({ project }) => (
    <>
        <section className="case-section case-context" aria-labelledby="systems-context-title">
            <div className="case-section-heading"><p>01</p><h2 id="systems-context-title">My work</h2></div>
            <div className="case-section-copy">
                {project.problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <ul className="case-contributions">{project.role.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
        </section>

        <section className="case-section case-workflow" aria-labelledby="systems-workflow-title">
            <div className="case-section-heading">
                <p>02</p>
                <h2 id="systems-workflow-title">Research workflow</h2>
            </div>
            <div className="case-diagram-column">
                <WorkflowDiagram visualization={project.visualization} />
            </div>
        </section>

        <section className="case-section case-result" aria-labelledby="systems-result-title">
            <div className="case-section-heading"><p>03</p><h2 id="systems-result-title">What changed</h2></div>
            <div>
            <div className="case-impact-grid">
                {project.result.map((item) => (
                    <article key={item.label}>
                        <h3>{item.label}</h3>
                        <p>{item.detail}</p>
                    </article>
                ))}
            </div>
                {project.inProgress.length > 0 && (
                <aside className="case-next-step" aria-label="In progress">
                    <h3>Still in progress</h3>
                    {project.inProgress.map((item) => <p key={item}>{item}</p>)}
                </aside>
                )}
            </div>
        </section>
    </>
);

const CreativeCase = ({ project }) => (
    <>
        <section className="case-section case-context" aria-labelledby="creative-context-title">
            <div className="case-section-heading"><p>01</p><h2 id="creative-context-title">My work</h2></div>
            <div className="case-section-copy">
                {project.problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
        </section>

        <section className="case-section case-public-work" aria-labelledby="creative-public-title">
            <div className="case-section-heading"><p>02</p><h2 id="creative-public-title">Selected videos</h2></div>
            <div>
                <div className="case-video-grid">
                    {project.media.map((video, index) => (
                        <article className="case-video-card" key={video.url}>
                            <iframe
                                src={video.embedUrl}
                                title={`Jiaoyimao video ${index + 1}: ${video.title}`}
                                width="1080"
                                height="1920"
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allow="fullscreen"
                                allowFullScreen
                            />
                            <h3>{video.title}</h3>
                            <p>AI image &amp; video generation</p>
                            <a href={video.url} target="_blank" rel="noreferrer">Watch on Douyin <span aria-hidden="true">↗</span></a>
                        </article>
                    ))}
                </div>
                <p className="case-video-help">If the player doesn’t load, open the original on Douyin.</p>
            </div>
        </section>

        <section className="case-section case-account" aria-labelledby="creative-account-title">
            <div className="case-section-heading"><p>03</p><h2 id="creative-account-title">Account snapshot</h2></div>
            <div>
                <a href={project.account.url} target="_blank" rel="noreferrer">Jiaoyimao’s company-run Douyin account <span aria-hidden="true">↗</span></a>
                <dl className="case-account-metrics">
                    {project.account.metrics.map((metric) => (
                        <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>
                    ))}
                </dl>
                <p className="case-account-note">Account-wide totals as of <time dateTime={project.account.checkedAt}>October 3, 2026</time>. My contribution covered AI generation for the first eight posts.</p>
            </div>
        </section>
    </>
);

const WorkDetail = () => {
    const { slug } = useParams();
    const project = selectedWork.find((item) => item.slug === slug);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (!project) return undefined;
        const previousTitle = document.title;
        document.title = `${project.title} — Rin Qi`;
        return () => { document.title = previousTitle; };
    }, [project]);

    if (!project) return <Navigate to="/" replace />;

    const currentIndex = selectedWork.findIndex((item) => item.slug === project.slug);
    const nextProject = selectedWork[(currentIndex + 1) % selectedWork.length];

    return (
        <div className={`case-shell case-shell--${project.caseType}`}>
            <a className="case-skip-link" href="#case-content" onClick={skipToCaseStudy}>Skip to case study</a>
            <header className="case-nav" aria-label="Case study navigation">
                <Link className="case-brand" to="/">Rin Qi</Link>
                <p>Case study / {project.index}</p>
                <div><Link to="/">Portfolio</Link><a href={resumePdf} target="_blank" rel="noreferrer">Resume</a></div>
            </header>

            <main id="case-content" tabIndex="-1">
                <section className="case-hero" aria-labelledby="case-title">
                    <div className="case-hero-label"><p>{project.label}</p><p>{project.context}</p></div>
                    <div className="case-hero-copy">
                        <h1 id="case-title">{project.title}</h1>
                        <p>{project.summary}</p>
                        <span>{project.metadata}</span>
                    </div>
                </section>

                {project.caseType === 'systems' && <SystemsCase project={project} />}
                {project.caseType === 'creative' && <CreativeCase project={project} />}
            </main>

            <footer className="case-footer">
                <div><p>Next case study</p><Link to={`/work/${nextProject.slug}`}>{nextProject.title} <span aria-hidden="true">↗</span></Link></div>
                <Link to="/">Return to portfolio</Link>
            </footer>
        </div>
    );
};

export default WorkDetail;
