import { portfolioData } from "./data";

export type CommandResult = {
  output: React.ReactNode | string;
  type: "success" | "error" | "info" | "raw";
  navigateTo?: string;
};

export const COMMANDS = {
  help: "Show available commands",
  about: "About Antaryami",
  skills: "Technical skills",
  experience: "Work experience",
  education: "Education history",
  projects: "Portfolio projects",
  certifications: "Certifications",
  contact: "Contact information",
  "send-message": "Send me a message (interactive form)",
  clear: "Clear terminal",
  whoami: "Display current user",
  ls: "List available pages",
  pwd: "Print working directory",
  date: "Show current date & time",
  banner: "Show the welcome banner",
  resume: "Download resume (hint)",
  socials: "Social links",
};

export function processCommand(input: string): CommandResult {
  const trimmed = input.trim().toLowerCase();
  const [cmd, ...args] = trimmed.split(" ");

  switch (cmd) {
    case "help":
      return {
        type: "success",
        output: formatHelp(),
      };

    case "about":
      return {
        type: "success",
        output: formatAbout(),
      };

    case "skills":
      return {
        type: "success",
        output: formatSkills(),
      };

    case "experience":
    case "exp":
      return {
        type: "success",
        output: formatExperience(),
      };

    case "education":
    case "edu":
      return {
        type: "success",
        output: formatEducation(),
      };

    case "projects":
    case "work":
      return {
        type: "success",
        output: formatProjects(),
      };

    case "certifications":
    case "certs":
      return {
        type: "success",
        output: formatCertifications(),
      };

    case "contact":
      return {
        type: "success",
        output: formatContact(),
      };

    case "send-message":
    case "send-contact":
    case "msg":
      return {
        type: "raw",
        output: "START_CONTACT_WIZARD",
      };

    case "socials":
      return {
        type: "success",
        output: formatSocials(),
      };

    case "whoami":
      return {
        type: "success",
        output: `antaryami@portfolio:~$ → ${portfolioData.name} | ${portfolioData.title}`,
      };

    case "pwd":
      return {
        type: "info",
        output: "/home/antaryami/portfolio",
      };

    case "ls":
    case "ls -la":
      return {
        type: "success",
        output: formatLS(),
      };

    case "date":
      return {
        type: "info",
        output: new Date().toString(),
      };

    case "banner":
      return {
        type: "raw",
        output: "SHOW_BANNER",
      };

    case "clear":
      return {
        type: "raw",
        output: "CLEAR",
      };

    case "resume":
      return {
        type: "info",
        output: `📄 Resume: Visit ${portfolioData.website} or type 'contact' for direct email.`,
      };

    case "":
      return {
        type: "info",
        output: "",
      };

    case "sudo":
      return {
        type: "error",
        output: `sudo: antaryami is not in the sudoers file. This incident will be reported. 😄`,
      };

    case "vim":
    case "nano":
    case "code":
      return {
        type: "error",
        output: `${cmd}: this is a portfolio, not an IDE! Try 'help' to see what you can do.`,
      };

    case "exit":
    case "quit":
      return {
        type: "info",
        output: `There's no escaping this portfolio! Try 'help' instead.`,
      };

    default:
      return {
        type: "error",
        output: `command not found: ${cmd}. Type 'help' for available commands.`,
      };
  }
}

function formatHelp(): string {
  const lines = [
    "┌─────────────────────────────────────────────┐",
    "│           AVAILABLE COMMANDS                │",
    "└─────────────────────────────────────────────┘",
    "",
    ...Object.entries(COMMANDS).map(
      ([cmd, desc]) => `  ${cmd.padEnd(18)} → ${desc}`
    ),
    "",
    "  Aliases: exp, edu, work, certs",
    "  Tip: Press ↑↓ to navigate command history",
  ];
  return lines.join("\n");
}

function formatAbout(): string {
  const p = portfolioData;
  return [
    "╔══════════════════════════════════════════════╗",
    "║              ABOUT ME                        ║",
    "╚══════════════════════════════════════════════╝",
    "",
    `  Name      : ${p.name}`,
    `  Role      : ${p.title}`,
    `  Location  : ${p.location}`,
    `  Email     : ${p.email}`,
    `  Phone     : ${p.phone}`,
    "",
    "  ── Summary ──────────────────────────────────",
    "",
    `  ${p.summary}`,
    "",
    "  Type 'skills' to see my tech stack.",
    "  Type 'experience' to see my work history.",
  ].join("\n");
}

