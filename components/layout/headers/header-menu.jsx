import Link from 'next/link';
import servicesData from '../../data/services-data';

const MainMenu = () => {
    return (
        <>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li className="menu-item-has-children">
                    <Link href="/about">About Us</Link>
                    {/* <ul className="sub-menu">
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/testimonial">Testimonials</Link></li>
                        <li><Link href="/pricing-plan">Pricing Plan</Link></li>
                        <li><Link href="/faq">Faq</Link></li>
                        <li className="menu-item-has-children"><Link href="#">Team<i className="fas fa-angle-right"></i></Link>
                            <ul className="sub-menu">
                                <li><Link href="/team">Team Style 01</Link></li>
                                <li><Link href="/team-two">Team Style 02</Link></li>
                            </ul>
                        </li>
                        <li><Link href="/request-quote">Request Quote</Link></li>
                        <li><Link href="/404">404</Link></li>
                    </ul> */}
                </li>
                <li className="menu-item-has-children">
                    <Link href="/services">Services <i className="fas fa-angle-down"></i></Link>
                    <ul className="sub-menu">
                        {servicesData.map((item, index) => (
                            <li key={index}><Link href={`/services/${item.id}`}>{item.title.replace(/<[^>]+>/g, ' ')}</Link></li>
                        ))}
                    </ul>
                </li>
                <li>
                    <Link href="/industries">Industries</Link>
                </li>
                <li>
                    <Link href="/case-studies">Case Studies</Link>
                </li>
                {/* <li className="menu-item-has-children"><Link href="#">Portfolio <i className="fas fa-angle-down"></i></Link>
                    <ul className="sub-menu">
                        <li><Link href="/portfolio/2-columns">2 Columns</Link></li>
                        <li><Link href="/portfolio/3-columns">3 Columns</Link></li>
                        <li><Link href="/portfolio/gateway-integration">Portfolio Details</Link></li>
                    </ul>
                </li> */}
                {/* <li className="menu-item-has-children"><Link href="#">Blog <i className="fas fa-angle-down"></i></Link>
                    <ul className="sub-menu">
                        <li><Link href="/blog">Blog Grid</Link></li>
                        <li><Link href="/blog-standard">Blog Standard</Link></li>
                        <li><Link href="/blog/ux-ui-designing-the-future-web-design">Blog Details</Link></li>
                    </ul>
                </li> */}
                <li><Link href="/contact">Contact</Link></li>
            </ul>
        </>
    );
};

export default MainMenu;