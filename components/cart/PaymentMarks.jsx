/*
  Payment marks for the checkout.

  These are the real logos, hotlinked from Wikimedia Commons rather than drawn
  by hand, so nothing here is an approximation of somebody's trademark:

    Visa        commons.wikimedia.org/wiki/File:Visa_Inc._logo_(2021–present).svg
    Mastercard  commons.wikimedia.org/wiki/File:Mastercard_2019_logo.svg
    Vodacom     en.wikipedia.org/wiki/File:Vodacom_Logo_2017.svg
    Airtel      commons.wikimedia.org/wiki/File:Airtel_Africa_logo.svg
    Yas         commons.wikimedia.org/wiki/File:Yas_Tanzania.svg

  The Vodacom file is the one exception to the Commons rule: Commons only holds
  the old blue and green group logo, so the current red wordmark comes from the
  English Wikipedia, where it is held as a non-free logo under fair use. That
  makes self-hosting it more pressing than the others, not less — take it from
  Vodacom's own brand portal, not from here, before this ships.

  Two things to settle before this goes live:

    1. Self-host them. Hotlinking someone else's CDN leaves the checkout's
       branding at the mercy of a file being renamed, and Wikimedia asks people
       not to lean on upload.wikimedia.org for production traffic. Drop the
       files into /public/brand and point these at local paths.
    2. Check each brand's own usage rules. Visa, Mastercard, Vodacom, Airtel
       and Yas all publish guidance on clear space, minimum size and where an
       acceptance mark may appear, and a payment page is exactly the context
       those rules are written for.

  Plain <img> rather than next/image on purpose: serving third-party SVG
  through the image optimiser needs `dangerouslyAllowSVG`, and an <img> renders
  SVG with scripting inert, which is the safer way to show a file from a host
  we do not control.
*/

const BASE = "https://upload.wikimedia.org/wikipedia/commons";

function Mark({ src, alt, className }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={`w-auto object-contain ${className}`}
    />
  );
}

export function VisaMark({ className = "h-3.5" }) {
  return (
    <Mark
      src={`${BASE}/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg`}
      alt="Visa"
      className={className}
    />
  );
}

export function MastercardMark({ className = "h-6" }) {
  return (
    <Mark src={`${BASE}/a/a4/Mastercard_2019_logo.svg`} alt="Mastercard" className={className} />
  );
}

export function VodacomMark({ className = "h-4" }) {
  return (
    <Mark
      src="https://upload.wikimedia.org/wikipedia/en/8/8c/Vodacom_Logo_2017.svg"
      alt="Vodacom M-Pesa"
      className={className}
    />
  );
}

export function AirtelMark({ className = "h-6" }) {
  return (
    <Mark src={`${BASE}/d/da/Airtel_Africa_logo.svg`} alt="Airtel Money" className={className} />
  );
}

export function YasMark({ className = "h-6" }) {
  return <Mark src={`${BASE}/f/f2/Yas_Tanzania.svg`} alt="Mixx by Yas" className={className} />;
}
