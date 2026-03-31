
const servicesData = [
    {
        id: 'software-development',
        icon: <i className="flaticon-software-development"></i>,
        title: 'Software <br/> Development',
        des: 'We design and build scalable, secure, and high-performance software solutions tailored to business needs.',
        mainDescription: 'We design and build scalable, secure, and high-performance software solutions tailored to business needs.',
        subHeading: 'Our Approach',
        subDescription: [
            'At eIntuition, we provide comprehensive software development services designed to meet the evolving needs of modern businesses. Our focus is on building scalable, secure, and high-performance applications that support growth and innovation.',
            'We work closely with clients to understand their business requirements and translate them into powerful software solutions. Whether it is a custom-built platform, a SaaS product, or modernization of legacy systems, our engineering teams ensure that every solution is built with flexibility, scalability, and long-term sustainability in mind.',
            'Our expertise includes developing enterprise-grade applications, integrating complex systems through APIs, and modernizing outdated architectures into cloud-ready, efficient platforms. We follow agile development methodologies, ensuring faster delivery cycles, continuous improvement, and alignment with business objectives.'
        ],
        box1Heading: 'What We Offer',
        box1Description: '',
        box1List: [
            'Custom application development',
            'Enterprise software solutions',
            'SaaS platform development',
            'Legacy system modernization',
            'API development & system integration'
        ],
        box2Heading: '',
        box2Description: '',
        finalDescription: ''
    },
    {
        id: 'web-development',
        icon: <i className="flaticon-global-network"></i>,
        title: 'Web <br/>Development',
        des: 'We create modern, responsive, and high-performing web platforms that drive engagement and conversions.',
        mainDescription: 'We create modern, responsive, and high-performing web platforms that drive engagement and conversions.',
        subHeading: 'Our Approach',
        subDescription: [
            'Our web development services focus on creating modern, responsive, and performance-driven digital experiences. A website today is more than just an online presence—it is a critical business platform that drives engagement, conversions, and brand perception.',
            'At eIntuition, we design and develop websites that are not only visually compelling but also optimized for speed, usability, and scalability. From corporate websites to complex web applications and e-commerce platforms, we ensure that every solution is aligned with business goals and user expectations.',
            'We emphasize intuitive user experience, clean design, and robust architecture. Our development approach ensures seamless performance across devices, strong search engine visibility, and the ability to scale as your business grows.'
        ],
        box1Heading: 'Capabilities',
        box1Description: '',
        box1List: [
            'Corporate websites & platforms',
            'E-commerce development',
            'UI/UX design and optimization',
            'CMS-based development (WordPress, headless CMS)',
            'Performance and SEO optimization'
        ],
        box2Heading: '',
        box2Description: '',
        finalDescription: ''
    },
    {
        id: 'mobile-app-development',
        icon: <i className="flaticon-mobile-app"></i>,
        title: 'Mobile App <br/> Development',
        des: 'We build intuitive, scalable, and feature-rich mobile applications for iOS and Android.',
        mainDescription: [
            'In a mobile-first world, having a powerful and intuitive mobile application is essential for engaging customers and driving business growth. eIntuition specializes in building high-quality mobile applications that deliver seamless user experiences and strong performance.',
            'We build intuitive, scalable, and feature-rich mobile applications for iOS and Android.'
        ],
        subHeading: 'Our Approach',
        subDescription: [
            'We develop both native and cross-platform applications, ensuring compatibility across iOS and Android devices. Our focus is on creating applications that are user-friendly, secure, and scalable.',
            'From concept to deployment, we work closely with clients to design applications that align with their business objectives. Whether it is a customer-facing app or an enterprise mobility solution, we ensure that the final product delivers value, reliability, and long-term usability.'
        ],
        box1Heading: 'Capabilities',
        box1Description: '',
        box1List: [
            'Native and cross-platform development',
            'Enterprise mobility solutions',
            'Customer-facing mobile apps',
            'App modernization and optimization'
        ],
        box2Heading: 'Focus Areas',
        box2Description: '',
        box2List: [
            'User experience (UX) excellence',
            'Performance optimization',
            'Secure and scalable architecture'
        ],
        finalDescription: ''
    },
    {
        id: 'digital-media-analytics',
        icon: <i className="flaticon-analytics"></i>,
        title: 'Digital Media <br/> Analytics',
        des: 'We help organizations unlock the power of data to drive smarter marketing and business decisions.',
        mainDescription: [
            'Data is at the core of modern decision-making, and our digital media analytics services are designed to help organizations unlock actionable insights from their data.',
            'We help organizations unlock the power of data to drive smarter marketing and business decisions.'
        ],
        subHeading: 'Our Approach',
        subDescription: [
            'We enable businesses to track, analyze, and optimize their digital presence across multiple channels. By leveraging advanced analytics tools and methodologies, we provide deep visibility into customer behavior, campaign performance, and market trends.',
            'Our solutions include real-time dashboards, performance tracking systems, and predictive analytics models that help organizations make informed decisions. By transforming raw data into meaningful insights, we empower businesses to improve engagement, optimize strategies, and achieve better outcomes.'
        ],
        box1Heading: 'Capabilities',
        box1Description: '',
        box1List: [
            'Social media analytics',
            'Customer sentiment analysis',
            'Marketing performance tracking',
            'Real-time dashboards and reporting',
            'AI-driven insights and predictions'
        ],
        box2Heading: '',
        box2Description: '',
        finalDescription: ''
    },
    {
        id: 'martech-solutions',
        icon: <i className="flaticon-content-marketing"></i>,
        title: 'Martech <br/> Solutions',
        des: 'Modern marketing requires a strong technology backbone, and our Martech services are designed to help organizations build and optimize their marketing ecosystems.',
        mainDescription: [
            'Modern marketing requires a strong technology backbone, and our Martech services are designed to help organizations build and optimize their marketing ecosystems.',
            'We design and implement marketing technology ecosystems that enable personalized, data-driven customer engagement.'
        ],
        subHeading: 'Our Approach',
        subDescription: [
            'We work with businesses to implement and integrate marketing automation platforms, customer relationship management systems, and personalization tools that enable data-driven customer engagement.',
            'Our approach focuses on creating seamless customer journeys, improving campaign effectiveness, and maximizing return on marketing investments. By aligning technology with marketing strategy, we help organizations deliver consistent, personalized experiences across all touchpoints.'
        ],
        box1Heading: 'Capabilities',
        box1Description: '',
        box1List: [
            'Marketing automation platforms',
            'CRM integration (Salesforce, HubSpot, etc.)',
            'Customer journey orchestration',
            'Campaign management systems',
            'Personalization engines'
        ],
        box2Heading: 'Impact',
        box2Description: '',
        box2List: [
            'Improved customer acquisition',
            'Higher engagement rates',
            'Optimized marketing ROI'
        ],
        finalDescription: ''
    },
    {
        id: 'ai-and-data-engineering',
        icon: <i className="flaticon-data-scientist"></i>,
        title: 'AI & Data <br/> Engineering',
        des: 'Artificial intelligence and data are transforming the way businesses operate, and eIntuition helps organizations harness these technologies effectively.',
        mainDescription: [
            'Artificial intelligence and data are transforming the way businesses operate, and eIntuition helps organizations harness these technologies effectively.',
            'We help organizations leverage AI and data to drive innovation and automation.'
        ],
        subHeading: 'Our Approach',
        subDescription: [
            'We design and implement data platforms, build machine learning models, and develop intelligent automation solutions that enhance efficiency and decision-making.',
            'Our capabilities include predictive analytics, AI-driven insights, conversational AI, and automation of complex processes. By integrating AI into business workflows, we enable organizations to improve performance, reduce costs, and gain a competitive advantage.'
        ],
        box1Heading: 'Capabilities',
        box1Description: '',
        box1List: [
            'Data engineering & data platforms',
            'AI/ML model development',
            'Predictive analytics',
            'Intelligent automation',
            'Conversational AI'
        ],
        box2Heading: '',
        box2Description: '',
        finalDescription: ''
    },
    {
        id: 'digital-transformation-consulting',
        icon: <i className="flaticon-consultant"></i>,
        title: 'Digital Transformation <br/> Consulting',
        des: 'Digital transformation is not just about technology—it is about rethinking how businesses operate and deliver value.',
        mainDescription: 'Digital transformation is not just about technology—it is about rethinking how businesses operate and deliver value.',
        subHeading: 'Our Approach',
        subDescription: [
            'At eIntuition, we guide organizations through their transformation journeys by aligning strategy, technology, and processes. We help businesses modernize their systems, optimize operations, and adopt new ways of working that support innovation and growth.',
            'Our consulting services focus on creating clear roadmaps, enabling smooth transitions, and ensuring that transformation initiatives deliver measurable results.'
        ],
        box1Heading: 'Capabilities',
        box1Description: '',
        box1List: [
            'Digital strategy & roadmap',
            'Technology modernization',
            'Process optimization',
            'Change management',
            'Innovation frameworks'
        ],
        box2Heading: '',
        box2Description: '',
        finalDescription: ''
    },
    {
        id: 'staff-augmentation',
        icon: <i className="flaticon-assistant"></i>,
        title: 'Staff <br/> Augmentation',
        des: 'Scale your team with elite talent to meet project demands and accelerate growth.',
        mainDescription: 'At eIntuition, we understand that building the right team at the right time is critical to the success of any project. Our Staff Augmentation services are designed to help organizations quickly scale their teams with highly skilled professionals who seamlessly integrate into existing workflows and deliver immediate value.',
        subHeading: 'Flexible Talent Solutions',
        subDescription: [
            'We provide access to experienced talent across software engineering, product management, data engineering, AI, quality assurance, and digital transformation. Whether you need short-term support for a critical project or long-term team extension, our flexible engagement models ensure you have the right expertise when you need it.',
            'Our professionals are carefully vetted not only for their technical capabilities but also for their ability to collaborate effectively within your organization. We focus on aligning talent with your business goals, ensuring productivity, efficiency, and high-quality outcomes from day one.',
            'By leveraging our staff augmentation services, organizations can reduce hiring timelines, optimize costs, and maintain agility in an ever-changing business environment—without compromising on quality or performance.'
        ],
        box1Heading: '',
        box1Description: '',
        box2Heading: '',
        box2Description: '',
        finalDescription: ''
    },
    {
        id: 'business-intelligence-and-data-visualization',
        icon: <i className="flaticon-monitoring-software"></i>,
        title: 'Business Intelligence <br/> & Data Visualization',
        des: 'Transform complex data into actionable insights with compelling visual analytics.',
        mainDescription: 'In today’s data-driven world, having access to information is not enough—organizations need the ability to transform data into meaningful insights that drive strategic decisions. eIntuition’s Business Intelligence services enable businesses to harness the full potential of their data through advanced analytics and visualization.',
        subHeading: 'Empowering Decisions through Data',
        subDescription: [
            'We design and implement comprehensive BI solutions that provide real-time visibility into key business metrics, performance indicators, and operational trends. Our approach focuses on creating intuitive dashboards and reporting systems that empower stakeholders at all levels to make informed decisions quickly and confidently.',
            'Our expertise includes data integration from multiple sources, data modeling, dashboard development, and implementation of modern BI tools. We ensure that data is accurate, accessible, and presented in a way that delivers clarity and actionable insights.',
            'By transforming complex data into clear, visual narratives, we help organizations improve decision-making, identify opportunities, and drive continuous improvement across their operations.'
        ],
        box1Heading: '',
        box1Description: '',
        box2Heading: '',
        box2Description: '',
        finalDescription: ''
    }
];

export default servicesData;