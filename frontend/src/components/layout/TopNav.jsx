import { NavLink } from "react-router-dom";

function navClass({ isActive }) {
  return isActive ? "topnav-link active" : "topnav-link";
}

export default function TopNav() {
  return (
    <header className="topnav">
      <div className="topnav-left">
        <NavLink to="/" className="topnav-brand">
          Photocard Tracker
        </NavLink>

        <nav className="topnav-links">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/inbox" className={navClass}>
            Inbox
          </NavLink>
          <NavLink to="/library" className={navClass}>
            Library
          </NavLink>
        </nav>
      </div>

      <div className="topnav-right">
        <NavLink to="/admin" className={navClass}>
          Admin
        </NavLink>
      </div>
    </header>
  );
}