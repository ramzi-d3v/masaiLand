"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarBlank,
  CreditCard,
  EnvelopeSimple,
  LockSimple,
  Phone,
  SpinnerGap,
  User,
  Warning,
} from "@phosphor-icons/react";
import { useCart } from "@/components/cart/CartProvider";
import {
  AirtelMark,
  MastercardMark,
  VisaMark,
  VodacomMark,
  YasMark,
} from "@/components/cart/PaymentMarks";
import { currency } from "@/lib/catalogue";
import { saveOrder } from "@/lib/orders";

/*
  ============================ SIMULATION ONLY ============================
  This checkout does not take a payment and is not wired to a payment service.
  Nothing typed into it is sent anywhere: the card and phone fields live in
  component state for the length of the visit and are never written to storage,
  never put in a URL, and never posted. "Paying" runs a timer and prints a
  receipt from figures already in the browser.

  It is built this way so the flow and the screens can be reviewed before the
  property chooses a real provider. Two things must happen before this goes
  anywhere near a live site:

    1. Replace this component with the provider's own hosted checkout or
       element — card details should never touch this codebase.
    2. Take the demo banners out only once (1) is done, never before. They are
       the only thing stopping someone typing a real card number into a form
       that goes nowhere.

  The mobile money options are the three Tanzanian networks the lodge's guests
  actually use: M-Pesa (Vodacom), Mixx by Yas, and Airtel Money. Each would be
  a real integration; here each is a mock "approve on your handset" step.
  =========================================================================
*/

const METHODS = [
  {
    id: "card",
    label: "Debit or credit card",
    hint: "Visa, Mastercard",
    marks: (
      <>
        <VisaMark className="h-3.5" />
        <MastercardMark className="h-6" />
      </>
    ),
  },
  { id: "mpesa", label: "M-Pesa", hint: "Vodacom", marks: <VodacomMark className="h-4" /> },
  { id: "mixx", label: "Mixx by Yas", hint: "Yas", marks: <YasMark className="h-6" /> },
  { id: "airtel", label: "Airtel Money", hint: "Airtel", marks: <AirtelMark className="h-6" /> },
];

/* Only Tanzania for now. It is a select rather than fixed text so another
   market can be added without redrawing the field. */
const DIAL_CODES = [{ code: "+255", flag: "🇹🇿", name: "Tanzania" }];

const groupDigits = (value, size = 4) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(new RegExp(`(.{${size}})`, "g"), "$1 ")
    .trim();

/*
  Field chrome. Both of these sit at module scope on purpose: a component
  declared inside another component is a new type on every render, so React
  would tear the input down and rebuild it on every keystroke and the caret
  would jump to the end.
*/
const field = (bad) =>
  `w-full rounded-field border bg-paper py-3.5 pl-11 pr-4 text-[15px] placeholder:text-[13px] placeholder:text-sage-soft focus:outline-none ${
    bad ? "border-danger focus:border-danger" : "border-basalt/20 focus:border-basalt"
  }`;

