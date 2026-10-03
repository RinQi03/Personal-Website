export const portfolioProfile = {
    hero: {
        eyebrow: 'AI Product Manager Intern at Lingxi Games · Guangzhou, China',
        title: 'Hi, I’m Rin.',
        summary: 'I build AI tools for marketing teams. My work includes automating recurring tasks and organizing the knowledge those tools need.',
    },
    why: {
        title: 'Why this work',
        paragraphs: [
            'I enjoy trying new AI tools and figuring out where they’re useful.',
            'I also want them to take repetitive work off people’s hands, leaving more time for decisions and creative work.',
        ],
    },
};

export const selectedWork = [
    {
        slug: 'ai-systems-for-marketing-teams',
        index: '01',
        prominence: 'featured',
        label: 'Current work · Lingxi Games',
        title: 'AI Systems for Marketing Teams',
        summary: 'Turning routine work into AI workflows the whole team can use.',
        metadata: 'Workflow design · Agent skills · Knowledge systems',
        caseType: 'systems',
        context: 'Lingxi Games, Alibaba Group · AI Product Manager Internship · 2026',
        problem: [
            'Much of the team’s research was still done by hand. People had very different levels of experience with AI.',
            'I built reusable skills with the team’s procedures and context, so colleagues could use them without setting everything up themselves.',
        ],
        role: [
            'Mapped team tasks and defined each workflow’s scope.',
            'Built agent skills with SOPs, connected tools, and report templates.',
            'Organized shared knowledge and its maintenance.',
        ],
        built: [
            {
                title: 'Reusable AI workflows',
                description: 'Packaged standard operating procedures, business context, tools, structured outputs, and review points into repeatable agent workflows.',
            },
            {
                title: 'Supporting knowledge systems',
                description: 'Organized shared context so workflows could retrieve maintained knowledge instead of relying on one-off prompts or individual setup.',
            },
        ],
        visualization: {
            title: 'Example: competitive research',
            description: 'A permission-aware workflow turns an open research request into a source-backed report.',
            stages: [
                {
                    id: 'brief',
                    type: 'action',
                    kicker: 'Input',
                    label: 'Trigger skill + define brief',
                    mobileLabel: 'Define brief',
                    detail: 'Set the research question, scope, and expected output.',
                },
                {
                    id: 'target',
                    type: 'decision',
                    question: 'Competitor specified?',
                    mobileQuestion: 'Target given?',
                    detail: 'Determine whether the request already names a research target.',
                    branches: [
                        {
                            id: 'named-target',
                            path: 'Yes',
                            label: 'Use named target',
                            mobileLabel: 'Use target',
                            detail: 'Continue with the competitor selected by the user.',
                        },
                        {
                            id: 'resolve-context',
                            path: 'No',
                            label: 'Resolve from permitted context',
                            mobileLabel: 'Find from context',
                            detail: 'Check permitted personal memory first, then the user’s team knowledge base, and propose relevant options.',
                            tags: ['Personal memory', 'Team knowledge'],
                        },
                    ],
                },
                {
                    id: 'confirm',
                    type: 'human',
                    kicker: 'HITL',
                    label: 'Confirm target + scope',
                    mobileLabel: 'Confirm scope',
                    detail: 'The market team confirms the competitor and research scope before retrieval begins.',
                },
                {
                    id: 'knowledge',
                    type: 'decision',
                    question: 'Fresh knowledge available?',
                    mobileQuestion: 'Knowledge fresh?',
                    detail: 'Check whether existing competitor information is recent enough for the brief.',
                    branches: [
                        {
                            id: 'reuse-knowledge',
                            path: 'Yes',
                            label: 'Reuse maintained knowledge',
                            mobileLabel: 'Reuse knowledge',
                            detail: 'Pull current updates, sentiment, and context from the knowledge base.',
                        },
                        {
                            id: 'search-sources',
                            path: 'No / stale',
                            label: 'Search approved sources',
                            mobileLabel: 'Search sources',
                            detail: 'Search and summarize the platforms and accounts specified by the knowledge base.',
                        },
                    ],
                },
                {
                    id: 'analyze',
                    type: 'action',
                    kicker: 'Method',
                    label: 'Analyze with team SOP',
                    mobileLabel: 'Analyze',
                    detail: 'Synthesize the evidence using the research method packaged in the skill.',
                },
                {
                    id: 'report',
                    type: 'output',
                    kicker: 'Output',
                    label: 'Deliver structured report',
                    mobileLabel: 'Deliver report',
                    detail: 'Fill the standard report template and return the result to the user.',
                },
            ],
        },
        result: [
            {
                label: 'Before',
                detail: 'Manual research. Individual AI setup.',
            },
            {
                label: 'With the workflow',
                detail: 'Shared skills. Built-in context. A standard report.',
            },
            {
                label: 'Human role',
                detail: 'The market team checks the evidence and makes the decisions.',
            },
        ],
        inProgress: [
            'Designed a golden-question evaluation framework for assessing answer quality; implementation is in progress.',
        ],
    },
    {
        slug: 'aigc-creative-production',
        index: '02',
        prominence: 'secondary',
        label: 'Marketing Internship · 2025',
        title: 'AIGC Creative Production',
        summary: 'AI images and videos for a company-run Douyin account.',
        metadata: 'AI image generation · AI video generation',
        caseType: 'creative',
        context: 'Lingxi Games, Alibaba Group · Marketing Internship · 2025',
        problem: [
            'I contributed AI-generated images and videos to the first eight posts on Jiaoyimao’s company-run Douyin account during my internship at Lingxi Games.',
        ],
        media: [
            {
                title: 'Account theft',
                originalTitle: '敢盗账号？看本猫怎么去收拾他？',
                url: 'https://www.douyin.com/video/7537270432739740938',
                embedUrl: 'https://open.douyin.com/player/video?vid=7537270432739740938&autoplay=0',
            },
            {
                title: 'Account recovery',
                originalTitle: '捆绑play！盗号的最后都变成烤乳猪了',
                url: 'https://www.douyin.com/video/7539863271050923291',
                embedUrl: 'https://open.douyin.com/player/video?vid=7539863271050923291&autoplay=0',
            },
        ],
        account: {
            url: 'https://www.douyin.com/user/MS4wLjABAAAAnzxjiudNGwO5oysVhk8DUuishWK2EZ3R29waiyh1kHIPwzDV7KCsxB2XbbgcCqKS',
            checkedAt: '2026-10-03',
            metrics: [
                { label: 'Posts', value: '13' },
                { label: 'Followers', value: '659' },
                { label: 'Likes', value: '1,842' },
            ],
        },
    },
];

