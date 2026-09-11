import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase";
import API_URL from "../api";
import "./ProfessionalProfile.css";

const ProfessionalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const [professional, setProfessional] = useState(null);
  const [customer, setCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [service, setService] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");

  // =========================================
  // GET PROFESSIONAL FROM MONGODB
  // =========================================
  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/professionals/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Professional not found"
          );
        }

        console.log(
          "Professional from MongoDB:",
          data
        );

        setProfessional(data);

        // Automatically select the professional's skill
        setService(data.skill || "");
      } catch (error) {
        console.error(
          "Professional profile error:",
          error
        );

        setError(
          error.message ||
            "Failed to load professional."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  // =========================================
  // GET CURRENT CUSTOMER
  // =========================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          return;
        }

        try {
          const response = await fetch(
            `${API_URL}/api/users/uid/${firebaseUser.uid}`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Customer profile not found"
            );
          }

          if (data.role === "customer") {
            setCustomer(data);
          }
        } catch (error) {
          console.error(
            "Customer profile error:",
            error
          );
        }
      }
    );

    return () => unsubscribe();
  }, [auth]);

  // =========================================
  // SEND BOOKING REQUEST
  // =========================================
  const handleBooking = async (e) => {
    e.preventDefault();

    setError("");

    if (!customer) {
      setError(
        "Please login as a customer before sending a request."
      );
      return;
    }

    if (!professional) {
      setError(
        "Professional information is not available."
      );
      return;
    }

    if (!service) {
      setError(
        "Please select a service."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Please describe what you need."
      );
      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        `${API_URL}/api/job-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customer: customer._id,

            professional:
              professional.user._id,

            service: service,

            description:
              description.trim(),

            location:
              customer.location ||
              "Location not provided",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send booking request."
        );
      }

      console.log(
        "Booking request created:",
        data
      );

      alert(
        "Booking request sent successfully!"
      );

      // Go to customer requests
      navigate("/customer-requests");

    } catch (error) {
      console.error(
        "Booking request error:",
        error
      );

      setError(
        error.message ||
          "Failed to send booking request."
      );
    } finally {
      setSending(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="profile-not-found">
        <h2>
          Loading professional...
        </h2>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================
  if (error && !professional) {
    return (
      <div className="profile-not-found">

        <h2>
          Professional not found
        </h2>

        <p>{error}</p>

        <Link to="/find-professionals">
          Back to Professionals
        </Link>

      </div>
    );
  }

  if (!professional) {
    return null;
  }

  // =========================================
  // PROFESSIONAL DATA
  // =========================================
  const name =
    professional.user?.name ||
    "Professional";

  const skill =
    professional.skill ||
    "Professional";

  const rating =
    professional.rating || 0;

  const location =
    professional.location ||
    professional.user?.location ||
    "Location unavailable";

  const experience =
    professional.experience || 0;

  const image =
    professional.user?.profileImage || "";

  return (
    <div className="professional-profile">

      <div className="profile-container">

        {/* BACK */}
        <Link
          to="/find-professionals"
          className="back-link"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Professionals
        </Link>

        {/* =====================================
            PROFILE CARD
        ===================================== */}
        <div className="profile-card">

          <div className="profile-image">

            {image ? (

              <img
                src={image}
                alt={name}
              />

            ) : (

              <div className="default-profile-image">

                <i className="fa-solid fa-user"></i>

              </div>

            )}

            <span>
              <i className="fa-solid fa-circle-check"></i>
              Verified Professional
            </span>

          </div>

          <div className="profile-info">

            <p className="profile-skill">
              {skill}
            </p>

            <h1>{name}</h1>

            <div className="profile-details">

              <span>
                <i className="fa-solid fa-star"></i>
                {rating}
              </span>

              <span>
                <i className="fa-solid fa-location-dot"></i>
                {location}
              </span>

              <span>
                <i className="fa-solid fa-briefcase"></i>
                {experience}+ years
              </span>

            </div>

            <p className="profile-about">
              {professional.description ||
                `${name} is a professional ${skill.toLowerCase()} ready to provide quality services to customers.`}
            </p>

            <button
              className="contact-btn"
              onClick={() => {
                document
                  .getElementById(
                    "booking-section"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Contact Professional

              <i className="fa-solid fa-arrow-right"></i>

            </button>

          </div>

        </div>

        {/* =====================================
            BOOKING SECTION
        ===================================== */}
        <div
          className="profile-services"
          id="booking-section"
        >

          <div className="booking-section">

            <div className="booking-header">

              <p>Get started</p>

              <h2>
                Book {name}
              </h2>

              <span>
                Send a request and let the
                professional know what you need.
              </span>

            </div>

            <form
              className="booking-form"
              onSubmit={handleBooking}
            >

              {/* CUSTOMER NAME */}
              <div className="form-group">

                <label>
                  Your Name
                </label>

                <input
                  type="text"
                  value={
                    customer?.name || ""
                  }
                  placeholder="Enter your name"
                  readOnly
                />

              </div>

              {/* PHONE */}
              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={
                    customer?.phone || ""
                  }
                  placeholder="Enter your phone number"
                  readOnly
                />

              </div>

              {/* SERVICE */}
              <div className="form-group">

                <label>
                  Service Needed
                </label>

                <input
                  type="text"
                  value={service}
                  onChange={(e) =>
                    setService(
                      e.target.value
                    )
                  }
                  placeholder="Enter service needed"
                  required
                />

              </div>

              {/* DESCRIPTION */}
              <div className="form-group">

                <label>
                  Describe Your Request
                </label>

                <textarea
                  placeholder="Tell the professional what you need..."
                  rows="5"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  required
                ></textarea>

              </div>

              {/* ERROR */}
              {error && (
                <p className="register-error">
                  {error}
                </p>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                className="booking-btn"
                disabled={sending}
              >

                {sending
                  ? "Sending Request..."
                  : "Send Booking Request"}

                {!sending && (
                  <i className="fa-solid fa-paper-plane"></i>
                )}

              </button>

            </form>

          </div>

          {/* SERVICES */}
          <h2>
            Services Offered
          </h2>

          <div className="services-list">

            <div className="service-item">

              <i className="fa-solid fa-circle-check"></i>

              <span>
                {skill}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfessionalProfile;