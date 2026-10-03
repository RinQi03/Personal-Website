import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import * as portfolioData from './portfolioData.js';

const readSource = (relativePath) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

test('public profile introduces Rin with her current role and location', () => {
    assert.equal(
        portfolioData.portfolioProfile?.hero.eyebrow,
        'AI Product Manager Intern at Lingxi Games · Guangzhou, China',
    );
    assert.equal(portfolioData.portfolioProfile?.hero.title, 'Hi, I’m Rin.');
});

test('selected work is one featured systems case and one secondary creative case', () => {
    assert.deepEqual(
        portfolioData.selectedWork.map(({ slug, prominence }) => ({ slug, prominence })),
        [
            { slug: 'ai-systems-for-marketing-teams', prominence: 'featured' },
            { slug: 'aigc-creative-production', prominence: 'secondary' },
        ],
    );

    assert.equal(
        portfolioData.selectedWork[0].metadata,
        'Workflow design · Agent skills · Knowledge systems',
    );
    assert.deepEqual(
        portfolioData.selectedWork[0].built.map(({ title }) => title),
        ['Reusable AI workflows', 'Supporting knowledge systems'],
    );
});

test('systems case models decisions and branches in a permission-aware research workflow', () => {
    const systemsCase = portfolioData.selectedWork.find(
        ({ slug }) => slug === 'ai-systems-for-marketing-teams',
    );

    assert.equal(systemsCase.visualization.title, 'Example: competitive research');
    assert.deepEqual(
        systemsCase.visualization.stages.map(({ id, type }) => ({ id, type })),
        [
            { id: 'brief', type: 'action' },
            { id: 'target', type: 'decision' },
            { id: 'confirm', type: 'human' },
            { id: 'knowledge', type: 'decision' },
            { id: 'analyze', type: 'action' },
            { id: 'report', type: 'output' },
        ],
    );
    assert.deepEqual(
        systemsCase.visualization.stages
            .filter(({ type }) => type === 'decision')
            .map(({ question }) => question),
        ['Competitor specified?', 'Fresh knowledge available?'],
    );
    assert.match(JSON.stringify(systemsCase.visualization), /Personal memory/);
    assert.match(JSON.stringify(systemsCase.visualization), /Team knowledge/);
    assert.match(JSON.stringify(systemsCase.visualization), /Search approved sources/);
});

test('mobile workflow keeps both decision paths while using shorter labels', () => {
    const systemsCase = portfolioData.selectedWork.find(
        ({ slug }) => slug === 'ai-systems-for-marketing-teams',
    );
    const decisions = systemsCase.visualization.stages.filter(({ type }) => type === 'decision');
    const styles = readSource('../css/WorkDetail.css');

    assert.deepEqual(
        decisions.map(({ mobileQuestion, branches }) => ({
            mobileQuestion,
            branchLabels: branches.map(({ mobileLabel }) => mobileLabel),
        })),
        [
            { mobileQuestion: 'Target given?', branchLabels: ['Use target', 'Find from context'] },
            { mobileQuestion: 'Knowledge fresh?', branchLabels: ['Reuse knowledge', 'Search sources'] },
        ],
    );
    assert.match(
        styles,
        /@media \(max-width:\s*820px\)[\s\S]*\.case-flow-branches\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s,
    );
    assert.match(
        styles,
        /@media \(max-width:\s*820px\)[\s\S]*\.case-flow-decision::before\s*\{[^}]*display:\s*block/s,
    );
});

test('systems case keeps before-after impact separate from the workflow diagram', () => {
    const systemsCase = portfolioData.selectedWork.find(
        ({ slug }) => slug === 'ai-systems-for-marketing-teams',
    );

    assert.deepEqual(
        systemsCase.result.map(({ label }) => label),
        ['Before', 'With the workflow', 'Human role'],
    );
    assert.match(systemsCase.result[2].detail, /The market team/);
});

