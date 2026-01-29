import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">🏥</span>
          <div className="logo-text">
            <h1>Medi-Plain</h1>
            <p>Patient-Owned Digital Health</p>
          </div>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <a href="#home" className="nav-link">Home</a>
          <a href="#dashboard" className="nav-link">Dashboard</a>
          <a href="#reports" className="nav-link">Reports</a>
          <a href="#summary" className="nav-link">Health Summary</a>
          <a href="#settings" className="nav-link">Settings</a>
        </div>

        <button 
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
