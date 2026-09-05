import React, { useState, useEffect, useRef } from "react"
import cvPdf from "./assets/Sulav_Bhatta_CV.pdf"

// ---------------------------------------------------------------------------
// Gyroscope singleton — shared across all animation loops
// ---------------------------------------------------------------------------
const gyro = { x: 0, y: 0, active: false }
let gyroListenerAttached = false

function attachGyroListener() {
  if (gyroListenerAttached) return
  gyroListenerAttached = true
  window.addEventListener("deviceorientation", (e: DeviceOrientationEvent) => {
    // gamma = left/right tilt (-90…90), beta = front/back tilt (-180…180)
    const gamma = e.gamma ?? 0   // maps to X axis
    const beta  = e.beta  ?? 0   // maps to Y axis
    // Clamp to a comfortable tilt range and normalise to -1…1
    gyro.x = Math.max(-1, Math.min(1, gamma / 30))
    gyro.y = Math.max(-1, Math.min(1, (beta - 30) / 40)) // offset 30° for natural hold
    gyro.active = true
  }, { passive: true })
}

// Detect whether the device likely has a gyroscope (touch + orientation API)
function isMobileGyro() {
  return (
    typeof window !== "undefined" &&
    "DeviceOrientationEvent" in window &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  )
}

// iOS 13+ requires explicit permission
async function requestGyroPermission(): Promise<boolean> {
  const DOE = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>
  }
  if (typeof DOE.requestPermission === "function") {
    const result = await DOE.requestPermission()
    return result === "granted"
  }
  return true // Android / older iOS — no permission needed
}

// Small floating button that requests gyro permission on iOS
function GyroPermissionButton() {
  const [needed, setNeeded] = useState(false)
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    if (!isMobileGyro()) return
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
    if (typeof DOE.requestPermission === "function") {
      setNeeded(true) // iOS 13+ needs the button
    } else {
      // Android — attach immediately, no button needed
      attachGyroListener()
      setGranted(true)
    }
  }, [])

  if (!needed || granted) return null

  return (
    <button
      onClick={async () => {
        const ok = await requestGyroPermission()
        if (ok) {
          attachGyroListener()
          setGranted(true)
          setNeeded(false)
        }
      }}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 100,
        backgroundColor: "var(--accent)",
        color: "var(--background)",
        border: "none",
        borderRadius: "9999px",
        padding: "0.6rem 1rem",
        fontSize: "0.75rem",
        fontFamily: "monospace",
        cursor: "pointer",
        opacity: 0.9,
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}
      aria-label="Enable gyroscope animations"
    >
      ✦ Enable Gyro
    </button>
  )
}

const PROJECTS = [
  {
    id: 1,
    title: "Astro-Dodge",
    year: "2025",
    tag: "Game",
    description:
      "Astro-Dodge is a fast-paced survival game that tests your quick reactions and strategic thinking.",
    tech: ["Processing", "Java"],
    github: "https://github.com/b-sulav/Game",
    live: null,
  },
  {
    id: 2,
    title: "Cineby",
    year: "2025",
    tag: "Data",
    description:
      "An application that analyses the users choices to recommend them movies that they might like.",
    tech: ["Python", "Numpy","Pandas"],
    github: "https://github.com/b-sulav/Movie-Recommender",
    live: null,
  },
  {
    id: 3,
    title: "Hotel Management System",
    year: "2025",
    tag: "Full-Stack Development",
    description:
      "A system that provides a dynamic dashboard connected to a database to manage, edit and view relavent info.",
    tech: ["Python", "FastAPI","MySQL","HTML/CSS/JS"],
    github: "https://github.com/b-sulav/Hotel-Management-System",
    live: null,
  },
  {
    id: 4,
    title: "Player Dashboard",
    year: "2025",
    tag: "Visualization",
    description:
      "Interactive analytics dashboard for technical data of professional esports valorant players across all VCT tournaments.",
    tech: ["SQL", "Matplotlib","Pandas", "Numpy", "Seaborn"],
    github: "https://github.com/b-sulav/Player-Dashboard",
    live: null,
  },
]

const EXTRA_PROJECTS = [
  {
    id: 5,
    title: "Null",
    year: "0",
    tag: "Null",
    description:
      "Null",
    tech: ["np.Nan", "np.Nan"],
    github: "https://github.com/b-sulav",
    live: null,
  },
   {
    id: 6,
    title: "Null",
    year: "0",
    tag: "Null",
    description:
      "Null",
    tech: ["np.Nan", "np.Nan"],
    github: "https://github.com/b-sulav",
    live: null,
  },
]