test('creative case links only the two approved public videos, with matching non-autoplay embeds', () => {
    const creativeCase = portfolioData.selectedWork.find(
        ({ slug }) => slug === 'aigc-creative-production',
    );

    assert.ok(creativeCase.media?.length);
    assert.deepEqual(creativeCase.media.map(({ url }) => url), [
        'https://www.douyin.com/video/7537270432739740938',
        'https://www.douyin.com/video/7539863271050923291',
    ]);
    for (const video of creativeCase.media) {
        const embed = new URL(video.embedUrl);
        assert.equal(embed.origin, 'https://open.douyin.com');
        assert.equal(embed.searchParams.get('vid'), new URL(video.url).pathname.split('/').pop());
        assert.equal(embed.searchParams.get('autoplay'), '0');
    }
    assert.equal('images' in creativeCase, false);
});

test('all exported portfolio content follows the public disclosure boundary', () => {
    const serialized = JSON.stringify(portfolioData);

    assert.doesNotMatch(serialized, /~10|200\+|500\+|2,500\+|3h\s*→\s*30m/i);
});

test('evaluation work is separated from completed results', () => {
    const systemsCase = portfolioData.selectedWork.find(
        ({ slug }) => slug === 'ai-systems-for-marketing-teams',
    );

    assert.deepEqual(systemsCase.inProgress, [
        'Designed a golden-question evaluation framework for assessing answer quality; implementation is in progress.',
    ]);
    assert.doesNotMatch(
        JSON.stringify(systemsCase.result),
        /evaluation|evaluated|golden-question|golden question/i,
    );
});

test('experience timeline explains every short engagement with dates and type', () => {
    assert.deepEqual(
        portfolioData.experienceTimeline.map(({ time, employmentType }) => ({
            time,
            employmentType,
        })),
        [
            { time: 'Jun 2026 — Present', employmentType: 'Internship' },
            { time: 'Sep 2024 — Dec 2025', employmentType: 'Part-time' },
            { time: 'Jun 2025 — Aug 2025', employmentType: 'Internship' },
            { time: 'Jul 2024 — Aug 2024', employmentType: 'Internship' },
            { time: 'May 2023 — Aug 2023', employmentType: 'Internship' },
        ],
    );
});

test('homepage leads with Rin and one semantic link per work card', () => {
    const source = readSource('../pages/Portfolio.jsx');

    assert.match(source, /portfolioProfile/);
    assert.match(source, /selectedWork/);
    assert.match(source, /experienceTimeline/);
    assert.doesNotMatch(source, /featuredProject|proofPoints/);
    assert.match(source, /profilePhoto/);
    assert.match(source, /portfolioProfile\.hero/);
    assert.match(source, /View my work/);
    assert.doesNotMatch(source, /portfolio-hero-flow/);
    assert.match(source, /selectedWork\.map/);
    assert.match(source, /<Link[^>]*className=[^>]*portfolio-work-card/s);
    assert.match(source, /className="portfolio-work-meta"/);
});

