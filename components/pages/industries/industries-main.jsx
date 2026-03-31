import React from 'react';

const IndustriesMain = () => {
    return (
        <div className="industries__area section-padding">
            <div className="container">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-xl-8 col-lg-10">
                        <div className="section-title">
                            <span className="subtitle-one">Industries We Serve</span>
                            <h2>Tailored Solutions for Your Sector</h2>
                            <p className="mt-4">
                                eIntuition works across a diverse range of industries, bringing tailored solutions that address specific challenges and opportunities within each sector.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row gy-4">
                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="services__two-single-service" style={{ height: "100%" }}>
                            <div className="services__two-single-service-icon">
                                <i className="flaticon-global-network"></i>
                            </div>
                            <div className="services__two-single-service-content" style={{ marginTop: "20px" }}>
                                <h4>Aviation & Transportation</h4>
                                <p style={{ marginTop: "10px" }}>We have experience supporting organizations in aviation and transportation, helping them modernize operations and enhance customer experiences.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="services__two-single-service" style={{ height: "100%" }}>
                            <div className="services__two-single-service-icon">
                                <i className="flaticon-analytics"></i>
                            </div>
                            <div className="services__two-single-service-content" style={{ marginTop: "20px" }}>
                                <h4>Retail & Consumer Insights</h4>
                                <p style={{ marginTop: "10px" }}>In retail and consumer insights, we enable businesses to leverage data and digital platforms to better understand and engage their customers.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="services__two-single-service" style={{ height: "100%" }}>
                            <div className="services__two-single-service-icon">
                                <i className="flaticon-software-development"></i>
                            </div>
                            <div className="services__two-single-service-content" style={{ marginTop: "20px" }}>
                                <h4>Healthcare</h4>
                                <p style={{ marginTop: "10px" }}>Our work in healthcare focuses on improving efficiency, data management, and patient experience through technology solutions.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="services__two-single-service" style={{ height: "100%" }}>
                            <div className="services__two-single-service-icon">
                                <i className="flaticon-it"></i>
                            </div>
                            <div className="services__two-single-service-content" style={{ marginTop: "20px" }}>
                                <h4>Financial Services</h4>
                                <p style={{ marginTop: "10px" }}>In financial services, we support organizations in building secure, scalable systems that enhance operational efficiency and customer trust.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="services__two-single-service" style={{ height: "100%" }}>
                            <div className="services__two-single-service-icon">
                                <i className="flaticon-consultant"></i>
                            </div>
                            <div className="services__two-single-service-content" style={{ marginTop: "20px" }}>
                                <h4>Startups & Growth</h4>
                                <p style={{ marginTop: "10px" }}>We also work with startups and growing businesses, helping them build scalable products, validate ideas, and accelerate their growth journey.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndustriesMain;
