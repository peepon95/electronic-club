import React, { useEffect, useRef, useState } from "react";
import { siteConfig } from "./config";
import { supabase, supabaseConfigured } from "./supabase";

const C = {
  cream: "#F4F0E3",
  blue: "#2F43E0",
  blueDeep: "#1D2AA4",
  coral: "#E87355",
  coralSoft: "#F1A18C",
  coralText: "#AA432F",
  ink: "#171719",
};

const FLOWER_MARK =
  "https://raw.githubusercontent.com/peepon95/electronic-club/main/public/wallflower-club-logo-v2-rustic.png";
const COMMUNITY_PHOTO =
  "https://raw.githubusercontent.com/peepon95/electronic-club/main/public/wallflower-project-community-hero.png";

const GUIDES = [
  {
    id: "cyberdeck-1",
    title: "Cyberdeck · Part 1",
    tag: "Setting it up",
    time: "1 meetup",
    blurb:
      "Start with the core: the board, the screen, the power, and get the whole thing booting. You leave with a little machine that's already starting to feel like yours.",
    kit: "Raspberry Pi (or similar) · small display · keyboard · power bank · case bits",
    guideUrl: siteConfig.guides.cyberdeckPart1,
  },
  {
    id: "cyberdeck-2",
    title: "Cyberdeck · Part 2",
    tag: "Games & guts",
    time: "1 meetup",
    blurb:
      "Load it up, tinker with the setup, add a game or two, and make it properly yours. Part one gets it alive. Part two gives it personality.",
    kit: "Your part-one cyberdeck · SD card · a game or two you love",
    guideUrl: siteConfig.guides.cyberdeckPart2,
  },
  {
    id: "whats-next",
    title: "More ways to connect",
    tag: "What's next",
    time: "growing slowly",
    blurb:
      "We're figuring this out as we go. Down the line: more builds, and matching nights where we pair you with someone new for a proper one-on-one. Making stays at the heart of it.",
    kit: "A little courage. We'll handle the awkward bit.",
    soon: true,
  },
];

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
      return (
        window.localStorage.getItem("wallflower-project-guide-email") ||
        window.localStorage.getItem("wallflower-club-guide-email") ||
        window.localStorage.getItem("solder-sisters-guide-email") ||
        ""
      );
    } catch {
      return "";
    }
  });

  const unlockGuides = (email) => {
    setGuideEmail(email);
    try {
      window.localStorage.setItem("wallflower-project-guide-email", email);
    } catch {
      // The guide still unlocks when browser storage is unavailable.
    }
  };

  return (
    <div style={S.page}>
      <StyleTag />
      <Nav />
      <Hero />
      <Marquee />
      <HowItWorks />
      <WhatWeMake onOpen={setActiveGuide} />
      <Story />
      <Community />
      <FAQ />
      <FinalCTA joined={joined} setJoined={setJoined} />
      <Footer />

      {activeGuide && (
        <GuideModal
          guide={activeGuide}
          unlocked={Boolean(guideEmail)}
          onClose={() => setActiveGuide(null)}
          onUnlock={unlockGuides}
        />
      )}
    </div>
  );
}

function Nav() {
  return (
    <nav style={S.nav}>
      <a href="#top" style={S.brand} aria-label="Wallflower Project home">
        <LogoCrop />
        <span style={S.brandName}>WALLFLOWER PROJECT</span>
      </a>
      <div className="wf-nav-links" style={S.navLinks}>
        <a href="#how" style={S.navLink}>how it works</a>
        <a href="#make" style={S.navLink}>what we make</a>
        <a href="#story" style={S.navLink}>the story</a>
        <a href="#community" style={S.navLink}>community</a>
        <a href="#faq" style={S.navLink}>FAQ</a>
        <a href="#join" style={S.navBtn}>SAVE MY SPOT</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header id="top" style={S.hero}>
      <div className="wf-hero-grid" style={S.heroGrid}>
        <div style={S.heroCopy}>
          <div style={S.eyebrow}>A SMALL KL COMMUNITY FOR TIRED, CURIOUS ADULTS</div>
          <h1 className="wf-h1" style={S.h1}>
            MAKE SOMETHING.<br />MEET SOMEONE.
          </h1>
          <p style={S.heroP}>
            Burnt out? Same. Wallflower Project is a small monthly gathering where we
            make something real with our hands and actually meet each other doing it —
            no small talk required. First up: build your own cyberdeck. No experience
            needed. Just show up curious.
          </p>
          <p style={S.heroNote}>
            Heads up — we're not pros. We're people learning together, one build at a time.
          </p>
          <div style={S.heroCtas}>
            <a href="#join" style={S.primaryBtn}>SAVE MY SPOT</a>
            <a href="#make" style={S.ghostBtn}>what we make</a>
          </div>
          <div style={S.houseLine}>
            <span style={S.houseDot} /> hands busy, guard down.
          </div>
        </div>
        <div style={S.heroVisual}>
          <img
            src={COMMUNITY_PHOTO}
            alt="A small group of Malaysian adults building electronics together around a workshop table"
            style={S.heroPhoto}
          />
        </div>
      </div>
    </header>
  );
}

