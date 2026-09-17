"use client";

import { useState } from "react";
import { submitQuote } from "@/lib/api-client";

const SERVICE_OPTIONS = [
  { id: "seo", label: "Optimization (SEO)" },
  { id: "web-design", label: "Web Design" },
  { id: "web-hosting", label: "Web Hosting" },
  { id: "maintenance", label: "Maintenance" },
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  message: "",
  services: [],
};

const RequestQuoteMain = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onServiceToggle = (label) => {
    setForm((prev) => {
      const exists = prev.services.includes(label);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((item) => item !== label)
          : [...prev.services, label],
      };
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.services.length) {
      setStatus({
        type: "error",
        message: "Please select at least one service.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitQuote({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        website: form.website.trim(),
        services: form.services,
        message: form.message.trim(),
      });
      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Thank you. Your quote request has been submitted.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to submit quote request. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="request-quote__area section-padding">
      <div className="container">
        <form onSubmit={onSubmit}>
          <div className="request-quote__area-inputs">
            <div className="request-quote__area-input-field">
              <label htmlFor="first-name">First Name *</label>
              <input
                type="text"
                id="first-name"
                name="firstName"
                placeholder="First"
                required
                value={form.firstName}
                onChange={onChange}
              />
            </div>
            <div className="request-quote__area-input-field">
              <label htmlFor="last-name">Last Name *</label>
              <input
                type="text"
                id="last-name"
                name="lastName"
                placeholder="Last"
                required
                value={form.lastName}
                onChange={onChange}
              />
            </div>
            <div className="request-quote__area-input-field">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={onChange}
              />
            </div>
            <div className="request-quote__area-input-field">
              <label htmlFor="number">Number *</label>
              <input
                type="text"
                id="number"
                name="phone"
                placeholder="+ 00 123 4567"
                required
                value={form.phone}
                onChange={onChange}
              />
            </div>
            <div className="request-quote__area-input-field">
              <label htmlFor="company">Company/Organization *</label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Envato"
                required
                value={form.company}
                onChange={onChange}
              />
            </div>
            <div className="request-quote__area-input-field">
              <label htmlFor="website">Website *</label>
              <input
                type="text"
                id="website"
                name="website"
                placeholder="http://envato.com"
                required
                value={form.website}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="request-quote__area-service-input">
            <span>What services can we provide you? *</span>
            {SERVICE_OPTIONS.map((service) => (
              <div className="request-quote__area-service-input-single" key={service.id}>
                <input
                  type="checkbox"
                  id={service.id}
                  checked={form.services.includes(service.label)}
                  onChange={() => onServiceToggle(service.label)}
                />
                <label htmlFor={service.id}>{service.label}</label>
              </div>
            ))}
          </div>

          <label htmlFor="message" className="mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Type Here"
            required
            value={form.message}
            onChange={onChange}
          ></textarea>

          {status.message ? (
            <p
              className={`mt-3 ${status.type === "success" ? "text-success" : "text-danger"}`}
            >
              {status.message}
            </p>
          ) : null}

          <button type="submit" className="btn-two mt-4" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestQuoteMain;
