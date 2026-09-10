import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './FormDemoPage.css';

// Works with <BrowserRouter> (no data router required).
// Intercepts NavLink/Link clicks via capture-phase listener before React
// handles them, and guards beforeunload for browser-level navigation.
function useNavigationGuard(when) {
  const [showModal, setShowModal] = useState(false);
  const pendingPathRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!when) return;

    const handleClick = (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) return;

      e.preventDefault();
      e.stopPropagation();
      pendingPathRef.current = href;
      setShowModal(true);
    };

    // Capture phase fires before React's synthetic event delegation
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [when]);

  const proceed = () => {
    setShowModal(false);
    if (pendingPathRef.current) {
      navigate(pendingPathRef.current);
      pendingPathRef.current = null;
    }
  };

  const cancel = () => {
    setShowModal(false);
    pendingPathRef.current = null;
  };

  return { showModal, proceed, cancel };
}

const STATES = [
  'Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
  'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'West Bengal',
];

const ConfirmModal = ({ onConfirm, onCancel }) => (
  <div className="fdp-overlay" role="dialog" aria-modal="true" aria-labelledby="fdp-modal-title">
    <div className="fdp-modal">
      <div className="fdp-modal-icon">!</div>
      <h2 id="fdp-modal-title" className="fdp-modal-title">Leave without saving?</h2>
      <p className="fdp-modal-body">
        You have unsaved changes. If you leave now your progress will be lost.
      </p>
      <div className="fdp-modal-actions">
        <button className="fdp-btn fdp-btn--ghost" onClick={onCancel}>Stay</button>
        <button className="fdp-btn fdp-btn--danger" onClick={onConfirm}>Leave anyway</button>
      </div>
    </div>
  </div>
);

const FieldError = ({ error }) =>
  error ? <span className="fdp-error" role="alert">{error.message}</span> : null;

const FormDemoPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting, isSubmitSuccessful, dirtyFields },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      payment: 'cod',
      saveAddress: false,
      notes: '',
    },
  });

  const { showModal, proceed, cancel } = useNavigationGuard(isDirty && !isSubmitSuccessful);

  // Block browser close / refresh
  useEffect(() => {
    const handler = (e) => {
      if (isDirty && !isSubmitSuccessful) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, isSubmitSuccessful]);

  const onSubmit = (data) => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        console.log('Form submitted:', data);
        resolve();
      }, 1000);
    });
  };

  const handleReset = () => reset();

  const dirtyCount = Object.keys(dirtyFields).length;
  const paymentValue = watch('payment');

  return (
    <div className="fdp-page">
      {showModal && (
        <ConfirmModal
          onConfirm={proceed}
          onCancel={cancel}
        />
      )}

      <div className="fdp-header">
        <h1 className="fdp-title">Shipping Details</h1>
        <p className="fdp-subtitle">
          Demonstrates <code>react-hook-form</code> — validation, dirty tracking, and unsaved-changes guard.
        </p>
      </div>

      {isSubmitSuccessful && (
        <div className="fdp-success" role="status">
          Order placed successfully! Check the browser console for submitted values.
        </div>
      )}

      <div className="fdp-layout">
        <form className="fdp-form" onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* ── Personal info ────────────────────────────── */}
          <section className="fdp-section">
            <h2 className="fdp-section-title">Personal Information</h2>

            <div className="fdp-row fdp-row--2">
              <div className="fdp-field">
                <label htmlFor="fullName">Full Name <span className="fdp-req">*</span></label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Ravi Kumar"
                  aria-invalid={!!errors.fullName}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 3, message: 'Name must be at least 3 characters' },
                    maxLength: { value: 60, message: 'Name must be 60 characters or fewer' },
                  })}
                />
                <FieldError error={errors.fullName} />
              </div>

              <div className="fdp-field">
                <label htmlFor="email">Email <span className="fdp-req">*</span></label>
                <input
                  id="email"
                  type="email"
                  placeholder="ravi@example.com"
                  aria-invalid={!!errors.email}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
                <FieldError error={errors.email} />
              </div>
            </div>

            <div className="fdp-field fdp-field--half">
              <label htmlFor="phone">Phone <span className="fdp-req">*</span></label>
              <input
                id="phone"
                type="tel"
                placeholder="9876543210"
                aria-invalid={!!errors.phone}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Enter a valid 10-digit Indian mobile number',
                  },
                })}
              />
              <FieldError error={errors.phone} />
            </div>
          </section>

          {/* ── Address ──────────────────────────────────── */}
          <section className="fdp-section">
            <h2 className="fdp-section-title">Delivery Address</h2>

            <div className="fdp-field">
              <label htmlFor="address">Address Line 1 <span className="fdp-req">*</span></label>
              <input
                id="address"
                type="text"
                placeholder="Flat / House No., Street"
                aria-invalid={!!errors.address}
                {...register('address', {
                  required: 'Address is required',
                  minLength: { value: 10, message: 'Please enter a fuller address' },
                })}
              />
              <FieldError error={errors.address} />
            </div>

            <div className="fdp-row fdp-row--3">
              <div className="fdp-field">
                <label htmlFor="city">City <span className="fdp-req">*</span></label>
                <input
                  id="city"
                  type="text"
                  placeholder="Hyderabad"
                  aria-invalid={!!errors.city}
                  {...register('city', { required: 'City is required' })}
                />
                <FieldError error={errors.city} />
              </div>

              <div className="fdp-field">
                <label htmlFor="state">State <span className="fdp-req">*</span></label>
                <select
                  id="state"
                  aria-invalid={!!errors.state}
                  {...register('state', { required: 'Please select a state' })}
                >
                  <option value="">Select state…</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <FieldError error={errors.state} />
              </div>

              <div className="fdp-field">
                <label htmlFor="pincode">PIN Code <span className="fdp-req">*</span></label>
                <input
                  id="pincode"
                  type="text"
                  placeholder="500001"
                  maxLength={6}
                  aria-invalid={!!errors.pincode}
                  {...register('pincode', {
                    required: 'PIN code is required',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'PIN code must be exactly 6 digits',
                    },
                  })}
                />
                <FieldError error={errors.pincode} />
              </div>
            </div>
          </section>

          {/* ── Payment ──────────────────────────────────── */}
          <section className="fdp-section">
            <h2 className="fdp-section-title">Payment Method</h2>

            <div className="fdp-radio-group" role="radiogroup" aria-label="Payment method">
              {[
                { value: 'cod',  label: 'Cash on Delivery', desc: 'Pay when the order arrives' },
                { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay' },
                { value: 'upi',  label: 'UPI', desc: 'GPay, PhonePe, Paytm' },
              ].map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={`fdp-radio-card ${paymentValue === value ? 'fdp-radio-card--selected' : ''}`}
                >
                  <input type="radio" value={value} {...register('payment')} />
                  <span className="fdp-radio-label">{label}</span>
                  <span className="fdp-radio-desc">{desc}</span>
                </label>
              ))}
            </div>
          </section>

          {/* ── Extras ───────────────────────────────────── */}
          <section className="fdp-section">
            <h2 className="fdp-section-title">Additional Options</h2>

            <div className="fdp-field">
              <label htmlFor="notes">Delivery Notes <span className="fdp-optional">(optional)</span></label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Leave at door, call before delivery, etc."
                aria-invalid={!!errors.notes}
                {...register('notes', {
                  maxLength: { value: 200, message: 'Notes must be 200 characters or fewer' },
                })}
              />
              <FieldError error={errors.notes} />
            </div>

            <label className="fdp-checkbox">
              <input type="checkbox" {...register('saveAddress')} />
              <span>Save this address for future orders</span>
            </label>
          </section>

          {/* ── Actions ──────────────────────────────────── */}
          <div className="fdp-actions">
            <button
              type="button"
              className="fdp-btn fdp-btn--ghost"
              onClick={handleReset}
              disabled={!isDirty || isSubmitting}
            >
              Reset
            </button>
            <button
              type="submit"
              className="fdp-btn fdp-btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing order…' : 'Place Order'}
            </button>
          </div>
        </form>

        {/* ── Sidebar: live form state ─────────────────── */}
        <aside className="fdp-sidebar">
          <h3 className="fdp-sidebar-title">Form State</h3>
          <dl className="fdp-state-list">
            <div className={`fdp-state-row ${isDirty ? 'fdp-state-row--warn' : ''}`}>
              <dt>isDirty</dt>
              <dd>{isDirty ? `Yes (${dirtyCount} field${dirtyCount !== 1 ? 's' : ''} changed)` : 'No'}</dd>
            </div>
            <div className={`fdp-state-row ${Object.keys(errors).length ? 'fdp-state-row--error' : ''}`}>
              <dt>Errors</dt>
              <dd>{Object.keys(errors).length ? Object.keys(errors).join(', ') : 'None'}</dd>
            </div>
            <div className="fdp-state-row">
              <dt>isSubmitting</dt>
              <dd>{isSubmitting ? 'Yes' : 'No'}</dd>
            </div>
            <div className={`fdp-state-row ${isSubmitSuccessful ? 'fdp-state-row--ok' : ''}`}>
              <dt>isSubmitSuccessful</dt>
              <dd>{isSubmitSuccessful ? 'Yes' : 'No'}</dd>
            </div>
            <div className="fdp-state-row">
              <dt>Payment</dt>
              <dd>{paymentValue || '—'}</dd>
            </div>
          </dl>
          <p className="fdp-sidebar-hint">
            Navigate away while the form is dirty to trigger the unsaved-changes guard.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default FormDemoPage;
