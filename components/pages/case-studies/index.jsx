import SEO from "@/components/data/seo";
import HeaderOne from "@/components/layout/headers/header/header-one";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import CaseStudiesMain from "@/components/pages/case-studies/case-studies-main";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";

const CaseStudiesPage = () => {
    return (
        <>
            <SEO pageTitle="Case Studies" />
            <HeaderOne />
            <BreadCrumb title="Case Studies" innerTitle="Recent Projects" />
            <CaseStudiesMain />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default CaseStudiesPage;
