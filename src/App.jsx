import React, { useState, useEffect, useRef } from "react";
import { supabase, supabaseConfigured } from "./supabase";

// ============================================================
//  SOLDER SISTERS — ladies-first hardware build club
//  Redesigned in the bold electric-blue-on-cream style:
//  one huge condensed display face, a single saturated accent,
//  and a repeating hand-drawn microchip motif as the signature.
// ============================================================

const C = {
  cream: "#F4F1E4",   // warm paper base
  blue: "#2F43E0",    // electric primary — does almost everything
  blueDeep: "#1E2CA8",
  ink: "#1A1A2E",
};

const GUIDES = [
  {
    id: "cyberdeck-1",
    title: "Cyberdeck · Part 1",
    tag: "Build 1 · Setting it up",
    time: "1 meetup",
    blurb:
      "Build your own cyberdeck from scratch. In part one we set up the core: the board, the screen, the power, and get it booting. You leave with a little machine that's truly yours.",
    kit: "Raspberry Pi (or similar) · small display · keyboard · power bank · case bits",
    guideUrl: import.meta.env.VITE_CYBERDECK_PART_1_GUIDE_URL?.trim(),
  },
  {
    id: "cyberdeck-2",
    title: "Cyberdeck · Part 2",
    tag: "Build 2 · Games & guts",
    time: "1 meetup",
    blurb:
      "Now the fun part. We build on your setup and load it up with games, installing, tinkering, and making it feel like your own handheld. Part one first, then this.",
    kit: "Your part-one cyberdeck · SD card · a game or two you love",
    guideUrl: import.meta.env.VITE_CYBERDECK_PART_2_GUIDE_URL?.trim(),
  },
  {
    id: "coming-soon",
    title: "More builds, soon",
    tag: "In the works",
    time: "TBA",
    blurb:
      "We're figuring this out as we go. New builds get added after each meetup once we've tried them together. Got something you want to make? Tell us, we build what the room's curious about.",
    kit: "Your ideas",
    soon: true,
  },
];

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const getGuideLinks = (url) => {
  if (!url) return null;
  const docId = url.match(/\/document\/d\/([^/]+)/)?.[1];
  if (!docId) return { view: url };

  const base = `https://docs.google.com/document/d/${docId}`;
  return {
    view: `${base}/view`,
    copy: `${base}/copy`,
    pdf: `${base}/export?format=pdf`,
  };
};

