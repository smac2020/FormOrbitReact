import React, { useState, useEffect, useRef } from 'react';

const deviceOptions = [
  { id: 'iphoneSE', label: 'iPhone SE (320×568)', width: 320, height: 568 },
  { id: 'iphone14', label: 'iPhone 14 (390×844)', width: 390, height: 844 },
  { id: 'iphoneXR', label: 'iPhone XR (414×896)', width: 414, height: 896 },
  { id: 'pixel5', label: 'Pixel 5 (360×800)', width: 360, height: 800 },
  { id: 'ipadMini', label: 'iPad Mini (600×960)', width: 600, height: 960 },
  { id: 'ipad', label: 'iPad (768×1024)', width: 768, height: 1024 },
];

const PhoneEmulator = () => {
  const [formType, setFormType] = useState('GymGoldRush');
  const [selectedDevice, setSelectedDevice] = useState(deviceOptions[1]); // Default: iPhone 14
  const [iframeSrc, setIframeSrc] = useState('');
  const iframeRef = useRef(null);

  // Original dark-themed Gym Signup form markup
  const gymGoldRushHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>GoldRush Gym Signup</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet"/>
  <style>
    html, body { background: linear-gradient(135deg, #0d1117 0%, #1c1f26 100%); color: #e0e6f0; margin:0; padding:2rem 1rem; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-height:100vh; }
    .container { max-width:700px; background:rgba(28,31,38,0.9); border-radius:1rem; box-shadow:0 8px 32px rgba(13,110,253,0.4); padding:2.5rem 3rem; backdrop-filter:blur(8px); border:1px solid rgba(13,110,253,0.3); }
    header h1 { font-weight:700; font-size:2.75rem; color:#0d6efd; text-shadow:0 0 8px rgba(13,110,253,0.7); }
    header p { font-style:italic; font-weight:500; color:#a3b0ffcc; font-size:1.1rem; margin-top:0.3rem; }
    label.form-label { color:#c8d0ffdd; font-weight:600; text-shadow:0 0 5px rgba(13,110,253,0.6); display:flex; align-items:center; gap:0.5rem; }
    .form-icon-label i { color:#0d6efd; }
    .form-control, .form-select, textarea.form-control, input[type="range"] { background:#222831; color:#e0e6f0; border:1.5px solid #444dff; border-radius:0.6rem; box-shadow:inset 0 1px 2px #0008; padding:0.6rem 1rem; }
    .form-control:focus, .form-select:focus, textarea.form-control:focus, input[type="range"]:focus { border-color:#5f7aff; box-shadow:0 0 10px #5f7affaa; background:#1e2430; color:#f0f5ff; }
    button.btn-primary { background:linear-gradient(135deg,#5f7aff,#3b52d6); border:none; font-weight:600; padding:0.8rem 1.2rem; border-radius:0.8rem; box-shadow:0 4px 15px rgba(59,82,214,0.7); }
    button.btn-primary:hover { background:linear-gradient(135deg,#3b52d6,#5f7aff); box-shadow:0 6px 20px rgba(93,120,255,0.9); }
  </style>
</head>
<body>
  <div class="container">
    <header class="text-center">
      <h1><i class="bi bi-fire"></i> GoldRush Gym Signup</h1>
      <p>Join today and unlock your fitness potential!</p>
    </header>
    <form action="https://6t3a4ou3xe.execute-api.us-east-1.amazonaws.com/form/form" method="POST" novalidate>
      <input type="hidden" name="formid" value="3d2d18f2-ddad-40ee-bf0f-ca2f8d8b320b" />
      <input type="hidden" name="formrev" value="1" />
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <label for="idFirst" class="form-label form-icon-label"><i class="bi bi-person"></i> First Name</label>
          <input type="text" id="idFirst" name="idFirst" class="form-control" placeholder="Enter first name" required />
        </div>
        <div class="col-md-4">
          <label for="idMiddle" class="form-label form-icon-label"><i class="bi bi-person-lines-fill"></i> Middle Name</label>
          <input type="text" id="idMiddle" name="idMiddle" class="form-control" placeholder="Middle (optional)" />
        </div>
        <div class="col-md-4">
          <label for="idLast" class="form-label form-icon-label"><i class="bi bi-person"></i> Last Name</label>
          <input type="text" id="idLast" name="idLast" class="form-control" placeholder="Enter last name" required />
        </div>
      </div>
      <div class="mb-4">
        <label for="idProvince" class="form-label form-icon-label"><i class="bi bi-geo-alt"></i> Province</label>
        <input type="text" id="idProvince" name="idProvince" class="form-control" placeholder="Enter your province or state" required />
      </div>
      <div class="mb-4">
        <label for="contactDate" class="form-label form-icon-label"><i class="bi bi-calendar-event"></i> Preferred Contact Date</label>
        <input type="date" id="contactDate" name="contactDate" class="form-control" />
      </div>
      <div class="mb-4">
        <label for="membershipTier" class="form-label form-icon-label"><i class="bi bi-star-fill"></i> Membership Tier</label>
        <select class="form-select" id="membershipTier" name="membershipTier" required>
          <option value="" disabled selected>-- Choose a Tier --</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="fitnessLevel" class="form-label form-icon-label"><i class="bi bi-activity"></i> Fitness Level: <span id="fitnessValue" class="slider-value">5</span></label>
        <input type="range" class="form-range" min="1" max="10" value="5" id="fitnessLevel" name="fitnessLevel" />
      </div>
      <div class="form-check form-switch mb-4">
        <input class="form-check-input" type="checkbox" id="newsletterToggle" name="newsletterToggle" />
        <label class="form-check-label form-icon-label" for="newsletterToggle"><i class="bi bi-envelope-paper"></i> Subscribe to newsletter?</label>
      </div>
      <div class="form-check mb-4">
        <input class="form-check-input" type="checkbox" id="agreeTerms" name="agreeTerms" required />
        <label class="form-check-label" for="agreeTerms">I agree to the <a href="#" class="text-white">terms and conditions</a></label>
      </div>
      <div class="mb-4">
        <label for="additionalInfo" class="form-label form-icon-label"><i class="bi bi-chat-left-dots"></i> Additional Information</label>
        <textarea id="additionalInfo" name="additionalInfo" rows="4" class="form-control" placeholder="Tell us anything else (e.g. goals, injuries)"></textarea>
      </div>
      <button type="submit" class="btn btn-primary w-100"><i class="bi bi-check-circle me-2"></i>Sign Up</button>
    </form>
  </div>
</body>
</html>
`;

  // Elegant dark style wrapper for same form elements
  const style2HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Elegant Dark Signup Form</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" />
  <style>
    body { background: linear-gradient(135deg,#1f2937,#111827); min-height:100vh; margin:0; display:flex;justify-content:center;align-items:center;padding:2rem; font-family:'Helvetica Neue',sans-serif; color:#e5e7eb; }
    .form-card { background:#242f40; border-radius:14px; padding:2.5rem 3rem; box-shadow:0 10px 30px rgba(0,0,0,0.7); max-width:480px; width:100%; transition:transform .3s; }
    .form-card:hover { transform:translateY(-6px); box-shadow:0 14px 40px rgba(0,0,0,0.85); }
    h2 { text-align:center; font-weight:700; margin-bottom:1.5rem; color:#f3f4f6; letter-spacing:.05em; }
    label.form-label, label.form-icon-label { color:#9ca3af; font-weight:600; display:flex; align-items:center; gap:.5rem; }
    .form-control, .form-select, textarea.form-control { background:#1e293b; border:1.5px solid #374151; border-radius:8px; color:#d1d5db; padding:.55rem .85rem; transition:border-color .3s,box-shadow .3s; }
    .form-control::placeholder { color:#6b7280; }
    .form-control:focus, .form-select:focus, textarea.form-control:focus { border-color:#3b82f6; box-shadow:0 0 10px #3b82f6; outline:none; background:#1e293b; color:#f9fafb; }
    .btn-gradient { background:linear-gradient(135deg,#2563eb,#9333ea); border:none; font-weight:700; padding:.7rem; border-radius:10px; width:100%; font-size:1.1rem; color:#fff; box-shadow:0 5px 15px rgba(147,51,234,0.5); transition:background .3s,box-shadow .3s; }
    .btn-gradient:hover, .btn-gradient:focus { background:linear-gradient(135deg,#4f46e5,#a855f7); box-shadow:0 8px 25px rgba(168,85,247,0.7); outline:none; }
    .form-check-label { color:#cbd5e1; user-select:none; }
    .slider-value { color:#3b82f6; font-weight:600; }
  </style>
</head>
<body>
  <div class="form-card">
    <h2><i class="bi bi-fire"></i> GoldRush Gym Signup</h2>
    <form action="https://6t3a4ou3xe.execute-api.us-east-1.amazonaws.com/form/form" method="POST" novalidate>
      <input type="hidden" name="formid" value="3d2d18f2-ddad-40ee-bf0f-ca2f8d8b320b" />
      <input type="hidden" name="formrev" value="1" />
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <label for="idFirst" class="form-label form-icon-label"><i class="bi bi-person"></i> First Name</label>
          <input type="text" id="idFirst" name="idFirst" class="form-control" placeholder="Enter first name" required />
        </div>
        <div class="col-md-4">
          <label for="idMiddle" class="form-label">Middle Name</label>
          <input type="text" id="idMiddle" name="idMiddle" class="form-control" placeholder="Optional" />
        </div>
        <div class="col-md-4">
          <label for="idLast" class="form-label form-icon-label"><i class="bi bi-person"></i> Last Name</label>
          <input type="text" id="idLast" name="idLast" class="form-control" placeholder="Enter last name" required />
        </div>
      </div>
      <div class="mb-4">
        <label for="idProvince" class="form-label form-icon-label"><i class="bi bi-geo-alt"></i> Province</label>
        <input type="text" id="idProvince" name="idProvince" class="form-control" placeholder="Enter your state/province" required />
      </div>
      <div class="mb-4">
        <label for="contactDate" class="form-label form-icon-label"><i class="bi bi-calendar-event"></i> Preferred Contact Date</label>
        <input type="date" id="contactDate" name="contactDate" class="form-control" />
      </div>
      <div class="mb-4">
        <label for="membershipTier" class="form-label form-icon-label"><i class="bi bi-star-fill"></i> Membership Tier</label>
        <select id="membershipTier" name="membershipTier" class="form-select" required>
          <option value="" disabled selected>-- Choose Tier --</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="fitnessLevel" class="form-label form-icon-label"><i class="bi bi-activity"></i> Fitness Level: <span id="fitnessValue" class="slider-value">5</span></label>
        <input type="range" id="fitnessLevel" name="fitnessLevel" class="form-range" min="1" max="10" value="5" />
      </div>
      <div class="form-check form-switch mb-4">
        <input class="form-check-input" type="checkbox" id="newsletterToggle" name="newsletterToggle" />
        <label class="form-check-label" for="newsletterToggle"><i class="bi bi-envelope-paper"></i> Subscribe to newsletter?</label>
      </div>
      <div class="form-check mb-4">
        <input class="form-check-input" type="checkbox" id="agreeTerms" name="agreeTerms" required />
        <label class="form-check-label" for="agreeTerms">I agree to the terms & conditions</label>
      </div>
      <div class="mb-4">
        <label for="additionalInfo" class="form-label form-icon-label"><i class="bi bi-chat-left-dots"></i> Additional Information</label>
        <textarea id="additionalInfo" name="additionalInfo" class="form-control" rows="4" placeholder="Tell us more..."></textarea>
      </div>
      <button type="submit" class="btn btn-gradient"><i class="bi bi-check-circle me-2"></i>Sign Up</button>
    </form>
  </div>
  <script>
    document.getElementById('fitnessLevel').addEventListener('input', function() {
      document.getElementById('fitnessValue').textContent = this.value;
    });
  </script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

  useEffect(() => {
    const html = formType === 'GymGoldRush' ? gymGoldRushHTML : style2HTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setIframeSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [formType]);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <div className="d-flex gap-2 mb-3">
        <select className="form-select" value={formType} onChange={e => setFormType(e.target.value)}>
          <option value="GymGoldRush">GoldRush Gym (Dark)</option>
          <option value="Style2">GoldRush Gym (Elegant Dark)</option>
        </select>
        <select className="form-select" value={selectedDevice.id} onChange={e => {
          const dev = deviceOptions.find(d => d.id === e.target.value);
          dev && setSelectedDevice(dev);
        }}>
          {deviceOptions.map(dev => <option key={dev.id} value={dev.id}>{dev.label}</option>)}
        </select>
      </div>
      <div style={{
        width: selectedDevice.width,
        height: selectedDevice.height,
        margin: '0 auto',
        border: '1px solid #ccc',
        borderRadius: 35,
        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        background: '#f0f0f0',
        position: 'relative'
      }}>
        <div style={{ height: 40, backgroundColor: '#222', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', fontSize: '0.8rem' }}>
          <span>Wi-Fi</span><span>12:45</span><span>🔋</span>
        </div>
        <iframe ref={iframeRef} src={iframeSrc} title="form-emulator" style={{ width: '100%', height: selectedDevice.height - 40, border: 'none' }} />
      </div>
    </div>
  );
};

export default PhoneEmulator;