test('homepage portrait uses restrained interactive layers instead of a framed photo card', () => {
    const source = readSource('../pages/Portfolio.jsx');
    const styles = readSource('../css/Portfolio.css');

    assert.match(source, /portraitOutline/);
    assert.match(source, /onPointerMove=\{handlePortraitMove\}/);
    assert.match(source, /onPointerLeave=\{resetPortraitMotion\}/);
    assert.match(source, /className="portfolio-portrait-cutout"/);
    assert.match(source, /portfolio-portrait-outline--front/);
    assert.doesNotMatch(source, /portfolio-portrait-outline--back/);
    assert.doesNotMatch(source, /<figcaption>/);

    assert.match(styles, /\.portfolio-portrait-cutout[^{]*\{[^}]*transform:/s);
    assert.doesNotMatch(styles, /\.portfolio-portrait-outline--back/);
    assert.match(styles, /@media \(max-width:\s*720px\)[\s\S]*\.portfolio-hero-portrait\s*\{[^}]*pointer-events:\s*none/s);
    assert.match(styles, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.portfolio-portrait-cutout,[\s\S]*\.portfolio-portrait-outline\s*\{[^}]*animation:\s*none/s);
});

test('homepage keeps experience disclosure and personal sections understandable', () => {
    const source = readSource('../pages/Portfolio.jsx');

    assert.match(source, /useState\(0\)/);
    assert.match(source, /aria-expanded=/);
    assert.match(source, /aria-controls=/);
    assert.match(source, /role\.employmentType/);
    assert.match(source, /portfolioProfile\.why/);
    assert.match(source, /Photography/);
    assert.match(source, /to="\/space"/);
    assert.match(source, /portfolio-footer[\s\S]*href=\{resumePdf\}/);
});

test('homepage work hierarchy is 70/30 without button-like metadata', () => {
    const styles = readSource('../css/Portfolio.css');
    const metadataRule = styles.match(/\.portfolio-work-meta\s*\{([^}]*)\}/)?.[1];

    assert.match(styles, /grid-template-columns:\s*minmax\(0,\s*7fr\)\s+minmax\(16rem,\s*3fr\)/);
    assert.match(styles, /@media \(max-width:\s*720px\)[\s\S]*\.portfolio-work-grid\s*\{\s*grid-template-columns:\s*1fr/);
    assert.ok(metadataRule, 'portfolio metadata has a dedicated plain-text rule');
    assert.doesNotMatch(metadataRule, /border|background|cursor/);
    assert.doesNotMatch(styles, /\.portfolio-work-meta:(?:hover|focus|active)/);
});

test('homepage migration removes the temporary featured-project export', () => {
    assert.equal('featuredProject' in portfolioData, false);
});

test('case route renders distinct systems and creative narratives', () => {
    const source = readSource('../pages/WorkDetail.jsx');

    assert.match(source, /project\.caseType === 'systems'/);
    assert.match(source, /project\.caseType === 'creative'/);
    assert.match(source, /project\.inProgress\.length/);
    assert.match(source, /className="case-flowchart"/);
    assert.match(source, /className="case-flow-decision"/);
    assert.match(source, /className="case-flow-branches"/);
    assert.match(source, /tabIndex="0"/);
    assert.match(source, /className="case-impact-grid"/);
    assert.match(source, /project\.result\.map/);
    assert.doesNotMatch(source, /case-workflow-steps/);
    assert.doesNotMatch(source, /Next system inside|case-outcomes|500\+|2,500\+|3h\s*→\s*30m/);
});

test('case route preserves direct-navigation and missing-route behavior', () => {
    const source = readSource('../pages/WorkDetail.jsx');

    assert.match(source, /if \(!project\) return <Navigate to="\/" replace \/>/);
    assert.match(source, /document\.title = `\$\{project\.title\} — Rin Qi`/);
    assert.match(source, /\}, \[project\]\)/);
    assert.match(source, /Next case study/);
});

test('case styles distinguish systems evidence, creative process, and unfinished work', () => {
    const styles = readSource('../css/WorkDetail.css');

    assert.match(styles, /\.case-systems-facets/);
    assert.match(styles, /\.case-flowchart/);
    assert.match(styles, /\.case-flow-stage--decision/);
    assert.match(styles, /\.case-flow-node--human/);
    assert.match(styles, /\.case-flow-node--output/);
    assert.match(styles, /\.case-creative-storyboard/);
    assert.match(styles, /\.case-progress/);
    assert.doesNotMatch(styles, /\.case-outcomes/);
});

test('workflow decision branches draw both fan-out and merge connectors', () => {
    const styles = readSource('../css/WorkDetail.css');

    assert.match(styles, /\.case-flow-branches::before\s*\{[^}]*top:[^}]*left:\s*calc\(\(100% - 4rem\) \/ 4\)[^}]*right:\s*calc\(\(100% - 4rem\) \/ 4\)/s);
    assert.match(styles, /\.case-flow-branches \.case-flow-node::before\s*\{[^}]*top:/s);
    assert.match(styles, /\.case-flow-branches::after\s*\{[^}]*bottom:[^}]*left:\s*calc\(\(100% - 4rem\) \/ 4\)[^}]*right:\s*calc\(\(100% - 4rem\) \/ 4\)/s);
    assert.match(styles, /\.case-flow-branches \.case-flow-node::after\s*\{[^}]*bottom:/s);
    assert.match(
        styles,
        /@media \(max-width:\s*820px\)[\s\S]*\.case-flow-branches::after\s*\{[^}]*display:\s*block[^}]*\}[\s\S]*\.case-flow-branches \.case-flow-node::after\s*\{[^}]*display:\s*block/s,
    );
});

