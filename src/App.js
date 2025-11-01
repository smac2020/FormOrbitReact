import React, { useState } from "react";
import FormBuilder from "./components/FormBuilder";
import GettingStarted from "./components/GettingStarted";
import PhoneEmulator from "./components/PhoneEmulator";
import FormImporter from "./components/FormImporter";
import AIGeneratorForm from "./components/AIGeneratorForm";
import VisualFormTree from "./components/VisualFormTree";
import LogInBanner from "./LogInBanner";
import LoginModal from "./components/LoginModal";
import TemplateManager from "./components/TemplateManager";
import FormGallery from "./components/FormGallery";
import AnalyticsDashboard from "./components/AnalyticsDashboard";  // <-- Import it here
import "./components/styles.css";
import MPDesigner from "./components/MPDesigner";

const App = () => {
  const [selected, setSelected] = useState("Explore FormOrbit");
  const [tasks, setTasks] = useState([]);
  const [formJson, setFormJson] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const menuItems = [
    "Explore FormOrbit",
    "Style Gallery",
    "AI Form Builder",
    "Form Converter (PDF/Image)",
    "FormOrbit Designer",
    "Multi-Page FormOrbit Designer",
    "Template Manager", 
    "Mobile Preview",
    "View Submissions",
    "Form Insights Dashboard"  // <-- Added here as last menu item
  ];

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogoutClick = () => {
    alert("Simulated logout");
    setIsLoggedIn(false);
    setUsername(null);
    setSelected("Explore FormOrbit");
  };

const handleLoginSuccess = (name) => {
  setIsLoggedIn(true);
  setUsername(name);
  setSelected("Explore FormOrbit");  // Show Getting Started on login
  setShowLoginModal(false);
};

  return (
    <div className="app-container">
      <nav className="sidebar">
        <h2>Menu</h2>
        <ul className="menu">
          {menuItems.map((item) => (
            <li
              key={item}
              className={selected === item ? "active" : ""}
              onClick={() => isLoggedIn && setSelected(item)}
              style={{ opacity: isLoggedIn ? 1 : 0.4, cursor: isLoggedIn ? "pointer" : "not-allowed" }}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>

      <div className="main-content">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "1rem"
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>FormOrbit</h1>
            {isLoggedIn && username && (
              <span style={{ fontSize: "0.9rem", color: "#ccc" }}>
                Welcome, {username}
              </span>
            )}
          </div>
          <div>
            {!isLoggedIn ? (
              <button onClick={handleLoginClick}>Sign In</button>
            ) : (
              <button onClick={handleLogoutClick}>Sign Out</button>
            )}
          </div>
        </div>

        {!isLoggedIn && <LogInBanner />}
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLoginSuccess} />
        )}

        {/* Main Content */}
        {selected === "Explore FormOrbit" && <GettingStarted />}
        {selected === "Style Gallery" && <FormGallery />}
        {selected === "AI Form Builder" && (
          <AIGeneratorForm setFormJson={setFormJson} />
        )}
        {selected === "Form Converter (PDF/Image)" && (
          <FormImporter setFormJson={setFormJson} />
        )}
        {selected === "FormOrbit Designer" && (
          <FormBuilder tasks={tasks} setTasks={setTasks} formJson={formJson} />
        )}
         {selected === "Multi-Page FormOrbit Designer" && (
          <MPDesigner tasks={tasks} setTasks={setTasks} formJson={formJson} />
        )}
         {selected === "Template Manager" && (
          <TemplateManager tasks={tasks} setTasks={setTasks} formJson={formJson} />
        )}
        {selected === "View Submissions" && <VisualFormTree />}
        {selected === "Mobile Preview" && <PhoneEmulator />}
        {selected === "Form Insights Dashboard" && <AnalyticsDashboard/>} {/* <-- Render here */}

        {!menuItems.includes(selected) && (
          <p style={{ padding: "20px", fontSize: "1.2rem" }}>
            Sign in to view: {selected}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;




