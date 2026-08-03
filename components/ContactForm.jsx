"use client";

import { useId, useState } from "react";
import { CircleNotch, PaperPlaneTilt } from "@phosphor-icons/react";

const field =
  "w-full rounded-field border border-basalt/15 bg-transparent px-4 py-3 text-[15px] text-basalt " +
  "transition-colors focus:border-basalt focus:outline-none";

const subjects = [
  "Rooms & Suites",
  "A conference or event",
  "The restaurant",
  "Something else",
];

/* UI only for now. It validates, reports back, and is ready to be wired to
   whatever the lodge uses to receive enquiries. */
export default function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: subjects[0],
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  function onSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!values.name.trim()) next.name = "Tell us who you are.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      next.email = "Enter an email address the lodge can reply to.";
    if (values.message.trim().length < 10)
      next.message = "Add a little more detail so we can answer properly.";

    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    setTimeout(() => setStatus("sent"), 900);
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-surface border border-basalt/12 bg-paper-raised p-8"
      >
        <h2 className="font-display text-3xl leading-tight">Message sent</h2>
        <p className="mt-4 leading-relaxed text-sage">
          Thank you, {values.name.split(" ")[0]}. The lodge replies to{" "}
          {values.email} within one working day. For anything urgent, call
          +255 624 71 20 20.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues({ name: "", email: "", subject: subjects[0], message: "" });
            setStatus("idle");
          }}
          className="mt-7 rounded-full border border-basalt/20 px-6 py-3 font-medium transition-colors hover:border-basalt hover:bg-basalt hover:text-paper"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={`${uid}-name`} className="text-sm text-sage">
            Your name
          </label>
          <input
            id={`${uid}-name`}
            value={values.name}
            onChange={set("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            className={field}
          />
          {errors.name && (
            <p id={`${uid}-name-err`} className="text-sm text-danger">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor={`${uid}-email`} className="text-sm text-sage">
            Email
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            value={values.email}
            onChange={set("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            className={field}
          />
          {errors.email && (
            <p id={`${uid}-email-err`} className="text-sm text-danger">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor={`${uid}-subject`} className="text-sm text-sage">
          What is this about
        </label>
        <select
          id={`${uid}-subject`}
          value={values.subject}
          onChange={set("subject")}
          className={field}
        >
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor={`${uid}-message`} className="text-sm text-sage">
          Message
        </label>
        <textarea
          id={`${uid}-message`}
          rows={6}
          value={values.message}
          onChange={set("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${uid}-message-err` : `${uid}-message-help`}
          className={`${field} resize-y`}
        />
        {errors.message ? (
          <p id={`${uid}-message-err`} className="text-sm text-danger">
            {errors.message}
          </p>
        ) : (
          <p id={`${uid}-message-help`} className="text-sm text-sage">
            Who's travelling, and anything you need us to arrange.
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full border border-basalt px-8 py-4 font-medium text-basalt transition-colors hover:bg-basalt hover:text-paper active:scale-[0.98] disabled:opacity-70"
        >
          {status === "sending" ? (
            <CircleNotch size={17} weight="bold" className="animate-spin" />
          ) : (
            <PaperPlaneTilt size={17} weight="bold" />
          )}
          Send message
        </button>
      </div>
    </form>
  );
}