function Marquee() {
  const items = [
    "HANDS BUSY, GUARD DOWN",
    "NO SMALL TALK REQUIRED",
    "NO EXPERIENCE NEEDED",
    "MAKE SOMETHING REAL",
    "COME STAND BY THE WALL WITH US",
    "NO EXPERTS, NO EGOS",
  ];

  return (
    <div style={S.strip} aria-hidden="true">
      <div style={S.stripTrack} data-marquee>
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} style={S.stripItem}>
            <FlowerDot /> {item}
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
      title: "Grab a spot",
      text: "Sign up for the monthly meetup and drop your email. We'll send the parts list and links so you're ready before the day.",
    },
    {
      n: "02",
      title: "Make it together",
      text: "We build side by side, step by step. Stuck on a wire or a line of code? Someone's right there next to you. No mingling pressure — the build does the talking.",
    },
    {
      n: "03",
      title: "Keep what you made",
      text: "You leave with a real thing you built, a written guide to redo it at home, and a room of people who were there.",
    },
  ];

  return (
    <section id="how" style={S.section}>
      <SectionHead label="how it works" title="THREE STEPS. ZERO MINGLING GAMES." />
      <div className="wf-steps" style={S.steps}>
        {steps.map((step) => (
          <article className="wf-step" key={step.n} style={S.step}>
            <div style={S.stepTop}>
              <div style={S.stepNum}>{step.n}</div>
              <ConnectionGlyph size={46} />
            </div>
            <h3 style={S.stepTitle}>{step.title}</h3>
            <p style={S.stepText}>{step.text}</p>
          </article>
        ))}
      </div>
      <p style={S.sectionAside}>No pressure to be charming. That's the whole idea.</p>
    </section>
  );
}

