import "./hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">

        <div className="hero-content">

          <span className="hero-badge">
            <i className="fa-solid fa-circle-check"></i>
            Trusted local professionals
          </span>

          <h1>
            Find the right
            <span> skilled professional </span>
            for any job.
          </h1>

          <p>
            SkillConnect helps people in Ogbomoso find trusted,
            skilled and reliable professionals for their everyday needs.
          </p>

          {/* SEARCH BOX */}

          <div className="hero-search">

            <div className="search-input">

              <i className="fa-solid fa-magnifying-glass"></i>

              <input
                type="text"
                placeholder="What service do you need?"
              />

            </div>

            <button>
              Search
            </button>

          </div>

          {/* POPULAR SERVICES */}

          <div className="popular-services">

            <span>Popular:</span>

            <button>
              <i className="fa-solid fa-bolt"></i>
              Electrician
            </button>

            <button>
              <i className="fa-solid fa-faucet-drip"></i>
              Plumber
            </button>

            <button>
              <i className="fa-solid fa-car"></i>
              Mechanic
            </button>

            <button>
              <i className="fa-solid fa-scissors"></i>
              Barber
            </button>

          </div>

        </div>


        {/* HERO IMAGE / DESIGN */}

        <div className="hero-visual">

          <div className="visual-circle">

            <div className="worker-icon">
              <i className="fa-solid fa-user-gear"></i>
            </div>

          </div>


          {/* VERIFIED CARD */}

          <div className="hero-professional-card">

            <div className="hero-profile-icon">
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="hero-professional-info">

              <h3>Verified Professional</h3>

              <p>
                <i className="fa-solid fa-location-dot"></i>
                Available near you
              </p>

            </div>

            <div className="hero-verified">
              <i className="fa-solid fa-check"></i>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;