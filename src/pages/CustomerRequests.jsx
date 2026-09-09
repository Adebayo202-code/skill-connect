
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "./CustomerDashboard.css";

const CustomerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          setError("Please login to view your requests.");
          setLoading(false);
          return;
        }

        try {
          // Get customer from MongoDB
          const userResponse = await fetch(
            `http://localhost:2300/api/users/uid/${firebaseUser.uid}`
          );

          const userData = await userResponse.json();

          if (!userResponse.ok) {
            throw new Error(
              userData.message || "Customer profile not found."
            );
          }

          // Make sure this is a customer
          if (userData.role !== "customer") {
            throw new Error(
              "Only customers can view this page."
            );
          }

          // Get customer's job requests
          const requestsResponse = await fetch(
            `http://localhost:2300/api/job-requests/customer/${userData._id}`
          );

          const requestsData = await requestsResponse.json();

          if (!requestsResponse.ok) {
            throw new Error(
              requestsData.message ||
                "Failed to load your requests."
            );
          }

          setRequests(requestsData);
        } catch (error) {
          console.error(
            "Customer requests error:",
            error
          );

          setError(
            error.message ||
              "Failed to load your requests."
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="professional-requests-page">

      {/* SIDEBAR */}
      <aside className="requests-sidebar">

        <div className="requests-logo">
          <i className="fa-solid fa-handshake"></i>
          <span>SkillConnect</span>
        </div>

        <nav className="requests-nav">

          <Link to="/customer-dashboard">
            <i className="fa-solid fa-chart-line"></i>
            Dashboard
          </Link>

          <Link to="/professionals">
            <i className="fa-solid fa-users"></i>
            Find Professionals
          </Link>

          <Link
            className="active"
            to="/customer-requests"
          >
            <i className="fa-solid fa-briefcase"></i>
            My Requests
          </Link>

          <Link to="/customer-messages">
            <i className="fa-solid fa-message"></i>
            Messages
          </Link>

          <Link to="/customer-profile">
            <i className="fa-solid fa-user"></i>
            My Profile
          </Link>

        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="requests-main">

        <header className="requests-header">

          <div>
            <p>Customer workspace</p>

            <h1>My Requests</h1>

            <span>
              Track the jobs you’ve requested.
            </span>
          </div>

          <Link
            className="requests-back"
            to="/customer-dashboard"
          >
            Back to dashboard
          </Link>

        </header>

        <section className="requests-list">

          {/* LOADING */}
          {loading && (
            <div className="requests-empty">

              <i className="fa-solid fa-spinner fa-spin"></i>

              <h2>Loading requests...</h2>

              <p>
                Please wait while we load your requests.
              </p>

            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="requests-empty">

              <i className="fa-solid fa-circle-exclamation"></i>

              <h2>Something went wrong</h2>

              <p>{error}</p>

            </div>
          )}

          {/* NO REQUESTS */}
          {!loading &&
            !error &&
            requests.length === 0 && (
              <div className="requests-empty">

                <i className="fa-solid fa-briefcase"></i>

                <h2>No requests yet</h2>

                <p>
                  Your submitted requests will appear here.
                </p>

              </div>
            )}

          {/* REQUESTS */}
          {!loading &&
            !error &&
            requests.length > 0 && (
              <div className="customer-request-cards">

                {requests.map((request) => (

                  <div
                    className="customer-request-card"
                    key={request._id}
                  >

                    <div className="customer-request-top">

                      <div>

                        <span className="request-label">
                          Service
                        </span>

                        <h2>
                          {request.service}
                        </h2>

                      </div>

                      <span
                        className={`request-status ${request.status}`}
                      >
                        {request.status}
                      </span>

                    </div>

                    <div className="customer-request-info">

                      <div>
                        <i className="fa-solid fa-user-tie"></i>

                        <span>
                          Professional:{" "}
                          <strong>
                            {request.professional?.name ||
                              "Professional"}
                          </strong>
                        </span>
                      </div>

                      <div>
                        <i className="fa-solid fa-location-dot"></i>

                        <span>
                          Location:{" "}
                          <strong>
                            {request.location ||
                              "Not provided"}
                          </strong>
                        </span>
                      </div>

                      <div>
                        <i className="fa-solid fa-calendar"></i>

                        <span>
                          Requested:{" "}
                          <strong>
                            {new Date(
                              request.createdAt
                            ).toLocaleDateString()}
                          </strong>
                        </span>
                      </div>

                    </div>

                    <div className="customer-request-description">

                      <span>Description</span>

                      <p>
                        {request.description}
                      </p>

                    </div>

                  </div>

                ))}

              </div>
            )}

        </section>

      </main>

    </div>
  );
};

export default CustomerRequests;