export default function App() {
  const [joined, setJoined] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);
  const [guideEmail, setGuideEmail] = useState(() => {
    try {
      return window.localStorage.getItem("solder-sisters-guide-email") || "";
    } catch {
      return "";
    }
  });

  const unlockGuides = (email) => {
    setGuideEmail(email);
    try {
      window.localStorage.setItem("solder-sisters-guide-email", email);
    } catch {
      // The guide still unlocks when storage is unavailable.
    }
  };

  return (
    <div style={S.page}>
      <StyleTag />
      <Nav />
      <Hero />
      <ChipStrip />
      <HowItWorks />
      <Guides onOpen={(g) => setActiveGuide(g)} />
      <Community />
      <FAQ />
      <FinalCTA joined={joined} setJoined={setJoined} />
      <Footer />

      {activeGuide && (
        <GuideModal
          guide={activeGuide}
          unlocked={!!guideEmail}
          onClose={() => setActiveGuide(null)}
          onUnlock={unlockGuides}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------
function Nav() {
  return (
    <nav style={S.nav}>
      <a href="#top" style={S.brand}>
        <Chip size={26} />
        <span style={S.brandName}>SOLDER SISTERS</span>
      </a>
      <div className="ss-nav-links" style={S.navLinks}>
        <a href="#how" style={S.navLink}>how it works</a>
        <a href="#guides" style={S.navLink}>builds</a>
        <a href="#community" style={S.navLink}>community</a>
        <a href="#join" style={S.navBtn}>join</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header id="top" style={S.hero}>
      <div style={S.heroInner}>
        <div style={S.eyebrow}>ladies-first hardware build club · monthly</div>
        <h1 className="ss-h1" style={S.h1}>
          WE BUILD<br />REAL THINGS
        </h1>
        <p style={S.heroP}>
          Once a month a small group of us meet up to build real hardware together,
          starting with our own cyberdecks. No experience needed. Just show up curious.
        </p>
        <p style={S.heroNote}>
          Heads up, we're not professionals. We're a bunch of people learning and
          growing together, one build at a time.
        </p>
        <div style={S.heroCtas}>
          <a href="#join" style={S.primaryBtn}>SAVE MY SPOT</a>
          <a href="#guides" style={S.ghostBtn}>see the builds</a>
        </div>
      </div>
      <ChipField />
    </header>
  );
}

// scrolling strip of words, cream on blue
function ChipStrip() {
  const items = [
    "NO EXPERIENCE NEEDED",
    "BUILD YOUR OWN CYBERDECK",
    "LOAD IT UP WITH GAMES",
    "ONCE A MONTH, IN PERSON",
    "SMALL & INTENTIONAL",
    "LADIES FIRST",
  ];
  return (
    <div style={S.strip} aria-hidden="true">
      <div style={S.stripTrack} data-marquee>
        {[...items, ...items].map((t, i) => (
          <span key={i} style={S.stripItem}>
            <Chip size={16} tone="cream" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "grab a spot for the month",
      d: "Sign up for the monthly meetup and drop your email. We'll send you the parts list and links so you can buy your materials before the day.",
    },
    {
      n: "02",
      t: "build together, in person",
      d: "We meet up and build side by side, step by step. Stuck on a wire or a line of code? There's someone right there building beside you.",
    },
    {
      n: "03",
      t: "keep the guide forever",
      d: "Every build has a written guide you can download and redo at home, at your own pace, whenever you want.",
    },
  ];
  return (
    <section id="how" style={S.section}>
      <SectionHead label="how it works" title="THREE STEPS." />
      <div className="ss-steps" style={S.steps}>
        {steps.map((s) => (
          <div key={s.n} style={S.step}>
            <div style={S.stepNum}>{s.n}</div>
            <h3 style={S.stepTitle}>{s.t}</h3>
            <p style={S.stepText}>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Guides({ onOpen }) {
  return (
    <section id="guides" style={{ ...S.section, ...S.sectionInvert }}>
      <SectionHead label="the build path" title="BUILD YOUR CYBERDECK." invert />
      <p style={{ ...S.sectionLede, color: C.cream + "cc" }}>
        We're starting with a two-part cyberdeck build. Drop your email once and the
        guides unlock. Each one lists what to buy before the meetup.
      </p>
      <div className="ss-guide-grid" style={S.guideGrid}>
        {GUIDES.map((g) => (
          <button
            key={g.id}
            style={{ ...S.guideCard, ...(g.soon ? { opacity: 0.6 } : {}) }}
            onClick={() => !g.soon && onOpen(g)}
            aria-disabled={g.soon || undefined}
          >
            <div style={S.guideTop}>
              <Chip size={34} />
              <span style={S.guideTime}>{g.time}</span>
            </div>
            <span style={S.guideTag}>{g.tag}</span>
            <h3 style={S.guideTitle}>{g.title}</h3>
            <p style={S.guideBlurb}>{g.blurb}</p>
            <span style={S.guideLink}>
              {g.soon ? "stay tuned" : "get the guide →"}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Community() {
  return (
    <section id="community" style={S.section}>
      <SectionHead label="the room" title="DON'T BUILD ALONE." />
      <div className="ss-comm" style={S.commWrap}>
        <div>
          <p style={S.commP}>
            After your first meetup we'll add you to a community of people walking the
            same path. We keep it small and intentional on purpose, so we only add
            members who've come to a meetup with us.
          </p>
          <p style={S.commP}>
            No dead group chats here. Just a room of ladies actually building.
          </p>
          <ul style={S.commList}>
            <li>Vibe coding meets real hardware</li>
            <li>Kept small and intentional while we experiment</li>
            <li>No experts, no egos, just people building</li>
          </ul>
          <a href="#join" style={S.primaryBtn}>COME BUILD WITH US</a>
        </div>
        <div style={S.commQuotes}>
          <Quote
            text="It's hard to stay motivated building alone. Having a room of people doing it with you changes everything."
            who="the whole idea, in one sentence"
          />
          <Quote
            text="You don't need to be an engineer. You just need to show up curious and be okay with things not working the first time."
            who="the house rule"
          />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    {
      q: "who runs this?",
      a: "Hi, I'm Ee! I've run a few AI events in the past, but a ruptured Achilles tendon kept me at home more and that's when I got into building electronics. It's been lonely building alone. This is my little experiment to create a space where we can come together and build something. I'm not a professional engineer, so I'm learning and building right alongside you.",
    },
    {
      q: "why does this space exist?",
      a: "Because it's hard to build alone. I wanted a space for ladies to come together and make more, combining vibe coding with real hardware. It's more fun, and you get way further, when you're figuring it out in a room full of people who are just as curious.",
    },
    {
      q: "is it free? what's the fee for?",
      a: "We ask for a small RM 15 commitment fee. It helps cover the logistics and planning of each meetup, and honestly it's there to make sure the people who join actually want to be there and are ready to commit to building together.",
    },
    {
      q: "are the equipment and parts included?",
      a: "Nope, parts aren't included. Before each meetup we'll advise you on exactly what to get and send you links. Please buy your materials ahead of time so you're ready to build on the day.",
    },
    {
      q: "how many people join?",
      a: "We're keeping the group super small for now while we test and experiment with this format.",
    },
    {
      q: "do i need any experience?",
      a: "None at all. We go slow, we build together, and there's always someone to help when you get stuck. Curiosity is the only requirement.",
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section style={{ ...S.section, ...S.sectionInvert }}>
      <SectionHead label="questions" title="THE HONEST ANSWERS." invert />
      <div style={S.faqList}>
        {qs.map((item, i) => (
          <div key={i} style={S.faqItem}>
            <button
              style={S.faqQ}
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
            >
              <span>{item.q}</span>
              <span style={{ ...S.faqPlus, transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
            </button>
            {open === i && <p style={S.faqA}>{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA({ joined, setJoined }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!validEmail(email)) return setErr("Check that email for me?");
    setErr("");
    setSubmitting(true);

    try {
      if (!supabaseConfigured) throw new Error("Supabase is not configured");

      const { error } = await supabase.from("guide_signups").insert({
        email: email.trim().toLowerCase(),
        guide_id: "meetup-waitlist",
        guide_title: "Next meetup waitlist",
      });

      if (error) throw error;

      setJoined(true);
    } catch (error) {
      console.error("Meetup signup failed:", error);
      setErr("We couldn't save your spot just now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section id="join" style={S.finalCta}>
      <div style={S.finalInner}>
        <div style={S.eyebrow}>the next meetup</div>
        <h2 className="ss-final-h" style={S.finalH}>
          STOP SCROLLING.<br />GO MAKE SOMETHING.
        </h2>
        <p style={S.finalP}>
          Drop your email and we'll tell you when the next monthly meetup opens up.
        </p>
        {joined ? (
          <div style={S.successBox}>
            You're on the list. We'll email you when the next meetup opens.
          </div>
        ) : (
          <form style={S.joinForm} onSubmit={submit}>
            <input
              style={S.joinInput}
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="your email"
            />
            <button style={S.joinSubmit} type="submit" disabled={submitting}>
              {submitting ? "SAVING…" : "SAVE MY SPOT"}
            </button>
          </form>
        )}
        {err && <div style={S.errText}>{err}</div>}
      </div>
      <ChipField dense />
    </section>
  );
}

function Footer() {
  return (
    <footer style={S.footer}>
      <div style={S.footerBrand}>
        <Chip size={22} tone="cream" />
        <span style={S.brandName}>SOLDER SISTERS</span>
      </div>
      <p style={S.footerNote}>
        A ladies-first build club for people who'd rather make something than read
        about it. We're not pros, we're learning together.
      </p>
      <div style={S.footerLinks}>
        <span>instagram</span>
        <span>discord</span>
        <span>hello@soldersisters.club</span>
      </div>
      <div style={S.footerFine}>© 2026 Solder Sisters · placeholder brand, swap anytime</div>
    </footer>
  );
}

// ---------------------------------------------------------
//  Pieces
// ---------------------------------------------------------
function SectionHead({ label, title, invert }) {
  return (
    <div style={S.sectionHead}>
      <div style={{ ...S.sectionLabel, color: invert ? C.cream : C.blue }}>· {label} ·</div>
      <h2 className="ss-h2" style={{ ...S.h2, color: invert ? C.cream : C.blue }}>{title}</h2>
    </div>
  );
}

function Quote({ text, who }) {
  return (
    <div style={S.quoteCard}>
      <p style={S.quoteText}>"{text}"</p>
      <div style={S.quoteWho}>{who}</div>
    </div>
  );
}

// hand-drawn microchip — the signature motif (replaces the reference's tennis balls)
function Chip({ size = 40, tone = "blue" }) {
  const stroke = tone === "cream" ? C.cream : C.blue;
  const core = tone === "cream" ? C.cream : C.blue;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true"
         style={{ display: "block", flexShrink: 0 }}>
      <path
        d="M14 13.5 Q14 13 15 13 L33 13.2 Q34.5 13 34.6 14.5 L34.8 33 Q35 34.6 33.5 34.7 L15 34.9 Q13.3 35 13.4 33.4 L13.2 15 Q13 13.6 14 13.5 Z"
        stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" fill="none" />
      <rect x="20" y="20" width="8" height="8" rx="1.5" fill={core} opacity="0.9" />
      <g stroke={stroke} strokeWidth="2.4" strokeLinecap="round">
        <path d="M18 13V7.5M24 13.1V7.4M30 13.2V7.6" />
        <path d="M18 35v5.5M24 35v5.6M30 35.1v5.4" />
        <path d="M13.3 18H7.6M13.3 24H7.5M13.4 30H7.7" />
        <path d="M34.7 18.2h5.6M34.8 24.1h5.6M34.8 30.1h5.5" />
      </g>
    </svg>
  );
}

// tiled field of chips at varying sizes — the hero/footer signature
function ChipField({ dense }) {
  const rows = dense ? 2 : 3;
  const cols = 9;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = (r * 7 + c * 3) % 5;
      const outline = seed === 1 || seed === 4;
      const size = 60 + ((r + c) % 3) * 22;
      cells.push(
        <div key={`${r}-${c}`} style={{ ...S.chipCell, transform: `rotate(${(seed - 2) * 4}deg)` }}>
          <ChipBig size={size} outline={outline} />
        </div>
      );
    }
  }
  return <div style={{ ...S.chipField, opacity: dense ? 0.9 : 1 }} aria-hidden="true">{cells}</div>;
}

// larger decorative chip, either solid or outline
function ChipBig({ size, outline }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M14 13.5 Q14 13 15 13 L33 13.2 Q34.5 13 34.6 14.5 L34.8 33 Q35 34.6 33.5 34.7 L15 34.9 Q13.3 35 13.4 33.4 L13.2 15 Q13 13.6 14 13.5 Z"
        stroke={C.blue} strokeWidth="2.6" strokeLinejoin="round"
        fill={outline ? "none" : C.blue} />
      {!outline && <rect x="20" y="20" width="8" height="8" rx="1.5" fill={C.cream} />}
      {outline && <rect x="20" y="20" width="8" height="8" rx="1.5" fill="none" stroke={C.blue} strokeWidth="2.2" />}
      <g stroke={C.blue} strokeWidth="2.6" strokeLinecap="round">
        <path d="M18 13V7.5M24 13.1V7.4M30 13.2V7.6" />
        <path d="M18 35v5.5M24 35v5.6M30 35.1v5.4" />
        <path d="M13.3 18H7.6M13.3 24H7.5M13.4 30H7.7" />
        <path d="M34.7 18.2h5.6M34.8 24.1h5.6M34.8 30.1h5.5" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------
//  Modal
// ---------------------------------------------------------
function GuideModal({ guide, unlocked, onClose, onUnlock }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const closeRef = useRef(null);
  const guideLinks = getGuideLinks(guide.guideUrl);

  useEffect(() => {
    closeRef.current && closeRef.current.focus();
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!validEmail(email)) return setErr("That email looks off, mind checking?");
    setErr("");
    setSubmitting(true);

    try {
      if (!supabaseConfigured) throw new Error("Supabase is not configured");

      const { error } = await supabase.from("guide_signups").insert({
        email: email.trim().toLowerCase(),
        guide_id: guide.id,
        guide_title: guide.title,
      });

      if (error) throw error;

      onUnlock(email);
    } catch (error) {
      console.error("Guide signup failed:", error);
      setErr("We couldn't unlock the guide just now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button ref={closeRef} style={S.modalClose} onClick={onClose} aria-label="close">×</button>
        <div style={S.modalHead}>
          <Chip size={40} tone="cream" />
          <div>
            <span style={{ ...S.guideTag, color: C.cream }}>{guide.tag}</span>
            <h3 style={S.modalTitle}>{guide.title}</h3>
          </div>
        </div>
        <div style={S.modalBody}>
          <p style={{ margin: "0 0 16px", lineHeight: 1.6 }}>{guide.blurb}</p>
          <div style={S.kitBox}>
            <strong style={S.kitLabel}>what you'll need</strong>
            <div style={{ marginTop: 6 }}>{guide.kit}</div>
          </div>
          {unlocked ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: 6, fontWeight: 700 }}>Unlocked. It's yours.</div>
              <p style={S.guideAccessNote}>
                This is a live guide, so you will always see the latest version.
              </p>
              {guideLinks ? (
                <>
                  <div style={S.guideActions}>
                    <a
                      style={{ ...S.joinSubmit, display: "inline-block" }}
                      href={guideLinks.view}
                      target="_blank"
                      rel="noreferrer"
                    >
                      OPEN LIVE GUIDE ↗
                    </a>
                    {guideLinks.copy && (
                      <a
                        style={S.guideSecondary}
                        href={guideLinks.copy}
                        target="_blank"
                        rel="noreferrer"
                      >
                        MAKE A COPY
                      </a>
                    )}
                  </div>
                  {guideLinks.pdf && (
                    <a style={S.guidePdfLink} href={guideLinks.pdf}>
                      Download as PDF
                    </a>
                  )}
                </>
              ) : (
                <div style={S.guidePending}>
                  The live guide link is being added. Check back soon.
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={submit}>
              <label style={S.gateLabel}>
                Drop your email once to unlock this and every live guide.
              </label>
              <div style={S.joinForm}>
                <input
                  style={S.joinInput}
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="email to unlock guide"
                />
                <button style={S.joinSubmit} type="submit" disabled={submitting}>
                  {submitting ? "UNLOCKING…" : "UNLOCK"}
                </button>
              </div>
              {err && <div style={S.errText}>{err}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
//  Styles
// ---------------------------------------------------------
function StyleTag() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;600;700&display=swap');
      :root {
        --display: 'Anton', Impact, sans-serif;
        --body: 'Archivo', -apple-system, system-ui, sans-serif;
      }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; }
      button { cursor: pointer; font-family: var(--body); }
      a { text-decoration: none; }
      *:focus-visible { outline: 3px solid ${C.blue}; outline-offset: 3px; }
      @keyframes scroll-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @media (prefers-reduced-motion: reduce) {
        [data-marquee] { animation: none !important; }
        html { scroll-behavior: auto; }
      }
      @media (max-width: 860px) {
        .ss-nav-links { display: none !important; }
        .ss-h1 { font-size: 64px !important; line-height: .92 !important; }
        .ss-h2 { font-size: 40px !important; }
        .ss-final-h { font-size: 44px !important; }
        .ss-steps { grid-template-columns: 1fr !important; }
        .ss-comm { grid-template-columns: 1fr !important; }
        .ss-step-last { border-right: none !important; }
      }
    `}</style>
  );
}

const wrap = { maxWidth: 1160, margin: "0 auto", width: "100%" };

const S = {
  page: { background: C.cream, color: C.blue, fontFamily: "var(--body)", overflowX: "hidden" },

  nav: {
    position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "16px 30px",
    background: C.cream + "f2", backdropFilter: "blur(6px)",
    borderBottom: `2px solid ${C.blue}`,
  },
  brand: { display: "flex", alignItems: "center", gap: 10, color: C.blue },
  brandName: { fontFamily: "var(--display)", fontSize: 22, letterSpacing: 1 },
  navLinks: { display: "flex", alignItems: "center", gap: 28 },
  navLink: { color: C.blue, fontWeight: 700, fontSize: 15 },
  navBtn: {
    background: C.blue, color: C.cream, padding: "9px 22px", borderRadius: 2,
    fontFamily: "var(--display)", fontSize: 15, letterSpacing: 1,
  },

  hero: { position: "relative", padding: "70px 30px 0", overflow: "hidden" },
  heroInner: { ...wrap, position: "relative", zIndex: 2, textAlign: "center" },
  eyebrow: {
    display: "inline-block", fontWeight: 700, fontSize: 13, letterSpacing: 1.5,
    textTransform: "uppercase", marginBottom: 20, color: C.blue,
  },
  h1: {
    fontFamily: "var(--display)", fontSize: 132, lineHeight: 0.86, letterSpacing: 1,
    margin: "0 0 26px", color: C.blue, textTransform: "uppercase",
  },
  heroP: { fontSize: 20, lineHeight: 1.55, maxWidth: 560, margin: "0 auto 14px", color: C.blue },
  heroNote: { fontSize: 15, lineHeight: 1.5, maxWidth: 480, margin: "0 auto 30px", color: C.blue + "b0" },
  heroCtas: { display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 54 },
  primaryBtn: {
    background: C.blue, color: C.cream, padding: "15px 34px", borderRadius: 2,
    fontFamily: "var(--display)", fontSize: 18, letterSpacing: 1, display: "inline-block",
  },
  ghostBtn: {
    background: "transparent", color: C.blue, padding: "15px 30px", borderRadius: 2,
    border: `2px solid ${C.blue}`, fontWeight: 700, fontSize: 16, display: "inline-block",
  },

  chipField: {
    display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end",
    gap: 4, marginTop: 10, lineHeight: 0,
  },
  chipCell: { display: "flex", alignItems: "flex-end" },

  strip: {
    background: C.blue, color: C.cream, padding: "13px 0", overflow: "hidden",
    whiteSpace: "nowrap",
  },
  stripTrack: { display: "inline-flex", gap: 44, animation: "scroll-x 30s linear infinite", willChange: "transform" },
  stripItem: {
    display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--display)",
    fontSize: 17, letterSpacing: 1, paddingRight: 44,
  },

  section: { padding: "92px 30px" },
  sectionInvert: { background: C.blue, color: C.cream },
  sectionHead: { ...wrap, textAlign: "center", marginBottom: 40 },
  sectionLabel: { fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 12, marginBottom: 10 },
  h2: { fontFamily: "var(--display)", fontSize: 64, lineHeight: 0.95, letterSpacing: 1, margin: 0, textTransform: "uppercase" },
  sectionLede: { ...wrap, textAlign: "center", fontSize: 18, lineHeight: 1.6, maxWidth: 600, marginBottom: 50 },

  steps: { ...wrap, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, border: `2px solid ${C.blue}` },
  step: { padding: "34px 30px", borderRight: `2px solid ${C.blue}` },
  stepNum: { fontFamily: "var(--display)", fontSize: 52, lineHeight: 1, marginBottom: 12 },
  stepTitle: { fontFamily: "var(--display)", fontSize: 24, margin: "0 0 10px", letterSpacing: 0.5, textTransform: "uppercase" },
  stepText: { fontSize: 16, lineHeight: 1.6, margin: 0, color: C.blue + "d0" },

  guideGrid: { ...wrap, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 },
  guideCard: {
    textAlign: "left", background: C.cream, color: C.blue, border: "none",
    padding: "24px 24px 26px", display: "flex", flexDirection: "column", borderRadius: 3,
  },
  guideTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  guideTime: { fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" },
  guideTag: { fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", opacity: 0.8 },
  guideTitle: { fontFamily: "var(--display)", fontSize: 26, margin: "6px 0 10px", letterSpacing: 0.5, textTransform: "uppercase" },
  guideBlurb: { fontSize: 15, lineHeight: 1.55, margin: "0 0 18px", color: C.blue + "cc" },
  guideLink: { fontWeight: 700, marginTop: "auto" },

  commWrap: { ...wrap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "start" },
  commP: { fontSize: 18, lineHeight: 1.65, margin: "0 0 18px", color: C.blue },
  commList: { listStyle: "none", padding: 0, margin: "0 0 28px", fontSize: 16, lineHeight: 2, fontWeight: 600 },
  commQuotes: { display: "flex", flexDirection: "column", gap: 18 },
  quoteCard: { border: `2px solid ${C.blue}`, borderRadius: 3, padding: "24px 26px" },
  quoteText: { fontFamily: "var(--display)", fontSize: 22, lineHeight: 1.25, margin: "0 0 14px", letterSpacing: 0.3 },
  quoteWho: { fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", opacity: 0.75 },

  faqList: { ...wrap, maxWidth: 780 },
  faqItem: { borderBottom: `2px solid ${C.cream}40` },
  faqQ: {
    width: "100%", background: "transparent", border: "none", textAlign: "left",
    padding: "22px 4px", fontFamily: "var(--display)", fontSize: 24, color: C.cream,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    letterSpacing: 0.5, textTransform: "uppercase",
  },
  faqPlus: { fontSize: 30, transition: "transform .18s", flexShrink: 0, marginLeft: 16 },
  faqA: { padding: "0 4px 24px", fontSize: 16, lineHeight: 1.65, margin: 0, maxWidth: 660, color: C.cream + "d8" },

  finalCta: { position: "relative", background: C.cream, padding: "92px 30px 0", overflow: "hidden", textAlign: "center" },
  finalInner: { ...wrap, position: "relative", zIndex: 2 },
  finalH: { fontFamily: "var(--display)", fontSize: 78, lineHeight: 0.9, letterSpacing: 1, margin: "0 0 20px", color: C.blue, textTransform: "uppercase" },
  finalP: { fontSize: 17, lineHeight: 1.6, maxWidth: 500, margin: "0 auto 30px", color: C.blue },
  joinForm: { display: "flex", gap: 10, maxWidth: 460, margin: "0 auto 60px", flexWrap: "wrap" },
  joinInput: {
    flex: 1, minWidth: 200, padding: "15px 18px", borderRadius: 2,
    border: `2px solid ${C.blue}`, fontSize: 16, fontFamily: "var(--body)", background: C.cream, color: C.blue,
  },
  joinSubmit: {
    background: C.blue, color: C.cream, border: "none", padding: "15px 30px", borderRadius: 2,
    fontFamily: "var(--display)", fontSize: 17, letterSpacing: 1,
  },
  successBox: { border: `2px solid ${C.blue}`, borderRadius: 3, padding: "18px 24px", fontWeight: 700, maxWidth: 460, margin: "0 auto 60px", color: C.blue },
  errText: { fontWeight: 700, marginTop: 12, fontSize: 15, color: C.blue },

  footer: { background: C.blue, color: C.cream, padding: "56px 30px 42px", textAlign: "center" },
  footerBrand: { display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 },
  footerNote: { maxWidth: 440, margin: "0 auto 22px", lineHeight: 1.6, color: C.cream + "cc" },
  footerLinks: { display: "flex", gap: 22, justifyContent: "center", flexWrap: "wrap", fontWeight: 700, marginBottom: 20 },
  footerFine: { fontSize: 13, opacity: 0.6 },

  overlay: { position: "fixed", inset: 0, background: C.blue + "d8", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100 },
  modal: { background: C.cream, borderRadius: 4, maxWidth: 480, width: "100%", border: `2px solid ${C.blue}`, position: "relative", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" },
  modalClose: { position: "absolute", top: 12, right: 14, background: "transparent", border: "none", fontSize: 30, lineHeight: 1, color: C.cream, zIndex: 3 },
  modalHead: { background: C.blue, color: C.cream, padding: "22px 26px", display: "flex", gap: 16, alignItems: "center" },
  modalTitle: { fontFamily: "var(--display)", fontSize: 26, margin: "4px 0 0", letterSpacing: 0.5, textTransform: "uppercase" },
  modalBody: { padding: "24px 26px 28px", color: C.blue },
  kitBox: { border: `2px solid ${C.blue}`, borderRadius: 3, padding: "14px 16px", fontSize: 15, marginBottom: 20 },
  kitLabel: { fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
  gateLabel: { display: "block", fontWeight: 700, marginBottom: 12, fontSize: 15 },
  guideAccessNote: { margin: "0 auto 18px", fontSize: 14, lineHeight: 1.5, maxWidth: 340 },
  guideActions: { display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" },
  guideSecondary: {
    color: C.blue, border: `2px solid ${C.blue}`, padding: "13px 24px", borderRadius: 2,
    fontFamily: "var(--display)", fontSize: 17, letterSpacing: 1, display: "inline-block",
  },
  guidePdfLink: {
    color: C.blue, display: "inline-block", marginTop: 16, fontSize: 14,
    fontWeight: 700, textDecoration: "underline",
  },
  guidePending: {
    border: `2px solid ${C.blue}`, borderRadius: 3, padding: "14px 16px",
    fontSize: 14, lineHeight: 1.5,
  },
};
