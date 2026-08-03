"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, EyeIcon, EyeOffIcon, LockKeyholeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DEMO_PASSCODE, signIn } from "@/lib/adminAuth";

/*
  Trimmed down from the registry's @efferd/auth-5 block: that page offered
  Google/Apple/GitHub and a "sign in or join" magic link, none of which apply
  here — there are no user accounts, only one shared passcode gating a demo
  admin area. What is kept is the two-pane layout; what changed is the form,
  the copy, and the backdrop, which is the property's own mark oversized and
  faded rather than the block's stock animated-lines effect.
*/
export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [passcode, setPasscode] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (signIn(passcode)) {
      router.replace(next);
    } else {
      setError("That's not it. Try the demo passcode below.");
    }
  }

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col overflow-hidden border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
        {/* The mark itself, small and faint, centred in the column. */}
        <Image
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 w-[45%] max-w-[280px] -translate-x-1/2 -translate-y-1/2 opacity-[0.09] grayscale"
          height={189}
          src="/brand/logo-masailand.png"
          width={300}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />

        <a className="relative z-10 mr-auto flex items-center gap-2" href="/">
          <Image
            alt="Masailand Safari & Lodge"
            className="h-8 w-auto"
            height={189}
            src="/brand/logo-masailand.png"
            width={300}
          />
        </a>

        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="font-hero text-2xl leading-snug">
              A hilltop lodge in Arusha, with Mount Meru on the horizon and the
              northern safari circuit at the gate.
            </p>
            <footer className="font-display text-sm">~ Masailand Safari &amp; Lodge</footer>
          </blockquote>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col justify-center px-8">
        <div aria-hidden className="absolute inset-0 isolate -z-10 opacity-60 contain-strict">
          <div className="absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>

        <Button asChild className="absolute top-7 left-5" variant="ghost">
          <a href="/">
            <ChevronLeftIcon data-icon="inline-start" />
            Back to the site
          </a>
        </Button>

        <div className="mx-auto space-y-6 sm:w-sm">
          <Image
            alt="Masailand Safari & Lodge"
            className="h-7 w-auto lg:hidden"
            height={189}
            src="/brand/logo-masailand.png"
            width={300}
          />

          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-2xl tracking-wide">Sign in to the admin area</h1>
            <p className="text-base text-muted-foreground">
              One shared passcode for this preview — there are no individual
              accounts.
            </p>
          </div>

          <form className="space-y-3" onSubmit={submit}>
            {/* No border or ring on this one when focused, or when a browser
                password manager marks it as a field it can fill — the
                passcode field sits right under the pitch, and shadcn's
                default focus ring reads as an error state against this
                layout. */}
            <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0">
              <InputGroupInput
                autoComplete="current-password"
                autoFocus
                className="border-transparent outline-none focus:border-transparent focus:outline-none focus-visible:border-transparent focus-visible:outline-none"
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                placeholder="Passcode"
                type={reveal ? "text" : "password"}
                value={passcode}
              />
              <InputGroupAddon align="inline-start">
                <LockKeyholeIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label={reveal ? "Hide passcode" : "Show passcode"}
                  onClick={() => setReveal((v) => !v)}
                  size="icon-xs"
                  type="button"
                >
                  {reveal ? <EyeOffIcon /> : <EyeIcon />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </form>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3.5 py-3 text-xs leading-relaxed text-amber-700 dark:text-amber-500">
            This gate runs entirely in the browser — the passcode ships in the
            page and only keeps out a casual visitor, not a determined one.
            Demo passcode:{" "}
            <code className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono">
              {DEMO_PASSCODE}
            </code>
          </div>
        </div>
      </div>
    </main>
  );
}
