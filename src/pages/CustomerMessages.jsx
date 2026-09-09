
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import app from "../firebase";
import API_URL from "../api";
import "./CustomerDashboard.css";

const CustomerMessages = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] =
    useState(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] =
    useState(false);
  const [error, setError] = useState("");

  // =========================================
  // LOAD CUSTOMER AND PROFESSIONALS
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
          // Get customer from MongoDB
          const userResponse = await fetch(
            `${API_URL}/api/users/uid/${firebaseUser.uid}`
          );

          const userData = await userResponse.json();

          if (!userResponse.ok) {
            throw new Error(
              userData.message ||
                "Customer profile not found."
            );
          }

          if (userData.role !== "customer") {
            navigate("/");
            return;
          }

          setUser(userData);

          // Get customer's job requests
          const requestResponse = await fetch(
            `${API_URL}/api/job-requests/customer/${userData._id}`
          );

          const requestData =
            await requestResponse.json();

          if (!requestResponse.ok) {
            throw new Error(
              requestData.message ||
                "Failed to load professionals."
            );
          }

          // Get unique professionals
          const uniqueProfessionals = [];

          requestData.forEach((request) => {
            if (
              request.professional &&
              !uniqueProfessionals.some(
                (professional) =>
                  professional._id ===
                  request.professional._id
              )
            ) {
              uniqueProfessionals.push(
                request.professional
              );
            }
          });

          setProfessionals(uniqueProfessionals);

          // Automatically select first professional
          if (uniqueProfessionals.length > 0) {
            setSelectedProfessional(
              uniqueProfessionals[0]
            );
          }
        } catch (error) {
          console.error(
            "Customer messages error:",
            error
          );

          setError(
            error.message ||
              "Failed to load messages."
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [auth, navigate]);

  // =========================================
  // LOAD MESSAGES
  // =========================================

  useEffect(() => {
    if (!user || !selectedProfessional) {
      return;
    }

    const loadMessages = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/messages/${user._id}/${selectedProfessional._id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load conversation."
          );
        }

        setMessages(data);

        // Mark messages from professional as read
        const unreadMessages = data.filter(
          (message) =>
            message.receiver?._id === user._id &&
            message.read === false
        );

        for (const message of unreadMessages) {
          await fetch(
            `${API_URL}/api/messages/${message._id}/read`,
            {
              method: "PATCH",
            }
          );
        }
      } catch (error) {
        console.error(
          "Load messages error:",
          error
        );

        setError(
          error.message ||
            "Failed to load conversation."
        );
      }
    };

    // First load
    const firstLoad = async () => {
      try {
        setMessagesLoading(true);
        setError("");

        await loadMessages();
      } finally {
        setMessagesLoading(false);
      }
    };

    firstLoad();

    // Refresh every 3 seconds
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    // Stop refreshing when component is removed
    return () => clearInterval(interval);
  }, [user, selectedProfessional]);

  // =========================================
  // SEND MESSAGE
  // =========================================

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (
      !newMessage.trim() ||
      !user ||
      !selectedProfessional
    ) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: user._id,
            receiver: selectedProfessional._id,
            message: newMessage.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send message."
        );
      }

      // Add the new message immediately
      setMessages((currentMessages) => [
        ...currentMessages,
        data.newMessage,
      ]);

      setNewMessage("");
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      setError(
        error.message ||
          "Failed to send message."
      );
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading messages...</p>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="professional-requests-page">

      {/* SIDEBAR */}

      <aside className="requests-sidebar">

        <div className="requests-logo">

          <i className="fa-solid fa-handshake"></i>

          <span>
            SkillConnect
          </span>

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

          <Link to="/customer-requests">
            <i className="fa-solid fa-briefcase"></i>
            My Requests
          </Link>

          <Link
            className="active"
            to="/customer-messages"
          >
            <i className="fa-solid fa-message"></i>
            Messages
          </Link>

          <Link to="/customer-profile">
            <i className="fa-solid fa-user"></i>
            My Profile
          </Link>

        </nav>

      </aside>

      {/* MAIN */}

      <main className="requests-main">

        <header className="requests-header">

          <div>

            <p>
              Customer workspace
            </p>

            <h1>
              Messages
            </h1>

            <span>
              Chat with your professionals.
            </span>

          </div>

          <Link
            className="requests-back"
            to="/customer-dashboard"
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

        {/* NO PROFESSIONALS */}

        {professionals.length === 0 ? (

          <section className="requests-list">

            <div className="requests-empty">

              <i className="fa-solid fa-message"></i>

              <h2>
                No conversations yet
              </h2>

              <p>
                Request a service from a professional
                to start a conversation.
              </p>

              <Link
                to="/professionals"
                className="empty-dashboard-btn"
              >
                Find Professionals
              </Link>

            </div>

          </section>

        ) : (

          <section
            style={{
              display: "grid",
              gridTemplateColumns:
                "280px 1fr",
              gap: "20px",
              minHeight: "500px",
            }}
          >

            {/* PROFESSIONAL LIST */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "15px",
                border: "1px solid #eeeeee",
              }}
            >

              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "15px",
                }}
              >
                Conversations
              </h3>

              {professionals.map(
                (professional) => (

                  <button
                    key={professional._id}
                    onClick={() =>
                      setSelectedProfessional(
                        professional
                      )
                    }
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "8px",
                      cursor: "pointer",
                      textAlign: "left",
                      background:
                        selectedProfessional?._id ===
                        professional._id
                          ? "#fff4c2"
                          : "#f7f7f7",
                    }}
                  >

                    <strong>
                      {professional.name}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        marginTop: "4px",
                        fontSize: "13px",
                        color: "#777",
                      }}
                    >
                      Professional
                    </span>

                  </button>

                )
              )}

            </div>

            {/* CHAT */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #eeeeee",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >

              {/* CHAT HEADER */}

              <div
                style={{
                  padding: "18px",
                  borderBottom:
                    "1px solid #eeeeee",
                }}
              >

                <h3
                  style={{
                    margin: 0,
                  }}
                >
                  {selectedProfessional?.name ||
                    "Select a professional"}
                </h3>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#777",
                  }}
                >
                  Professional
                </span>

              </div>

              {/* MESSAGES */}

              <div
                style={{
                  flex: 1,
                  padding: "20px",
                  overflowY: "auto",
                  minHeight: "350px",
                  background: "#fafafa",
                }}
              >

                {messagesLoading ? (

                  <p>
                    Loading conversation...
                  </p>

                ) : messages.length === 0 ? (

                  <div
                    style={{
                      textAlign: "center",
                      paddingTop: "100px",
                      color: "#777",
                    }}
                  >

                    <i
                      className="fa-solid fa-message"
                      style={{
                        fontSize: "30px",
                        marginBottom: "12px",
                      }}
                    ></i>

                    <p>
                      No messages yet.
                    </p>

                    <span>
                      Send the first message.
                    </span>

                  </div>

                ) : (

                  messages.map((message) => {

                    const isMine =
                      message.sender?._id ===
                      user?._id;

                    return (

                      <div
                        key={message._id}
                        style={{
                          display: "flex",
                          justifyContent:
                            isMine
                              ? "flex-end"
                              : "flex-start",
                          marginBottom: "12px",
                        }}
                      >

                        <div
                          style={{
                            maxWidth: "70%",
                            padding:
                              "10px 14px",
                            borderRadius:
                              "14px",
                            background:
                              isMine
                                ? "#ffc107"
                                : "#ffffff",
                            border:
                              "1px solid #eeeeee",
                          }}
                        >

                          <p
                            style={{
                              margin: 0,
                            }}
                          >
                            {message.message}
                          </p>

                          <small
                            style={{
                              display: "block",
                              marginTop: "5px",
                              fontSize: "11px",
                              color: "#777",
                            }}
                          >
                            {new Date(
                              message.createdAt
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )}
                          </small>

                        </div>

                      </div>
                    );
                  })

                )}

              </div>

              {/* MESSAGE INPUT */}

              <form
                onSubmit={handleSendMessage}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "15px",
                  borderTop:
                    "1px solid #eeeeee",
                }}
              >

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) =>
                    setNewMessage(
                      e.target.value
                    )
                  }
                  placeholder="Type your message..."
                  disabled={
                    !selectedProfessional
                  }
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    border:
                      "1px solid #dddddd",
                    borderRadius: "10px",
                    outline: "none",
                  }}
                />

                <button
                  type="submit"
                  disabled={
                    !newMessage.trim()
                  }
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding:
                      "0 20px",
                    cursor: "pointer",
                    background:
                      "#ffc107",
                    color: "#111",
                    fontWeight: "600",
                  }}
                >

                  <i className="fa-solid fa-paper-plane"></i>

                </button>

              </form>

            </div>

          </section>

        )}

      </main>

    </div>
  );
};

export default CustomerMessages;

