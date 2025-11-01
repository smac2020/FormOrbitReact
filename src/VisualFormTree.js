import React, { useState } from 'react';

// Sample form definition JSON
const formDefinition = {
  type: 'group',
  label: 'User Profile Form',
  children: [
    {
      type: 'text',
      label: 'Full Name',
      name: 'fullName',
    },
    {
      type: 'select',
      label: 'Country',
      name: 'country',
      options: ['USA', 'Canada', 'UK'],
    },
    {
      type: 'checkbox',
      label: 'Subscribe to newsletter',
      name: 'subscribe',
    },
    {
      type: 'group',
      label: 'Notification Preferences',
      children: [
        {
          type: 'toggle',
          label: 'Email Notifications',
          name: 'emailNotif',
        },
        {
          type: 'toggle',
          label: 'SMS Notifications',
          name: 'smsNotif',
        },
      ],
    },
  ],
};

// Recursive Form Tree Component
const FormTree = ({ node, values, setValues }) => {
  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  switch (node.type) {
    case 'group':
      return (
        <div style={{ marginLeft: 20, marginTop: 10 }}>
          <strong>{node.label}</strong>
          <div style={{ borderLeft: '2px solid #ccc', paddingLeft: 10, marginTop: 5 }}>
            {node.children?.map((child, index) => (
              <FormTree
                key={index}
                node={child}
                values={values}
                setValues={setValues}
              />
            ))}
          </div>
        </div>
      );

    case 'text':
      return (
        <div style={{ marginTop: 8 }}>
          <label>
            {node.label}
            <input
              type="text"
              value={values[node.name] || ''}
              onChange={(e) => handleChange(node.name, e.target.value)}
              style={{ marginLeft: 10 }}
            />
          </label>
        </div>
      );

    case 'select':
      return (
        <div style={{ marginTop: 8 }}>
          <label>
            {node.label}
            <select
              value={values[node.name] || ''}
              onChange={(e) => handleChange(node.name, e.target.value)}
              style={{ marginLeft: 10 }}
            >
              <option value="">Select...</option>
              {node.options.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        </div>
      );

    case 'checkbox':
      return (
        <div style={{ marginTop: 8 }}>
          <label>
            <input
              type="checkbox"
              checked={values[node.name] || false}
              onChange={(e) => handleChange(node.name, e.target.checked)}
            />
            {' '}{node.label}
          </label>
        </div>
      );

    case 'toggle':
      return (
        <div style={{ marginTop: 8 }}>
          <label>
            {node.label}
            <input
              type="checkbox"
              checked={values[node.name] || false}
              onChange={(e) => handleChange(node.name, e.target.checked)}
              style={{ marginLeft: 10 }}
            />
          </label>
        </div>
      );

    default:
      return <div>Unsupported node type: {node.type}</div>;
  }
};

// Main component
const VisualFormTree = () => {
  const [formValues, setFormValues] = useState({});

  return (
    <div style={{ fontFamily: 'Arial', padding: 20 }}>
      <h2>Dynamic Form Tree</h2>
      <FormTree node={formDefinition} values={formValues} setValues={setFormValues} />

      <div style={{ marginTop: 20 }}>
        <h3>Form Data</h3>
        <pre>{JSON.stringify(formValues, null, 2)}</pre>
      </div>
    </div>
  );
};

export default VisualFormTree;