function formatSkills(): string {
  const s = portfolioData.skills;
  return [
    "╔══════════════════════════════════════════════╗",
    "║              TECH SKILLS                     ║",
    "╚══════════════════════════════════════════════╝",
    "",
    "  ── Backend ──────────────────────────────────",
    `  ${s.backend.join("  •  ")}`,
    "",
    "  ── Frontend ─────────────────────────────────",
    `  ${s.frontend.join("  •  ")}`,
    "",
    "  ── DevOps & Tools ───────────────────────────",
    `  ${s.other.join("  •  ")}`,
    "",
    "  Type 'certifications' for my course credentials.",
  ].join("\n");
}

function formatExperience(): string {
  const lines: string[] = [
    "╔══════════════════════════════════════════════╗",
    "║           WORK EXPERIENCE                    ║",
    "╚══════════════════════════════════════════════╝",
    "",
  ];

  portfolioData.experience.forEach((exp, i) => {
    lines.push(`  [${i + 1}] ${exp.role}`);
    lines.push(`      Company  : ${exp.company}, ${exp.location}`);
    lines.push(`      Period   : ${exp.period}${exp.status === "current" ? "  ← CURRENT" : ""}`);
    lines.push("");
    lines.push("      Projects:");
    exp.projects.forEach((p) => lines.push(`        ▸ ${p}`));
    if (exp.achievements.length > 0) {
      lines.push("");
      lines.push("      Achievements:");
      exp.achievements.forEach((a) => lines.push(`        ✓ ${a}`));
    }
    lines.push("");
    lines.push("  " + "─".repeat(44));
    lines.push("");
  });

  return lines.join("\n");
}

function formatEducation(): string {
  return [
    "╔══════════════════════════════════════════════╗",
    "║              EDUCATION                       ║",
    "╚══════════════════════════════════════════════╝",
    "",
    ...portfolioData.education.flatMap((edu, i) => [
      `  [${i + 1}] ${edu.degree}`,
      `      Institution : ${edu.institution}`,
      `      Period      : ${edu.period}`,
      ...(edu.highlights.length > 0
        ? ["", "      Highlights:", ...edu.highlights.map((h) => `        → ${h}`)]
        : []),
      "",
      "  " + "─".repeat(44),
      "",
    ]),
  ].join("\n");
}

function formatProjects(): string {
  const lines = [
    "╔══════════════════════════════════════════════╗",
    "║           PORTFOLIO PROJECTS                 ║",
    "╚══════════════════════════════════════════════╝",
    "",
  ];

  portfolioData.projects.forEach((proj, i) => {
    const num = String(i + 1).padStart(2, "0");
    lines.push(`  [${num}] ${proj.name}`);
    lines.push(`       Tag  : ${proj.tech}`);
    lines.push(`       Desc : ${proj.desc}`);
    lines.push(`       URL  : ${proj.url}`);
    lines.push("");
  });

  lines.push("  + many more in production...");
  return lines.join("\n");
}

function formatCertifications(): string {
  return [
    "╔══════════════════════════════════════════════╗",
    "║           CERTIFICATIONS                     ║",
    "╚══════════════════════════════════════════════╝",
    "",
    ...portfolioData.certifications.flatMap((cert) => [
      `  ── ${cert.provider} ──────────────────────────────`,
      ...cert.items.map((item) => `    🏅 ${item}`),
      "",
    ]),
  ].join("\n");
}

function formatContact(): string {
  const p = portfolioData;
  return [
    "╔══════════════════════════════════════════════╗",
    "║              CONTACT ME                      ║",
    "╚══════════════════════════════════════════════╝",
    "",
    `  📧 Email    : ${p.email}`,
    `  📱 Phone    : ${p.phone}`,
    `  🌐 Website  : ${p.website}`,
    `  📍 Location : ${p.location}`,
    "",
    "  ── Open to ──────────────────────────────────",
    "    ✓ Full-time roles",
    "    ✓ Freelance projects",
    "    ✓ Collaborations",
    "",
    "  Feel free to reach out anytime!",
  ].join("\n");
}

function formatSocials(): string {
  const p = portfolioData;
  return [
    "╔══════════════════════════════════════════════╗",
    "║              SOCIAL LINKS                    ║",
    "╚══════════════════════════════════════════════╝",
    "",
    `  🔗 Portfolio : ${p.website}`,
    `  💼 LinkedIn  : ${p.linkedin}`,
    `  🐱 GitHub    : ${p.github}`,
    `  📧 Email     : ${p.email}`,
  ].join("\n");
}

function formatLS(): string {
  return [
    "total 7",
    "drwxr-xr-x  about/         → About me",
    "drwxr-xr-x  skills/        → Tech stack",
    "drwxr-xr-x  experience/    → Work history",
    "drwxr-xr-x  education/     → Education",
    "drwxr-xr-x  projects/      → Portfolio work",
    "drwxr-xr-x  certifications/ → Credentials",
    "drwxr-xr-x  contact/       → Get in touch",
    "-rw-r--r--  send-message   → Send me a message",
    "",
    "Type any folder name as a command to explore.",
  ].join("\n");
}
