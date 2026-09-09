import Navbar from "../Navbar/navbar";
import Hero from "../Hero/hero";
import Services from "../Services/services";
import HowItWorks from "../HowItWorks/howitworks";
import Professionals from "../Professionals/professionals";
import Testimonials from "../Testimonials/testimonials";
import CTA from "../CTA/cta";
import Footer from "../Footer/footer";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Professionals />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default Home;