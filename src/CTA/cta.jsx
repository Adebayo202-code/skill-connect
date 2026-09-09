import { Link } from "react-router-dom";
import "./cta.css";

const CTA = () => {
  return (
    <section className="cta">
      <div className="cta-content">
        <p className="cta-small">Get started today</p>

        <h2>
          Ready to find the right
          <br />
          professional?
        </h2>

        <span>
          Connect with skilled and trusted professionals
          <br />
          who are ready to help you.
        </span>

        <div className="cta-buttons">
          <Link to="/find-professionals" className="cta-primary">
           Find a Professional
          <i className="fa-solid fa-arrow-right"></i>
         </Link>

          <button className="cta-secondary">
            Become a Professional
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;