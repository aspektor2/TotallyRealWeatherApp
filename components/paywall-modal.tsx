"use client";

import { useEffect, useRef, useState } from "react";
import {
  CreditCard,
  PlayCircle,
  Database,
  Briefcase,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  BadgePercent,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drizzle, SpeechBubble } from "@/components/drizzle";
import { Confetti } from "@/components/confetti";
import { DISCOUNT_CODE, TIERS, type Tier } from "@/lib/tiers";
import { cn } from "@/lib/utils";

type View = "options" | "purchase" | "ad" | "sell" | "sales" | "success";

export function PaywallModal({
  open,
  tier,
  location,
  onOpenChange,
  onUnlock,
}: {
  open: boolean;
  tier: Tier;
  location?: string;
  onOpenChange: (open: boolean) => void;
  onUnlock: (tier: Tier) => void;
}) {
  const t = TIERS[tier];
  const [view, setView] = useState<View>("options");
  const [soldTo, setSoldTo] = useState<string[] | null>(null);

  useEffect(() => {
    if (open) {
      setView("options");
      setSoldTo(null);
    }
  }, [open, tier]);

  function succeed(note?: string[]) {
    setSoldTo(note ?? null);
    setView("success");
    onUnlock(tier);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {view === "options" && (
          <>
            <div className="mb-4 flex items-center gap-3">
              <Drizzle mood="guard" className="h-20 w-24 shrink-0" />
              <SpeechBubble>
                Whoa there, buddy! This data is protected under the Totally
                Real Weather Access Program. {t.name} is {t.priceLabel}. I
                don&apos;t make the rules. (I make the rules.)
              </SpeechBubble>
            </div>
            <DialogTitle>Unlock Premium Weather™</DialogTitle>
            <DialogDescription>
              Pick how you&apos;d like to pay. Drizzle accepts almost
              everything.
            </DialogDescription>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <OptionCard
                icon={CreditCard}
                color="bg-tile-mint text-tile-mintText"
                title="Purchase Access"
                body={`One-time payment of ${t.priceLabel}. Valid for the current session only.`}
                cta="Purchase Now"
                variant="primary"
                onClick={() => setView("purchase")}
              />
              <OptionCard
                icon={PlayCircle}
                color="bg-tile-blue text-tile-blueText"
                title="Watch An Advertisement"
                body="View a short message from one of our atmospheric partners."
                cta="Continue"
                variant="outline"
                onClick={() => setView("ad")}
              />
              <OptionCard
                icon={Database}
                color="bg-tile-purple text-tile-purpleText"
                title="Provide Personal Information"
                body="Trade your secrets for sweet, sweet humidity."
                cta="Get Started"
                variant="outline"
                onClick={() => setView("sell")}
              />
              <OptionCard
                icon={Briefcase}
                color="bg-tile-amber text-tile-amberText"
                title="Contact Sales"
                body="Discuss weather procurement with our team. (The team is Drizzle.)"
                cta="Schedule Demo"
                variant="outline"
                onClick={() => setView("sales")}
              />
            </div>
            <p className="mt-5 text-center text-xs font-bold text-mist">
              Weather accuracy not guaranteed. All sales final.
            </p>
          </>
        )}

        {view === "purchase" && (
          <PurchaseFlow
            tier={tier}
            location={location}
            onBack={() => setView("options")}
            onFreeUnlock={() => succeed()}
          />
        )}

        {view === "ad" && <AdFlow onBack={() => setView("options")} />}

        {view === "sell" && (
          <SellDataFlow
            onBack={() => setView("options")}
            onDone={() =>
              succeed([
                "WeatherCorp",
                "Rainlytics",
                "CloudHub",
                "National Temperature Bureau",
              ])
            }
          />
        )}

        {view === "sales" && <SalesFlow onBack={() => setView("options")} />}

        {view === "success" && (
          <div className="relative py-4 text-center">
            <Confetti />
            <Drizzle mood="party" className="mx-auto h-24 w-28" />
            <DialogTitle className="mt-3">
              {soldTo ? "Thank you." : "Woo-hoo! Premium weather!"}
            </DialogTitle>
            {soldTo ? (
              <div className="mx-auto mt-4 max-w-sm text-left">
                <p className="text-sm font-bold text-slateink">
                  Your information has been successfully sold to:
                </p>
                <ul className="mt-3 space-y-2">
                  {soldTo.map((org) => (
                    <li
                      key={org}
                      className="flex items-center gap-2 text-sm font-extrabold text-ink"
                    >
                      <CheckCircle2 className="h-4 w-4 text-leaf" /> {org}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-bold italic text-slateink">
                  Your sacrifice has been accepted.
                </p>
              </div>
            ) : (
              <DialogDescription className="mx-auto max-w-sm">
                {t.name} is now active. Purchases are valid for the current
                session only. Drizzle is so proud of you.
              </DialogDescription>
            )}
            <Button variant="sky" className="mt-6" onClick={() => onOpenChange(false)}>
              View My Weather
            </Button>
            <p className="mt-4 text-xs font-bold text-mist">
              Weather accuracy not guaranteed. All sales final.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function OptionCard({
  icon: Icon,
  color,
  title,
  body,
  cta,
  variant,
  onClick,
}: {
  icon: typeof CreditCard;
  color: string;
  title: string;
  body: string;
  cta: string;
  variant: "primary" | "outline";
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border-2 border-line bg-white p-4 transition-transform hover:-translate-y-0.5">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          color
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="mt-3 text-sm font-extrabold text-ink">{title}</div>
      <p className="mt-1 flex-1 text-[13px] font-semibold leading-relaxed text-slateink">
        {body}
      </p>
      <Button size="sm" variant={variant} className="mt-3 w-full" onClick={onClick}>
        {cta}
      </Button>
    </div>
  );
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="mb-4 inline-flex items-center gap-1 rounded-md text-sm font-extrabold text-slateink transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
    >
      <ChevronLeft className="h-4 w-4" /> All options
    </button>
  );
}

function PurchaseFlow({
  tier,
  location,
  onBack,
  onFreeUnlock,
}: {
  tier: Tier;
  location?: string;
  onBack: () => void;
  onFreeUnlock: () => void;
}) {
  const t = TIERS[tier];
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function applyCode() {
    if (code.trim().toUpperCase() === DISCOUNT_CODE) {
      setApplied(true);
      setCodeError(null);
    } else {
      setCodeError("Drizzle doesn't recognize that code. Drizzle is judging you.");
    }
  }

  async function completePurchase() {
    setError(null);
    if (applied) {
      onFreeUnlock();
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, location }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Checkout is unavailable. Please try again later.");
        setBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Checkout is unavailable. Please try again later.");
      setBusy(false);
    }
  }

  return (
    <div>
      <BackLink onBack={onBack} />
      <DialogTitle>Purchase Access</DialogTitle>
      <DialogDescription>
        {t.name} — unlocks {t.unlocks.join(", ").toLowerCase()} for the current
        browser session.
      </DialogDescription>

      <div className="mt-6 rounded-2xl border-2 border-line bg-cloud p-5">
        <div className="flex items-center justify-between text-sm font-bold">
          <span className="text-slateink">Subtotal</span>
          <span className="tabular text-ink">{t.priceLabel}</span>
        </div>
        {applied && (
          <div className="mt-2 flex items-center justify-between text-sm font-bold">
            <span className="inline-flex items-center gap-1.5 text-leaf-edge">
              <BadgePercent className="h-4 w-4" /> Discount ({DISCOUNT_CODE})
            </span>
            <span className="tabular text-leaf-edge">-{t.priceLabel}</span>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t-2 border-line pt-3">
          <span className="text-sm font-extrabold text-ink">Total</span>
          <span className="tabular text-lg font-extrabold text-ink">
            {applied ? "$0.00" : t.priceLabel}
          </span>
        </div>
      </div>

      {!applied && (
        <div className="mt-4">
          <label
            htmlFor="discount"
            className="text-xs font-extrabold uppercase tracking-wide text-mist"
          >
            Discount Code
          </label>
          <div className="mt-1.5 flex gap-2">
            <Input
              id="discount"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCode()}
              placeholder="Enter code"
              className="h-12 font-bold uppercase"
            />
            <Button variant="outline" onClick={applyCode}>
              Apply
            </Button>
          </div>
          {codeError && (
            <p className="mt-2 text-sm font-bold text-berry-edge">{codeError}</p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-tile-pink p-3 text-sm font-bold text-tile-pinkText">
          {error}
        </p>
      )}

      <Button size="lg" className="mt-6 w-full" onClick={completePurchase} disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {applied ? "Complete Purchase" : `Purchase Now — ${t.priceLabel}`}
      </Button>
      <p className="mt-3 text-center text-xs font-bold text-mist">
        Weather accuracy not guaranteed. All sales final.
      </p>
    </div>
  );
}

function AdFlow({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<"loading" | "empty">("loading");

  useEffect(() => {
    const id = setTimeout(() => setPhase("empty"), 3000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div>
      <BackLink onBack={onBack} />
      <DialogTitle>Watch An Advertisement</DialogTitle>
      {phase === "loading" ? (
        <div className="flex flex-col items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky" />
          <p className="mt-4 text-sm font-bold text-slateink">
            Searching for available advertisements...
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-8 text-center">
          <Drizzle mood="sad" className="h-24 w-28" animate={false} />
          <p className="mt-3 font-extrabold text-ink">
            No advertisements are currently available.
          </p>
          <p className="mt-1 text-sm font-bold text-slateink">
            Pick another option, buddy.
          </p>
          <Button variant="outline" className="mt-6" onClick={onBack}>
            Back to options
          </Button>
        </div>
      )}
    </div>
  );
}

function SellDataFlow({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: () => void;
}) {
  // Deliberately uncontrolled and never read: nothing typed here is stored,
  // sent, or logged anywhere. It is discarded on submit.
  const ref = useRef<HTMLTextAreaElement>(null);
  const [busy, setBusy] = useState(false);

  function submit() {
    if (ref.current) ref.current.value = ""; // discard immediately
    setBusy(true);
    setTimeout(onDone, 1200);
  }

  return (
    <div>
      <BackLink onBack={onBack} />
      <DialogTitle>Provide Personal Information</DialogTitle>
      <DialogDescription>
        Please provide all available personal information. Examples: Social
        Security Number, Bank Account Numbers, Bitcoin Wallet Addresses,
        Mother&apos;s Maiden Name, Nuclear Launch Codes.
      </DialogDescription>

      <textarea
        ref={ref}
        rows={6}
        placeholder="Paste everything here. Hold nothing back."
        className="mt-5 w-full rounded-2xl border-2 border-line bg-white p-4 text-sm font-semibold text-ink placeholder:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
      />
      <p className="mt-2 text-xs font-bold text-mist">
        This is a joke. Nothing entered here is stored, transmitted, or logged
        — it is discarded the moment you submit. Please don&apos;t type real
        information anyway.
      </p>

      <Button size="lg" variant="sky" className="mt-4 w-full" onClick={submit} disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Sell My Data
      </Button>
    </div>
  );
}

function SalesFlow({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <BackLink onBack={onBack} />
      <DialogTitle>Contact Sales</DialogTitle>
      <div className="mt-6 rounded-2xl border-2 border-line bg-cloud p-6 text-center">
        <Drizzle mood="happy" className="mx-auto h-20 w-24" animate={false} />
        <p className="mt-3 font-extrabold text-ink">
          Enterprise weather consultations are currently booking 14–18 months
          in advance.
        </p>
        <p className="mt-2 text-sm font-bold text-slateink">
          Please consider purchasing directly.
        </p>
      </div>
      <Button variant="outline" className="mt-5 w-full" onClick={onBack}>
        Back to options
      </Button>
    </div>
  );
}
