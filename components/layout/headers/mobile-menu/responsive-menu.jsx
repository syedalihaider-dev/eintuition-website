"use client"
import Link from 'next/link';
import React, { useState } from 'react';

const ResponsiveMenu = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const active = (value) => setActiveMenu(value === activeMenu ? null : value),
    activeIcon = (value) => (activeMenu == value ? "mean-clicked" : ""),
    activeSubMenu = (value) => value == activeMenu ? { display: "block" } : { display: "none" };

    const [activeMenus, setActiveMenus] = useState(null);
    const actives = (value) => setActiveMenus(value === activeMenus ? null : value),
    activeIcons = (value) => (activeMenus == value ? "mean-clicked" : ""),
    activeSubMenus = (value) => value == activeMenus ? { display: "block" } : { display: "none" };
  return (
        <>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>  
                <li>
                    <Link href="/about">About Us</Link>
                </li>
                <li className='menu-item-has-children'><Link href='/services'>Services</Link>
                    <ul className='sub-menu' style={activeSubMenu("services")}>
                        <li><Link href="/services/digital-media-analytics">Digital Media Analytics</Link></li>
                        <li><Link href="/services/martech">MarTech</Link></li>
                        <li><Link href="/services/ui-ux">UI/UX</Link></li>
                        <li><Link href="/services/application-development-modernization">Application Development & Modernization</Link></li>
                    </ul>
                    <a className={`mean-expand ${activeIcon("services")}`} onClick={() => active("services")}></a>
                </li>
                <li><Link href="/contact">Contact</Link></li>   
            </ul>  
        </>
    );
};

export default ResponsiveMenu;