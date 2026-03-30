import image1 from "../../../../public/assets/img/why-choose-us/why-choose.png";
import image2 from "../../../../public/assets/img/shape/why-choose-shape.png";

const ChooseUs = () => {
    return (
        <>
            <div className="why-choose-us__one section-padding">
                <div className="container">
                    <div className="row gy-4 align-items-center">
                        <div className="col-xl-6 col-lg-7 col-md-9">
                            <div className="why-choose-us__one-left">
                                <div className="why-choose-us__one-title">
                                    <span className="subtitle-one">End-to-End Digital Expertise</span>
                                    <h2>Expertise & Solutions</h2>
                                    <p>
                                        Our expertise spans across the entire digital ecosystem, enabling us to deliver end-to-end solutions:
                                        <br /><br />
                                        We design and develop robust software platforms, build high-performing web and mobile applications, implement advanced analytics solutions, and create integrated marketing technology ecosystems that enhance customer engagement and business performance.
                                        <br /><br />
                                        With a strong focus on innovation and scalability, we ensure every solution is built to support long-term growth.
                                    </p>
                                    <h4 className="mb-3">Our Core Capabilities</h4>
                                </div>
                                <div className="about__one-content-service">
                                    <div className="service">
                                        <i className="far fa-check-circle"></i>
                                        <span>Software Development</span>
                                    </div>
                                    <div className="service">
                                        <i className="far fa-check-circle"></i>
                                        <span>Web Development</span>
                                    </div>
                                    <div className="service">
                                        <i className="far fa-check-circle"></i>
                                        <span>Mobile App Development</span>
                                    </div>
                                    <div className="service">
                                        <i className="far fa-check-circle"></i>
                                        <span>Digital Media Analytics</span>
                                    </div>
                                    <div className="service">
                                        <i className="far fa-check-circle"></i>
                                        <span>Martech Solutions</span>
                                    </div>
                                    <div className="service">
                                        <i className="far fa-check-circle"></i>
                                        <span>AI & Data Engineering</span>
                                    </div>
                                    <div className="service">
                                        <i className="far fa-check-circle"></i>
                                        <span>Digital Transformation Consulting</span>
                                    </div>
                                    <div className="service">
                                        <i className="far fa-check-circle"></i>
                                        <span>Staff Augmentation</span>
                                    </div>
                                    <div className="service">
                                        <i className="far fa-check-circle"></i>
                                        <span>Business Intelligence & Data Visualization</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 offset-xl-1 col-lg-6 col-md-10">
                            <div className="why-choose-us__one-image">
                                <div className="why-choose-us__one-image-shape">
                                    <div className="shape shape-1 animate-x-axis"></div>
                                    <div className="shape shape-2 animate-x-axis"></div>
                                    <img src={image2.src} alt="image" className="shape shape-3 animate-y-axis" />
                                </div>
                                <img src={image1.src} alt="image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChooseUs;