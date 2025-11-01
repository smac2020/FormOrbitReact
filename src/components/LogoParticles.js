import React from "react";
import { Particles } from "react-particles";
import { loadFull } from "tsparticles";

const LogoParticles = () => {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
      options={{
        fullScreen: { enable: false },
        background: { color: "#000000" },
        fpsLimit: 60,
        particles: {
          number: { value: 150 },
          color: { value: "#00ffcc" },
          shape: { type: "circle" },
          size: { value: 3 },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: true,
            outModes: "bounce",
          },
          links: {
            enable: true,
            distance: 100,
            color: "#00ffcc",
            opacity: 0.5,
            width: 1,
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { quantity: 4 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default LogoParticles;





