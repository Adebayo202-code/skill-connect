
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import app from "../firebase";
import API_URL from "../api";
import "./ProfessionalDashboard.css";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          navigate("/login");
          return;
        }

        try {
          // Get real user from MongoDB
          const userResponse = await fetch(
            `${API_URL}/api/users/uid/${firebaseUser.uid}`
          );

          if (!userResponse.ok) {
            throw new Error("User profile not found");
          }

          const userData = await userResponse.json();

          // Only professionals can access this dashboard
          if (userData.role !== "professional") {
            navigate("/");
            return;
          }

          setUser(userData);

          // Get real professional profile
          const professionalResponse = await fetch(
            `${API_URL}/api/professionals`
          );

          if (!professionalResponse.ok) {
            throw new Error(
              "Professional profile not found"
            );
          }

          const professionals =
            await professionalResponse.json();

          // Find the professional belonging to this user
          const professionalData =
            professionals.find(
              (item) =>
                item.user &&
                String(item.user._id) ===
                  String(userData._id)
            );

          if (!professionalData) {
            throw new Error(
              "Professional profile not found"
            );
          }

          setProfessional(professionalData);
        } catch (error) {
          console.error(
            "Dashboard error:",
            error
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user || !professional) {
    return (
      <div className="dashboard-loading">
        <p>
          Unable to load your professional profile.
        </p>
      </div>
    );
  }

  return (
    <div className="professional-dashboard">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          <i className="fa-solid fa-handshake"></i>
          <span>SkillConnect</span>
        </div>

        <nav className="dashboard-nav">

          <Link
            to="/professional-dashboard"
            className="active"
          >
            <i className="fa-solid fa-chart-line"></i>
            Dashboard
          </Link>

          <Link to="/professional-requests">
            <i className="fa-solid fa-briefcase"></i>
            Job Requests
          </Link>

          <Link to="/professional-messages">
            <i className="fa-solid fa-message"></i>
            Messages
          </Link>

          <Link to="/professional-profile">
            <i className="fa-solid fa-user"></i>
            My Profile
          </Link>

        </nav>

        <button
          className="dashboard-logout"
          onClick={async () => {
            await auth.signOut();
            navigate("/login");
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <p>Professional Dashboard</p>

            <h1>
              Welcome, {user.name}
            </h1>
          </div>

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
              <strong>
                {user.name}
              </strong>

              <span>
                {professional.skill}
              </span>
            </div>

          </div>

        </header>

        {/* PROFILE SUMMARY */}
        <section className="dashboard-profile">

          <div className="profile-avatar">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
              />
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </div>

          <div className="profile-summary">

            <div className="profile-name">

              <h2>
                {user.name}
              </h2>

              <span className="verified-badge">
                <i className="fa-solid fa-circle-check"></i>
                Verified Professional
              </span>

            </div>

            <p>
              <i className="fa-solid fa-briefcase"></i>
              {professional.skill}
            </p>

            <p>
              <i className="fa-solid fa-location-dot"></i>
              {user.location}
            </p>

          </div>

          <Link
            to="/professional-profile"
            className="edit-profile-btn"
          >
            Edit Profile
          </Link>

        </section>

        {/* STATS */}
        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              <i className="fa-solid fa-briefcase"></i>
            </div>

            <div>
              <span>Job Requests</span>
              <h2>0</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>

            <div>
              <span>Completed Jobs</span>
              <h2>0</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <i className="fa-solid fa-star"></i>
            </div>

            <div>
              <span>Rating</span>
              <h2>
                {professional.rating > 0
                  ? professional.rating
                  : "New"}
              </h2>
            </div>

          </div>

        </section>

        {/* JOB REQUESTS */}
        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Recent Job Requests</h2>

              <p>
                Requests from customers will appear here.
              </p>
            </div>

            <Link to="/professional-requests">
              View all
            </Link>

          </div>

          <div className="empty-dashboard">

            <i className="fa-solid fa-briefcase"></i>

            <h3>No job requests yet</h3>

            <p>
              When customers request your service,
              their requests will appear here.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};

export default ProfessionalDashboard;