export const experienceTimeline = [
    {
        time: 'Jun 2026 — Present',
        title: 'AI Product Manager Intern',
        company: 'Lingxi Games, Alibaba Group',
        employmentType: 'Internship',
        summary: 'AI tools for the market team.',
        details: [
            'Built reusable skills for research, copywriting, and game-trend monitoring.',
            'Organized the knowledge those workflows retrieve and use.',
        ],
        relatedWorkSlug: 'ai-systems-for-marketing-teams',
    },
    {
        time: 'Sep 2024 — Dec 2025',
        title: 'CS, Math & Accounting Tutor',
        company: 'New York University',
        employmentType: 'Part-time',
        summary: 'Supported students through structured tutoring, technical workshops, and exam reviews.',
        details: [
            'Explained concepts in computer science, math, and accounting.',
        ],
    },
    {
        time: 'Jun 2025 — Aug 2025',
        title: 'Marketing Intern',
        company: 'Lingxi Games, Alibaba Group',
        employmentType: 'Internship',
        summary: 'Contributed AI-generated images and videos to a company-run Douyin account.',
        details: [
            'Participated in AI generation for the account’s first eight posts.',
        ],
        relatedWorkSlug: 'aigc-creative-production',
    },
    {
        time: 'Jul 2024 — Aug 2024',
        title: 'Research Intern',
        company: 'Ascent Partners Foundation',
        employmentType: 'Internship',
        summary: 'Produced literature analyses on climate change and Doughnut Economics.',
        details: [
            'Summarized academic findings for non-specialist readers.',
        ],
    },
    {
        time: 'May 2023 — Aug 2023',
        title: 'Summer Analyst',
        company: 'Cypress Capital International',
        employmentType: 'Internship',
        summary: 'Worked on due diligence, industry research, and equity analysis across logistics and EV batteries.',
        details: [
            'Researched companies and analyzed financial information.',
        ],
    },
];
