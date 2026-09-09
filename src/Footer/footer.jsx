import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>Skill<span>Connect</span></h2>

          <p>
            Connecting you with trusted professionals
            for all your everyday needs.
          </p>

          <div className="social-icons">
            <a href="#">
              <i className="fa-brands fa-facebook-f"></i>
            </a>

            <a href="#">
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a href="#">
              <i className="fa-brands fa-x-twitter"></i>
            </a>

            <a href="#">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h3>Company</h3>

          <a href="#">About Us</a>
          <a href="#">How It Works</a>
          <a href="#">Contact Us</a>
          <a href="#">Careers</a>
        </div>

        {/* Services */}
        <div className="footer-column">
          <h3>Services</h3>

          <a href="#">Find a Professional</a>
          <a href="#">Become a Professional</a>
          <a href="#">Popular Services</a>
          <a href="#">Reviews</a>
        </div>

        {/* Support */}
        <div className="footer-column">
          <h3>Support</h3>

          <a href="#">Help Center</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">FAQs</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Skill Connect. All rights reserved.</p>

        <p>
          Made with <i className="fa-regular fa-heart"></i> for connecting people with great skills.
        </p>
      </div>
    </footer>
  );
};

export default Footer;