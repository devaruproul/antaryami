"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { processCommand } from "@/lib/commands";
import { ASCII_BANNER, WELCOME_TEXT } from "@/lib/banner";
import LiveClock from "./LiveClock";
import {
  INITIAL_WIZARD,
  WizardState,
  ContactStep,
  getStepPrompt,
  getStepHint,
  validateStep,
  buildSummary,
  nextStep,
} from "@/lib/contactWizard";
import styles from "./Terminal.module.css";

type HistoryEntry = {
  id: number;
  type: "input" | "output" | "banner" | "error" | "info" | "wizard";
  content: string;
};

const SUGGESTIONS = [
  "help", "about", "skills", "experience", "education",
  "projects", "certifications", "contact", "send-message",
  "socials", "clear", "ls", "whoami",
];

let idCounter = 0;
const newId = () => ++idCounter;

function pushEntries(
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>,
  entries: Omit<HistoryEntry, "id">[]
) {
  setHistory((prev) => [
    ...prev,
    ...entries.map((e) => ({ ...e, id: newId() })),
  ]);
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestion, setSuggestion] = useState("");
  const [booted, setBooted] = useState(false);
  const [bootText, setBootText] = useState<string[]>([]);
  const [wizard, setWizard] = useState<WizardState>(INITIAL_WIZARD);
  const [submitting, setSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Boot sequence ────────────────────────────────────────────────────────────
  useEffect(() => {
    const bootLines = [
      "BIOS v2.4.1 – Antaryami Portfolio OS",
      "Initializing kernel modules...",
      "Loading developer profile: antaryami.roul [OK]",
      "Mounting filesystem: /home/antaryami [OK]",
      "Starting portfolio services...",
      "Network: online",
      "All systems operational.",
      "",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setBootText((prev) => [...prev, bootLines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBooted(true);
          setHistory([{ id: newId(), type: "banner", content: ASCII_BANNER + WELCOME_TEXT }]);
        }, 400);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // ── Auto-scroll ──────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, bootText, wizard]);

  // ── Start contact wizard ─────────────────────────────────────────────────────
  const startWizard = useCallback(() => {
    setWizard({
      active: true,
      step: "name",
      data: { name: "", email: "", mobile: "", message: "" },
    });
    pushEntries(setHistory, [{ type: "wizard", content: getStepHint("name") }]);
  }, []);

  // ── Cancel wizard ────────────────────────────────────────────────────────────
  const cancelWizard = useCallback(() => {
    setWizard(INITIAL_WIZARD);
    setInput("");
    pushEntries(setHistory, [
      { type: "error", content: "\n  ✗ Message cancelled. Type 'send-message' to try again.\n" },
    ]);
  }, []);

  // ── Submit to Supabase via API route ─────────────────────────────────────────
  const submitContact = useCallback(async (data: WizardState["data"]) => {
    setSubmitting(true);
    pushEntries(setHistory, [{ type: "info", content: "\n  ⟳ Sending your message...\n" }]);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          message: data.message,
        }),
      });
      const json = await res.json();
      if (json.success) {
        pushEntries(setHistory, [
          {
            type: "output",
            content: [
              "",
              "  ✓ Message sent successfully!",
              `  I'll get back to you at ${data.email} soon.`,
              "",
              `  Thank you for reaching out, ${data.name}!`,
              "  Type 'help' to keep exploring.",
              "",
            ].join("\n"),
          },
        ]);
      } else {
        throw new Error(json.message || "Server error");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      pushEntries(setHistory, [
        {
          type: "error",
          content: `\n  ✗ Failed to send: ${msg}\n  Please email me directly: roulantaryami3@gmail.com\n`,
        },
      ]);
    } finally {
      setSubmitting(false);
      setWizard(INITIAL_WIZARD);
    }
  }, []);

  // ── Handle one wizard step ───────────────────────────────────────────────────
  const handleWizardInput = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      const { step, data } = wizard;

      // Echo user input in wizard style
      pushEntries(setHistory, [
        { type: "wizard", content: `  ${getStepPrompt(step)} ${trimmed || "(skipped)"}` },
      ]);

      // Cancel keywords
      if (["cancel", "exit", "quit", "esc"].includes(trimmed.toLowerCase())) {
        cancelWizard();
        return;
      }

      // ── Confirm step ──────────────────────────────────────────────────────────
      if (step === "confirm") {
        if (["y", "yes"].includes(trimmed.toLowerCase())) {
          submitContact(data);
        } else {
          cancelWizard();
        }
        return;
      }

      // ── Validate input ────────────────────────────────────────────────────────
      const error = validateStep(step, trimmed);
      if (error) {
        pushEntries(setHistory, [
          { type: "error", content: `  ✗ ${error} — please try again.` },
        ]);
        return; // stay on same step, don't advance
      }

      // ── Save value ────────────────────────────────────────────────────────────
      const newData = { ...data };
      if (step === "name")    newData.name    = trimmed;
      if (step === "email")   newData.email   = trimmed;
      if (step === "mobile")  newData.mobile  = trimmed;
      if (step === "message") newData.message = trimmed;

      const next = nextStep(step) as ContactStep;

      if (next === "confirm") {
        pushEntries(setHistory, [
          { type: "wizard", content: buildSummary(newData) },
          { type: "wizard", content: getStepHint("confirm") },
        ]);
        setWizard({ active: true, step: "confirm", data: newData });
      } else {
        pushEntries(setHistory, [
          { type: "wizard", content: getStepHint(next) },
        ]);
        setWizard({ active: true, step: next, data: newData });
      }
    },
    [wizard, cancelWizard, submitContact]
  );

  // ── Input change ─────────────────────────────────────────────────────────────
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInput(val);
      setHistoryIdx(-1);
      if (!wizard.active && val.length > 0) {
        const match = SUGGESTIONS.find(
          (s) => s.startsWith(val.toLowerCase()) && s !== val.toLowerCase()
        );
        setSuggestion(match ? match.slice(val.length) : "");
      } else {
        setSuggestion("");
      }
    },
    [wizard.active]
  );

  // ── Submit command ───────────────────────────────────────────────────────────
  const submitCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();

      if (wizard.active) {
        if (!submitting) {
          handleWizardInput(trimmed);
          setInput("");
        }
        return;
      }

      const inputEntry: HistoryEntry = { id: newId(), type: "input", content: trimmed };
      if (trimmed) setCmdHistory((prev) => [trimmed, ...prev.slice(0, 49)]);

      const result = processCommand(trimmed);

      if (result.output === "CLEAR") {
        setHistory([]);
        setInput("");
        setSuggestion("");
        return;
      }
      if (result.output === "SHOW_BANNER") {
        setHistory((prev) => [
          ...prev,
          inputEntry,
          { id: newId(), type: "banner", content: ASCII_BANNER + WELCOME_TEXT },
        ]);
        setInput("");
        setSuggestion("");
        return;
      }
      if (result.output === "START_CONTACT_WIZARD") {
        setHistory((prev) => [...prev, inputEntry]);
        setInput("");
        setSuggestion("");
        startWizard();
        return;
      }

      setHistory((prev) => [
        ...prev,
        inputEntry,
        {
          id: newId(),
          type: result.type === "error" ? "error" : result.type === "info" ? "info" : "output",
          content: result.output as string,
        },
      ]);
      setInput("");
      setSuggestion("");
    },
    [wizard.active, submitting, handleWizardInput, startWizard]
  );

  // ── Keyboard ─────────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && wizard.active) {
        e.preventDefault();
        cancelWizard();
        return;
      }
      if (e.key === "Enter") {
        submitCommand(input);
      } else if (e.key === "Tab" && !wizard.active) {
        e.preventDefault();
        if (suggestion) {
          setInput(input + suggestion);
          setSuggestion("");
        }
      } else if (e.key === "ArrowUp" && !wizard.active) {
        e.preventDefault();
        const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
        setHistoryIdx(newIdx);
        setInput(cmdHistory[newIdx] || "");
        setSuggestion("");
      } else if (e.key === "ArrowDown" && !wizard.active) {
        e.preventDefault();
        const newIdx = Math.max(historyIdx - 1, -1);
        setHistoryIdx(newIdx);
        setInput(newIdx === -1 ? "" : cmdHistory[newIdx]);
        setSuggestion("");
      } else if (e.key === "l" && e.ctrlKey && !wizard.active) {
        e.preventDefault();
        setHistory([]);
      }
    },
    [input, suggestion, historyIdx, cmdHistory, wizard.active, submitCommand, cancelWizard]
  );

  const focusInput = () => inputRef.current?.focus();
  const handleQuickCmd = (cmd: string) => { submitCommand(cmd); inputRef.current?.focus(); };

  const activePromptLabel = wizard.active ? getStepPrompt(wizard.step) : null;

  // ── Boot screen ──────────────────────────────────────────────────────────────
  if (!booted) {
    return (
      <div className={styles.bootScreen}>
        <div className={styles.bootContent}>
          {bootText.map((line, i) => (
            <div key={i} className={styles.bootLine}>
              <span className={styles.bootPrefix}>[ {String(i + 1).padStart(3, "0")} ]</span>
              <span>{line}</span>
            </div>
          ))}
          {bootText.length > 0 && (
            <div className={styles.bootCursor}>
              <span className={styles.cursor}>▊</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} onClick={focusInput}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.windowControls}>
          <span className={styles.dot} style={{ background: "#ff5f57" }} />
          <span className={styles.dot} style={{ background: "#febc2e" }} />
          <span className={styles.dot} style={{ background: "#28c840" }} />
        </div>
        <div className={styles.tabTitle}>
          antaryami@portfolio:~
          {wizard.active && (
            <span className={styles.wizardTag}>&nbsp;[SEND MESSAGE — ESC to cancel]</span>
          )}
        </div>
        <div className={styles.topRight}>
          <span className={styles.statusBadge}>● ONLINE</span>
        </div>
      </div>

      {/* ── Quick bar ── */}
      <div className={styles.quickBar}>
        {["about", "skills", "experience", "projects", "contact", "send-message", "clear"].map((cmd) => (
          <button
            key={cmd}
            className={`${styles.quickBtn} ${cmd === "send-message" ? styles.quickBtnHighlight : ""}`}
            onClick={() => handleQuickCmd(cmd)}
            disabled={submitting}
          >
            {cmd === "send-message" ? "📨 send-message" : `./${cmd}`}
          </button>
        ))}
      </div>

      {/* ── Terminal body ── */}
      <div className={styles.terminal}>
        {history.map((entry) => (
          <div key={entry.id} className={styles.entry}>
            {entry.type === "input" ? (
              <div className={styles.inputLine}>
                <span className={styles.prompt}>
                  <span className={styles.promptUser}>antaryami</span>
                  <span className={styles.promptAt}>@</span>
                  <span className={styles.promptHost}>portfolio</span>
                  <span className={styles.promptColon}>:</span>
                  <span className={styles.promptPath}>~</span>
                  <span className={styles.promptDollar}>$</span>
                </span>
                <span className={styles.inputText}> {entry.content}</span>
              </div>
            ) : entry.type === "banner" ? (
              <pre className={styles.banner}>{entry.content}</pre>
            ) : entry.type === "wizard" ? (
              <pre className={styles.wizardOutput}>{entry.content}</pre>
            ) : (
              <pre
                className={`${styles.output} ${
                  entry.type === "error"
                    ? styles.outputError
                    : entry.type === "info"
                    ? styles.outputInfo
                    : styles.outputSuccess
                }`}
              >
                {entry.content}
              </pre>
            )}
          </div>
        ))}

        {/* ── Live input row ── */}
        <div className={styles.inputRow}>
          {wizard.active ? (
            <span className={styles.wizardPrompt}>
              {submitting ? "  ⟳ Submitting..." : `  ${activePromptLabel}`}
            </span>
          ) : (
            <span className={styles.prompt}>
              <span className={styles.promptUser}>antaryami</span>
              <span className={styles.promptAt}>@</span>
              <span className={styles.promptHost}>portfolio</span>
              <span className={styles.promptColon}>:</span>
              <span className={styles.promptPath}>~</span>
              <span className={styles.promptDollar}>$</span>
            </span>
          )}
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              className={`${styles.inputField} ${wizard.active ? styles.inputFieldWizard : ""}`}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoFocus
              disabled={submitting}
              aria-label={wizard.active ? `Enter ${wizard.step}` : "Terminal input"}
            />
            {suggestion && !wizard.active && (
              <span className={styles.autocomplete}>{suggestion}</span>
            )}
            <span className={styles.cursor}>▊</span>
          </div>
        </div>

        <div ref={bottomRef} />
      </div>

      {/* ── Status bar ── */}
      <div className={styles.statusBar}>
        <span>antaryami-portfolio-v1.0</span>
        <span>
          {wizard.active
            ? `📨 COMPOSE — step: ${wizard.step.toUpperCase()}`
            : "Full Stack Developer"}
        </span>
        <span>Bhubaneswar, India</span>
        <LiveClock />
      </div>
    </div>
  );
}