test('workflow decisions reserve their visible diamond bounds and connect to the split rail', () => {
    const source = readSource('../pages/WorkDetail.jsx');
    const styles = readSource('../css/WorkDetail.css');

    assert.match(source, /className="case-flow-split-stem"/);
    assert.match(
        styles,
        /\.case-flow-decision\s*\{[^}]*width:\s*10\.47rem[^}]*min-height:\s*10\.47rem/s,
    );
    assert.match(styles, /\.case-flow-split-stem\s*\{[^}]*width:\s*1px[^}]*height:\s*1rem/s);
    assert.match(
        styles,
        /@media \(max-width:\s*820px\)[\s\S]*\.case-flow-decision\s*\{[^}]*width:\s*7\.64rem[^}]*min-height:\s*7\.64rem/s,
    );
});

test('two-column role copy aligns at the top and workflow arrows share one SVG coordinate system', () => {
    const styles = readSource('../css/WorkDetail.css');
    const source = readSource('../pages/WorkDetail.jsx');

    assert.match(styles, /\.case-role \.case-section-copy p \+ p\s*\{[^}]*margin-top:\s*0/s);
    assert.match(source, /<svg[\s\S]*className="case-flow-connector"[\s\S]*viewBox="0 0 16 42"[\s\S]*<path d="M8 0V42M3\.5 37\.5 8 42l4\.5-4\.5"/);
    assert.match(styles, /\.case-flow-connector path\s*\{[^}]*stroke:\s*currentColor[^}]*stroke-width:\s*1/s);
    assert.doesNotMatch(styles, /\.case-flow-connector::after/);
});

test('portfolio and case layouts preserve focus and mobile reading order', () => {
    const portfolioSource = readSource('../pages/Portfolio.jsx');
    const caseSource = readSource('../pages/WorkDetail.jsx');
    const portfolioStyles = readSource('../css/Portfolio.css');
    const caseStyles = readSource('../css/WorkDetail.css');

    for (const styles of [portfolioStyles, caseStyles]) {
        assert.match(styles, /@media \(prefers-reduced-motion:\s*reduce\)/);
        assert.match(styles, /:focus-visible/);
        assert.doesNotMatch(styles, /^\s*width:\s*[4-9]\d{2,}px/m);
    }

    assert.match(portfolioStyles, /@media \(max-width:\s*720px\)/);
    assert.match(caseStyles, /@media \(max-width:\s*820px\)/);
    assert.match(portfolioStyles, /\.portfolio-section\[id\][^{]*\{[^}]*scroll-margin-top:/s);
    assert.match(caseStyles, /#case-content[^{]*\{[^}]*scroll-margin-top:/s);
    assert.match(portfolioStyles, /@media \(max-width:\s*720px\)[\s\S]*\.portfolio-work-grid\s*\{\s*grid-template-columns:\s*1fr/);
    assert.match(caseStyles, /@media \(max-width:\s*820px\)[\s\S]*\.case-systems-facets,[\s\S]*\.case-creative-storyboard\s*\{\s*grid-template-columns:\s*1fr/);
    assert.match(caseStyles, /@media \(max-width:\s*820px\)[\s\S]*\.case-creative-storyboard article\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*5\.5rem 1fr/s);

    for (const source of [portfolioSource, caseSource]) {
        assert.match(source, /event\.preventDefault\(\)/);
        assert.match(source, /target\?\.focus\(\{ preventScroll: true \}\)/);
        assert.match(source, /scrollIntoView\(\{ behavior: 'auto'/);
    }
});

test('document title reflects the current public positioning', () => {
    const source = readSource('../../index.html');

    assert.match(source, /<title>Rin Qi — AI Product &amp; Applied AI<\/title>/);
    assert.doesNotMatch(source, /Forward Deployed Engineer/);
});

test('legacy experience route follows the same public disclosure boundary', () => {
    const source = readSource('../pages/Experience.jsx');

    assert.doesNotMatch(source, /~10|200\+|500\+|2,500\+|3 hours to 30 minutes/i);
    assert.doesNotMatch(source, /golden-question|evaluation framework/i);
});
