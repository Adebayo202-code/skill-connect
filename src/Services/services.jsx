import "./services.css";

const Services = () => {
  const services = [
    {
      icon: "fa-solid fa-bolt",
      title: "Electrician",
      text: "Wiring, repairs and electrical installations",
    },
    {
      icon: "fa-solid fa-faucet",
      title: "Plumber",
      text: "Pipes, taps, leaks and plumbing repairs",
    },
    {
      icon: "fa-solid fa-car",
      title: "Mechanic",
      text: "Car repairs, servicing and maintenance",
    },
    {
      icon: "fa-solid fa-scissors",
      title: "Barber",
      text: "Professional haircuts and grooming",
    },
    {
      icon: "fa-solid fa-broom",
      title: "Cleaner",
      text: "Home, office and commercial cleaning",
    },
    {
      icon: "fa-solid fa-hammer",
      title: "Carpenter",
      text: "Furniture, woodwork and repairs",
    },
  ];

  return (
    <section className="services">
      <div className="services-header">
        <p>What do you need?</p>

        <h2>Popular Services</h2>

        <span>
          Find trusted professionals for all your everyday needs.
        </span>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">
              <i className={service.icon}></i>
            </div>

            <h3>{service.title}</h3>

            <p>{service.text}</p>

            <button>
              Find a professional
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;