function WhatWeMake({ onOpen }) {
  return (
    <section id="make" style={{ ...S.section, ...S.sectionInvert }}>
      <SectionHead label="where we're starting" title="BUILD YOUR CYBERDECK." invert />
      <p style={{ ...S.sectionLede, color: `${C.cream}d9` }}>
        Every gathering centers on making something together — the easiest way to
        skip small talk and actually connect. We're starting with a two-part cyberdeck
        build: a little handheld machine that's truly yours.
      </p>
      <div className="wf-guide-grid" style={S.guideGrid}>
        {GUIDES.map((guide) => (
          <button
            key={guide.id}
            className="wf-guide-card"
            style={{
              ...S.guideCard,
              ...(guide.soon ? S.guideCardSoon : {}),
            }}
            onClick={() => !guide.soon && onOpen(guide)}
            aria-disabled={guide.soon || undefined}
          >
            <div style={S.guideTop}>
              <ConnectionGlyph size={42} />
              <span style={S.guideTime}>{guide.time}</span>
            </div>
            <span style={S.guideTag}>{guide.tag}</span>
            <h3 style={S.guideTitle}>{guide.title}</h3>
            <p style={S.guideBlurb}>{guide.blurb}</p>
            <span style={S.guideLink}>
              {guide.soon ? "more soon, gently →" : "get the guide →"}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section id="story" style={S.story}>
      <div className="wf-story-grid" style={S.storyGrid}>
        <div style={S.storyTitleWrap}>
          <div style={{ ...S.sectionLabel, color: C.ink }}>· the honest bit ·</div>
          <h2 className="wf-h2" style={{ ...S.h2, color: C.ink }}>WHY<br />“WALLFLOWER”?</h2>
        </div>
        <div style={S.storyCopy}>
          <p style={S.storyLead}>Because I am one.</p>
          <p style={S.storyP}>
            I'm an introvert, a little socially awkward, and walking into an event
            alone genuinely scares me — that standing-by-the-wall feeling of wanting
            to connect but not knowing how. Building alone at home got lonely the same way.
          </p>
          <p style={S.storyP}>
            So Wallflower Project is the room I wished existed: one where you don't have
            to be good at mingling, because we give you something to do together instead.
            You make something with your hands, we quietly pair you with someone to
            actually talk to, and the awkward part takes care of itself. A club for the
            people who usually hang back — where hanging back is the whole point.
          </p>
          <div style={S.storyRule}>“No pressure to be charming. That's the whole idea.”</div>
          <p style={S.storyP}>
            We're all social creatures, even the ones of us hiding by the wall. Wanting
            connection isn't needy — it's human. Most of us just never got handed an
            easy way to do it as adults, somewhere between the exhaustion of work and
            the loneliness of scrolling.
          </p>
          <p style={{ ...S.storyP, marginBottom: 0 }}>
            This is that easy way: something to make, someone to meet, no performance required.
          </p>
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section id="community" style={S.section}>
      <SectionHead label="the room" title="YOU'RE NOT HERE JUST TO BUILD." />
      <div className="wf-community" style={S.communityGrid}>
        <div>
          <p style={S.communityP}>
            After your first meetup, you're in — a small, intentional room of people
            who'd rather make something than scroll. We keep it small on purpose so it
            actually feels like knowing people, not a dead group chat.
          </p>
          <p style={S.communityLead}>The build is the excuse. The people are the point.</p>
          <ul style={S.communityList}>
            <li><FlowerBullet /> Introvert-friendly by design</li>
            <li><FlowerBullet /> Beginners very welcome</li>
            <li><FlowerBullet /> No experts, no egos, no performance</li>
          </ul>
          <a href="#join" style={S.primaryBtn}>COME BUILD WITH US</a>
        </div>
        <div style={S.quoteStack}>
          <Quote
            text="It's hard to stay motivated building alone. A room of people doing it with you changes everything."
            who="the whole idea"
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
  const questions = [
    {
      q: "Who runs this?",
      a: "Hi, I'm Ee — a KL introvert who likes making things but finds walking into rooms alone genuinely terrifying. I'm not an expert or a professional engineer. I'm building the kind of gentle, curious room I wanted to find myself. Proper founder intro coming soon.",
    },
    {
      q: "Why does this space exist?",
      a: "Because adults need easier ways to make real friends. Work is exhausting, scrolling is lonely, and networking events can feel like another performance. Making something side by side gives us a kinder way in.",
    },
    {
      q: "Is it free? What's the fee for?",
      a: "We'll ask for a small commitment fee to hold your spot and cover the planning and logistics behind each meetup. You buy your own materials; we'll send a clear parts list and links before the day.",
    },
    {
      q: "Do I need experience?",
      a: "None. We go slowly, build together, and expect things not to work the first time. Curiosity is the only useful prerequisite.",
    },
    {
      q: "I'm shy and don't know anyone. Is that okay?",
      a: "That's literally who this is for. You don't need to arrive with a friend or be good at working a room. The build gives your hands something to do and the conversation somewhere natural to start.",
    },
    {
      q: "What kinds of events?",
      a: "Right now, hands-on builds starting with cyberdecks. Later we'll explore more things to make and occasional matching nights, but doing something together stays at the heart of it.",
    },
    {
      q: "What's a matching night?",
      a: "An idea we're growing into. At some gatherings we'll gently pair you with someone new for a deeper one-on-one, so you leave having met a person, not just a room. More soon.",
    },
  ];
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" style={{ ...S.section, ...S.sectionInvert }}>
      <SectionHead label="questions" title="THE HONEST ANSWERS." invert />
      <div style={S.faqList}>
        {questions.map((item, index) => (
          <div key={item.q} style={S.faqItem}>
            <button
              style={S.faqQ}
              onClick={() => setOpen(open === index ? -1 : index)}
              aria-expanded={open === index}
            >
              <span>{item.q}</span>
              <span style={{ ...S.faqPlus, transform: open === index ? "rotate(45deg)" : "none" }}>+</span>
            </button>
            {open === index && <p style={S.faqA}>{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA({ joined, setJoined }) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!validEmail(email)) return setErrorMessage("Check that email for me?");
    setErrorMessage("");
    setSubmitting(true);

    try {
      if (!supabaseConfigured) throw new Error("Supabase is not configured");

      const { error } = await supabase.from("guide_signups").insert({
        email: email.trim().toLowerCase(),
        guide_id: "meetup-waitlist",
        guide_title: "Wallflower Project meetup waitlist",
      });

      if (error) throw error;
      setJoined(true);
    } catch (error) {
      console.error("Meetup signup failed:", error);
      setErrorMessage("We couldn't save your spot just now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="join" style={S.finalCta}>
      <div style={S.finalInner}>
        <div style={S.eyebrow}>the next meetup</div>
        <h2 className="wf-final-h" style={S.finalH}>
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
          <form className="wf-join-form" style={S.joinForm} onSubmit={submit}>
            <input
              style={S.joinInput}
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-label="your email"
            />
            <button style={S.joinSubmit} type="submit" disabled={submitting}>
              {submitting ? "SAVING…" : "SAVE MY SPOT"}
            </button>
          </form>
        )}
        {errorMessage && <div style={S.errorText}>{errorMessage}</div>}
        <div style={S.finalAccent}>come stand by the wall with us.</div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={S.footer}>
      <div style={S.footerBrand}>
        <span style={S.brandName}>WALLFLOWER PROJECT</span>
      </div>
      <p style={S.footerNote}>
        A small KL community for burnt-out adults who'd rather make something than
        scroll. We're not pros, we're learning together, and meeting each other while we do.
      </p>
      <div style={S.footerLinks}>
        <span>Instagram</span>
        <span>Discord</span>
        <span>hello@wallflowerproject.my</span>
      </div>
      <div style={S.footerFine}>© 2026 Wallflower Project · hands busy, guard down.</div>
    </footer>
  );
}

function SectionHead({ label, title, invert = false }) {
  return (
    <div style={S.sectionHead}>
      <div style={{ ...S.sectionLabel, color: invert ? C.cream : C.coralText }}>· {label} ·</div>
      <h2 className="wf-h2" style={{ ...S.h2, color: invert ? C.cream : C.blue }}>{title}</h2>
    </div>
  );
}

function Quote({ text, who }) {
  return (
    <div style={S.quoteCard}>
      <div style={S.quoteMark}>“</div>
      <p style={S.quoteText}>{text}</p>
      <div style={S.quoteWho}>{who}</div>
    </div>
  );
}

function LogoCrop() {
  return (
    <span style={S.logoCrop} aria-hidden="true">
      <img src={FLOWER_MARK} alt="" style={S.logoCropImage} />
    </span>
  );
}

function FlowerDot() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="5" r="3.2" fill="currentColor" />
      <circle cx="14.7" cy="8.5" r="3.2" fill="currentColor" />
      <circle cx="12.9" cy="14" r="3.2" fill="currentColor" />
      <circle cx="7.1" cy="14" r="3.2" fill="currentColor" />
      <circle cx="5.3" cy="8.5" r="3.2" fill="currentColor" />
      <circle cx="10" cy="10" r="2.4" fill={C.coral} />
    </svg>
  );
}

function FlowerBullet() {
  return <span style={S.flowerBullet}><FlowerDot /></span>;
}

function ConnectionGlyph({ size = 64, tone = "blue" }) {
  const color = tone === "coral" ? C.coral : C.blue;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12 20V12H20M44 12H52V20M52 44V52H44M20 52H12V44" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M18 32H25M39 32H46M32 18V24M32 40V47" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="27" r="5" fill={color} />
      <circle cx="38" cy="31" r="5" fill={color} />
      <circle cx="36" cy="38" r="5" fill={color} />
      <circle cx="28" cy="38" r="5" fill={color} />
      <circle cx="26" cy="31" r="5" fill={color} />
      <circle cx="32" cy="33" r="3" fill={C.cream} />
      <path d="M37 27L43 20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="45" cy="18" r="3" fill={color} />
    </svg>
  );
}

function GuideModal({ guide, unlocked, onClose, onUnlock }) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const closeRef = useRef(null);
  const guideLinks = getGuideLinks(guide.guideUrl);

  useEffect(() => {
    closeRef.current?.focus();
    const onEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);

  const submit = async (event) => {
    event.preventDefault();
    if (!validEmail(email)) return setErrorMessage("That email looks off, mind checking?");
    setErrorMessage("");
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
      setErrorMessage("We couldn't unlock the guide just now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button ref={closeRef} style={S.modalClose} onClick={onClose} aria-label="close">×</button>
        <div style={S.modalHead}>
          <ConnectionGlyph size={46} tone="coral" />
          <div>
            <span style={{ ...S.guideTag, color: C.cream }}>{guide.tag}</span>
            <h3 style={S.modalTitle}>{guide.title}</h3>
          </div>
        </div>
        <div style={S.modalBody}>
          <p style={S.modalBlurb}>{guide.blurb}</p>
          <div style={S.kitBox}>
            <strong style={S.kitLabel}>what you'll need</strong>
            <div style={{ marginTop: 6 }}>{guide.kit}</div>
          </div>
          {unlocked ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: 6, fontWeight: 700 }}>Unlocked. It's yours.</div>
              <p style={S.guideAccessNote}>This is a live guide, so you'll always see the latest version.</p>
              {guideLinks ? (
                <>
                  <div style={S.guideActions}>
                    <a style={{ ...S.joinSubmit, display: "inline-block" }} href={guideLinks.view} target="_blank" rel="noreferrer">OPEN LIVE GUIDE ↗</a>
                    {guideLinks.copy && <a style={S.guideSecondary} href={guideLinks.copy} target="_blank" rel="noreferrer">MAKE A COPY</a>}
                  </div>
                  {guideLinks.pdf && <a style={S.guidePdfLink} href={guideLinks.pdf}>Download as PDF</a>}
                </>
              ) : (
                <div style={S.guidePending}>The live guide link is being added. Check back soon.</div>
              )}
            </div>
          ) : (
            <form onSubmit={submit}>
              <label style={S.gateLabel}>Drop your email once to unlock this and every live guide.</label>
              <div className="wf-join-form" style={{ ...S.joinForm, marginBottom: 0 }}>
                <input
                  style={S.joinInput}
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-label="email to unlock guide"
                />
                <button style={S.joinSubmit} type="submit" disabled={submitting}>
                  {submitting ? "UNLOCKING…" : "UNLOCK"}
                </button>
              </div>
              {errorMessage && <div style={S.errorText}>{errorMessage}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function StyleTag() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600;700&display=swap');
      :root { --display: 'Anton', Impact, sans-serif; --body: 'DM Sans', system-ui, sans-serif; }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; }
      button, input { font-family: var(--body); }
      button { cursor: pointer; }
      button:disabled { cursor: wait; opacity: .72; }
      a { text-decoration: none; }
      *:focus-visible { outline: 3px solid ${C.coral}; outline-offset: 3px; }
      .wf-guide-card { transition: transform .18s ease, box-shadow .18s ease; }
      .wf-guide-card:not([aria-disabled="true"]):hover { transform: translateY(-5px); box-shadow: 0 12px 0 ${C.coral}; }
      @keyframes scroll-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @media (prefers-reduced-motion: reduce) {
        [data-marquee] { animation: none !important; }
        html { scroll-behavior: auto; }
        .wf-guide-card { transition: none; }
      }
      @media (max-width: 1040px) {
        .wf-nav-links a:not(:last-child) { display: none !important; }
        .wf-hero-grid { grid-template-columns: 1fr !important; }
        .wf-hero-grid > div:first-child { text-align: center !important; }
        .wf-hero-grid > div:first-child > div { justify-content: center; }
        .wf-community, .wf-story-grid { grid-template-columns: 1fr !important; }
        .wf-story-grid { gap: 36px !important; }
      }
      @media (max-width: 760px) {
        .wf-h1 { font-size: 60px !important; line-height: .92 !important; }
        .wf-h2 { font-size: 46px !important; }
        .wf-final-h { font-size: 50px !important; }
        .wf-steps, .wf-guide-grid { grid-template-columns: 1fr !important; }
        .wf-step { border-right: 0 !important; border-bottom: 2px solid ${C.blue}; }
        .wf-step:last-child { border-bottom: 0 !important; }
      }
      @media (max-width: 520px) {
        .wf-h1 { font-size: 48px !important; }
        .wf-h2 { font-size: 40px !important; }
        .wf-final-h { font-size: 43px !important; }
        .wf-join-form { flex-direction: column !important; }
        .wf-join-form input, .wf-join-form button { width: 100% !important; }
      }
    `}</style>
  );
}

const wrap = { maxWidth: 1160, margin: "0 auto", width: "100%" };

const S = {
  page: { background: C.cream, color: C.blue, fontFamily: "var(--body)", overflowX: "hidden" },
  nav: {
    position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "12px 28px", background: `${C.cream}f2`,
    backdropFilter: "blur(9px)",
  },
  brand: { display: "flex", alignItems: "center", gap: 10, color: C.ink },
  logoCrop: { width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: C.cream, flexShrink: 0 },
  logoCropImage: { width: 70, height: 70, maxWidth: "none", display: "block", transform: "translate(-11px, -4px)" },
  brandName: { fontFamily: "var(--display)", fontSize: 21, letterSpacing: 1.1 },
  navLinks: { display: "flex", alignItems: "center", gap: 22 },
  navLink: { color: C.blue, fontWeight: 700, fontSize: 14 },
  navBtn: { background: C.coral, color: C.ink, padding: "11px 20px", borderRadius: 999, fontFamily: "var(--display)", fontSize: 15, letterSpacing: 1 },

  hero: { padding: "78px 30px 72px", position: "relative", overflow: "hidden" },
  heroGrid: { ...wrap, display: "grid", gridTemplateColumns: "1.18fr .82fr", gap: 60, alignItems: "center" },
  heroCopy: { position: "relative", zIndex: 2 },
  eyebrow: { display: "inline-block", fontWeight: 700, fontSize: 12, letterSpacing: 1.7, textTransform: "uppercase", marginBottom: 20, color: C.coralText },
  h1: { fontFamily: "var(--display)", fontSize: 100, lineHeight: .9, letterSpacing: .5, margin: "0 0 28px", color: C.blue, textTransform: "uppercase" },
  heroP: { fontSize: 19, lineHeight: 1.62, maxWidth: 650, margin: "0 0 14px", color: C.ink },
  heroNote: { fontSize: 15, lineHeight: 1.55, maxWidth: 590, margin: "0 0 30px", color: `${C.ink}a8` },
  heroCtas: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 },
  primaryBtn: { background: C.coral, color: C.ink, padding: "15px 32px", borderRadius: 999, fontFamily: "var(--display)", fontSize: 18, letterSpacing: 1, display: "inline-block" },
  ghostBtn: { background: "transparent", color: C.blue, padding: "13px 28px", borderRadius: 999, border: `2px solid ${C.blue}`, fontWeight: 700, fontSize: 16, display: "inline-block" },
  houseLine: { display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 14, color: C.blue },
  houseDot: { width: 10, height: 10, borderRadius: "50%", background: C.coral },
  heroVisual: { position: "relative", maxWidth: 520, width: "100%", margin: "0 auto" },
  heroPhoto: { display: "block", width: "100%", aspectRatio: "16 / 10", objectFit: "cover", objectPosition: "center", borderRadius: 24 },

  strip: { background: C.blue, color: C.cream, padding: "14px 0", overflow: "hidden", whiteSpace: "nowrap" },
  stripTrack: { display: "inline-flex", gap: 44, animation: "scroll-x 32s linear infinite", willChange: "transform" },
  stripItem: { display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--display)", fontSize: 17, letterSpacing: 1, paddingRight: 44 },

  section: { padding: "104px 30px" },
  sectionInvert: { background: C.blue, color: C.cream },
  sectionHead: { ...wrap, textAlign: "center", marginBottom: 42 },
  sectionLabel: { fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 12, marginBottom: 12 },
  h2: { fontFamily: "var(--display)", fontSize: 66, lineHeight: .96, letterSpacing: .8, margin: 0, textTransform: "uppercase" },
  sectionLede: { ...wrap, textAlign: "center", fontSize: 18, lineHeight: 1.65, maxWidth: 720, marginBottom: 52 },
  sectionAside: { textAlign: "center", fontWeight: 700, color: C.coralText, margin: "28px auto 0", fontSize: 16 },

  steps: { ...wrap, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: `2px solid ${C.blue}`, borderRadius: 20, overflow: "hidden" },
  step: { padding: "30px", borderRight: `2px solid ${C.blue}`, background: "#F8F5EA" },
  stepTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  stepNum: { fontFamily: "var(--display)", fontSize: 52, lineHeight: 1, color: C.coralText },
  stepTitle: { fontFamily: "var(--display)", fontSize: 25, margin: "0 0 12px", letterSpacing: .4, textTransform: "uppercase" },
  stepText: { fontSize: 16, lineHeight: 1.65, margin: 0, color: C.ink },

  guideGrid: { ...wrap, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 },
  guideCard: { textAlign: "left", background: C.cream, color: C.blue, border: "none", padding: "26px", display: "flex", flexDirection: "column", minHeight: 340, borderRadius: 20 },
  guideCardSoon: { background: C.coralSoft, color: C.ink },
  guideTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  guideTime: { fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
  guideTag: { fontWeight: 700, fontSize: 12, letterSpacing: 1.1, textTransform: "uppercase" },
  guideTitle: { fontFamily: "var(--display)", fontSize: 29, margin: "7px 0 12px", letterSpacing: .4, textTransform: "uppercase" },
  guideBlurb: { fontSize: 15.5, lineHeight: 1.62, margin: "0 0 22px", color: "inherit", opacity: .88 },
  guideLink: { fontWeight: 700, marginTop: "auto" },

  story: { background: C.coral, padding: "110px 30px" },
  storyGrid: { ...wrap, display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: 70, alignItems: "start" },
  storyTitleWrap: { position: "sticky", top: 110 },
  storyCopy: { color: C.ink },
  storyLead: { fontFamily: "var(--display)", fontSize: 38, margin: "0 0 16px", textTransform: "uppercase" },
  storyP: { fontSize: 19, lineHeight: 1.72, margin: "0 0 24px" },
  storyRule: { border: `3px solid ${C.ink}`, borderRadius: 18, padding: "24px 26px", fontFamily: "var(--display)", fontSize: 30, lineHeight: 1.2, margin: "34px 0", background: C.cream, transform: "rotate(-1deg)" },

  communityGrid: { ...wrap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 58, alignItems: "start" },
  communityP: { fontSize: 19, lineHeight: 1.7, margin: "0 0 22px", color: C.ink },
  communityLead: { fontFamily: "var(--display)", fontSize: 29, lineHeight: 1.2, margin: "0 0 26px", color: C.blue, textTransform: "uppercase" },
  communityList: { listStyle: "none", padding: 0, margin: "0 0 30px", fontSize: 16, lineHeight: 2.1, fontWeight: 700, color: C.ink },
  flowerBullet: { color: C.blue, display: "inline-flex", verticalAlign: "middle", marginRight: 8 },
  quoteStack: { display: "flex", flexDirection: "column", gap: 18 },
  quoteCard: { border: `2px solid ${C.blue}`, borderRadius: 20, padding: "25px 27px", position: "relative", background: "#F8F5EA" },
  quoteMark: { position: "absolute", right: 22, top: 6, fontFamily: "Georgia, serif", fontSize: 70, color: C.coral, lineHeight: 1 },
  quoteText: { fontFamily: "var(--display)", fontSize: 23, lineHeight: 1.3, margin: "0 40px 14px 0", letterSpacing: .2 },
  quoteWho: { fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: C.coralText },

  faqList: { ...wrap, maxWidth: 820 },
  faqItem: { borderBottom: `2px solid ${C.cream}45` },
  faqQ: { width: "100%", background: "transparent", border: "none", textAlign: "left", padding: "23px 4px", fontFamily: "var(--display)", fontSize: 24, color: C.cream, display: "flex", justifyContent: "space-between", alignItems: "center", letterSpacing: .4, textTransform: "uppercase" },
  faqPlus: { fontSize: 32, transition: "transform .18s", color: C.coralSoft, flexShrink: 0, marginLeft: 16 },
  faqA: { padding: "0 4px 26px", fontSize: 16.5, lineHeight: 1.72, margin: 0, maxWidth: 700, color: `${C.cream}dc` },

  finalCta: { position: "relative", background: C.cream, padding: "104px 30px 70px", overflow: "hidden", textAlign: "center" },
  finalInner: { ...wrap, position: "relative", zIndex: 2 },
  finalH: { fontFamily: "var(--display)", fontSize: 80, lineHeight: .91, letterSpacing: .6, margin: "0 0 22px", color: C.blue, textTransform: "uppercase" },
  finalP: { fontSize: 18, lineHeight: 1.6, maxWidth: 540, margin: "0 auto 30px", color: C.ink },
  joinForm: { display: "flex", gap: 10, maxWidth: 560, margin: "0 auto 22px", flexWrap: "wrap" },
  joinInput: { flex: 1, minWidth: 220, padding: "16px 19px", borderRadius: 999, border: `2px solid ${C.blue}`, fontSize: 16, background: "#FAF8F2", color: C.ink },
  joinSubmit: { background: C.coral, color: C.ink, border: `2px solid ${C.ink}`, padding: "15px 29px", borderRadius: 999, fontFamily: "var(--display)", fontSize: 17, letterSpacing: 1 },
  successBox: { border: `2px solid ${C.blue}`, borderRadius: 18, padding: "18px 24px", fontWeight: 700, maxWidth: 520, margin: "0 auto 22px", color: C.blue },
  errorText: { fontWeight: 700, marginTop: 12, fontSize: 15, color: C.blue },
  finalAccent: { color: C.coralText, fontFamily: "var(--display)", fontSize: 21, marginTop: 28 },

  footer: { background: C.ink, color: C.cream, padding: "58px 30px 42px", textAlign: "center" },
  footerBrand: { display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 },
  footerNote: { maxWidth: 580, margin: "0 auto 24px", lineHeight: 1.65, color: `${C.cream}d0` },
  footerLinks: { display: "flex", gap: 22, justifyContent: "center", flexWrap: "wrap", fontWeight: 700, marginBottom: 20, color: C.coralSoft },
  footerFine: { fontSize: 13, opacity: .62 },

  overlay: { position: "fixed", inset: 0, background: `${C.ink}dc`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100 },
  modal: { background: C.cream, borderRadius: 22, maxWidth: 540, width: "100%", border: `2px solid ${C.ink}`, position: "relative", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" },
  modalClose: { position: "absolute", top: 14, right: 16, background: "transparent", border: "none", fontSize: 30, lineHeight: 1, color: C.cream, zIndex: 3 },
  modalHead: { background: C.blue, color: C.cream, padding: "24px 27px", display: "flex", gap: 16, alignItems: "center" },
  modalTitle: { fontFamily: "var(--display)", fontSize: 28, margin: "4px 0 0", letterSpacing: .4, textTransform: "uppercase" },
  modalBody: { padding: "26px 27px 30px", color: C.ink },
  modalBlurb: { margin: "0 0 18px", lineHeight: 1.65 },
  kitBox: { border: `2px solid ${C.blue}`, borderRadius: 14, padding: "15px 17px", fontSize: 15, marginBottom: 22 },
  kitLabel: { fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: C.blue },
  gateLabel: { display: "block", fontWeight: 700, marginBottom: 13, fontSize: 15 },
  guideAccessNote: { margin: "0 auto 18px", fontSize: 14, lineHeight: 1.5, maxWidth: 360 },
  guideActions: { display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" },
  guideSecondary: { color: C.blue, border: `2px solid ${C.blue}`, padding: "13px 23px", borderRadius: 999, fontFamily: "var(--display)", fontSize: 17, letterSpacing: 1, display: "inline-block" },
  guidePdfLink: { color: C.blue, display: "inline-block", marginTop: 17, fontSize: 14, fontWeight: 700, textDecoration: "underline" },
  guidePending: { border: `2px solid ${C.blue}`, borderRadius: 14, padding: "15px 17px", fontSize: 14, lineHeight: 1.5 },
};
