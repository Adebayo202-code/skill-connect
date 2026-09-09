import { Link } from "react-router-dom";
import "./JoinNow.css";

const JoinNow = () => {
  return (
    <div className="join-page">

      <div className="join-card">

        <div className="join-header">
          <h1>Join Skill Connect</h1>
          <p>Choose how you want to use Skill Connect</p>
        </div>

        <div className="join-options">

          <Link to="/register/customer" className="join-option">
            <div className="join-icon">
              <i className="fa-solid fa-user"></i>
            </div>

            <div>
              <h3>I'm looking for a professional</h3>
              <p>
                Find trusted professionals for your next project.
              </p>
            </div>

            <i className="fa-solid fa-arrow-right"></i>
          </Link>

          <Link to="/register/professional" className="join-option">
            <div className="join-icon">
              <i className="fa-solid fa-briefcase"></i>
            </div>

            <div>
              <h3>I'm a professional</h3>
              <p>
                Offer your skills and connect with new customers.
              </p>
            </div>

            <i className="fa-solid fa-arrow-right"></i>
          </Link>

        </div>

        <div className="join-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default JoinNow;