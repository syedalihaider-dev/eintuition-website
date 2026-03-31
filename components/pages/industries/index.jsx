import SEO from "@/components/data/seo";
import HeaderOne from "@/components/layout/headers/header/header-one";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import IndustriesMain from "@/components/pages/industries/industries-main";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";

const IndustriesPage = () => {
    return (
        <>
            <SEO pageTitle="Industries" />
            <HeaderOne />
            <BreadCrumb title="Industries" innerTitle="Our Industries" />
            <IndustriesMain />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default IndustriesPage;
