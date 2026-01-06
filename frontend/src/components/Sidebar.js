import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  FaCar, FaRoute, FaMapMarkedAlt, FaClock, FaBox, FaHistory, FaCog, 
  FaChevronDown, FaChevronUp, FaRoad, FaSatelliteDish, FaTrafficLight, FaWrench
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const mapPaths = ["/map", "/live-tracking", "/traffic"];

  const [isMapOpen, setIsMapOpen] = useState(() => mapPaths.includes(location.pathname));

  const isMapActive = mapPaths.includes(location.pathname);

  const links = [
    { to: "/fleet", label: "Fleet Manager", icon: <FaCar /> },
    { to: "/plan", label: "Route Planning", icon: <FaRoute /> },
    { 
      label: "Map Control", 
      icon: <FaMapMarkedAlt />,
      isDropdown: true,
      subLinks: [
        { to: "/map", label: "Route View", icon: <FaRoad /> },
        { to: "/live-tracking", label: "Live Tracking", icon: <FaSatelliteDish /> },
        { to: "/traffic", label: "Traffic Analytics", icon: <FaTrafficLight /> }
      ]
    },
    { to: "/eta", label: "ETA Comparison", icon: <FaClock /> },
    { to: "/load", label: "Load Optimization", icon: <FaBox /> },
    { to: "/history", label: "History Reports", icon: <FaHistory /> },
    { to: "/settings", label: "Settings", icon: <FaCog /> },
    { to: "/maintainance", label: "Maintainance Center", icon: <FaWrench /> }
  ];

  const sidebarStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "30px 20px",
    minWidth: "240px",
    background: "linear-gradient(to bottom, #1E3C72, #2A5298)",
    height: "100vh",
    color: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
    overflowY: "auto" 
  };

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: "500",
    fontSize: "16px",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer", 
    border: "none",
    background: "transparent",
    width: "100%",
    textAlign: "left"
  };

  const activeLinkStyle = {
    backgroundColor: "#fff",
    color: "#1E3C72",
    fontWeight: "600",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  };

  const subLinkStyle = {
    ...linkStyle,
    paddingLeft: "45px",
    fontSize: "14px",
    opacity: 0.9
  };

  return (
    <nav style={sidebarStyle}>
      {links.map((link, index) => {
        if (link.isDropdown) {
          return (
            <div key={index}>
              <button 
                onClick={() => setIsMapOpen(!isMapOpen)} 
                style={isMapActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}
              >
                <span style={{ fontSize: "18px" }}>{link.icon}</span>
                <span style={{ flex: 1 }}>{link.label}</span>
                {isMapOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              
              {isMapOpen && (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "5px" }}>
                  {link.subLinks.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      style={({ isActive }) =>
                        isActive ? { ...subLinkStyle, ...activeLinkStyle, backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", boxShadow: "none" } : subLinkStyle
                      }
                    >
                      <span style={{ fontSize: "14px" }}>{sub.icon}</span>
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        }
        return (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
            }
          >
            <span style={{ fontSize: "18px" }}>{link.icon}</span>
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  );
}