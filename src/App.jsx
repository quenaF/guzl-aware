'use client';

import { useEffect, useMemo, useState } from 'react';
import { booking, experienceContract, initialActivity } from './state.js';
import { registerGuzlTools } from './webmcp.js';

const prompts = [
  'Cancel Maya’s camp session tomorrow.',
  'We have another commitment tomorrow. Can you cancel it?',
  'She doesn’t feel comfortable going back after what happened yesterday.',
];

function ActivityItem({ item }) {
  return (
    <div className="activity-item">
      <div className="activity-dot" />
      <div>
        <strong>{item.title}</strong>
        <p>{item.detail}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [status, setStatus] = useState(booking.status);
  const [webmcp, setWebmcp] = useState({ ready: false, message: 'Checking browser support…' });
  const [activity, setActivity] = useState(initialActivity);
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const [contextMode, setContextMode] = useState('unknown');

  useEffect(() => {
    const onTool = (event) => {
      const { name, summary } = event.detail;
      setActivity((items) => [
        { title: name.replaceAll('_', ' '), detail: summary },
        ...items,
      ].slice(0, 8));
      if (name === 'webmcp_ready') setWebmcp({ ready: true, message: summary });
      if (name === 'webmcp_unavailable') setWebmcp({ ready: false, message: summary });
      if (name === 'cancel_booking') setStatus('cancelled');
      if (name === 'clarify_uncertainty') {
        setContextMode(event.detail.result?.supportBoundary ? 'support' : 'supplied');
      }
    };
    window.addEventListener('guzl:tool', onTool);
    registerGuzlTools();
    return () => window.removeEventListener('guzl:tool', onTool);
  }, []);

  const contextLabel = useMemo(() => {
    if (contextMode === 'support') return 'Human support boundary surfaced';
    if (contextMode === 'supplied') return 'Human-provided context preserved';
    return 'Cancellation reason remains unknown';
  }, [contextMode]);

  return (
    <main>
      <section className="hero shell">
        <div>
          <div className="eyebrow">WEBMCP × EXPERIENCE INTELLIGENCE</div>
          <h1>Capability is not the same as meaning.</h1>
          <p className="hero-copy">
            guzl is a reference demo for websites that expose not only what an agent can do,
            but the human context it should preserve while doing it.
          </p>
        </div>
        <div className={`status-pill ${webmcp.ready ? 'ok' : ''}`}>
          <span /> {webmcp.message}
        </div>
      </section>

      <section className="shell demo-grid">
        <div className="card booking-card">
          <div className="card-kicker">CURRENT BOOKING</div>
          <div className="booking-topline">
            <div>
              <h2>{booking.program}</h2>
              <p>{booking.session}</p>
            </div>
            <span className={`booking-status ${status}`}>{status}</span>
          </div>
          <dl>
            <div><dt>Participant</dt><dd>{booking.participant}</dd></div>
            <div><dt>When</dt><dd>{booking.startsAt}</dd></div>
            <div><dt>Authority</dt><dd>{booking.relationship}</dd></div>
            <div><dt>Booking ID</dt><dd>{booking.id}</dd></div>
          </dl>

          <div className="prompt-box">
            <div className="prompt-label">Try with a WebMCP-aware agent</div>
            <p>“{selectedPrompt}”</p>
            <div className="prompt-row">
              {prompts.map((prompt, index) => (
                <button key={prompt} onClick={() => setSelectedPrompt(prompt)}>
                  Scenario {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card contract-card">
          <div className="card-kicker">EXPERIENCE CONTRACT</div>
          <h2>{experienceContract.intent}</h2>

          <div className="contract-section">
            <span className="mini-label">Known</span>
            {experienceContract.known.map((item) => <p key={item}>✓ {item}</p>)}
          </div>

          <div className="contract-section unknown">
            <span className="mini-label">Unknown</span>
            <p>◌ {contextLabel}</p>
          </div>

          <div className="contract-section">
            <span className="mini-label">Do not infer</span>
            <div className="chips">
              {experienceContract.doNotInfer.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>

          <div className="contract-section">
            <span className="mini-label">Available paths</span>
            <div className="chips paths">
              {experienceContract.alternatives.map((item) => <span key={item.id}>{item.label}</span>)}
              <span>Human support</span>
              <span>Continue cancellation</span>
            </div>
          </div>

          <div className="boundary">
            <strong>Decision boundary</strong>
            <p>Cancellation requires explicit human confirmation.</p>
          </div>
        </div>
      </section>

      <section className="shell compare-card">
        <div>
          <div className="card-kicker">THE DIFFERENCE</div>
          <h2>Same capability. Different handling.</h2>
        </div>
        <div className="compare-grid">
          <div>
            <span className="compare-label">Capability only</span>
            <code>cancel_booking()</code>
            <p>The requested transaction is completed.</p>
          </div>
          <div className="arrow">→</div>
          <div className="aware">
            <span className="compare-label">guzl</span>
            <code>context → boundary → confirmation → action</code>
            <p>Meaning survives the transaction. Sensitive context can open a separate human-support path without blocking cancellation.</p>
          </div>
        </div>
      </section>

      <section className="shell activity-card">
        <div>
          <div className="card-kicker">LIVE TOOL ACTIVITY</div>
          <h2>What the agent discovered</h2>
          <p className="muted">Tool calls update this surface so the human can see the experience contract being used.</p>
        </div>
        <div className="activity-list">
          {activity.map((item, index) => <ActivityItem key={`${item.title}-${index}`} item={item} />)}
        </div>
      </section>

      <footer className="shell">
        <span>guzl · WebMCP Challenge 2026</span>
        <span>Capability contract × Experience contract</span>
      </footer>
    </main>
  );
}
