import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Brandloader.css";

const BrandLoader = ({ children }) => {
  const location = useLocation();

  const [initialLoading, setInitialLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  /*
    INITIAL PAGE LOAD
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  /*
    ROUTE LOADING
    Runs whenever the page route changes
  */
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    setRouteLoading(true);

    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* =========================================
          INITIAL FULL SCREEN LOADER
      ========================================= */}
      {initialLoading && (
        <div className="brand-loader">
          <div className="brand-loader__content">

            <div className="brand-loader__logo">
              <i className="fa-solid fa-handshake"></i>
            </div>

            <h1 className="brand-loader__name">
              Skill<span>Connect</span>
            </h1>

            <p className="brand-loader__tagline">
              Connecting skills. Creating solutions.
            </p>

            <div className="brand-loader__loading">
              <div className="brand-loader__loading-bar"></div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================
          ROUTE TOP LOADING BAR
      ========================================= */}
      {routeLoading && (
        <div className="route-loader">
          <div className="route-loader__bar"></div>
        </div>
      )}

      {/* =========================================
          APPLICATION PAGES
      ========================================= */}
      {children}
    </>
  );
};

export default BrandLoader;