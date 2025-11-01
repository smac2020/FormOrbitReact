import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#3399FF'];

const cardStyle = {
  backgroundColor: '#0f111a',
  borderRadius: '1rem',
  padding: '2rem',
  marginBottom: '2.5rem',
  boxShadow: '0 0 8px #4f83cc33, 0 0 16px #1e40af33',
  color: '#a0c8ff',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  border: '1.5px solid #1e40af',
  fontSize: '1.125rem',
  lineHeight: '1.6',
};

const headerStyle = {
  color: '#66aaff',
  textShadow: '0 0 4px #66aaff88',
  marginBottom: '1.5rem',
  fontSize: '2.25rem',
  fontWeight: '600',
};

const toChartData = (obj) =>
  Object.entries(obj).map(([name, value]) => ({ name, value }));

function DynamicChart({ field }) {
  const { name, recommendedChart, distribution, histogram, topValues } = field;

  if ((recommendedChart === 'Pie') && distribution) {
    const data = toChartData(distribution);
    return (
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ ...headerStyle, fontSize: '1.75rem' }}>{name} (Pie Chart)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label fill="#00C49F">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
    );
  }

  if ((recommendedChart === 'Histogram' || recommendedChart === 'Bar') && (histogram || topValues)) {
    const rawData = histogram || topValues;
    const data = toChartData(rawData);
    return (
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ ...headerStyle, fontSize: '1.75rem' }}>{name} ({recommendedChart} Chart)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 15, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3b82f633" />
            <XAxis dataKey="name" stroke="#66aaff" fontSize={16} />
            <YAxis stroke="#66aaff" fontSize={16} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', borderColor: '#3b82f6' }}
                     itemStyle={{ color: '#a0c8ff', fontSize: '1rem' }} />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h3 style={{ ...headerStyle, fontSize: '1.75rem' }}>{name}</h3>
      <p style={{ fontSize: '1.125rem' }}>No chart available for this field.</p>
    </section>
  );
}

function PredictionCard({ title, details }) {
  const { count, percentChange, modelDetails, explanation } = details;

  const changeColor = percentChange > 0 ? "#00ff99" : percentChange < 0 ? "#ff4d4d" : "#a0c8ff";
  const changeSymbol = percentChange > 0 ? "▲" : percentChange < 0 ? "▼" : "➖";

  return (
    <div style={{
      backgroundColor: '#111427',
      border: '1.5px solid #1e40af',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 0 12px #00e5ff66, 0 0 20px #8a2be266',
    }}>
      <h3 style={{ color: '#66aaff', fontSize: '1.5rem', marginBottom: '1rem' }}>
        {title.replace(/([A-Z])/g, ' $1')}
      </h3>

      <p>
        <strong>Count:</strong> {count?.toLocaleString()}{" "}
        <span style={{ color: changeColor, fontWeight: "600" }}>
          {changeSymbol} {percentChange}%
        </span>
      </p>

      {modelDetails && (
        <div style={{ marginTop: "1rem", fontSize: "1rem" }}>
          <p><strong>Algorithm:</strong> {modelDetails.algorithm}</p>
          <p><strong>Features Used:</strong> {modelDetails.featuresUsed.join(", ")}</p>
          <p><strong>Accuracy:</strong> {(modelDetails.accuracy * 100).toFixed(1)}%</p>
          <p><strong>Precision:</strong> {(modelDetails.precision * 100).toFixed(1)}%</p>
          <p><strong>Recall:</strong> {(modelDetails.recall * 100).toFixed(1)}%</p>
        </div>
      )}

      {explanation && (
        <p style={{ marginTop: "1rem", fontStyle: "italic", color: "#a0c8ff" }}>
          {explanation}
        </p>
      )}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState('gym');

  // Help modal state
  const [helpOpen, setHelpOpen] = useState(false);
  const [typedText, setTypedText] = useState('');

  const helpText = `Deep Insights Help:

The Deep Insights component analyzes your selected dataset and visualizes key patterns.
It provides:
- Dynamic summaries of submissions or metrics.
- Pie and Bar/Histogram charts for distributions.
- Predictive insights for trends, such as forecasted signups or churn.
- Color-coded visualizations for quick pattern recognition.

Use the dropdown above to switch between datasets. Click the ❓ icon anytime for this guidance.`;

  useEffect(() => {
    if (helpOpen) {
      let i = 0;
      setTypedText('');
      const interval = setInterval(() => {
        if (i < helpText.length) {
          setTypedText((prev) => prev + helpText.charAt(i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 20); // fast typing
      return () => clearInterval(interval);
    }
  }, [helpOpen]);

  useEffect(() => {
    setLoading(true);
    fetch(`/${dataset}.json`)
      .then(res => res.json())
      .then(data => {
        setCurrentData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load JSON:", err);
        setCurrentData(null);
        setLoading(false);
      });
  }, [dataset]);

  if (loading) return <main style={{ color: '#a0c8ff', padding: '2rem' }}>Loading data...</main>;
  if (!currentData) return <main style={{ color: '#a0c8ff', padding: '2rem' }}>Failed to load data.</main>;

  const schema = {
    formId: currentData.formId,
    fields: Object.entries(currentData.distributions || {}).map(([key, value]) => {
      if (key.toLowerCase().includes('histogram')) {
        return { name: key, recommendedChart: 'Histogram', histogram: value };
      } else {
        return { name: key, recommendedChart: 'Pie', distribution: value };
      }
    }),
  };

  const summary = currentData.summary || {};
  const predictions = currentData.predictions || {};

  return (
    <main style={{ maxWidth: 950, margin: 'auto', padding: '2rem', color: '#a0c8ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#0a0c17', minHeight: '100vh', fontSize: '1.125rem' }}>
      
      {/* Dataset selection + HELP ICON */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#0f111a', border: '1.5px solid #1e40af', boxShadow: '0 0 8px #4f83cc33, 0 0 16px #1e40af33', borderRadius: '10px', padding: '12px 16px', marginBottom: '2rem', position: 'relative' }}>
        <span style={{ color: '#66aaff', textShadow: '0 0 6px #66aaff66', fontWeight: '600' }}>Select Dataset:</span>
        <select value={dataset} onChange={(e) => setDataset(e.target.value)}
          style={{ backgroundColor: '#0a0c17', color: '#a0c8ff', border: '1.5px solid #00e5ff', boxShadow: '0 0 8px #00e5ff33, inset 0 0 8px #001a2b', padding: '8px 12px', borderRadius: '8px', outline: 'none', fontSize: '1rem', cursor: 'pointer' }}>
          <option value="gym">Gym Results</option>
          <option value="customer-survey">Customer Survey</option>
          <option value="school-funding">School Funding</option>
        </select>

        {/* Neon HELP ICON */}
        <div
          onClick={() => setHelpOpen(true)}
          style={{ position: 'absolute', right: '16px', fontSize: '1.5rem', cursor: 'pointer', color: '#00e5ff', textShadow: '0 0 10px #00e5ff, 0 0 20px #8a2be2' }}
          title="Help"
        >
          ❓
        </div>
      </div>

      {/* Summary */}
      <section style={cardStyle}>
        <h2 style={headerStyle}>Summary of Current Data</h2>
        {Object.entries(summary).map(([k, v]) => (
          <p key={k}>{k.replace(/([A-Z])/g, ' $1')}: <strong>{typeof v === 'number' ? v.toLocaleString() : v}</strong></p>
        ))}
      </section>

      {/* Charts */}
      {schema.fields.map((field, idx) => <DynamicChart key={idx} field={field} />)}

      {/* Predictive Insights */}
      {Object.keys(predictions).length > 0 && (
        <section style={cardStyle}>
          <h2 style={headerStyle}>Predictive Insights</h2>
          {Object.entries(predictions).map(([k, v]) => (
            <PredictionCard key={k} title={k} details={v} />
          ))}
          <p style={{ fontStyle: 'italic', color: '#718096' }}>*Note: These predictions are mock estimates for demonstration only.</p>
        </section>
      )}

      {/* Comprehend Segments Card */}
      {currentData.segments && (
        <section style={cardStyle}>
          <h2 style={headerStyle}>Customer Segments Analysis (Amazon Comprehend)</h2>

          {currentData.segments.sentimentAnalysis && (
            <DynamicChart
              field={{
                name: "Sentiment Analysis",
                recommendedChart: "Pie",
                distribution: currentData.segments.sentimentAnalysis,
              }}
            />
          )}

          {currentData.segments.topicSegmentation && (
            <DynamicChart
              field={{
                name: "Topic Segmentation",
                recommendedChart: "Bar",
                histogram: currentData.segments.topicSegmentation,
              }}
            />
          )}

          {currentData.segments.frequentTerms?.topWords && (
            <DynamicChart
              field={{
                name: "Top Frequent Terms",
                recommendedChart: "Bar",
                topValues: currentData.segments.frequentTerms.topWords.reduce((acc, cur) => {
                  acc[cur.word] = cur.count;
                  return acc;
                }, {}),
              }}
            />
          )}

          {currentData.segments.keyEntities && (
            <DynamicChart
              field={{
                name: "Key Entities Mentioned",
                recommendedChart: "Pie",
                distribution: currentData.segments.keyEntities.reduce((acc, entity) => {
                  acc[entity.entity] = entity.mentions;
                  return acc;
                }, {}),
              }}
            />
          )}
        </section>
      )}

      {/* Help Modal */}
      {helpOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          onClick={() => setHelpOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#0f0f1f',
              padding: '2rem',
              borderRadius: '0.75rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '70vh',
              overflowY: 'auto',
              color: '#ffffff',
              fontFamily: "'Roboto Mono', monospace",
              boxShadow: '0 0 25px #00e5ff, 0 0 50px #8a2be2',
              lineHeight: '1.5',
              fontSize: '1.1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <pre style={{ whiteSpace: 'pre-wrap' }}>{typedText}</pre>
          </div>
        </div>
      )}
    </main>
  );
}









