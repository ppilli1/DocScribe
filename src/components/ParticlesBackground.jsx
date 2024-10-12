// src/components/ParticlesBackground.jsx
import React, { useEffect } from 'react';

const ParticlesBackground = () => {
  useEffect(() => {
    const loadParticlesJS = () => {
      window.particlesJS.load('particles-js', '/src/assets/particles.json', function() {
        console.log('callback - particles.js config loaded');
      });
    };

    // Check if particlesJS is available
    if (!window.particlesJS) {
      const script = document.createElement('script');
      script.src = '/node_modules/particles.js/particles.js';
      script.async = true;
      script.onload = loadParticlesJS;
      document.body.appendChild(script);
    } else {
      loadParticlesJS();
    }

    // Clean up function
    return () => {
      if (window.particlesJS) {
        window.pJSDom = [];
      }
    };
  }, []);

  return <div id="particles-js" className="absolute w-full h-full z-0 pointer-events-none overflow-hidden" />;
};

export default ParticlesBackground;