const LITERATURE = [
  {
    id: 1,
    title: "Fornlorn Reminisces",
    tag: "Poem",
    date: "Aug 2026",
    excerpt:
      "Bring down the skies,\nshatter heaven to pieces.",
    readTime: "1 min",
    link: "#",
    body:
      "Bring down the skies,\nshatter heaven to pieces.\nWalk upon tombs, graves\nFor a pile of yearning kisses.\n\nBurn hell to the ground,\nand every place it reaches.\nA Sanctuary for hopeless romantics\nand a shrine for forlorn reminisces.\n\nMuch needed compassion,\nA tearful, weary heart.\nLife teaching a lesson,\nAnd us falling apart.",
  },
  {
    id: 2,
    title: "के हुन्थ्यो होला?",
    tag: "Poem",
    date: "July 2026",
    excerpt:
      "यदि हृदयमा बग्दैनथ्यो भावनाको धारा।\nकहाँ जान्थे होला यी थाकेका हारा? ",
    readTime: "2 min",
    link: "#",
    body:
      "यदि हृदयमा बग्दैनथ्यो भावनाको धारा।\nयदि मस्तिष्कमा हुँदैनथ्यो मानवताको बास।\nकहाँ जान्थे होला यी थाकेका हारा?\nयदि हुँदैनथ्यो अस्तित्वको आस्थामा साहस।\n\nयदि कल्पनाको हुँदैनथ्यो कुनै वास्तविक अन्त्य।\nयदि पलको अन्धकारले रित्याउँदैनथ्यो विश्वास।\nके हुन्थ्यो होला पश्चात्तापी जीवनको सत्य?\nयदि हतासमा हुँदैनथ्यो मृत्युको आभास।",
  },
  {
    id: 3,
    title: "A burning florist ",
    tag: "Poem",
    date: "Nov 2025",
    excerpt:
      "I stood still as the fierce fire of longing raged,\nas the petals of mourning burned.",
    readTime: "1 min",
    link: "#",
    body:
      "I stood still as the fierce fire of longing raged,\nas the petals of mourning burned.\n\nI stood still and seemingly fazed,\nas the sepals of belonging darkened,\nas the smoke engulfed.\n\nI stood still as I gasped,\nas I was left lone,\nas there remained nothing but ashes,\nI stood still.",
  },
  {
    id: 4,
    title: "A dark night",
    tag: "Poem",
    date: "Jan 2025",
    excerpt:
      "The darkness of my shadow strives\nas I discover, a different me within myself.",
    readTime: "1 min",
    link: "#",
    body:
      "The darkness of my shadow strives\nas I discover, a different me within myself.\nliving in obscurity with gloomy eyes\nit has a gaze worth fright.\n\nThe light reaches every nook and corner\nyet fails to shine upon that silhouette,\nsome pleased by the ethereal beauty\nyet others are scared of its tenebrosity.\n",
  },
]

const EXTRA_LITERATURE = [
  {
    id: 5,
    title: "तिमी",
    tag: "Poem",
    date: "Nov 2024",
    excerpt:
      "जीवनको हरेक पलमा छौ तिमी,\nसरिरको कण-कणमा छौ तिमी.",
    readTime: "2 min",
    link: "#",
    body:
      "जीवनको हरेक पलमा छौ तिमी,\nसरिरको कण-कणमा छौ तिमी.\nसासमा तिमी हरेक गासमा तिमी,\nविस्वास मर्दाको मेरो लासमा तिमी.\n\nपिडाको आगोमा जल्दै चिताको बासमा तिमी,\nभविष्य सम्म को यो इतिहासमा तिमी.\nस्वयम जीवनदेखि मृत्युसम्म,\nसुखदेखि नास सम्म केवल तिमी नै तिमी.",
  },
  {
    id: 6,
    title: "My love for you",
    tag: "Poem",
    date: "Sep 2023",
    excerpt:
      "My love for you is like a tattered, \nold canvas awaiting to be splashed with\nthe colours of life.",
    readTime: "2 min",
    link: "#",
    body:
      "My love for you is like a tattered, \nold canvas awaiting to be splashed with\nthe colours of life. \n\nMy love for you is like an old, \nfeeble man with eyes yet intact with, \nthe blaze of passion. \n\nMy love for you is like a starved, \npitiful stray still clenching onto,\nthe sparkle of hope.\n\nMy love for you is like a wilting,\nunnourished plant with faith in,\nthe miracles of heaven.",
  },
]

function Sun() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="7.05" y2="7.05" />
      <line x1="16.95" y1="16.95" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="7.05" y2="16.95" />
      <line x1="16.95" y1="7.05" x2="19.78" y2="4.22" />
    </svg>
  )
}

function Moon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ArticleModal({
  article,
  onClose,
}: {
  article: (typeof LITERATURE)[0]
  onClose: () => void
}) {
  if (!article) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(15, 15, 15, 0.82)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto border"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          borderRadius: "16px",
          padding: "clamp(1.25rem, 5vw, 2.5rem) clamp(1rem, 5vw, 2.25rem)",
          color: "var(--foreground)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full border bg-transparent p-2 transition-colors hover:bg-[var(--border)]"
          style={{
            color: "var(--foreground)",
            borderColor: "var(--border)",
            cursor: "pointer",
          }}
          aria-label="Close article"
        >
          <CloseIcon />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span
            className="font-mono-code text-xs uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            {article.tag}
          </span>
          <span
            className="font-mono-code text-xs"
            style={{ color: "var(--text-dim-2)" }}
          >
            {article.date}
          </span>
        </div>

        <h2
          className="font-display mb-4"
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {article.title}
        </h2>

        <p
          className="font-mono-code text-sm mb-6"
          style={{ color: "var(--text-dim-2)" }}
        >
          {article.readTime}
        </p>

        <p
          className="font-display text-base leading-relaxed whitespace-pre-line"
          style={{ color: "var(--foreground)" }}
        >
          {article.body}
        </p>
      </div>
    </div>
  )
}

