// components/DeviceEmulator.jsx
import React, { useEffect, useRef } from 'react';

const DeviceEmulator = ({ width, height, label, html }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [html]);

  const phoneFrameStyle = {
    width: width + 30,
    height: height + 56,
    border: '16px solid black',
    borderRadius: 40,
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    backgroundColor: '#000',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const screenStyle = {
    width,
    height,
    backgroundColor: 'white',
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  };

  const notchStyle = {
    width: 120,
    height: 20,
    backgroundColor: 'black',
    borderRadius: '0 0 20px 20px',
    position: 'absolute',
    top: 0,
    left: 'calc(50% - 60px)',
    zIndex: 1,
  };

  return (
    <div style={phoneFrameStyle}>
      <div style={{ color: 'white', marginBottom: 10 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <div style={notchStyle}></div>
        <div style={screenStyle}>
          <iframe
            ref={iframeRef}
            title={label}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceEmulator;
