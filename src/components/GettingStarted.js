import React from 'react';

const sectionHeadingStyle = {
  fontSize: '2rem',
  marginBottom: '1.5rem',
  color: '#00ffff',
  textAlign: 'center',
};

const subtitleStyle = {
  color: '#66ffff',
  fontSize: '1.1rem',
  textAlign: 'center',
  marginBottom: '2rem',
  maxWidth: '800px',
  marginInline: 'auto',
  lineHeight: 1.6,
};

const cardContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1.25rem',
  padding: '0 1rem',
};

const cardStyle = {
  backgroundColor: '#121212',
  borderRadius: '14px',
  padding: '1.5rem',
  boxShadow: '0 0 1.5px #0ff, 0 0 4px #6ff',
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  cursor: 'pointer',
  color: '#fff',
};

const iconStyle = {
  fontSize: '2rem',
  marginBottom: '0.75rem',
};

const cardTitleStyle = {
  fontSize: '1.25rem',
  marginBottom: '0.5rem',
};

const cardDescStyle = {
  fontSize: '1.10rem',
  lineHeight: '1.45',
  color: '#bbb',
};

export default function UnifiedFeatureSections() {
  const features = [
    // Section 1: Getting Started
    {
      title: 'Explore FormOrbit',
         items: [
        ['🤖', 'AI-Powered Form Generation', 'Turn plain English prompts into ready-to-use FormOrbit templates with zero code.'],
        ['📄', 'Legacy PDF Import', 'Auto-convert static PDF forms into fully interactive, editable experiences.'],
        ['🧠', 'Smart Image Parsing', 'Extract form structures from scanned documents or screenshots with pixel-perfect accuracy.'],
        ['🎨', 'Visual Form Designer', 'Build forms effortlessly with intuitive drag-and-drop — no dev skills required.'],
        ['✨', 'AI-Powered Field Suggestions', 'Dynamically recommends fields and layouts based on context and best practices.'],
        ['🖋️', 'Digital Signatures', 'Secure, built-in signature pads let users sign forms directly — no plug-ins or third parties.'],
        ['⭐', 'Star Ratings & Spinners', 'Add intuitive star ratings, numeric spinners, and stepper controls with ease.'],
        ['🔎', 'Filtering Submissions', 'Quickly filter and search form submissions by criteria such as date range, form fields, or user input to instantly find relevant responses and analyze trends efficiently.'],
        ['🎭', 'Dynamic Theming', 'Light, Dark, and custom themes apply instantly to live forms.'],
        ['📄', 'Multi-Page Forms', 'Design smarter, high-conversion forms like customer surveys, onboarding flows, or assessments—organized into clear steps with built-in validation and logic at every stage.'],
        ['🌐', 'Multi-Language Form Rendering', 'Effortlessly deliver forms in any language — fully localized interfaces that adapt to your users, boosting engagement worldwide.'],
        ['⚡', 'Live Preview & Responsive Testing', 'Instantly preview on desktop, tablet, and mobile.'],
        ['📊', 'Deep Insights', 'Automatically analyze any form’s submitted data — regardless of fields, structure, or language — to dynamically infer schemas, distributions, and patterns. Instantly generate interactive dashboards with tailored charts and clear summaries, empowering data-driven decisions without any manual setup or external BI tools.'],
        ['🔍', 'Predictive Models', 'Uses historical submission data — like user traits, form responses, and scores — to forecast future trends.'],
        ['🧠', 'Customer Segmentation', 'Automatically identify customer segments and behavior patterns from form submissions using Amazon Comprehend-style analysis. Understand sentiment, key topics, frequent terms, and entities mentioned. This helps businesses tailor marketing, improve product design, and personalize user experiences — ultimately driving engagement, retention, and revenue.'],
      ],
    },

    // Section 3: Why It Matters
    {
     title: 'Why FormOrbit Stands Out',
items: [
  ['⚡', 'Lightning-Fast Deployment', 'Spin up new forms instantly without coding.'],
  ['🛡️', 'Enterprise-Grade Security', 'End-to-end encryption for all submissions using HTTPS with AWS-managed certificates, thereby protecting sensitive user data (emails, personal info, etc) in transit.'],
  ['🎛️', 'Flexible Customization', 'Drag, drop exactly to your unique needs.'],
  ['☁️', 'Seamless Cloud Native', 'Built to leverage AWS’s global infrastructure for reliability and speed.'],
  ['📊', 'Deep Data Intelligence', 'Turn thousands of submissions into interactive dashboards, charts, and predictive insights in real time.'],
  ['📈', 'In-Depth Custom Surveys', 'Design multi-page surveys tailored to your needs, then transform submissions into deep insights and actionable predictions.'],
  ],

    },

     // Section 4: Example Business Flow
    {
      title: 'Example Business Flow',
      items: [
        ['✨', 'AI + WYSIWYG Design', 'Start by describing your form in plain English. FormOrbit generates a complete template instantly — refine and customize it with the drag-and-drop WYSIWYG editor.'],
        ['🚀', 'Deploy to AWS in One Click', 'Publish your form instantly with a live, shareable URL. Built on AWS for reliability, scalability, and global reach.'],
        ['📥', 'Collect Submissions in Real-Time', 'Securely capture responses as users fill out the form. Data flows directly into your dashboard, ready for exploration.'],
        ['📊', 'Analyze with Advanced AI', 'Automatically generate charts, dashboards, customer segments, and predictive insights — turning raw submissions into business intelligence.'],
      ],
    },
  ];

  return (
    <div style={{ padding: '3rem 0', backgroundColor: '#0b0b0b' }}>
      {features.map(({ title, items }) => (
        <section key={title} style={{ marginBottom: '4rem' }}>
          <h2 style={sectionHeadingStyle}>{title}</h2>
          {title === 'Explore FormOrbit' && (
            <p style={subtitleStyle}>
              <strong>
              Experience next-generation Form & Data Intelligence with FormOrbit: Instantly turn words, PDFs, and images into smart, mobile-first forms. Capture data, unlock AI insights, discover customer segments, and predict what’s next — empowering smarter, faster decisions.
              </strong>
            </p>
          )}
          <div style={cardContainerStyle}>
            {items.map(([icon, heading, desc]) => (
              <div
                key={heading}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 3px #0ff, 0 0 8px #6ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 1.5px #0ff, 0 0 4px #6ff';
                }}
              >
                <div style={iconStyle} aria-hidden="true">
                  {icon}
                </div>
                <h3 style={cardTitleStyle}>{heading}</h3>
                <p style={cardDescStyle}>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}