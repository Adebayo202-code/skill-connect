
import { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import app from "../firebase";
import API_URL from "../api";
import "./CustomerProfile.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapUpdater = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);

  return null;
};

const CustomerProfile = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [gettingLocation, setGettingLocation] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          navigate("/login");
          return;
        }

        try {
          const response = await fetch(
            `${API_URL}/api/users/uid/${firebaseUser.uid}`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "User profile not found"
            );
          }

          if (data.role !== "customer") {
            navigate("/");
            return;
          }

          setUser(data);
          setLocation(data.location || "");
          setLatitude(data.latitude ?? null);
          setLongitude(data.longitude ?? null);
        } catch (error) {
          console.error("Profile error:", error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await fetch(
        `${API_URL}/api/upload/image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.message || "Failed to upload image."
        );
      }

      const response = await fetch(
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save profile image."
        );
      }

      setUser(data.user);

      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Image upload error:", error);

      alert(
        error.message ||
          "Failed to upload profile image."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2`
          );

          const data = await response.json();

          if (data.display_name) {
            setLocation(data.display_name);
          } else {
            setLocation(
              `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            );
          }
        } catch (error) {
          console.error(
            "Reverse geocoding error:",
            error
          );

          setLocation(
            `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          );
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        setGettingLocation(false);

        if (error.code === 1) {
          alert(
            "Location permission was denied. Please allow location access in your browser."
          );
        } else if (error.code === 2) {
          alert(
            "Your location could not be determined. Please try again."
          );
        } else if (error.code === 3) {
          alert(
            "Location request timed out. Please try again."
          );
        } else {
          alert(
            "Unable to get your current location."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleLocationUpdate = async () => {
    if (
      latitude === null ||
      longitude === null ||
      !location
    ) {
      alert(
        "Please click 'Use My Current Location' first."
      );
      return;
    }

    try {
      setSavingLocation(true);

      const response = await fetch(
        `${API_URL}/api/users/uid/${user.uid}/location`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location,
            latitude,
            longitude,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update location."
        );
      }

      setUser(data.user);
      setLocation(data.user.location || "");
      setLatitude(data.user.latitude ?? null);
      setLongitude(data.user.longitude ?? null);

      alert("Location updated successfully!");
    } catch (error) {
      console.error(
        "Location update error:",
        error
      );

      alert(
        error.message ||
          "Failed to update location."
      );
    } finally {
      setSavingLocation(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();

    localStorage.removeItem("skillconnectUser");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mapPosition =
    latitude !== null && longitude !== null
      ? [latitude, longitude]
      : null;

  return (
    <div className="customer-profile-page">

      <aside className="profile-sidebar">

        <div className="profile-logo">
          <i className="fa-solid fa-handshake"></i>
          <span>SkillConnect</span>
        </div>

        <nav className="profile-nav">

          <Link to="/customer-dashboard">
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

          <Link
            to="/customer-profile"
            className="active"
          >
            <i className="fa-solid fa-user"></i>
            My Profile
          </Link>

        </nav>

        <button
          className="profile-logout"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>

      </aside>

      <main className="customer-profile-main">

        <div className="profile-page-header">

          <div>
            <p>Account</p>

            <h1>My Profile</h1>

            <span>
              View and manage your SkillConnect account.
            </span>
          </div>

          <Link
            to="/customer-dashboard"
            className="back-dashboard"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Dashboard
          </Link>

        </div>

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="customer-avatar">

              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                />
              ) : (
                <i className="fa-solid fa-user"></i>
              )}

            </div>

            <div className="customer-profile-name">

              <h2>{user.name}</h2>

              <span className="customer-badge">
                <i className="fa-solid fa-circle-check"></i>
                Customer
              </span>

              <label className="profile-image-button">

                <i className="fa-solid fa-camera"></i>

                {uploadingImage
                  ? "Uploading..."
                  : "Change Profile Image"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  hidden
                />

              </label>

            </div>

          </div>

          <div className="profile-details">

            <div className="profile-detail">

              <div className="detail-icon">
                <i className="fa-solid fa-user"></i>
              </div>

              <div>
                <span>Full Name</span>
                <strong>{user.name}</strong>
              </div>

            </div>

            <div className="profile-detail">

              <div className="detail-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>

              <div>
                <span>Email Address</span>
                <strong>{user.email}</strong>
              </div>

            </div>

            <div className="profile-detail">

              <div className="detail-icon">
                <i className="fa-solid fa-phone"></i>
              </div>

              <div>
                <span>Phone Number</span>

                <strong>
                  {user.phone || "Not provided"}
                </strong>

              </div>

            </div>

            <div className="profile-detail">

              <div className="detail-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>

              <div className="location-content">

                <span>Location</span>

                <p className="location-address">
                  {location ||
                    "Your current location has not been detected."}
                </p>

                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                >
                  <i className="fa-solid fa-location-crosshairs"></i>

                  {gettingLocation
                    ? "Getting Location..."
                    : "Use My Current Location"}
                </button>

                {mapPosition && (
                  <div className="location-map">

                    <MapContainer
                      center={mapPosition}
                      zoom={15}
                      scrollWheelZoom={true}
                    >

                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <MapUpdater
                        position={mapPosition}
                      />

                      <Marker
                        position={mapPosition}
                      >
                        <Popup>
                          <strong>
                            Your Location
                          </strong>
                          <br />
                          {location}
                        </Popup>
                      </Marker>

                    </MapContainer>

                  </div>
                )}

                {mapPosition && (
                  <button
                    type="button"
                    onClick={handleLocationUpdate}
                    disabled={savingLocation}
                    className="save-location-button"
                  >
                    <i className="fa-solid fa-floppy-disk"></i>

                    {savingLocation
                      ? "Saving..."
                      : "Save Location"}
                  </button>
                )}

              </div>

            </div>

            <div className="profile-detail">

              <div className="detail-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>

              <div>
                <span>Account Type</span>
                <strong>Customer</strong>
              </div>

            </div>

            <div className="profile-detail">

              <div className="detail-icon">
                <i className="fa-solid fa-calendar"></i>
              </div>

              <div>
                <span>Member Since</span>

                <strong>
                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}
                </strong>

              </div>

            </div>

          </div>

        </section>

        <section className="profile-info-card">

          <div className="info-icon">
            <i className="fa-solid fa-circle-info"></i>
          </div>

          <div>

            <h3>
              Looking for a professional?
            </h3>

            <p>
              Find trusted electricians, plumbers,
              mechanics, barbers and other skilled
              professionals on SkillConnect.
            </p>

            <Link to="/professionals">
              Find Professionals
              <i className="fa-solid fa-arrow-right"></i>
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
};

export default CustomerProfile;

