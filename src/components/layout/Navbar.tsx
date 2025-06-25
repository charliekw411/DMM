// src/components/layout/Navbar.tsx
import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  { name: "Project", path: "/project" },
  { name: "Architecture Diagram", path: "/diagram" },
  { name: "Modules", path: "/modules" },
  { name: "Patterns", path: "/patterns" },
];

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow">
      <ul className="flex space-x-6">
        {tabs.map((tab) => (
          <li key={tab.name}>
            <NavLink
              to={tab.path}
              className={({ isActive }) =>
                `text-sm font-medium hover:underline ${isActive ? "underline text-blue-300" : "text-white"}`
              }
            >
              {tab.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;