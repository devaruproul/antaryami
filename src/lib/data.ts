export const portfolioData = {
  name: "Antaryami Roul",
  title: "Full Stack Developer",
  email: "roulantaryami3@gmail.com",
  phone: "+91-76820 25145",
  website: "https://antaryamiroul.vercel.app/",
  location: "Bhubaneswar, Odisha, India",
  github: "https://github.com/devaruproul",
  linkedin: "https://linkedin.com/in/antaryami-roul",

  summary: "Full Stack Developer skilled in Laravel, React, Angular, Python, and Django with strong experience building scalable, data-driven systems. Adept at optimizing backend performance, designing secure APIs, and solving complex data-processing challenges.",

  skills: {
    backend: ["Laravel", "Django", "Node.js", "RESTful APIs", "Authentication", "MySQL", "MongoDB", "SQLite"],
    frontend: ["React", "Angular", "JavaScript", "TypeScript", "HTML5", "CSS3", "Bootstrap", "Tailwind CSS", "jQuery"],
    other: ["Unit Testing", "Debugging", "Git", "GitHub", "Postman", "Docker", "CI/CD", "AWS Serverless"],
  },

  experience: [
    {
      role: "Assistant Software Developer",
      company: "MindTrack Technologies Pvt Ltd",
      location: "Bhubaneswar",
      period: "Dec 2024 – Present",
      status: "current",
      projects: [
        "Advanced ERP Platform (React + Laravel) – Module development, secure authentication",
        "Monthly Attendance Intelligence System – Optimized heavy data-processing queries",
        "Document & Asset Management System – Secure file handling, audit logs, permissions",
      ],
      achievements: [
        "Improved high-load attendance module by eliminating N+1 queries",
        "Implemented Excel export for large datasets using optimized query pipelines",
        "Enhanced security using token-based access, scalable APIs, and encrypted file delivery",
        "Developed React components and reusable Laravel backend modules",
      ],
    },
    {
      role: "Software Development Trainee",
      company: "Chetu India Pvt Ltd",
      location: "Noida Sector 62",
      period: "Feb 2024 – Dec 2024",
      status: "past",
      projects: [
        "HRMS Portal – Attendance, payroll, and user lifecycle modules",
        "HMS Workflow – Patient record components, UI enhancements",
      ],
      achievements: [],
    },
  ],

  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "Nalanda Institute of Technology, BBSR",
      period: "2022 – 2024",
      highlights: [
        "Strong foundation in programming, data structures, and software engineering",
        "Participated in academic projects using modern web technologies",
      ],
    },
    {
      degree: "Bachelor of Science (BSc Geology)",
      institution: "Banki Autonomous College, Banki, Cuttack",
      period: "2018 – 2021",
      highlights: [],
    },
  ],

  certifications: [
    { provider: "NPTEL", items: ["Cloud Computing", "IoT", "Data Mining"] },
    {
      provider: "Udemy",
      items: [
        "Python Programming",
        "AWS Serverless",
        "React Crash Course",
        "SQL",
        "Cyber Security",
        "jQuery",
        "Django",
        "Data Analytics",
        "Docker",
        "CI/CD",
      ],
    },
  ],

  projects: [
    { name: "World Skill Center", url: "https://www.worldskillcenter.org/", tech: "Web Platform", desc: "Skill development & training portal" },
    { name: "Odisha Police", url: "https://police.odisha.gov.in/en/sun/home", tech: "Govt Portal", desc: "Official Odisha Police department website" },
    { name: "ORMAS Odisha", url: "https://ormas.odisha.gov.in/login", tech: "Govt Portal", desc: "Odisha Rural Development & Marketing Society" },
    { name: "SCB Mental Health Institute", url: "https://mentalhealthinstitute-scb.odisha.gov.in/", tech: "Healthcare", desc: "Mental Health Institute web portal" },
    { name: "MakeMyAttendance", url: "https://makemyattendance.in/", tech: "SaaS", desc: "Attendance management platform" },
    { name: "Jaga Mission", url: "https://atpl.org.in/jagamission/", tech: "Govt Initiative", desc: "Urban housing mission for Odisha" },
    { name: "OTDC Odisha", url: "https://otdc.odisha.gov.in", tech: "Tourism", desc: "Odisha Tourism Development Corporation" },
    { name: "DialUrban", url: "https://dialurban.com/", tech: "Directory", desc: "Urban services directory platform" },
    { name: "DayBucks", url: "https://daybucks.in/", tech: "Fintech", desc: "Daily earnings & rewards platform" },
    { name: "PACE Education", url: "https://paceeducation.ca/", tech: "EdTech", desc: "Education platform based in Canada" },
  ],
};

export type PortfolioData = typeof portfolioData;
