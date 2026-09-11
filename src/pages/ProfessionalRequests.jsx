
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import app from "../firebase";
import API_URL from "../api";
import "./ProfessionalRequests.css";

const ProfessionalRequests = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD PROFESSIONAL REQUESTS
  // =========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          navigate("/login");
          return;
        }

        try {
          // Get professional from MongoDB
          const userResponse = await fetch(
            `${API_URL}/api/users/uid/${firebaseUser.uid}`
          );

          const user = await userResponse.json();

          if (!userResponse.ok) {
            throw new Error(
              user.message ||
                "Professional profile not found."
            );
          }

          // Make sure this is a professional
          if (user.role !== "professional") {
            navigate("/");
            return;
          }

          // Get requests belonging to this professional
          const response = await fetch(
            `${API_URL}/api/job-requests/professional/${user._id}`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to load job requests."
            );
          }

          setRequests(data);
        } catch (requestError) {
          console.error(
            "Professional requests error:",
            requestError
          );

          setError(
            requestError.message ||
              "Failed to load job requests."
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [auth, navigate]);

  // =========================================
  // UPDATE REQUEST STATUS
  // =========================================

  const updateStatus = async (
    requestId,
    status
  ) => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/job-requests/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update request."
        );
      }

      // Update the request immediately
      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: data.request.status,
              }
            : request
        )
      );
    } catch (requestError) {
      console.error(
        "Update request error:",
        requestError
      );

      setError(
        requestError.message ||
          "Failed to update request."
      );
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="requests-loading">

        <i className="fa-solid fa-spinner fa-spin"></i>

        Loading job requests...

      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="professional-requests-page">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="requests-sidebar">

        <div className="requests-logo">

          <i className="fa-solid fa-handshake"></i>

          <span>SkillConnect</span>

        </div>

        <nav className="requests-nav">

          <Link to="/professional-dashboard">

            <i className="fa-solid fa-chart-line"></i>

            Dashboard

          </Link>

          <Link
            className="active"
            to="/professional-requests"
          >

            <i className="fa-solid fa-briefcase"></i>

            Job Requests

          </Link>

          <Link to="/professional-profile">

            <i className="fa-solid fa-user"></i>

            My Profile

          </Link>

        </nav>

      </aside>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="requests-main">

        {/* HEADER */}

        <header className="requests-header">

          <div>

            <p>
              Professional workspace
            </p>

            <h1>
              Job Requests
            </h1>

            <span>
              Review service requests from customers.
            </span>

          </div>

          <Link
            className="requests-back"
            to="/professional-dashboard"
          >
            Back to dashboard
          </Link>

        </header>


        {/* ERROR */}

        {error && (

          <p className="requests-error">

            <i className="fa-solid fa-circle-exclamation"></i>

            {error}

          </p>

        )}


        {/* REQUEST LIST */}

        <section className="requests-list">

          {/* NO REQUESTS */}

          {requests.length === 0 ? (

            <div className="requests-empty">

              <i className="fa-solid fa-briefcase"></i>

              <h2>
                No job requests yet
              </h2>

              <p>
                New customer requests will appear here.
              </p>

            </div>

          ) : (

            requests.map((request) => (

              <article
                className="request-card"
                key={request._id}
              >

                {/* =====================================
                    REQUEST HEADER
                ===================================== */}

                <div className="request-card-header">

                  <div>

                    <span className="request-label">
                      Service Request
                    </span>

                    <h2>
                      {request.service}
                    </h2>

                    <p>
                      From{" "}
                      <strong>
                        {request.customer?.name ||
                          "Customer"}
                      </strong>
                    </p>

                  </div>


                  {/* STATUS */}

                  <span
                    className={`request-status ${request.status}`}
                  >
                    {request.status}
                  </span>

                </div>


                {/* =====================================
                    DESCRIPTION
                ===================================== */}

                <div className="request-description">

                  <span>
                    Description
                  </span>

                  <p>
                    {request.description}
                  </p>

                </div>


                {/* =====================================
                    LOCATION
                ===================================== */}

                <span className="request-location">

                  <i className="fa-solid fa-location-dot"></i>

                  {request.location ||
                    "Location not provided"}

                </span>


                {/* =====================================
                    CUSTOMER INFORMATION
                ===================================== */}

                <div className="request-customer">

                  <div>

                    <i className="fa-solid fa-user"></i>

                    <span>
                      Customer:{" "}
                      <strong>
                        {request.customer?.name ||
                          "Customer"}
                      </strong>
                    </span>

                  </div>


                  <div>

                    <i className="fa-solid fa-phone"></i>

                    <span>
                      Phone:{" "}
                      <strong>
                        {request.customer?.phone ||
                          "Not provided"}
                      </strong>
                    </span>

                  </div>

                </div>


                {/* =====================================
                    PENDING ACTIONS
                ===================================== */}

                {request.status === "pending" && (

                  <div className="request-actions">

                    <button
                      className="accept-btn"
                      onClick={() =>
                        updateStatus(
                          request._id,
                          "accepted"
                        )
                      }
                    >

                      <i className="fa-solid fa-check"></i>

                      Accept

                    </button>


                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateStatus(
                          request._id,
                          "rejected"
                        )
                      }
                    >

                      <i className="fa-solid fa-xmark"></i>

                      Reject

                    </button>

                  </div>

                )}


                {/* =====================================
                    ACCEPTED ACTION
                ===================================== */}

                {request.status === "accepted" && (

                  <div className="request-actions">

                    <button
                      className="accept-btn"
                      onClick={() =>
                        updateStatus(
                          request._id,
                          "completed"
                        )
                      }
                    >

                      <i className="fa-solid fa-circle-check"></i>

                      Complete Job

                    </button>

                  </div>

                )}

              </article>

            ))

          )}

        </section>

      </main>

    </div>
  );
};

export default ProfessionalRequests;

