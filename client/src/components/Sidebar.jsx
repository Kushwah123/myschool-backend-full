import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ links }) => {
  return (
    <aside className="bg-gray-800 text-white w-64 h-screen p-4 hidden md:block fixed">
      <ul className="space-y-4">
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.path} className="hover:bg-gray-700 p-2 block rounded">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;