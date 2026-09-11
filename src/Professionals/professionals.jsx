import { Link } from "react-router-dom";
import "./professionals.css";

const Professionals = () => {
  const professionals = [
    {
      image: "/Electrician.png",
      name: "John Ade",
      skill: "Electrician",
      rating: "4.9",
      location: "Lagos",
    },
    {
      image: "/plumber.jpg",
      name: "Michael James",
      skill: "Plumber",
      rating: "4.8",
      location: "Ibadan",
    },
    {
      image: "/mechanic.jpg",
      name: "David Samuel",
      skill: "Mechanic",
      rating: "4.9",
      location: "Abuja",
    },
    {
      image: "/barber.png",
      name: "Daniel Smith",
      skill: "Barber",
      rating: "4.7",
      location: "Lagos",
    },
  ];

  return (
    <section className="professionals">
      <div className="professionals-header">
        <div>
          <p>Meet our experts</p>
          <h2>Featured Professionals</h2>
          <span>
            Connect with skilled and trusted professionals near you.
          </span>
        </div>

           <Link to="/find-professionals" className="view-all">
          View all professionals
          <i className="fa-solid fa-arrow-right"></i>
           </Link>
        
      </div>

      <div className="professionals-grid">
        {professionals.map((professional, index) => (
          <div className="professional-card" key={index}>
            
            <div className="professional-image">
              <img
                src={professional.image}
                alt={professional.name}
              />

              <span className="verified">
                <i className="fa-solid fa-circle-check"></i>
                Verified
              </span>
            </div>

            <div className="professional-info">
              <h3>{professional.name}</h3>

              <p className="professional-skill">
                {professional.skill}
              </p>

              <div className="professional-details">
                <span>
                  <i className="fa-solid fa-star"></i>
                  {professional.rating}
                </span>

                <span>
                  <i className="fa-solid fa-location-dot"></i>
                  {professional.location}
                </span>
              </div>

              <button className="profile-btn">
                View Profile
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Professionals;