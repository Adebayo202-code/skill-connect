
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import app from "../firebase";
import API_URL from "../api";
import "./ProfessionalRegister.css";

const ProfessionalRegister = () => {
  const navigate = useNavigate();

  const auth = getAuth(app);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [experience, setExperience] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [gettingLocation, setGettingLocation] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get the professional's current GPS location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setError("");
    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        try {
          // Convert GPS coordinates into a readable address
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
          console.error("Reverse geocoding error:", error);

          setLocation(
            `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          );
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        setGettingLocation(false);

        if (error.code === 1) {
          setError(
            "Location permission was denied. Please allow location access in your browser."
          );
        } else if (error.code === 2) {
          setError(
            "Your location could not be determined. Please try again."
          );
        } else if (error.code === 3) {
          setError(
            "Location request timed out. Please try again."
          );
        } else {
          setError("Unable to get your current location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (
      latitude === null ||
      longitude === null ||
      !location
    ) {
      setError(
        "Please click 'Use My Current Location' before creating your account."
      );
      return;
    }

    try {
      setLoading(true);

      // 1. Create Firebase Authentication account
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // 2. Create the main user in MongoDB
      const userResponse = await fetch(
        `${API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            name: fullName,
            email: user.email,
            role: "professional",
            phone: phone,
            location: location,
            latitude: latitude,
            longitude: longitude,
          }),
        }
      );

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(
          userData.message ||
            "Failed to save user information."
        );
      }

      // 3. Create the professional profile in MongoDB
      const professionalResponse = await fetch(
        `${API_URL}/api/professionals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: userData.user._id,
            skill: skill,
            description: "",
            experience: Number(experience),
            location: location,
            latitude: latitude,
            longitude: longitude,
            hourlyRate: 0,
          }),
        }
      );

      const professionalData =
        await professionalResponse.json();

      if (!professionalResponse.ok) {
        throw new Error(
          professionalData.message ||
            "Failed to create professional profile."
        );
      }

      // 4. Registration successful
      alert(
        "Professional account created successfully!"
      );

      // 5. Go to login
      navigate("/login");
    } catch (error) {
      console.log(error);

      if (
        error.code === "auth/email-already-in-use"
      ) {
        setError(
          "This email is already registered."
        );
      } else if (
        error.code === "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );
      } else if (
        error.code === "auth/weak-password"
      ) {
        setError("Password is too weak.");
      } else {
        setError(
          error.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="professional-register-page">
      <div className="professional-register-card">

        <div className="professional-register-header">
          <h1>Become a Professional</h1>

          <p>
            Create your profile and start connecting
            with customers.
          </p>
        </div>

        <form
          className="professional-register-form"
          onSubmit={handleRegister}
        >

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Professional Skill</label>

            <select
              value={skill}
              onChange={(e) =>
                setSkill(e.target.value)
              }
              required
            >
              <option value="">
                Select your skill
              </option>

              <option value="Electrician">
                Electrician
              </option>

              <option value="Plumber">
                Plumber
              </option>

              <option value="Mechanic">
                Mechanic
              </option>

              <option value="Barber">
                Barber
              </option>

              <option value="Carpenter">
                Carpenter
              </option>

              <option value="Painter">
                Painter
              </option>

              <option value="Tailor">
                Tailor
              </option>

              <option value="Cleaner">
                Cleaner
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              placeholder="Click the button below to detect your location"
              value={location}
              readOnly
              required
            />

            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              className="location-button"
            >
              <i className="fa-solid fa-location-crosshairs"></i>

              {gettingLocation
                ? "Getting Location..."
                : "Use My Current Location"}
            </button>

            {latitude !== null &&
              longitude !== null && (
                <small className="location-coordinates">
                  Location detected successfully
                </small>
              )}
          </div>

          <div className="form-group">
            <label>Years of Experience</label>

            <input
              type="number"
              placeholder="e.g. 5"
              min="0"
              value={experience}
              onChange={(e) =>
                setExperience(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="professional-register-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Professional Account"}

            {!loading && (
              <i className="fa-solid fa-arrow-right"></i>
            )}
          </button>

        </form>

        <div className="professional-register-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProfessionalRegister;

