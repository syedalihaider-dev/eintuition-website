import ServicesDetails from '../../../../public/assets/img/service/service-details.png';
import image1 from '../../../../public/assets/img/icon/service-details-icon-2.png';
import image2 from '../../../../public/assets/img/icon/service-details-icon.png';

const ServicesSingleMain = ({fullTitle, serviceDetails}) => {
    return (
        <>
        <div className="service__details section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="service__details-thumb">
                            <img src={ServicesDetails.src} alt="image" />
                            <div className="service__details-thumb-icon">
                                <div className="service__details-thumb-icon-wrapper">
                                    <img src={image1.src} alt="image" />
                                </div>
                            </div>
                        </div>
                        <div className="service__details-content">
                            <h2>Reach New Heights with {fullTitle}</h2>
                            {Array.isArray(serviceDetails?.mainDescription) 
                                ? serviceDetails.mainDescription.map((desc, idx) => <p key={idx}>{desc}</p>)
                                : <p>{serviceDetails?.mainDescription}</p>
                            }
    
                            <h3 className="sub-heading">{serviceDetails?.subHeading || "Transform Your Brand's Digital Future"}</h3>
                            {Array.isArray(serviceDetails?.subDescription) 
                                ? serviceDetails.subDescription.map((desc, idx) => <p key={idx}>{desc}</p>)
                                : <p>{serviceDetails?.subDescription}</p>
                            }
    
                            <div className="service__details-content-box">
                                {(serviceDetails?.box1Heading || serviceDetails?.box1Description || serviceDetails?.box1List) && (
                                    <div className="service__details-content-box-single">
                                        {serviceDetails?.box1Heading && <h4>{serviceDetails.box1Heading}</h4>}
                                        {serviceDetails?.box1Description && <p>{serviceDetails.box1Description}</p>}
                                        {serviceDetails?.box1List && (
                                            <ul className="service-qualities">
                                                {serviceDetails.box1List.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                                {(serviceDetails?.box2Heading || serviceDetails?.box2Description || serviceDetails?.box2List) && (
                                    <div className="service__details-content-box-single">
                                        <div className="icon">
                                            <img src={image2.src} alt="image" />
                                        </div>
                                        {serviceDetails?.box2Heading && <h4 className="mb-4">{serviceDetails.box2Heading}</h4>}
                                        {serviceDetails?.box2Description && <p className="m-0">{serviceDetails.box2Description}</p>}
                                        {serviceDetails?.box2List && (
                                            <ul className="service-qualities mt-3">
                                                {serviceDetails.box2List.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                            {serviceDetails?.finalDescription && <p>{serviceDetails.finalDescription}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>       
        </>
    );
};

export default ServicesSingleMain;