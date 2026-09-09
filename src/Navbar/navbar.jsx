import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">

        <div className="logo">
          <div className="logo-icon">S</div>
          <h2>SkillConnect</h2>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
         <Link to="/find-professionals">Find Professionals</Link>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="login-btn">
             Login
             </Link>
              <Link to="/join-now" className="join-btn">
                Join Now
              </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;