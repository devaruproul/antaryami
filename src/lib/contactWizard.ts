// The contact wizard runs as an "interrupt mode" inside the terminal.
// It intercepts Enter keypresses and routes them through a multi-step flow
// instead of the normal command parser.

export type ContactStep = "name" | "email" | "mobile" | "message" | "confirm" | "idle";

export type ContactFormData = {
  name: string;
  email: string;
  mobile: string;
  message: string;
};

export type WizardState = {
  active: boolean;
  step: ContactStep;
  data: ContactFormData;
};

export const INITIAL_WIZARD: WizardState = {
  active: false,
  step: "idle",
  data: { name: "", email: "", mobile: "", message: "" },
};

// Returns the prompt label shown before the cursor for each step
export function getStepPrompt(step: ContactStep): string {
  switch (step) {
    case "name":    return "Enter your name    »";
    case "email":   return "Enter your email   »";
    case "mobile":  return "Enter mobile no.   »";
    case "message": return "Your message       »";
    case "confirm": return "Send message? [y/n]»";
    default:        return "";
  }
}

// Returns the info line printed above each prompt
export function getStepHint(step: ContactStep): string {
  switch (step) {
    case "name":
      return [
        "",
        "┌──────────────────────────────────────────────┐",
        "│         📨  SEND ME A MESSAGE                │",
        "│  Type your details below. ESC to cancel.    │",
        "└──────────────────────────────────────────────┘",
        "",
        "  Step 1 of 4 — Name",
      ].join("\n");
    case "email":   return "  Step 2 of 4 — Email address";
    case "mobile":  return "  Step 3 of 4 — Mobile number (press Enter to skip)";
    case "message": return "  Step 4 of 4 — Your message";
    case "confirm":
      return "  ──────────────────────────────────────────────";
    default: return "";
  }
}

// Validates each step's input value
export function validateStep(step: ContactStep, value: string): string | null {
  const v = value.trim();
  switch (step) {
    case "name":
      if (!v) return "Name cannot be empty.";
      if (v.length < 2) return "Name must be at least 2 characters.";
      return null;
    case "email":
      if (!v) return "Email cannot be empty.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email address.";
      return null;
    case "mobile":
      // optional – skip allowed
      if (v && !/^[0-9+\-\s()]{7,15}$/.test(v)) return "Invalid mobile number.";
      return null;
    case "message":
      if (!v) return "Message cannot be empty.";
      if (v.length < 5) return "Message is too short.";
      return null;
    default:
      return null;
  }
}

// Returns a formatted summary before confirm step
export function buildSummary(data: ContactFormData): string {
  return [
    "",
    "  ── Review your details ─────────────────────────",
    `  Name    : ${data.name}`,
    `  Email   : ${data.email}`,
    `  Mobile  : ${data.mobile || "(not provided)"}`,
    `  Message : ${data.message}`,
    "  ────────────────────────────────────────────────",
    "",
  ].join("\n");
}

export const STEP_ORDER: ContactStep[] = ["name", "email", "mobile", "message", "confirm"];

export function nextStep(current: ContactStep): ContactStep {
  const idx = STEP_ORDER.indexOf(current);
  return STEP_ORDER[idx + 1] ?? "idle";
}
