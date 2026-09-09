import "./howitworks.css";

const HowItWorks = () => {
  const steps = [
    {
      icon: "fa-solid fa-magnifying-glass",
      number: "01",
      title: "Search for a service",
      text: "Tell us what service you need and we'll help you find the right professional.",
    },
    {
      icon: "fa-solid fa-user-check",
      number: "02",
      title: "Choose a professional",
      text: "Compare trusted professionals based on their skills, ratings and experience.",
    },
    {
      icon: "fa-solid fa-star",
      number: "03",
      title: "Get the job done",
      text: "Connect with your chosen professional, get the job done and leave a review.",
    },
  ];

  return (
    <section className="how-it-works">
      <div className="how-header">
        <p>Simple and convenient</p>
        <h2>How Skill Connect Works</h2>
        <span>
          Finding the right professional has never been easier.
        </span>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div className="step-card" key={index}>
            <div className="step-number">{step.number}</div>

            <div className="step-icon">
              <i className={step.icon}></i>
            </div>

            <h3>{step.title}</h3>

            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;