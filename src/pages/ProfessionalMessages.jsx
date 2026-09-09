import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import app from "../firebase";
import API_URL from "../api";
import "./ProfessionalRequests.css";

const ProfessionalMessages = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // LOAD PROFESSIONAL AND CUSTOMERS
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
          // Get logged-in professional from MongoDB
          const userResponse = await fetch(
            `${API_URL}/api/users/uid/${firebaseUser.uid}`
          );

          const userData = await userResponse.json();

          if (!userResponse.ok) {
            throw new Error(
              userData.message ||
                "Professional profile not found."
            );
          }

          // Make sure this is a professional
          if (userData.role !== "professional") {
            navigate("/");
            return;
          }

          setUser(userData);

          // Get professional's job requests
          const requestResponse = await fetch(
            `${API_URL}/api/job-requests/professional/${userData._id}`
          );

          const requestData = await requestResponse.json();

          if (!requestResponse.ok) {
            throw new Error(
              requestData.message ||
                "Failed to load customers."
            );
          }

          // Get unique customers
          const uniqueCustomers = [];

          requestData.forEach((request) => {
            if (
              request.customer &&
              !uniqueCustomers.some(
                (customer) =>
                  customer._id === request.customer._id
              )
            ) {
              uniqueCustomers.push(request.customer);
            }
          });

          setCustomers(uniqueCustomers);

          // Select first customer automatically
          if (uniqueCustomers.length > 0) {
            setSelectedCustomer(uniqueCustomers[0]);
          }
        } catch (error) {
          console.error(
            "Professional messages error:",
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
    if (!user || !selectedCustomer) {
      return;
    }

    const loadMessages = async () => {
      try {
        setMessagesLoading(true);

        const response = await fetch(
          `${API_URL}/api/messages/${user._id}/${selectedCustomer._id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load conversation."
          );
        }

        setMessages(data);

        // Mark messages sent by customer as read
        const unreadMessages = data.filter(
          (msg) =>
            msg.receiver?._id === user._id &&
            msg.read === false
        );

        for (const msg of unreadMessages) {
          await fetch(
            `${API_URL}/api/messages/${msg._id}/read`,
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
      } finally {
        setMessagesLoading(false);
      }
    };

    // First load
    loadMessages();

    // Refresh messages every 3 seconds
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    // Stop refreshing when component is removed
    return () => clearInterval(interval);
  }, [user, selectedCustomer]);

  // =========================================
  // SEND MESSAGE
  // =========================================

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (
      !newMessage.trim() ||
      !user ||
      !selectedCustomer
    ) {
      return;
    }

    try {
      setError("");

      const messageText = newMessage.trim();

      const response = await fetch(
        `${API_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: user._id,
            receiver: selectedCustomer._id,
            message: messageText,
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
      <div className="requests-loading">
        <i className="fa-solid fa-spinner fa-spin"></i>
        Loading messages...
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

          <span>SkillConnect</span>
        </div>

        <nav className="requests-nav">

          <Link to="/professional-dashboard">
            <i className="fa-solid fa-chart-line"></i>
            Dashboard
          </Link>

          <Link to="/professional-requests">
            <i className="fa-solid fa-briefcase"></i>
            Job Requests
          </Link>

          <Link
            className="active"
            to="/professional-messages"
          >
            <i className="fa-solid fa-message"></i>
            Messages
          </Link>

          <Link to="/professional-profile">
            <i className="fa-solid fa-user"></i>
            My Profile
          </Link>

        </nav>
      </aside>

      {/* MAIN */}

      <main className="requests-main">

        <header className="requests-header">

          <div>
            <p>Professional workspace</p>

            <h1>Messages</h1>

            <span>
              Manage chats with customers.
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

        {/* NO CUSTOMERS */}

        {customers.length === 0 ? (

          <section className="requests-list">

            <div className="requests-empty">

              <i className="fa-solid fa-message"></i>

              <h2>
                No conversations yet
              </h2>

              <p>
                Customers who request your services
                will appear here.
              </p>

            </div>

          </section>

        ) : (

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: "20px",
              minHeight: "500px",
            }}
          >

            {/* CUSTOMER LIST */}

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

              {customers.map((customer) => (

                <button
                  key={customer._id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setMessages([]);
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    marginBottom: "8px",
                    cursor: "pointer",
                    textAlign: "left",
                    background:
                      selectedCustomer?._id ===
                      customer._id
                        ? "#fff4c2"
                        : "#f7f7f7",
                  }}
                >

                  <strong>
                    {customer.name}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: "4px",
                      fontSize: "13px",
                      color: "#777",
                    }}
                  >
                    Customer
                  </span>

                </button>

              ))}

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
                  borderBottom: "1px solid #eeeeee",
                }}
              >

                <h3 style={{ margin: 0 }}>
                  {selectedCustomer?.name ||
                    "Select a customer"}
                </h3>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#777",
                  }}
                >
                  Customer
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

                  messages.map((msg) => {

                    const isMine =
                      msg.sender?._id ===
                      user?._id;

                    return (
                      <div
                        key={msg._id}
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
                            padding: "10px 14px",
                            borderRadius: "14px",
                            background:
                              isMine
                                ? "#ffc107"
                                : "#ffffff",
                            border:
                              "1px solid #eeeeee",
                          }}
                        >

                          <p style={{ margin: 0 }}>
                            {msg.message}
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
                              msg.createdAt
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </small>

                        </div>

                      </div>
                    );
                  })

                )}

              </div>

              {/* INPUT */}

              <form
                onSubmit={handleSendMessage}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "15px",
                  borderTop: "1px solid #eeeeee",
                }}
              >

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) =>
                    setNewMessage(e.target.value)
                  }
                  placeholder="Type your message..."
                  disabled={!selectedCustomer}
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    border: "1px solid #dddddd",
                    borderRadius: "10px",
                    outline: "none",
                  }}
                />

                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "0 20px",
                    cursor: "pointer",
                    background: "#ffc107",
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

export default ProfessionalMessages;