function ThemeToggle({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-10 h-5 rounded-full relative transition-colors duration-300 focus:outline-none"
      style={{ backgroundColor: dark ? "var(--accent)" : "var(--border)" }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          left: dark ? "calc(100% - 18px)" : "2px",
        }}
      >
        {dark ? <Moon /> : <Sun />}
      </span>
    </button>
  )
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path
        style={{ fill: "currentColor" }}
        d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.578 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
      />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24">
      <path
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      />
      <polyline
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        points="15 3 21 3 21 9"
      />
      <line
        style={{
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
        }}
        x1="10"
        y1="14"
        x2="21"
        y2="3"
      />
    </svg>
  )
}

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let curX = 0,
      curY = 0,
      tgtX = 0,
      tgtY = 0

    let mouseOver = false

    const handleMove = (e: MouseEvent) => {
      mouseOver = true
      const rect = el.getBoundingClientRect()
      tgtX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      tgtY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const handleLeave = () => {
      mouseOver = false
      tgtX = 0
      tgtY = 0
    }

    const tick = () => {
      if (!mouseOver && gyro.active) {
        tgtX = gyro.x
        tgtY = gyro.y
      }
      curX += (tgtX - curX) * 0.08
      curY += (tgtY - curY) * 0.08

      const rotY = curX * 6
      const rotX = -curY * 6
      const tx = curX * 6
      const ty = curY * 6
      el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(${tx}px, ${ty}px)`

      const shadowX = -curX * 5
      const shadowY = -curY * 3
      el.style.filter = `drop-shadow(${shadowX.toFixed(2)}px ${shadowY.toFixed(2)}px 8px rgba(0,0,0,0.25))`

      rafRef.current = requestAnimationFrame(tick)
    }

    el.addEventListener("mousemove", handleMove)
    el.addEventListener("mouseleave", handleLeave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener("mousemove", handleMove)
      el.removeEventListener("mouseleave", handleLeave)
      cancelAnimationFrame(rafRef.current)
      el.style.transform = ""
      el.style.filter = ""
    }
  }, [])

  return (
    <article
      ref={ref}
      className="h-full p-5 sm:p-[2.25rem] flex flex-col gap-5 border"
      style={{ borderColor: "var(--border)", transformStyle: "preserve-3d" }}
    >
      <div className="flex items-center gap-5">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--text-dim-2)" }}
        >
          <GitHubIcon />
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-dim-2)" }}
          >
            <ExternalLinkIcon />
          </a>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-display text-2xl sm:text-4xl mb-4">{project.title}</h3>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--text-dim-2)" }}
        >
          {project.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="font-mono-code text-sm px-3 py-1.5 border"
            style={{ borderColor: "var(--border)", color: "var(--text-dim-1)" }}
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  )
}

function LiteratureCard({
  item,
  onOpen,
}: {
  item: (typeof LITERATURE)[0]
  onOpen?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let curX = 0,
      curY = 0,
      tgtX = 0,
      tgtY = 0

    let mouseOver = false

    const handleMove = (e: MouseEvent) => {
      mouseOver = true
      const rect = el.getBoundingClientRect()
      tgtX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      tgtY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const handleLeave = () => {
      mouseOver = false
      tgtX = 0
      tgtY = 0
    }

    const tick = () => {
      if (!mouseOver && gyro.active) {
        tgtX = gyro.x
        tgtY = gyro.y
      }
      curX += (tgtX - curX) * 0.08
      curY += (tgtY - curY) * 0.08

      const rotY = curX * 6
      const rotX = -curY * 6
      const tx = curX * 6
      const ty = curY * 6
      el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(${tx}px, ${ty}px)`

      const shadowX = -curX * 5
      const shadowY = -curY * 3
      el.style.filter = `drop-shadow(${shadowX.toFixed(2)}px ${shadowY.toFixed(2)}px 8px rgba(0,0,0,0.25))`

      rafRef.current = requestAnimationFrame(tick)
    }

    el.addEventListener("mousemove", handleMove)
    el.addEventListener("mouseleave", handleLeave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener("mousemove", handleMove)
      el.removeEventListener("mouseleave", handleLeave)
      cancelAnimationFrame(rafRef.current)
      el.style.transform = ""
      el.style.filter = ""
    }
  }, [])

  return (
    <article
      ref={ref}
      className="h-full p-5 sm:p-[2.25rem] flex flex-col gap-5 border"
      style={{ borderColor: "var(--border)", transformStyle: "preserve-3d" }}
    >
      <div className="flex-1">
        <h3 className="font-display text-2xl sm:text-4xl mb-4">{item.title}</h3>
        <p
          className="text-lg leading-relaxed"
          style={{
            color: "var(--text-dim-2)",
            fontStyle: item.tag === "Poem" ? "italic" : "normal",
          }}
        >
          {item.excerpt}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span
          className="font-mono-code text-sm"
          style={{ color: "var(--text-dim-2)" }}
        >
          {item.readTime}
        </span>
        <a
          href={item.link}
          onClick={(e) => {
            e.preventDefault()
            onOpen?.()
          }}
          className="font-mono-code text-sm"
          style={{ color: "var(--accent)" }}
        >
          Read →
        </a>
      </div>
    </article>
  )
}

const SKILLS = [
  { label: "Python", value: 0.9 },
  { label: "Data Analytics", value: 0.85 },
  { label: "SQL", value: 0.82 },
  { label: "ML", value: 0.75 },
  { label: "Java", value: 0.7 },
  { label: "Processing", value: 0.65 },
]

const FLOAT_CHIPS = [
  { x: 8,  y: 18, size: 9.375 },
  { x: 18, y: 68, size: 4.6875 },
  { x: 6,  y: 46, size: 12.5 },
  { x: 27, y: 12, size: 5.46875 },
  { x: 92, y: 22, size: 7.8125 },
  { x: 82, y: 65, size: 10.9375 },
  { x: 94, y: 50, size: 3.90625 },
  { x: 74, y: 14, size: 7.03125 },
  { x: 14, y: 88, size: 5.46875 },
  { x: 88, y: 86, size: 8.59375 },
  { x: 34, y: 24, size: 3.90625 },
  { x: 30, y: 78, size: 10.15625 },
  { x: 70, y: 82, size: 5.46875 },
  { x: 58, y: 92, size: 6.25 },
  { x: 96, y: 72, size: 11.71875 },
  { x: 12, y: 8,  size: 4.6875 },
  { x: 45, y: 10, size: 6.25 },
  { x: 55, y: 20, size: 7.8125 },
  { x: 38, y: 55, size: 4.6875 },
  { x: 62, y: 48, size: 7.03125 },
].map((c, i) => ({
  ...c,
  depth: 0.35 + ((i * 37) % 70) / 100,
  phase: (i * 0.83) % 3.4,
}));

