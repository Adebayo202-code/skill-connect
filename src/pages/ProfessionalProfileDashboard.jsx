
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import app from "../firebase";
import API_URL from "../api";
import "./ProfessionalProfileDashboard.css";

const ProfessionalProfileDashboard = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          navigate("/login");
          return;
        }

        try {
          const userResponse = await fetch(
            `${API_URL}/api/users/uid/${firebaseUser.uid}`
          );

          if (!userResponse.ok) {
            throw new Error("User profile not found");
          }

          const userData = await userResponse.json();

          if (userData.role !== "professional") {
            navigate("/");
            return;
          }

          setUser(userData);

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
            "Professional profile error:",
            error
          );

          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setError("");

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Check file size - 5MB maximum
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploading(true);

      // Upload image to Cloudinary through backend
      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await fetch(
        `${API_URL}/api/upload/image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.message ||
            "Failed to upload image."
        );
      }

      // Save Cloudinary URL to MongoDB
      const updateResponse = await fetch(
        `${API_URL}/api/users/uid/${user.uid}/profile-image`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileImage: uploadData.imageUrl,
          }),
        }
      );

      const updateData =
        await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(
          updateData.message ||
            "Failed to save profile image."
        );
      }

      // Update profile immediately on screen
      setUser(updateData.user);

      alert("Profile photo updated successfully!");
    } catch (error) {
      console.error(
        "Profile image upload error:",
        error
      );

      setError(
        error.message ||
          "Failed to upload profile photo."
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="professional-profile-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user || !professional) {
    return (
      <div className="professional-profile-loading">
        <p>
          {error ||
            "Unable to load your profile."}
        </p>
      </div>
    );
  }

  return (
    <div className="professional-profile-dashboard">

      {/* SIDEBAR */}
      <aside className="professional-profile-sidebar">

        <div className="professional-profile-logo">
          <i className="fa-solid fa-handshake"></i>
          <span>SkillConnect</span>
        </div>

        <nav className="professional-profile-nav">

          <Link to="/professional-dashboard">
            <i className="fa-solid fa-chart-line"></i>
            Dashboard
          </Link>

          <Link to="/professional-requests">
            <i className="fa-solid fa-briefcase"></i>
            Job Requests
          </Link>

          <Link
            to="/professional-profile"
            className="active"
          >
            <i className="fa-solid fa-user"></i>
            My Profile
          </Link>

        </nav>

        <button
          className="professional-profile-logout"
          onClick={async () => {
            await auth.signOut();
            navigate("/login");
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>

      </aside>

      {/* MAIN */}
      <main className="professional-profile-main">

        <header className="professional-profile-header">

          <div>
            <p>Professional workspace</p>
            <h1>My Profile</h1>
            <span>
              Manage your professional information.
            </span>
          </div>

          <Link
            to="/professional-dashboard"
            className="professional-profile-back"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to dashboard
          </Link>

        </header>

        {error && (
          <p className="professional-profile-error">
            {error}
          </p>
        )}

        {/* PROFILE CARD */}
        <section className="professional-profile-card">

          <div className="professional-profile-image-wrapper">

            <div className="professional-profile-image">

              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                />
              ) : (
                <i className="fa-solid fa-user"></i>
              )}

            </div>

            {/* UPLOAD BUTTON */}
            <label
              htmlFor="professional-profile-photo"
              className="profile-upload-btn"
            >
              <i className="fa-solid fa-camera"></i>

              {uploading
                ? "Uploading..."
                : "Change Photo"}
            </label>

            <input
              id="professional-profile-photo"
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              disabled={uploading}
              hidden
            />

            <small>
              JPG, PNG or WEBP • Max 5MB
            </small>

          </div>

          <div className="professional-profile-info">

            <div className="professional-profile-name">

              <h2>{user.name}</h2>

              <span>
                <i className="fa-solid fa-circle-check"></i>
                Verified Professional
              </span>

            </div>

            <div className="professional-profile-details">

              <div>
                <i className="fa-solid fa-briefcase"></i>

                <div>
                  <small>Professional Skill</small>
                  <strong>
                    {professional.skill}
                  </strong>
                </div>
              </div>

              <div>
                <i className="fa-solid fa-location-dot"></i>

                <div>
                  <small>Location</small>
                  <strong>
                    {user.location ||
                      "Not provided"}
                  </strong>
                </div>
              </div>

              <div>
                <i className="fa-solid fa-phone"></i>

                <div>
                  <small>Phone Number</small>
                  <strong>
                    {user.phone ||
                      "Not provided"}
                  </strong>
                </div>
              </div>

              <div>
                <i className="fa-solid fa-star"></i>

                <div>
                  <small>Rating</small>
                  <strong>
                    {professional.rating > 0
                      ? professional.rating
                      : "New"}
                  </strong>
                </div>
              </div>

              <div>
                <i className="fa-solid fa-clock"></i>

                <div>
                  <small>Experience</small>
                  <strong>
                    {professional.experience} years
                  </strong>
                </div>
              </div>

              <div>
                <i className="fa-solid fa-money-bill"></i>

                <div>
                  <small>Hourly Rate</small>
                  <strong>
                    {professional.hourlyRate > 0
                      ? `₦${professional.hourlyRate}`
                      : "Not set"}
                  </strong>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* LOCATION */}
        <section className="professional-profile-location">

          <div>
            <p>Service location</p>
            <h2>Your Location</h2>
          </div>

          <div className="location-display">

            <i className="fa-solid fa-location-dot"></i>

            <span>
              {user.location ||
                "Location not provided"}
            </span>

          </div>

          {user.latitude !== null &&
            user.longitude !== null && (
              <small>
                GPS: {user.latitude},{" "}
                {user.longitude}
              </small>
            )}

        </section>

      </main>

    </div>
  );
};

export default ProfessionalProfileDashboard;

