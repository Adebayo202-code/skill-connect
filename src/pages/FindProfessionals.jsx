import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";
import "./FindProfessionals.css";

const FindProfessionals = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // GET PROFESSIONALS FROM MONGODB
  // =========================================
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/professionals`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load professionals"
          );
        }

        console.log(
          "Professionals from MongoDB:",
          data
        );

        setProfessionals(data);
      } catch (error) {
        console.error(
          "Fetch professionals error:",
          error
        );

        setError(
          error.message ||
            "Unable to load professionals."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  // =========================================
  // SEARCH AND FILTER
  // =========================================
  const filteredProfessionals =
    professionals.filter((professional) => {
      const name =
        professional.user?.name || "";

      const skill =
        professional.skill || "";

      const professionalLocation =
        professional.location ||
        professional.user?.location ||
        "";

      const matchesSearch =
        name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        skill
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesLocation =
        professionalLocation
          .toLowerCase()
          .includes(location.toLowerCase());

      return (
        matchesSearch &&
        matchesLocation
      );
    });

  // =========================================
  // SORT
  // =========================================
  const sortedProfessionals =
    [...filteredProfessionals].sort(
      (a, b) => {
        if (sortBy === "highest") {
          return (
            Number(b.rating || 0) -
            Number(a.rating || 0)
          );
        }

        if (sortBy === "lowest") {
          return (
            Number(a.rating || 0) -
            Number(b.rating || 0)
          );
        }

        return 0;
      }
    );

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="find-professionals">
        <section className="professionals-list">
          <div className="list-header">
            <div>
              <p>Available professionals</p>
              <h2>Popular Professionals</h2>
            </div>
          </div>

          <div className="empty-dashboard">
            <i className="fa-solid fa-spinner"></i>

            <h3>Loading professionals...</h3>

            <p>
              Please wait while we find
              available professionals.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================
  if (error) {
    return (
      <div className="find-professionals">
        <section className="professionals-list">
          <div className="empty-dashboard">
            <i className="fa-solid fa-triangle-exclamation"></i>

            <h3>Unable to load professionals</h3>

            <p>{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="find-professionals">

      {/* =====================================
          PAGE HEADER
      ===================================== */}
      <section className="find-hero">

        <div className="find-hero-content">

          <p>Find the right expert</p>

          <h1>Find a Professional</h1>

          <span>
            Discover trusted professionals ready
            to help with your next project.
          </span>

          {/* SEARCH */}
          <div className="professional-search">

            <div className="search-input">

              <i className="fa-solid fa-magnifying-glass"></i>

              <input
                type="text"
                placeholder="What service do you need?"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="location-input">

              <i className="fa-solid fa-location-dot"></i>

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              />

            </div>

            <button type="button">
              Search
              <i className="fa-solid fa-arrow-right"></i>
            </button>

          </div>

        </div>

      </section>

      {/* =====================================
          PROFESSIONALS
      ===================================== */}
      <section className="professionals-list">

        <div className="list-header">

          <div>

            <p>
              Available professionals
            </p>

            <h2>
              Popular Professionals
            </h2>

          </div>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >

            <option value="recommended">
              Sort by: Recommended
            </option>

            <option value="highest">
              Highest Rating
            </option>

            <option value="lowest">
              Lowest Rating
            </option>

          </select>

        </div>

        {/* =====================================
            NO PROFESSIONALS
        ===================================== */}
        {sortedProfessionals.length === 0 ? (

          <div className="empty-dashboard">

            <i className="fa-solid fa-users"></i>

            <h3>
              No professionals found
            </h3>

            <p>
              Try another service or location.
            </p>

          </div>

        ) : (

          <div className="find-professionals-grid">

            {sortedProfessionals.map(
              (professional) => {

                const name =
                  professional.user?.name ||
                  "Professional";

                const skill =
                  professional.skill ||
                  "Professional";

                const professionalLocation =
                  professional.location ||
                  professional.user?.location ||
                  "Location unavailable";

                const profileImage =
                  professional.user?.profileImage;

                return (
                  <div
                    className="find-professional-card"
                    key={professional._id}
                  >

                    {/* IMAGE */}
                    <div className="find-professional-image">

                      {profileImage ? (

                        <img
                          src={profileImage}
                          alt={name}
                        />

                      ) : (

                        <div className="default-professional-image">

                          <i className="fa-solid fa-user"></i>

                        </div>

                      )}

                      <span className="find-verified">

                        <i className="fa-solid fa-circle-check"></i>

                        Verified

                      </span>

                    </div>

                    {/* INFO */}
                    <div className="find-professional-info">

                      <h3>
                        {name}
                      </h3>

                      <p className="find-skill">
                        {skill}
                      </p>

                      <div className="find-details">

                        <span>

                          <i className="fa-solid fa-star"></i>

                          {professional.rating ||
                            "0.0"}

                        </span>

                        <span>

                          <i className="fa-solid fa-location-dot"></i>

                          {professionalLocation}

                        </span>

                      </div>

                      {/* IMPORTANT:
                          Use MongoDB professional ID
                      */}
                      <Link
                        to={`/professional/${professional._id}`}
                        className="find-profile-btn"
                      >

                        View Profile

                        <i className="fa-solid fa-arrow-right"></i>

                      </Link>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>

    </div>
  );
};

export default FindProfessionals;