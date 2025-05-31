
import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconHome, IconBookOpen, IconLightBulb, IconLeaf, IconPlusCircle, IconPhotograph } from './icons'; // Added IconPhotograph

const Header: React.FC = () => {
  const commonLinkClasses = "flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-green-light-hover hover:text-brand-green-dark transition-colors";
  const activeLinkClasses = "bg-brand-green text-white";
  const inactiveLinkClasses = "text-white hover:text-brand-green-dark";

  return (
    <header className="bg-brand-green-dark shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center text-white">
              <IconLeaf className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl tracking-tight">คลังความรู้เกษตร Infographic </span>
            </NavLink>
          </div>
          <nav className="flex space-x-2 items-center">
            <NavLink
              to="/"
              className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
            >
              <IconHome className="mr-2 h-5 w-5" />
              หน้าแรก
            </NavLink>
            <NavLink
              to="/infographics" // New link for Infographics page
              className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
            >
              <IconPhotograph className="mr-2 h-5 w-5" />
              Infographics
            </NavLink>
            <NavLink
              to="/articles"
              className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
            >
              <IconBookOpen className="mr-2 h-5 w-5" />
              บทความ
            </NavLink>
            <NavLink
              to="/technology"
              className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
            >
              <IconLightBulb className="mr-2 h-5 w-5" />
              เทคโนโลยี
            </NavLink>
            <NavLink
              to="/admin"
              className="ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium text-brand-green-dark bg-yellow-300 hover:bg-yellow-400 transition-colors"
            >
              <IconPlusCircle className="mr-2 h-5 w-5" />
              เพิ่มข้อมูล
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
