"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api-client";

const FormArea = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || null,
        message: form.message.trim(),
      });
      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus({
        type: "success",
        message: "Thank you. Your message has been sent successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to send your message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        <div className="col-md-6 mb-30">
          <div className="contact__form-area-item">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="col-md-6 md-mb-30">
          <div className="contact__form-area-item">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="col-md-12 mb-30">
          <div className="contact__form-area-item">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="col-md-12 mb-30">
          <div className="contact__form-area-item">
            <textarea
              name="message"
              placeholder="Message"
              required
              value={form.message}
              onChange={onChange}
            ></textarea>
          </div>
        </div>
        {status.message ? (
          <div className="col-md-12 mb-20">
            <p className={status.type === "success" ? "text-success" : "text-danger"}>
              {status.message}
            </p>
          </div>
        ) : null}
        <div className="col-md-12">
          <div className="contact__two-right-form-item">
            <button className="btn-one" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Now"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormArea;
