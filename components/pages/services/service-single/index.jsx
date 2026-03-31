"use client"
import SEO from "@/components/data/seo";
import HeaderOne from "@/components/layout/headers/header/header-one";
import BreadCrumb from "../../common/breadcrumb";
import ServicesSingleMain from "./services-single";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const ServicesSingle = ({serviceDetails}) => {
    return (
        <>
            <SEO pageTitle={serviceDetails?.title.replace(/<[^>]+>/g, ' ')} />            
            <HeaderOne />
            <BreadCrumb title={serviceDetails?.title.replace(/<[^>]+>/g, ' ')} innerTitle={serviceDetails?.title.replace(/<[^>]+>/g, ' ')} parentTitle="Our Services" parentLink="/services" />
            <ServicesSingleMain fullTitle={serviceDetails?.title.replace(/<[^>]+>/g, ' ')} serviceDetails={serviceDetails}/>
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default ServicesSingle;