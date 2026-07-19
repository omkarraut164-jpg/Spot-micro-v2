import React, { useState } from 'react';
import './ReserveSection.css';

const ReserveSection = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="reserve-section" id="reserve">
      {/* Background FX */}
      <div className="reserve-section__bg" />

      <div className="container">
        <div className="reserve-section__inner">
          <div className="reserve-section__badge">
            <span className="reserve-led" />
            <span>Early Access Open</span>
          </div>

          <h2 className="t-display reserve-section__headline">
            Ready to bring Spot Micro home?
            <br />
            <span className="gradient-text">Reserve My Spot Micro.</span>
          </h2>

          <p className="t-body reserve-section__body">
            Join the first batch of makers and dog lovers. Limited units for early adopters.
            Secure your unit with a fully refundable deposit and receive priority delivery,
            lifetime puppy OS updates, and exclusive founder status.
          </p>

          {!submitted ? (
            <form className="reserve-form" onSubmit={handleSubmit}>
              <div className="reserve-form__input-wrap">
                <input
                  type="email"
                  className="reserve-form__input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address for reservation"
                />
                <button type="submit" className="reserve-form__btn">
                  <span>Reserve My Spot Micro</span>
                  <span className="reserve-form__btn-arrow">→</span>
                </button>
              </div>
              <p className="reserve-form__note">
                Fully refundable deposit · No spam · Unsubscribe anytime
              </p>
            </form>
          ) : (
            <div className="reserve-success">
              <div className="reserve-success__icon">✓</div>
              <h3 className="reserve-success__title">You're on the list.</h3>
              <p className="reserve-success__body">
                Thank you. We'll reach out with next steps and your reservation
                confirmation at <strong>{email}</strong>.
              </p>
            </div>
          )}

          {/* Founder perks */}
          <div className="reserve-perks">
            {[
              { icon: '◈', title: 'Priority Delivery',    body: 'Guaranteed Spot Micro unit in the first production batch.' },
              { icon: '◉', title: 'Lifetime Puppy Updates', body: 'Free puppy OS and firmware upgrades forever.' },
              { icon: '◆', title: 'Founder Status',        body: 'Exclusive badge, serial number, and maker community access.' },
            ].map((p, i) => (
              <div key={i} className="reserve-perk">
                <span className="reserve-perk__icon">{p.icon}</span>
                <div>
                  <p className="reserve-perk__title">{p.title}</p>
                  <p className="reserve-perk__body">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReserveSection;
