import React, { useState } from 'react';
import FormModal from './FormModal';
import './FormGallery.css'; // Make sure this includes the CSS above

const formStyles = [
  { id: 'AuroraPulse', title: 'Aurora Pulse', description: 'A vibrant neon style inspired by northern lights.' },
  { id: 'CircuitWave', title: 'Circuit Wave', description: 'A sleek tech-inspired style with dynamic lines.' },
  { id: 'CyberVelvet', title: 'Cyber Velvet', description: 'A smooth and futuristic velvet-inspired theme.' },
  { id: 'CysteralDiamonds', title: 'Cysteral Diamonds', description: 'Sparkling diamond accents with cool crystal hues.' },
  { id: 'EclipseShadow', title: 'Eclipse Shadow', description: 'Dark mode with subtle eclipse-inspired shadows.' },
  { id: 'ElectricTwilight', title: 'Electric Twilight', description: 'An electric palette capturing twilight’s vibrant glow.' },
  { id: 'GirdIron', title: 'Grid Iron', description: 'Strong, structured, with industrial grid patterns.' },
  { id: 'Glass', title: 'Glass', description: 'Transparent glass-like visuals with soft reflections.' },
  { id: 'IcyMetal', title: 'Icy Metal', description: 'Cool metallic tones with icy blue highlights.' },
  { id: 'IndiePop', title: 'Indie Pop', description: 'Bright and playful colors inspired by indie pop culture.' },
  { id: 'MidnightGlass', title: 'Midnight Glass', description: 'Dark and reflective with a mysterious midnight vibe along with a logo.' },
  { id: 'MonarchGold', title: 'Monarch Gold', description: 'A premium golden theme with luxurious typography and a logo.' },
  { id: 'MapleStyle', title: 'Maple Style', description: 'A warm and patriotic red theme inspired by Canada.' },
  { id: 'OrbitalSlate', title: 'Orbital Slate', description: 'Sleek slate tones with orbital-themed accents.' },
  { id: 'PaperStyle', title: 'Paper Style', description: 'Clean and minimalist, inspired by paper textures.' },
  { id: 'QuantumFlux', title: 'Quantum Flux', description: 'Futuristic quantum-inspired dynamic effects.' },
  { id: 'QuantumFrost', title: 'Quantum Frost', description: 'Cold and futuristic with frosty blue tones.' },
  { id: 'SolarFlare', title: 'Solar Flare', description: 'Bright and energetic with solar-inspired colors.' },
  { id: 'SolarisDawn', title: 'Solaris Dawn', description: 'Warm dawn-inspired colors with soft gradients.' },
  { id: 'TitaniumCore', title: 'Titanium Core', description: 'Strong, sleek, with titanium metal styling.' },
  { id: 'TokyoTech', title: 'Tokyo Tech', description: 'Modern urban style inspired by Tokyo’s tech scene.' },
];

const FormGallery = () => {
  const [selectedForm, setSelectedForm] = useState(null);

  // Sort alphabetically by title
  const sortedForms = [...formStyles].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div>
      <section className="intro-section">
        <h3>Discover the Power of FormOrbit Styles</h3>
        
      </section>

      <div className="gallery-grid">
        {sortedForms.map((form) => (
          <div
            key={form.id}
            className="gallery-card"
            onClick={() => setSelectedForm(form)}
          >
            <h2 className="gallery-title">{form.title}</h2>
            <p className="gallery-description">{form.description}</p>
          </div>
        ))}

        {selectedForm && (
          <FormModal
            form={selectedForm}
            onClose={() => setSelectedForm(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FormGallery;


