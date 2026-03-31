import React from 'react';

const CaseStudiesMain = () => {
    return (
        <div className="case-studies__area section-padding">
            <div className="container">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-xl-8 col-lg-10">
                        <div className="section-title">
                            <span className="subtitle-one">Success Stories</span>
                            <h2>Bringing Strategic Visions to Life</h2>
                            <p className="mt-4">
                                Our projects demonstrate our commitment to bridging the gap between strategic vision and execution, delivering measurable results across diverse sectors.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row gy-5">
                    <div className="col-xl-12">
                        <div className="case-study-item p-5 border rounded shadow-sm">
                            <div className="row align-items-center">
                                <div className="col-lg-12">
                                    <span className="subtitle-one mb-2 d-block">Digital Product Transformation</span>
                                    <h3>Enterprise Product Transformation</h3>
                                    <p className="mt-3">
                                        We led the transformation of a large-scale digital product portfolio, implementing modern technologies and improving operational efficiency. The result was a more scalable, high-performing platform that supported business growth and improved customer engagement.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-12">
                        <div className="case-study-item p-5 border rounded shadow-sm" style={{ backgroundColor: '#f9f9f9' }}>
                            <div className="row align-items-center">
                                <div className="col-lg-12">
                                    <span className="subtitle-one mb-2 d-block">Data & AI</span>
                                    <h3>AI-Powered Analytics Implementation</h3>
                                    <p className="mt-3">
                                        We designed and implemented an advanced analytics solution that enabled real-time insights and predictive capabilities. This helped the organization make faster, data-driven decisions and significantly improved operational efficiency.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-12">
                        <div className="case-study-item p-5 border rounded shadow-sm">
                            <div className="row align-items-center">
                                <div className="col-lg-12">
                                    <span className="subtitle-one mb-2 d-block">Cloud & Infrastructure</span>
                                    <h3>Digital Modernization Initiative</h3>
                                    <p className="mt-3">
                                        We supported an organization in transitioning from legacy systems to modern, cloud-based architecture. This transformation improved system performance, reduced operational costs, and enabled faster delivery of new capabilities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseStudiesMain;
