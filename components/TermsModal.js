import { useState, useEffect } from 'react';

export default function TermsModal({ onAccept, onReject, canClose }) {
  const [agreed, setAgreed] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e) => {
    const element = e.target;
    const threshold = 50;
    const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
    if (isAtBottom) {
      setScrolledToBottom(true);
    }
  };

  const canAccept = agreed && scrolledToBottom && timeSpent >= 5;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>📜 Terms and Conditions</h2>
          <p className="modal-subtitle">Please read carefully before downloading</p>
        </div>
        
        <div className="terms-content" onScroll={handleScroll}>
          <h3>Audio File Download Agreement</h3>
          
          <p className="terms-intro">
            By downloading this audio file, you acknowledge and agree to be bound by the following terms and conditions:
          </p>
          
          <section className="terms-section">
            <h4>1. LICENSE GRANT</h4>
            <p>The audio file ("Content") is provided for personal, non-commercial use only.</p>
          </section>

          <section className="terms-section">
            <h4>2. RESTRICTIONS</h4>
            <p>You SHALL NOT redistribute, share, sell, or modify the Content.</p>
          </section>

          <section className="terms-section">
            <h4>3. INTELLECTUAL PROPERTY</h4>
            <p>All rights remain with the original copyright holder.</p>
          </section>

          <section className="terms-section">
            <h4>4. PRIVACY</h4>
            <p>Your download will be logged and the uploader will be notified.</p>
          </section>

          <section className="terms-section">
            <h4>5. LIABILITY</h4>
            <p>The content is provided "AS IS" without any warranties.</p>
          </section>
          
          {!scrolledToBottom && (
            <div className="scroll-indicator">
              ⬇️ Please scroll to read all terms ⬇️
            </div>
          )}
        </div>

        <div className="modal-footer">
          {timeSpent < 5 && (
            <div className="timer-notice">
              Please read the terms carefully ({5 - timeSpent}s)
            </div>
          )}
          
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={!scrolledToBottom || timeSpent < 5}
            />
            <span>I have read, understood, and agree to the terms and conditions</span>
          </label>
          
          <div className="modal-buttons">
            <button onClick={onReject} className="reject-btn">
              Decline
            </button>
            <button 
              onClick={onAccept}
              disabled={!canAccept}
              className="accept-btn"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}