function Field({ id, label, icon: Icon, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-sage">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          weight="light"
          aria-hidden
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
            error ? "text-danger" : "text-sage"
          }`}
        />
        {children}
      </div>
      {error ? (
        <p className="mt-1.5 text-[13px] text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-sage-soft">{hint}</p>
      ) : null}
    </div>
  );
}

/* A demo reference. Random on purpose: there is no booking system behind it. */
const makeReference = () =>
  `MSL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;

/* The page's own heading. It lives in here rather than in the route so the
   checkout can place it: above the form while there is still something to
   fill in, and beside the coupon once there is not. */
function PageTitle() {
  return (
    <>
      <h1 className="font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.04]">Checkout</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-sage">
        A working demonstration of the payment step, card and Mobile Money, so
        the flow can be reviewed before a real provider is chosen.
      </p>
    </>
  );
}

function DemoBanner({ tone = "page" }) {
  return (
    <p
      className={`flex items-start gap-2.5 rounded-field border border-danger/30 bg-danger/5 p-4 text-sm leading-relaxed text-danger ${
        tone === "page" ? "" : "mt-4"
      }`}
    >
      <Warning size={17} weight="light" className="mt-0.5 shrink-0" />
      <span>
        <strong className="font-medium">Simulation, not a real checkout.</strong>{" "}
        No payment is taken and nothing you type is sent anywhere. Do not enter a
        real card number or Mobile Money PIN.
      </span>
    </p>
  );
}

export default function Checkout() {
  const { lines, subtotal, count, hydrated, clear } = useCart();

  const [method, setMethod] = useState("card");
  const [stage, setStage] = useState("form"); // form → paying → done
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");

  // Held in memory for this screen only, never persisted.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [phone, setPhone] = useState("");

  const [dial] = useState(DIAL_CODES[0]);
  // Which fields the visitor has left, so an error only appears after they
  // have had their go at it rather than the moment the page loads.
  const [touched, setTouched] = useState({});

  const isCard = method === "card";
  const methodMeta = METHODS.find((m) => m.id === method);

  /* One place that decides whether a field is wrong and what to say about it.
     Nothing here talks to a payment network — it is shape checking only. */
  const errors = useMemo(() => {
    const e = {};
    if (name.trim().length < 2) e.name = "Enter the name the booking is under.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      e.email = "Enter an email the lodge can reply to.";

    if (isCard) {
      const digits = card.replace(/\D/g, "");
      if (digits.length !== 16) e.card = "A card number is 16 digits.";
      const [mm, yy] = expiry.split("/");
      if (!mm || !yy || mm.length !== 2 || yy.length !== 2) e.expiry = "Use MM/YY.";
      else if (Number(mm) < 1 || Number(mm) > 12) e.expiry = "Months run 01 to 12.";
      else if (new Date(2000 + Number(yy), Number(mm)) < new Date()) e.expiry = "That date has passed.";
      if (cvc.length < 3) e.cvc = "Three digits.";
    } else {
      const digits = phone.replace(/\D/g, "");
      if (digits.length !== 9) e.phone = `A Tanzanian number is 9 digits after ${dial.code}.`;
      else if (!/^[67]/.test(digits)) e.phone = "Mobile numbers start 6 or 7.";
    }
    return e;
  }, [name, email, isCard, card, expiry, cvc, phone, dial.code]);

  const ready = Object.keys(errors).length === 0;
  const show = (field) => (touched[field] || touched.all) && errors[field];
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const pay = (e) => {
    e.preventDefault();
    if (!ready) {
      setTouched((t) => ({ ...t, all: true }));
      setError("Check the fields marked above and the demo will run.");
      return;
    }
    setError("");
    setStage("paying");

    // Stands in for the round trip to a provider, and for the handset prompt
    // on the three mobile money networks.
    window.setTimeout(() => {
      const reference = makeReference();
      const at = new Date();
      // Only the last four of a card are kept, and only for this screen. The
      // full number, the expiry and the CVC are never stored anywhere.
      const detail = isCard
        ? `•••• ${card.replace(/\D/g, "").slice(-4)}`
        : `${dial.code} ${phone.replace(/\D/g, "").replace(/(\d{3})(?=\d)/g, "$1 ")}`;
      const orderLines = lines.map((l) => ({
        name: l.name,
        qty: l.qty,
        unit: l.unit,
        unitPlural: l.unitPlural,
        option: l.option,
        price: l.price,
      }));

      setReceipt({
        reference,
        amount: subtotal,
        at,
        method: methodMeta.label,
        marks: methodMeta.marks,
        detail,
        name,
        lines: orderLines,
      });

      /* The admin side reads these back. Same masked detail as the receipt —
         no card number, no PIN, nothing that could be replayed. */
      saveOrder({
        reference,
        at: at.toISOString(),
        amount: subtotal,
        method: methodMeta.label,
        methodId: method,
        detail,
        name,
        email,
        lines: orderLines,
        status: "paid",
        simulated: true,
      });

      setStage("done");
      clear();
    }, 2200);
  };

  if (!hydrated) {
    return (
      <>
        <PageTitle />
        <div className="mt-12 rounded-surface border border-basalt/12 p-10">
          <p className="text-sage">Loading your booking…</p>
        </div>
      </>
    );
  }

  /* The receipt, on the ticket shape from the reference: a header, a perforated
     rule, then the facts of the transaction. */
  if (stage === "done" && receipt) {
    /* Once the coupon exists it becomes the subject of the page, so the
       heading, the caveat and the ways out all move into a column beside it
       rather than stacking above it. The coupon itself carries a drop-shadow
       filter on its wrapper rather than a box-shadow on the card, so the
       shadow follows the torn edge along the bottom instead of squaring it
       off. */
    return (
      // Narrower than the page so the pair reads as one centred block rather
      // than a heading and a coupon pushed to opposite edges, and the two
      // columns sit level with each other rather than top-aligned.
      <div className="mx-auto grid max-w-[940px] items-center gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          <PageTitle />

          <p className="mt-8 flex max-w-md items-start gap-2.5 rounded-field border border-danger/30 bg-danger/5 p-4 text-sm leading-relaxed text-danger">
            <Warning size={16} weight="light" className="mt-0.5 shrink-0" />
            This receipt is generated in your browser for demonstration. It is
            not proof of a booking and no money moved. Call the lodge to book
            for real.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-basalt px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-basalt-raised"
            >
              Talk to the lodge
            </Link>
            <Link
              href="/book"
              className="rounded-full border border-basalt px-6 py-3 text-sm font-medium transition-colors hover:bg-basalt hover:text-paper"
            >
              Back to rooms and halls
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[380px] [filter:drop-shadow(0_16px_32px_rgba(23,26,25,0.18))]">
        <div className="overflow-hidden rounded-t-surface bg-paper-raised">
          <div className="px-7 pb-7 pt-8 text-center">
            <span className="relative mx-auto grid h-14 w-14 place-items-center">
              <span aria-hidden className="tick-halo absolute inset-0 rounded-full bg-success/25" />
              <span className="tick-ring relative grid h-14 w-14 place-items-center rounded-full bg-success-soft">
                <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none" aria-hidden>
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="var(--success)"
                    strokeWidth="1.5"
                    opacity="0.35"
                  />
                  <path
                    className="tick-path"
                    d="M13 20.4 18 25.4 27.5 15.5"
                    stroke="var(--success)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>

            <h2 className="mt-4 font-display text-2xl leading-tight">Thank you</h2>
            <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-sage">
              Recorded in this demo. Nothing was charged.
            </p>
            <p className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-xs font-medium text-success">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
              Payment simulated successfully
            </p>
          </div>

          <div className="mx-7 border-t border-dashed border-basalt/25" />

          <dl className="space-y-5 p-7">
            <div className="flex items-start justify-between gap-6">
              <div>
                <dt className="label text-sage">Reference</dt>
                <dd className="mt-1.5 font-mono text-[13px]">{receipt.reference}</dd>
              </div>
              <div className="text-right">
                <dt className="label text-sage">Amount</dt>
                <dd className="mt-1.5 font-display text-xl leading-none">
                  {currency(receipt.amount)}
                </dd>
              </div>
            </div>

            <div>
              <dt className="label text-sage">Date and time</dt>
              <dd className="mt-1.5 text-[13px]">
                {receipt.at.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {" · "}
                {receipt.at.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </dd>
            </div>

            <div className="flex items-center gap-3 rounded-field bg-paper p-3.5">
              <span className="flex shrink-0 items-center gap-1.5">{receipt.marks}</span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] text-basalt">{receipt.name}</span>
                <span className="block text-[13px] text-sage">
                  {receipt.method} · {receipt.detail}
                </span>
              </span>
            </div>

            <div>
              <dt className="label text-sage">Booked</dt>
              <dd className="mt-1.5 space-y-1.5">
                {receipt.lines.map((l) => (
                  <p key={l.name} className="flex justify-between gap-4 text-[13px]">
                    <span className="text-basalt">{l.name}</span>
                    <span className="text-sage">
                      {l.qty} {l.qty === 1 ? l.unit : l.unitPlural}
                    </span>
                  </p>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        {/* Torn bottom edge. Teeth are drawn in the coupon's own colour with
            transparent gaps, so whatever the page is sitting on shows through
            between them and nothing has to be colour-matched by hand. */}
        <svg
          viewBox="0 0 400 12"
          preserveAspectRatio="none"
          aria-hidden
          className="-mt-px block h-3 w-full"
        >
          <path
            d="M0 0h400v1L390 12 380 1 370 12 360 1 350 12 340 1 330 12 320 1 310 12 300 1 290 12 280 1 270 12 260 1 250 12 240 1 230 12 220 1 210 12 200 1 190 12 180 1 170 12 160 1 150 12 140 1 130 12 120 1 110 12 100 1 90 12 80 1 70 12 60 1 50 12 40 1 30 12 20 1 10 12 0 1Z"
            fill="var(--paper-raised)"
          />
        </svg>

        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <PageTitle />
        <div className="mt-12 rounded-surface border border-basalt/12 bg-paper-raised p-10 text-center sm:p-16">
          <h2 className="font-display text-3xl">Your booking is empty</h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-sage">
            Add a room or a hall and the checkout opens up.
          </p>
          <Link
            href="/book"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-basalt px-7 py-3.5 font-medium text-paper transition-colors hover:bg-basalt-raised"
          >
            Browse rooms and halls
            <ArrowRight size={15} weight="bold" />
          </Link>
        </div>
      </>
    );
  }

  /* Nothing here — `field` and `Field` live at module scope, below the
     component, so React keeps the same input elements across renders and the
     caret stays where the visitor put it. */

  return (
    <>
      <PageTitle />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        {/* Left: who and how */}
        <form onSubmit={pay} noValidate>
        <DemoBanner />

        <h2 className="mt-10 font-display text-2xl">Contact</h2>
        <div className="mt-5 space-y-5">
          <Field id="co-name" label="Full name" icon={User} error={show("name")}>
            <input
              id="co-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={blur("name")}
              placeholder="As it should appear on the booking"
              autoComplete="name"
              aria-invalid={show("name") ? true : undefined}
              className={field(show("name"))}
            />
          </Field>

          <Field id="co-email" label="Email" icon={EnvelopeSimple} error={show("email")}>
            <input
              id="co-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={blur("email")}
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={show("email") ? true : undefined}
              className={field(show("email"))}
            />
          </Field>
        </div>

        <h2 className="mt-10 font-display text-2xl">Payment</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {METHODS.map((m) => {
            const on = method === m.id;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    setMethod(m.id);
                    setError("");
                  }}
                  aria-pressed={on}
                  className={`flex w-full items-center gap-3 rounded-field border p-4 text-left transition-colors ${
                    on ? "border-basalt bg-paper-raised" : "border-basalt/20 hover:border-basalt/50"
                  }`}
                >
                  <span className="flex shrink-0 items-center gap-1.5">{m.marks}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] text-basalt">{m.label}</span>
                    <span className="block text-xs text-sage">{m.hint}</span>
                  </span>
                  <span
                    aria-hidden
                    className={`ml-auto h-4 w-4 shrink-0 rounded-full border transition-colors ${
                      on ? "border-[5px] border-basalt" : "border-basalt/25"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 space-y-5">
          {isCard ? (
            <>
              <Field
                id="co-card"
                label="Card number"
                icon={CreditCard}
                error={show("card")}
                hint="Use 4242 4242 4242 4242 — the demo checks the shape only."
              >
                <input
                  id="co-card"
                  value={card}
                  onChange={(e) => setCard(groupDigits(e.target.value))}
                  onBlur={blur("card")}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-invalid={show("card") ? true : undefined}
                  className={`${field(show("card"))} font-mono`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                  <VisaMark className="h-3" />
                  <MastercardMark className="h-5" />
                </span>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field id="co-exp" label="Expiry" icon={CalendarBlank} error={show("expiry")}>
                  <input
                    id="co-exp"
                    value={expiry}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                    }}
                    onBlur={blur("expiry")}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-invalid={show("expiry") ? true : undefined}
                    className={`${field(show("expiry"))} font-mono`}
                  />
                </Field>
                <Field id="co-cvc" label="Security code" icon={LockSimple} error={show("cvc")}>
                  <input
                    id="co-cvc"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    onBlur={blur("cvc")}
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-invalid={show("cvc") ? true : undefined}
                    className={`${field(show("cvc"))} font-mono`}
                  />
                </Field>
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="co-phone" className="mb-2 block text-sm text-sage">
                {methodMeta.label} number
              </label>
              <div className="flex gap-2">
                {/* Country code sits in its own control, Tanzania only. */}
                <div className="relative shrink-0">
                  <select
                    aria-label="Country code"
                    value={dial.code}
                    onChange={() => {}}
                    className="h-full appearance-none rounded-field border border-basalt/20 bg-paper py-3.5 pl-3.5 pr-3.5 font-mono text-[15px] focus:border-basalt focus:outline-none"
                  >
                    {DIAL_CODES.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.flag} {d.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1">
                  <Phone
                    size={16}
                    weight="light"
                    aria-hidden
                    className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                      show("phone") ? "text-danger" : "text-sage"
                    }`}
                  />
                  <input
                    id="co-phone"
                    value={phone}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, "").slice(0, 9);
                      setPhone(d.replace(/(\d{3})(?=\d)/g, "$1 ").trim());
                    }}
                    onBlur={blur("phone")}
                    placeholder="754 123 456"
                    inputMode="tel"
                    autoComplete="off"
                    aria-invalid={show("phone") ? true : undefined}
                    className={`${field(show("phone"))} font-mono`}
                  />
                </div>
              </div>
              {show("phone") ? (
                <p className="mt-1.5 text-[13px] text-danger">{errors.phone}</p>
              ) : (
                <p className="mt-1.5 text-[13px] leading-relaxed text-sage-soft">
                  {methodMeta.label} would push a prompt to this handset to
                  approve. Never enter your PIN on a web page — not here, not
                  anywhere.
                </p>
              )}
            </div>
          )}
        </div>

        {error && <p className="mt-5 text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={stage === "paying"}
          className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-basalt px-8 py-4 font-medium text-paper transition-colors hover:bg-basalt-raised disabled:opacity-70"
        >
          {stage === "paying" ? (
            <>
              <SpinnerGap size={17} weight="bold" className="animate-spin" />
              {isCard ? "Simulating payment…" : `Waiting for the ${methodMeta.hint} prompt…`}
            </>
          ) : (
            <>Run the demo payment · {currency(subtotal)}</>
          )}
        </button>

        <Link
          href="/cart"
          className="mt-5 inline-flex items-center gap-2 text-sm text-sage hover:text-basalt"
        >
          <ArrowLeft size={14} weight="light" />
          Back to your booking
        </Link>
      </form>

      {/* Right: what is being booked */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-surface border border-basalt/12 bg-paper-raised p-7">
          <h2 className="font-display text-2xl">Your booking</h2>

          <ul className="mt-6 space-y-5">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-4">
                <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-field bg-paper-deep">
                  <Image
                    src={`/img/${line.image}.webp`}
                    alt=""
                    aria-hidden
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-basalt px-1 font-mono text-[10px] text-paper">
                    {line.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px]">{line.name}</p>
                  <p className="text-sm text-sage">
                    {line.option} · {line.qty} {line.qty === 1 ? line.unit : line.unitPlural}
                  </p>
                </div>
                <p className="shrink-0 text-[15px]">{currency(line.price * line.qty)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-7 space-y-3 border-t border-basalt/10 pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-sage">
                Subtotal · {lines.length} {lines.length === 1 ? "line" : "lines"}
              </dt>
              <dd>{currency(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sage">Nights and days</dt>
              <dd>{count}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sage">Taxes and levies</dt>
              <dd className="text-sage">Confirmed by the lodge</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-basalt/10 pt-6">
            <span className="font-display text-xl">Total</span>
            <span className="font-display text-3xl leading-none">{currency(subtotal)}</span>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-sage-soft">
            Rates are the illustrative figures held in the site&rsquo;s content
            file, not the property&rsquo;s published rate card, and taxes are not
            modelled.
          </p>
        </div>
        </aside>
      </div>
    </>
  );
}