function FloatingChips({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>
}) {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | undefined>(undefined)
  const startRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) return

    startRef.current = performance.now()

    let mouseOver = false

    const handleMove = (e: MouseEvent) => {
      mouseOver = true
      const rect = container.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      targetRef.current = { x: px * 2 - 1, y: py * 2 - 1 }
    }

    const handleLeave = () => {
      mouseOver = false
      targetRef.current = { x: 0, y: 0 }
    }

    const tick = (now: number) => {
      const elapsed = now - startRef.current

      if (!mouseOver && gyro.active) {
        targetRef.current = { x: gyro.x, y: gyro.y }
      }

      const cur = currentRef.current
      const tgt = targetRef.current
      cur.x += (tgt.x - cur.x) * 0.09
      cur.y += (tgt.y - cur.y) * 0.09

      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const chip = FLOAT_CHIPS[i]
        const driftX = Math.sin(elapsed / 2600 + chip.phase * 10) * 4
        const driftY = Math.cos(elapsed / 3100 + chip.phase * 10) * 4
        const px = cur.x * 70 * chip.depth + driftX
        const py = cur.y * 70 * chip.depth + driftY
        el.style.transform = `translate(${px}px, ${py}px)`
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    container.addEventListener("mousemove", handleMove)
    container.addEventListener("mouseleave", handleLeave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      container.removeEventListener("mousemove", handleMove)
      container.removeEventListener("mouseleave", handleLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [containerRef])

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {FLOAT_CHIPS.map((chip, i) => (
        <div
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el
          }}
          className="absolute"
          style={{
            left: `${chip.x}%`,
            top: `${chip.y}%`,
            width: chip.size,
            height: chip.size,
            backgroundColor: "var(--accent)",
            borderRadius: "9999px",
            opacity: 0.65 + chip.depth * 0.3,
            boxShadow: `0 0 ${Math.max(6, chip.size * 0.8)}px 1px var(--accent)`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  )
}

const NAV_SECTIONS = [
  "home",
  "about",
  "selected-work",
  "curated-words",
] as const

const HERO_PLAIN = "Building with data. "
const HERO_ACCENT = "Writing through it."
const HERO_FULL = HERO_PLAIN + HERO_ACCENT

function Container({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`max-w-4xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(28px) scale(0.94)",
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const FOCUS_AREAS = [
  {
    label: "Data Analysis",
    desc: "Extracting patterns from complex datasets using Python, SQL, and visualisation libraries.",
    icon: "◇",
  },
  {
    label: "Software Dev",
    desc: "Building applications from games to dashboards, with a focus on clean, maintainable code.",
    icon: "◇",
  },
]

const TECH_STACK = [
  { category: "Languages", skills: ["Python", "Java", "SQL", "Processing"] },
  { category: "Libraries", skills: ["Pandas", "NumPy", "Matplotlib", "Seaborn"] },
  { category: "Frameworks", skills: ["Streamlit", "Reflex", "React", "Flutter"] },
  { category: "Tools", skills: ["Jupyter", "Git"] },
]

function AnimatedRadarChart({ noHover = false }: { noHover?: boolean }) {
  const ref = useRef<SVGPolygonElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const containerRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisible(true), 200)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const size = 320
  const cx = size / 2
  const cy = size / 2
  const r = 100
  const n = SKILLS.length
  const levels = 4

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2
  const point = (i: number, radius: number) => ({
    x: cx + radius * Math.cos(angle(i)),
    y: cy + radius * Math.sin(angle(i)),
  })

  const gridPolygon = (level: number) => {
    const fr = (r * level) / levels
    return Array.from({ length: n }, (_, i) => point(i, fr))
      .map((p) => `${p.x},${p.y}`)
      .join(" ")
  }

  const dataPolygon = SKILLS.map((s, i) =>
    point(i, visible ? s.value * r : 0),
  )
    .map((p) => `${p.x},${p.y}`)
    .join(" ")

  return (
    <svg
      ref={containerRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      onMouseEnter={noHover ? undefined : () => setHovered(true)}
      onMouseLeave={noHover ? undefined : () => {
        setHovered(false)
        setHoverIndex(null)
      }}
      style={{
        overflow: "visible",
        maxWidth: "100%",
        height: "auto",
        cursor: "default",
        transform: noHover ? undefined : hovered ? "scale(1.03)" : "scale(1)",
        transition: noHover ? undefined : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {Array.from({ length: levels }, (_, i) => (
        <polygon
          key={i}
          points={gridPolygon(i + 1)}
          style={{
            fill: "none",
            stroke: "var(--border)",
            strokeWidth: 1,
            opacity: visible ? 1 : 0,
            transition: `opacity 0.6s ease ${i * 80}ms`,
          }}
        />
      ))}
      {SKILLS.map((_, i) => {
        const p = point(i, r)
        const active = noHover ? false : hoverIndex === i
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            style={{
              stroke: active ? "var(--accent)" : "var(--border)",
              strokeWidth: active ? 1.5 : 1,
              opacity: visible ? 1 : 0,
              transition: `opacity 0.5s ease ${i * 60}ms, stroke 0.25s ease, stroke-width 0.25s ease`,
            }}
          />
        )
      })}
      <polygon
        ref={ref}
        points={dataPolygon}
        style={{
          fill: "var(--accent)",
          fillOpacity: visible ? (noHover ? 0.15 : hovered ? 0.24 : 0.15) : 0,
          stroke: "var(--accent)",
          strokeWidth: noHover ? 1.5 : hovered ? 2 : 1.5,
          filter: visible
            ? noHover
              ? "drop-shadow(0 0 4px var(--accent))"
              : hovered
                ? "drop-shadow(0 0 8px var(--accent))"
                : "drop-shadow(0 0 4px var(--accent))"
            : "none",
          transition:
            "fill-opacity 0.35s ease, stroke-width 0.35s ease, filter 0.35s ease, points 1.2s cubic-bezier(0.16, 1, 0.3, 1) 300ms",
        }}
      />
      {SKILLS.map((s, i) => {
        const p = point(i, visible ? s.value * r : 0)
        const active = noHover ? false : hoverIndex === i
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={active ? 5.5 : 3}
            onMouseEnter={noHover ? undefined : () => setHoverIndex(i)}
            style={{
              fill: "var(--accent)",
              opacity: visible ? 1 : 0,
              cursor: noHover ? "default" : "pointer",
              filter: active ? "drop-shadow(0 0 5px var(--accent))" : "none",
              transition: `opacity 0.4s ease ${600 + i * 80}ms, cx 1.2s cubic-bezier(0.16,1,0.3,1) 300ms, cy 1.2s cubic-bezier(0.16,1,0.3,1) 300ms, r 0.25s cubic-bezier(0.16,1,0.3,1), filter 0.25s ease`,
            }}
          />
        )
      })}
      <polygon
        points={gridPolygon(levels)}
        fill="transparent"
        onMouseEnter={noHover ? undefined : () => setHovered(true)}
        onMouseLeave={noHover ? undefined : () => {
          setHovered(false)
          setHoverIndex(null)
        }}
        style={{ cursor: noHover ? "default" : "pointer" }}
      />
      {SKILLS.map((s, i) => {
        const p = point(i, r + 8)
        const anchor = p.x < cx - 4 ? "end" : p.x > cx + 4 ? "start" : "middle"
        const active = noHover ? false : hoverIndex === i
        return (
          <text
            key={i}
            x={p.x}
            y={p.y + 4}
            textAnchor={anchor}
            onMouseEnter={noHover ? undefined : () => setHoverIndex(i)}
            style={{
              fontSize: active ? 12.5 : 11,
              fontFamily: "'JetBrains Mono', monospace",
              fill: active ? "var(--accent)" : "var(--text-dim-3)",
              opacity: visible ? 1 : 0,
              cursor: noHover ? "default" : "pointer",
              transition: `opacity 0.5s ease ${400 + i * 70}ms, fill 0.25s ease, font-size 0.25s ease`,
            }}
          >
            {s.label}
            {active ? ` · ${Math.round(s.value * 100)}%` : ""}
          </text>
        )
      })}
    </svg>
  )
}

function FocusAreaCard({
  item,
  index,
  horizontal = false,
}: {
  item: (typeof FOCUS_AREAS)[0]
  index: number
  horizontal?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisible(true), index * 120)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
        paddingTop: horizontal ? "0" : "1.25rem",
        paddingBottom: horizontal ? "0" : "1.25rem",
        borderTop: horizontal || index === 0 ? "none" : "1px solid var(--border)",
        cursor: "default",
      }}
    >
      <div className="flex items-start gap-4">
        <span
          style={{
            color: hovered ? "transparent" : "var(--accent)",
            backgroundImage: hovered
              ? "linear-gradient(var(--accent), var(--accent))"
              : "none",
            backgroundClip: hovered ? "text" : "unset",
            WebkitBackgroundClip: hovered ? "text" : "unset",
            fontSize: "1.1rem",
            lineHeight: 1,
            marginTop: "2px",
            opacity: hovered ? 1 : 0.5,
            transform: hovered ? "scale(1.2)" : "scale(1)",
            transition:
              "opacity 0.3s ease, transform 0.3s ease, color 0.3s ease, background-image 0.3s ease",
            display: "inline-block",
            flexShrink: 0,
          }}
          aria-hidden
        >
          {item.icon}
        </span>
        <div className="flex flex-col gap-1">
          <span
            className="font-mono-code text-sm"
            style={{
              color: hovered ? "var(--foreground)" : "var(--accent)",
              transition: "color 0.3s ease",
            }}
          >
            {item.label}
          </span>
          <span
            className="text-base leading-relaxed"
            style={{ color: "var(--text-dim-2)" }}
          >
            {item.desc}
          </span>
        </div>
      </div>
    </div>
  )
}

function SkillTag({ skill, delay }: { skill: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <span
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="font-mono-code text-sm px-3 py-1.5 border"
      style={{
        borderColor: hovered ? "var(--accent)" : "var(--border)",
        color: hovered ? "var(--accent)" : "var(--text-dim-2)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.88)",
        transition: `opacity 0.45s ease ${delay}ms, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}ms, border-color 0.2s ease, color 0.2s ease`,
        cursor: "default",
        display: "inline-block",
      }}
    >
      {skill}
    </span>
  )
}

function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<{ raf: number }>({ raf: 0 })

  useEffect(() => {
    const section = sectionRef.current
    const chart = chartRef.current
    if (!section || !chart) return

    let curX = 0,
      curY = 0,
      tgtX = 0,
      tgtY = 0

    let mouseOver = false

    const handleMove = (e: MouseEvent) => {
      mouseOver = true
      const rect = section.getBoundingClientRect()
      tgtX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      tgtY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const handleLeave = () => {
      mouseOver = false
      tgtX = 0
      tgtY = 0
    }

    const tick = () => {
      if (!mouseOver && gyro.active) {
        tgtX = gyro.x
        tgtY = gyro.y
      }
      curX += (tgtX - curX) * 0.08
      curY += (tgtY - curY) * 0.08

      const rotY = curX * 6
      const rotX = -curY * 6
      const tx = curX * 6
      const ty = curY * 6
      chart.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(${tx}px, ${ty}px)`

      const shadowX = -curX * 5
      const shadowY = -curY * 3
      chart.style.filter = `drop-shadow(${shadowX.toFixed(2)}px ${shadowY.toFixed(2)}px 8px rgba(0,0,0,0.25))`

      chartInstanceRef.current.raf = requestAnimationFrame(tick)
    }

    section.addEventListener("mousemove", handleMove)
    section.addEventListener("mouseleave", handleLeave)
    chartInstanceRef.current.raf = requestAnimationFrame(tick)

    return () => {
      section.removeEventListener("mousemove", handleMove)
      section.removeEventListener("mouseleave", handleLeave)
      cancelAnimationFrame(chartInstanceRef.current.raf)
      chart.style.transform = ""
      chart.style.filter = ""
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} style={{ scrollMarginTop: "3.5rem" }}>
      <Container className="py-14 sm:py-24">
        {/* Mobile section label */}
        <div className="flex sm:hidden mb-8">
          <span
            className="font-mono-code text-2xl font-bold tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            About Me
          </span>
        </div>
        <div className="flex gap-8 sm:gap-20">
          <div className="hidden sm:flex items-center justify-center pt-1 shrink-0">
            <span
              className="font-mono-code text-4xl font-bold tracking-[0.3em]"
              style={{
                color: "var(--accent)",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              About Me
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <Reveal className="h-full">
                <div
                  className="h-full p-5 sm:p-9 border"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--card)",
                  }}
                >
                  <div className="flex flex-col">
                    {FOCUS_AREAS.map((item, i) => (
                      <FocusAreaCard key={item.label} item={item} index={i} />
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100} className="h-full">
                <div
                  ref={chartRef}
                  className="h-full flex items-center justify-center sm:justify-start sm:pl-6"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <AnimatedRadarChart noHover />
                </div>
              </Reveal>
            </div>

            <Reveal delay={150}>
              <div
                className="p-5 sm:p-9 border"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--card)",
                }}
              >
                <div className="flex flex-col gap-5">
                  {TECH_STACK.map(({ category, skills }, ci) => (
                    <div key={category} className="flex flex-col gap-2">
                      <p
                        className="font-mono-code text-sm"
                        style={{ color: "var(--accent)" }}
                      >
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, si) => (
                          <SkillTag
                            key={skill}
                            skill={skill}
                            delay={ci * 60 + si * 50 + 200}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default function App() {
  const [dark, setDark] = useState(false)
  const [showMoreProjects, setShowMoreProjects] = useState(false)
  const [showMoreLiterature, setShowMoreLiterature] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("home")
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const [typedCount, setTypedCount] = useState(0)
  const [showBackground, setShowBackground] = useState(false)
  const [backgroundVisible, setBackgroundVisible] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<(typeof LITERATURE)[0] | null>(null)

  const handleScroll = () => {
    setScrolled(window.scrollY > 20)
  }

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      setTypedCount(HERO_FULL.length)
      setShowBackground(true)
      setBackgroundVisible(true)
      return
    }

    setTypedCount(HERO_PLAIN.length)
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setTypedCount(HERO_PLAIN.length + i)
      if (i >= HERO_ACCENT.length) {
        clearInterval(interval)
        setTimeout(() => setShowBackground(true), 300)
      }
    }, 107)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!showBackground) return
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setBackgroundVisible(true))
      return () => cancelAnimationFrame(raf2)
    })
    return () => cancelAnimationFrame(raf1)
  }, [showBackground])

  useEffect(() => {
    if (!showBackground) return
    const container = heroRef.current
    const title = titleRef.current
    const button = buttonRef.current
    if (!container || !title) return

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    let curX = 0,
      curY = 0,
      tgtX = 0,
      tgtY = 0
    let raf: number

    let mouseOver = false

    const handleMove = (e: MouseEvent) => {
      mouseOver = true
      const rect = container.getBoundingClientRect()
      tgtX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      tgtY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const handleLeave = () => {
      mouseOver = false
      tgtX = 0
      tgtY = 0
    }

    const tick = () => {
      if (!mouseOver && gyro.active) {
        tgtX = gyro.x
        tgtY = gyro.y
      }
      curX += (tgtX - curX) * 0.08
      curY += (tgtY - curY) * 0.08

      const rotY = curX * 6
      const rotX = -curY * 6
      const tx = curX * 6
      const ty = curY * 6
      title.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(${tx}px, ${ty}px)`

      const titleColor = getComputedStyle(title).color
      const titleRgb = titleColor.match(/\d+/g)
      const tsx = -curX * 5
      const tsy = -curY * 3
      if (titleRgb) {
        const [r, g, b] = titleRgb
        const shadows = Array.from({ length: 5 }, (_, k) => {
          const t = (k + 1) / 5
          const opacity = (0.18 - t * 0.12).toFixed(3)
          return `${(tsx * t).toFixed(2)}px ${(tsy * t).toFixed(2)}px 0px rgba(${r},${g},${b},${opacity})`
        }).join(", ")
        title.style.textShadow = shadows
      }

      if (button) {
        const bRotY = curX * 10
        const bRotX = -curY * 10
        const btx = curX * 8
        const bty = curY * 8
        button.style.transform = `perspective(400px) rotateX(${bRotX}deg) rotateY(${bRotY}deg) translate(${btx}px, ${bty}px)`

        const btnBg = getComputedStyle(button).backgroundColor
        const btnRgb = btnBg.match(/\d+/g)
        const bsx = -curX * 8
        const bsy = -curY * 5
        if (btnRgb) {
          const [r, g, b] = btnRgb
          const boxShadows = Array.from({ length: 5 }, (_, k) => {
            const t = (k + 1) / 5
            const opacity = (0.35 - t * 0.25).toFixed(3)
            return `${(bsx * t).toFixed(2)}px ${(bsy * t).toFixed(2)}px 0px rgba(${r},${g},${b},${opacity})`
          }).join(", ")
          button.style.boxShadow = boxShadows
        }
      }

      raf = requestAnimationFrame(tick)
    }

    container.addEventListener("mousemove", handleMove)
    container.addEventListener("mouseleave", handleLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      container.removeEventListener("mousemove", handleMove)
      container.removeEventListener("mouseleave", handleLeave)
      cancelAnimationFrame(raf)
      if (title) {
        title.style.transform = ""
        title.style.textShadow = ""
      }
      if (button) {
        button.style.transform = ""
        button.style.boxShadow = ""
      }
    }
  }, [showBackground])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  useEffect(() => {
    if (!selectedArticle) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedArticle(null)
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [selectedArticle])

  useEffect(() => {
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.35 },
    )
    NAV_SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        minHeight: "100vh",
      }}
    >
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={{
          backgroundColor: "var(--background)",
          borderBottom: "1px solid var(--border)",
          borderBottomColor: scrolled ? "var(--border)" : "transparent",
          transition: "border-bottom-color 0.2s ease",
        }}
      >
        <nav
          className="max-w-4xl mx-auto px-4 sm:px-8 flex items-center justify-between"
          style={{ height: "3.5rem" }}
        >
          <button
            onClick={() => scrollTo("home")}
            className="font-display text-xl tracking-tight focus:outline-none"
          >
            Sulav Bhatta
          </button>

          {/* Desktop nav links */}
          <ul className="hidden sm:flex items-center gap-6">
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className="font-mono-code text-sm capitalize transition-all duration-200 focus:outline-none"
                  style={{
                    color:
                      activeSection === id
                        ? "var(--foreground)"
                        : "var(--text-dim-1)",
                    fontWeight: activeSection === id ? 500 : 400,
                  }}
                >
                  {id === "selected-work"
                    ? "Projects"
                    : id === "curated-words"
                      ? "Literature"
                      : id}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <ThemeToggle dark={dark} toggle={() => setDark(!dark)} />
            {/* Hamburger — mobile only */}
            <button
              className="sm:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 focus:outline-none"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              <span
                style={{
                  display: "block",
                  width: "20px",
                  height: "2px",
                  backgroundColor: "var(--foreground)",
                  transition: "transform 0.25s ease, opacity 0.25s ease",
                  transform: mobileMenuOpen ? "translateY(7px) rotate(45deg)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "20px",
                  height: "2px",
                  backgroundColor: "var(--foreground)",
                  transition: "opacity 0.25s ease",
                  opacity: mobileMenuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "20px",
                  height: "2px",
                  backgroundColor: "var(--foreground)",
                  transition: "transform 0.25s ease, opacity 0.25s ease",
                  transform: mobileMenuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu — absolutely positioned so it overlays the hero */}
        <div
          className="sm:hidden"
          style={{
            position: "absolute",
            top: "3.5rem",
            left: 0,
            right: 0,
            backgroundColor: "var(--background)",
            borderBottom: "1px solid var(--border)",
            borderBottomColor: mobileMenuOpen ? "var(--border)" : "transparent",
            overflow: "hidden",
            maxHeight: mobileMenuOpen ? "16rem" : "0",
            opacity: mobileMenuOpen ? 1 : 0,
            transition: "max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, border-bottom-color 0.25s ease",
            zIndex: 49,
          }}
        >
          <ul className="flex flex-col px-4 py-4 gap-4">
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className="font-mono-code text-sm capitalize w-full text-left focus:outline-none"
                  style={{
                    color:
                      activeSection === id
                        ? "var(--foreground)"
                        : "var(--text-dim-1)",
                    fontWeight: activeSection === id ? 500 : 400,
                  }}
                >
                  {id === "selected-work"
                    ? "Projects"
                    : id === "curated-words"
                      ? "Literature"
                      : id}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section
        id="home"
        ref={heroRef}
        className="relative flex flex-col"
        style={{ minHeight: "100vh", paddingTop: "3.5rem" }}
      >
        {showBackground && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: backgroundVisible ? 1 : 0,
              transition: "opacity 1.4s ease",
              zIndex: 0,
              willChange: "opacity",
            }}
          >
            <FloatingChips containerRef={heroRef} />
          </div>
        )}
        <Container className="relative z-10 flex-1 flex flex-col items-center justify-center gap-12 sm:gap-20 py-16 sm:py-24">
          <h1
            ref={titleRef}
            className="font-display leading-none text-center"
            style={{
              fontSize: "clamp(2.5rem, 7.5vw, 5.5rem)",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              willChange: "transform",
              transformStyle: "preserve-3d",
            }}
          >
            <span className="sr-only">{HERO_FULL}</span>
            <span aria-hidden="true" className="flex flex-col items-center">
              <span>{HERO_PLAIN}</span>
              <span className="relative inline-block">
                <em
                  style={{ color: "var(--accent)", visibility: "hidden" }}
                  aria-hidden="true"
                >
                  {HERO_ACCENT}
                </em>
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  <em style={{ color: "var(--accent)" }}>
                    {HERO_ACCENT.slice(
                      0,
                      Math.max(0, typedCount - HERO_PLAIN.length),
                    )}
                  </em>
                  {!showBackground && (
                    <span
                      className="inline-block animate-pulse"
                      style={{
                        width: "3px",
                        height: "0.85em",
                        marginLeft: "2px",
                        verticalAlign: "-0.1em",
                        backgroundColor: "var(--foreground)",
                      }}
                    />
                  )}
                </span>
              </span>
            </span>
          </h1>

          <div className="flex items-center justify-center shrink-0">
            <a
              ref={buttonRef}
              href={cvPdf}
              download="Sulav_Bhatta_CV.pdf"
              className="font-mono-code text-sm px-6 py-4 transition-opacity hover:opacity-80 inline-block text-center"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
                willChange: "transform",
                textDecoration: "none",
              }}
            >
              Download CV
            </a>
          </div>
        </Container>
      </section>

      <AboutSection />

      <section id="selected-work" style={{ scrollMarginTop: "3.5rem" }}>
        <Container className="py-14 sm:py-24">
          {/* Mobile section label */}
          <div className="flex sm:hidden mb-8">
            <span
              className="font-mono-code text-2xl font-bold tracking-[0.2em]"
              style={{ color: "var(--accent)" }}
            >
              Selected Work
            </span>
          </div>
          <div className="flex flex-row-reverse gap-8 sm:gap-20">
            <div className="hidden sm:flex items-center justify-center pt-1">
              <span
                className="font-mono-code text-4xl font-bold tracking-[0.3em]"
                style={{ color: "var(--accent)", writingMode: "vertical-rl" }}
              >
                Selected Work
              </span>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
                {PROJECTS.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 2) * 100} className="h-full">
                    <ProjectCard project={p} />
                  </Reveal>
                ))}
                {showMoreProjects &&
                  EXTRA_PROJECTS.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 2) * 100} className="h-full">
                      <ProjectCard project={p} />
                    </Reveal>
                  ))}
              </div>
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setShowMoreProjects(!showMoreProjects)}
                  className="dim-button font-mono-code text-sm flex items-center gap-2"
                >
                  {showMoreProjects ? "Show less" : "View More"}
                  <span
                    style={{
                      display: "inline-block",
                      transform: showMoreProjects ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    ↓
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="curated-words" style={{ scrollMarginTop: "3.5rem" }}>
        <Container className="py-14 sm:py-24">
          {/* Mobile section label */}
          <div className="flex sm:hidden mb-8">
            <span
              className="font-mono-code text-2xl font-bold tracking-[0.2em]"
              style={{ color: "var(--accent)" }}
            >
              Curated Words
            </span>
          </div>
          <div className="flex gap-8 sm:gap-20">
            <div className="hidden sm:flex items-center justify-center pt-1">
              <span
                className="font-mono-code text-4xl font-bold tracking-[0.3em]"
                style={{
                  color: "var(--accent)",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                Curated Words
              </span>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
                {LITERATURE.map((item, i) => (
                  <Reveal
                    key={item.id}
                    delay={(i % 2) * 100}
                    className="h-full"
                  >
                    <LiteratureCard item={item} onOpen={() => setSelectedArticle(item)} />
                  </Reveal>
                ))}
                {showMoreLiterature &&
                  EXTRA_LITERATURE.map((item, i) => (
                    <Reveal
                      key={item.id}
                      delay={(i % 2) * 100}
                      className="h-full"
                    >
                      <LiteratureCard item={item} onOpen={() => setSelectedArticle(item)} />
                    </Reveal>
                  ))}
              </div>
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setShowMoreLiterature(!showMoreLiterature)}
                  className="dim-button font-mono-code text-sm flex items-center gap-2"
                >
                  {showMoreLiterature ? "Show less" : "View more"}
                  <span
                    style={{
                      display: "inline-block",
                      transform: showMoreLiterature ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    ↓
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <footer>
        <Container className="py-8 sm:py-12">
          <div className="flex flex-row items-center justify-between gap-5">
            <button
              onClick={() => scrollTo("home")}
              className="font-display focus:outline-none"
              style={{ color: "var(--foreground)" }}
              aria-label="Back to top"
            >
              Sulav Bhatta
            </button>
            <div className="flex flex-nowrap items-center gap-4 sm:gap-5">
              <a
                href="https://github.com/b-sulav"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition-opacity hover:opacity-60"
                style={{ color: "var(--foreground)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.4 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/vsulav/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-opacity hover:opacity-60"
                style={{ color: "var(--foreground)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/bsulav/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-opacity hover:opacity-60"
                style={{ color: "var(--foreground)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="7.5" y1="10" x2="7.5" y2="17" />
                  <circle cx="7.5" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
                  <path d="M11.5 17v-4.5a2.5 2.5 0 0 1 5 0V17" />
                  <line x1="11.5" y1="10" x2="11.5" y2="17" />
                </svg>
              </a>
              <a
                href="mailto:bhatta.sulav2005@gmail.com"
                aria-label="Email"
                className="transition-opacity hover:opacity-60"
                style={{ color: "var(--foreground)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3.5 6.5 12 13l8.5-6.5" />
                </svg>
              </a>
            </div>
          </div>
        </Container>
      </footer>
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
      <GyroPermissionButton />
    </div>
  )
}