import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiBookOpen,
  FiUsers,
  FiBook,
  FiCode,
  FiSettings,
} from "react-icons/fi";
import "./Sidebar.scss";

const Sidebar = () => {
  return (
    <div className="classroom_library_sidebar">
      
      <div className="classroom_library_sidebar_main">
        
        <NavLink
          to="/classroom/library/created-by-me"
          className="classroom_library_sidebar_main_item"
          activeClassName="active"
          activeKey="/classroom/library/created-by-me"
        >
          <FiCompass />
          <span className="classroom_sidebar_main_title">Created By Me</span>
        </NavLink>
        <NavLink
          to="/classroom/library/important"
          className="classroom_library_sidebar_main_item"
          activeClassName="active"
        >
          <FiBookOpen />
          <span className="classroom_sidebar_main_title">Important</span>
        </NavLink>
        <NavLink
          to="/classroom/library/liked"
          className="classroom_library_sidebar_main_item"
          activeClassName="active"
        >
          <FiUsers />
          <span className="classroom_sidebar_main_title">Liked By Me</span>
        </NavLink>
        <NavLink
          to="/classroom/library/all"
          className="classroom_library_sidebar_main_item"
          activeClassName="active"
        >
          <FiBook />
          <span className="classroom_sidebar_main_title">All My Content</span>
        </NavLink>
       
        
      </div>
    </div>
  );
};

export default Sidebar;
