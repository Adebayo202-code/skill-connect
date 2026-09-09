import "./testimonials.css";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Lagos",
      image: "/woman.jpg",
      rating: "5.0",
      text: "I found an excellent electrician through Skill Connect. The service was fast, professional and affordable.",
    },
    {
      name: "David Williams",
      role: "Ibadan",
      image: "/man.jpg",
      rating: "4.9",
      text: "Skill Connect made it so easy to find a reliable plumber. I would definitely recommend it to anyone.",
    },
    {
      name: "Mary Ade",
      role: "Abuja",
      image: "/tele.jpg",
      rating: "5.0",
      text: "I love how easy it is to compare professionals and choose someone with great reviews.",
    },
  ];

  return (
    <section className="testimonials">
      <div className="testimonials-header">
        <p>What our customers say</p>
        <h2>Trusted by People Like You</h2>
        <span>
          See what customers have to say about their Skill Connect experience.
        </span>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>

            <div className="testimonial-rating">
              <i className="fa-solid fa-star"></i>
              <span>{testimonial.rating}</span>
            </div>

            <p className="testimonial-text">
              "{testimonial.text}"
            </p>

            <div className="customer-info">
              <img
                src={testimonial.image}
                alt={testimonial.name}
              />

              <div>
                <h3>{testimonial.name}</h3>
                <span>{testimonial.role}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;