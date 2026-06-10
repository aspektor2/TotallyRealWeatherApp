"use client";

import { useEffect, useRef, useState } from "react";
import {
  CreditCard,
  PlayCircle,
  Database,
  Briefcase,
  Loader2,
  Lock,
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
  const [successNote, setSuccessNote] = useState<string[] | null>(null);

  useEffect(() => {
    if (open) {
      setView("options");
      setSuccessNote(null);
    }
  }, [open, tier]);

  function succeed(note?: string[]) {
    setSuccessNote(note ?? null);
    setView("success");
    onUnlock(tier);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {view === "options" && (
          <>
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft">
              <Lock className="h-5 w-5 text-brand" />
            </div>
            <DialogTitle>Unlock Premium Weather™</DialogTitle>
            <DialogDescription>
              This information is currently protected under the Enterprise
              Weather Access Program. You are unlocking{" "}
              <span className="font-medium text-ink">{t.name}</span> (
              {t.priceLabel}).
            </DialogDescription>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <OptionCard
                icon={CreditCard}
                title="Purchase Access"
                body={`One-time payment of ${t.priceLabel}. Valid for the current session only.`}
                cta="Purchase Now"
                onClick={() => setView("purchase")}
                featured
              />
              <OptionCard
                icon={PlayCircle}
                title="Watch An Advertisement"
                body="View a short message from one of our atmospheric partners."
                cta="Continue"
                onClick={() => setView("ad")}
              />
              <OptionCard
                icon={Database}
                title="Provide Personal Information"
                body="Exchange your data for enhanced meteorological visibility."
                cta="Get Started"
                onClick={() => setView("sell")}
              />
              <OptionCard
                icon={Briefcase}
                title="Contact Sales"
                body="Discuss enterprise weather procurement with our team."
                cta="Schedule Demo"
                onClick={() => setView("sales")}
              />
            </div>
            <p className="mt-5 text-center text-xs text-mist">
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
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-brand" />
            <DialogTitle className="mt-4">
              {successNote ? "Thank you." : "Thank you for supporting premium weather."}
            </DialogTitle>
            {successNote ? (
              <div className="mx-auto mt-4 max-w-sm text-left">
                <p className="text-sm text-slateink">
                  Your information has been successfully sold to:
                </p>
                <ul className="mt-3 space-y-2">
                  {successNote.map((org) => (
                    <li
                      key={org}
                      className="flex items-center gap-2 text-sm font-medium text-ink"
                    >
                      <CheckCircle2 className="h-4 w-4 text-brand" /> {org}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm italic text-slateink">
                  Your sacrifice has been accepted.
                </p>
              </div>
            ) : (
              <DialogDescription className="mx-auto max-w-sm">
                {t.name} is now active. Purchases are valid for the current
                session only.
              </DialogDescription>
            )}
            <Button className="mt-6" onClick={() => onOpenChange(false)}>
              View My Weather
            </Button>
            <p className="mt-4 text-xs text-mist">
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
  title,
  body,
  cta,
  onClick,
  featured,
}: {
  icon: typeof CreditCard;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-4 transition-all",
        featured
          ? "border-brand/40 bg-brand-soft/50"
          : "border-line bg-white hover:border-mist"
      )}
    >
      <Icon className={cn("h-5 w-5", featured ? "text-brand" : "text-slateink")} />
      <div className="mt-3 text-sm font-semibold text-ink">{title}</div>
      <p className="mt-1 flex-1 text-[13px] leading-relaxed text-slateink">
        {body}
      </p>
      <Button
        size="sm"
        variant={featured ? "primary" : "outline"}
        className="mt-3 w-full"
        onClick={onClick}
      >
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
      className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slateink transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md"
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
      setCodeError("That code is not recognized by our revenue systems.");
    }
  }

  async function completePurchase() {
    setError(null);
    if (applied) {
      // Total is $0.00 — unlock without touching Stripe.
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

      <div className="mt-6 rounded-xl border border-line bg-cloud p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slateink">Subtotal</span>
          <span className="tabular font-mono text-ink">{t.priceLabel}</span>
        </div>
        {applied && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1.5 text-brand">
              <BadgePercent className="h-4 w-4" /> Discount ({DISCOUNT_CODE})
            </span>
            <span className="tabular font-mono text-brand">-{t.priceLabel}</span>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="text-sm font-semibold text-ink">Total</span>
          <span className="tabular font-mono text-lg font-semibold text-ink">
            {applied ? "$0.00" : t.priceLabel}
          </span>
        </div>
      </div>

      {!applied && (
        <div className="mt-4">
          <label
            htmlFor="discount"
            className="text-xs font-medium uppercase tracking-wide text-mist"
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
              className="h-11 uppercase"
            />
            <Button variant="outline" onClick={applyCode}>
              Apply
            </Button>
          </div>
          {codeError && <p className="mt-2 text-sm text-red-600">{codeError}</p>}
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button
        size="lg"
        className="mt-6 w-full"
        onClick={completePurchase}
        disabled={busy}
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {applied ? "Complete Purchase" : `Purchase Now — ${t.priceLabel}`}
      </Button>
      <p className="mt-3 text-center text-xs text-mist">
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
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="mt-4 text-sm text-slateink">
            Searching for available advertisements...
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cloud">
            <PlayCircle className="h-6 w-6 text-mist" />
          </div>
          <p className="mt-4 font-medium text-ink">
            No advertisements are currently available.
          </p>
          <p className="mt-1 text-sm text-slateink">Pick another option, buddy.</p>
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
        className="mt-5 w-full rounded-xl border border-line bg-white p-4 text-sm text-ink placeholder:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      />
      <p className="mt-2 text-xs text-mist">
        This is a joke. Nothing entered here is stored, transmitted, or logged
        — it is discarded the moment you submit. Please don&apos;t type real
        information anyway.
      </p>

      <Button size="lg" className="mt-4 w-full" onClick={submit} disabled={busy}>
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
      <div className="mt-6 rounded-xl border border-line bg-cloud p-6 text-center">
        <Briefcase className="mx-auto h-7 w-7 text-slateink" />
        <p className="mt-4 font-medium text-ink">
          Enterprise weather consultations are currently booking 14–18 months
          in advance.
        </p>
        <p className="mt-2 text-sm text-slateink">
          Please consider purchasing directly.
        </p>
      </div>
      <Button variant="outline" className="mt-5 w-full" onClick={onBack}>
        Back to options
      </Button>
    </div>
  );
}
