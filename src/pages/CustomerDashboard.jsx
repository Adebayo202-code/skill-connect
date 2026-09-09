
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import app from "../firebase";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          navigate("/login");
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
              userData.message || "User profile not found"
            );
          }

          // Make sure this is a customer
          if (userData.role !== "customer") {
            navigate("/");
            return;
          }

          setUser(userData);

          // Get customer's job requests
          const requestResponse = await fetch(
            `http://localhost:2300/api/job-requests/customer/${userData._id}`
          );

          const requestData = await requestResponse.json();

          if (!requestResponse.ok) {
            throw new Error(
              requestData.message ||
                "Failed to load requests"
            );
          }

          setRequests(requestData);
        } catch (error) {
          console.error(
            "Customer dashboard error:",
            error
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [auth, navigate]);

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {
    await auth.signOut();

    localStorage.removeItem("skillconnectUser");

    navigate("/login");
  };

  // =========================================
  // REQUEST STATISTICS
  // =========================================

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  ).length;

  const acceptedRequests = requests.filter(
    (request) => request.status === "accepted"
  ).length;

  const completedJobs = requests.filter(
    (request) => request.status === "completed"
  ).length;

  /*
    NOTE:
    Messages are not connected yet.
  */
  const messages = 0;

  // Show latest 3 requests
  const recentRequests = requests.slice(0, 3);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="customer-dashboard">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">

          <i className="fa-solid fa-handshake"></i>

          <span>SkillConnect</span>

        </div>

        <nav className="dashboard-nav">

          <Link
            to="/customer-dashboard"
            className="active"
          >
            <i className="fa-solid fa-chart-line"></i>
            Dashboard
          </Link>

          <Link to="/professionals">

            <i className="fa-solid fa-users"></i>

            Find Professionals

          </Link>

          <Link to="/customer-requests">

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

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >

          <i className="fa-solid fa-right-from-bracket"></i>

          Logout

        </button>

      </aside>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p>Customer Dashboard</p>

            <h1>
              Welcome, {user.name}
            </h1>

            <span>
              Find trusted professionals for your next job.
            </span>

          </div>


          {/* USER */}

          <div className="dashboard-user">

            <div className="dashboard-avatar">

              {user.profileImage ? (

                <img
                  src={user.profileImage}
                  alt={user.name}
                />

              ) : (

                <i className="fa-solid fa-user"></i>

              )}

            </div>

            <div>

              <strong>{user.name}</strong>

              <span>Customer</span>

            </div>

          </div>

        </header>


        {/* =========================================
            FIND PROFESSIONAL
        ========================================= */}

        <section className="dashboard-search">

          <div>

            <h2>Find a Professional</h2>

            <p>
              Search for skilled professionals near you.
            </p>

          </div>

          <Link
            to="/professionals"
            className="find-professional-btn"
          >

            Find Professionals

            <i className="fa-solid fa-arrow-right"></i>

          </Link>

        </section>


        {/* =========================================
            STATISTICS
        ========================================= */}

        <section className="dashboard-stats">

          {/* TOTAL REQUESTS */}

          <div className="stat-card">

            <div className="stat-icon">

              <i className="fa-solid fa-briefcase"></i>

            </div>

            <div>

              <span>My Requests</span>

              <h2>{totalRequests}</h2>

            </div>

          </div>


          {/* PENDING REQUESTS */}

          <div className="stat-card">

            <div className="stat-icon">

              <i className="fa-solid fa-clock"></i>

            </div>

            <div>

              <span>Pending</span>

              <h2>{pendingRequests}</h2>

            </div>

          </div>


          {/* ACCEPTED REQUESTS */}

          <div className="stat-card">

            <div className="stat-icon">

              <i className="fa-solid fa-check"></i>

            </div>

            <div>

              <span>Accepted</span>

              <h2>{acceptedRequests}</h2>

            </div>

          </div>


          {/* COMPLETED JOBS */}

          <div className="stat-card">

            <div className="stat-icon">

              <i className="fa-solid fa-circle-check"></i>

            </div>

            <div>

              <span>Completed Jobs</span>

              <h2>{completedJobs}</h2>

            </div>

          </div>


          {/* MESSAGES */}

          <div className="stat-card">

            <div className="stat-icon">

              <i className="fa-solid fa-message"></i>

            </div>

            <div>

              <span>Messages</span>

              <h2>{messages}</h2>

            </div>

          </div>

        </section>


        {/* =========================================
            RECENT REQUESTS
        ========================================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>Recent Requests</h2>

              <p>
                Your recent service requests will appear here.
              </p>

            </div>

            <Link to="/customer-requests">
              View all
            </Link>

          </div>


          {/* REQUESTS EXIST */}

          {recentRequests.length > 0 ? (

            <div className="recent-requests">

              {recentRequests.map((request) => (

                <div
                  className="request-card"
                  key={request._id}
                >

                  <div className="request-card-info">

                    <h3>
                      {request.service}
                    </h3>

                    <p>
                      {request.description}
                    </p>

                    <span>

                      <i className="fa-solid fa-location-dot"></i>

                      {request.location ||
                        "Location not provided"}

                    </span>

                  </div>


                  <div className="request-card-status">

                    <span
                      className={`request-status ${request.status}`}
                    >
                      {request.status}
                    </span>

                    {request.professional && (

                      <small>
                        Professional:{" "}
                        {request.professional.name}
                      </small>

                    )}

                  </div>

                </div>

              ))}

            </div>

          ) : (

            /* =====================================
               NO REQUESTS
            ===================================== */

            <div className="empty-dashboard">

              <i className="fa-solid fa-briefcase"></i>

              <h3>No requests yet</h3>

              <p>
                Find a professional and request a service
                to get started.
              </p>

              <Link
                to="/professionals"
                className="empty-dashboard-btn"
              >
                Find a Professional
              </Link>

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default CustomerDashboard;

