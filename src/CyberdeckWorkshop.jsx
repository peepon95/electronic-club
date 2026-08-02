import React from "react";
import { siteConfig } from "./config";
import "./cyberdeck-workshop.css";

const repoUrl = siteConfig.cyberdeckRepository;
const releaseUrl = `${repoUrl}/releases/latest`;
const archiveUrl = `${releaseUrl}/download/cyberdeck-workshop.zip`;
const checksumUrl = `${releaseUrl}/download/SHA256SUMS`;

const sessionSteps = [
  ["01", "0:15–1:00", "Flash", "Put the tested Raspberry Pi OS image on the microSD card and save your Wi-Fi and SSH settings."],
  ["02", "1:00–1:30", "Connect", "Boot the Pi, connect from your laptop over SSH, and confirm the board is reachable."],
  ["03", "1:30–2:00", "Light the screen", "Enable SPI, install the display driver, and verify that the console appears on the touchscreen."],
  ["04", "2:10–2:50", "Load the deck", "Install the workshop release, launch the menu, and confirm touch and keyboard controls."],
  ["05", "2:50–3:20", "Choose a game", "Try the included games, then pick one small idea you want to understand and change."],
  ["06", "3:20–4:00", "Make it yours", "Use Codex to change one feature at a time, test on the deck, and keep the version that works."],
];

const equipment = [
  {
    name: "Raspberry Pi Zero 2 W with header",
    note: "The fully supported workshop board. The pre-soldered 40-pin header avoids soldering and accepts the GPIO display.",
    required: true,
  },
  {
    name: "3.5-inch GPIO touchscreen + stylus",
    note: "The tested setup is 480×320, uses XPT2046/ADS7846 touch input, and plugs onto GPIO pins 1–26.",
    required: true,
  },
  {
    name: "16GB+ microSD card + reader",
    note: "The card becomes the Pi's storage. Bring a reader that works with your laptop.",
    required: true,
  },
  {
    name: "Stable 5V/2A micro-USB power",
    note: "Use a suitable power bank or plug and a known-good cable.",
    required: true,
  },
  {
    name: "Mac or Windows laptop",
    note: "Needed for Raspberry Pi Imager and the terminal or PowerShell steps.",
    required: true,
  },
  {
    name: "Wired USB keyboard + micro-USB OTG data adapter",
    note: "The reliable workshop default. Bluetooth is an optional extension after the core deck works.",
    required: true,
  },
  {
    name: "2.4GHz Wi-Fi or phone hotspot",
    note: "The Pi Zero 2 W needs a network for SSH and the initial download. Keep the release ZIP on USB as a fallback.",
    required: true,
  },
];

const compatibility = [
  ["Pi Zero 2 W with header", "Fully supported", "Matches the tested size, GPIO header, power arrangement and workshop instructions."],
  ["Pi Zero W / Zero WH", "Experimental", "Similar form factor and GPIO, but slower. Animation-heavy games may stutter."],
  ["Pi 3B+ / Pi 4B", "Adaptable", "The app logic is reusable, but power, ports, case, framebuffer, overlay and touch input must be rechecked."],
  ["Pi 5", "Separate porting track", "Do not treat the current image as plug-and-play until the newer display and boot environment is tested end to end."],
  ["Pico / Arduino / ESP32", "Not compatible", "These microcontrollers do not provide the same Linux, framebuffer, filesystem or input stack."],
];

const gameIdeas = [
  ["Chinese Lingo", "Change the practice set, hints, difficulty or feedback while keeping correct stroke order."],
  ["Makan Ninja", "Swap the foods, rebalance points or add one new hazard."],
  ["Flappy Bird", "Adjust speed, gap size, colours or the city backdrop."],
  ["Paint", "Add a palette colour, brush size or clear-screen confirmation."],
  ["Journal + e-reader", "Change the typewriter theme or add your own licensed plain-text writing."],
];

const prompts = [
  "Explain this game's main loop to me like I am new to Python. Do not change anything yet.",
  "Change only the background colour of this game. Show me which file and line changed.",
  "Make Makan Ninja award 20 points for durian. Keep every other rule the same.",
  "Make Flappy Bird slightly easier for beginners, then tell me how to test the change.",
  "Use the blank game template to make a simple memory game for a 480×320 touchscreen.",
  "The app stopped launching. Read the error, find the smallest fix, and keep a backup of the working version.",
];

const troubleshooting = [
  ["SSH cannot find the hostname", "Check that the Pi and laptop use the same network. If local names fail, find the Pi's IP in the router or hotspot device list and use that address."],
  ["Host key changed after reflashing", "Remove only the saved key for that hostname with ssh-keygen -R yourhostname.local, then reconnect and verify the new key."],
  ["Screen stays white", "Recheck the SPI setting and every character in the display overlay line. Confirm you edited /boot/firmware/config.txt on the tested OS."],
  ["Touches land in the wrong place", "The screen needs calibration. Run the workshop calibration helper for that exact screen and rotation."],
  ["Keyboard is missing", "Use the Pi's data port, not its power-only port. Check the OTG adapter and replace any charge-only cable."],
  ["Arrows or typing do nothing", "Plug the keyboard in before launching the menu, then restart the app. Input devices are detected when the app starts."],
  ["A game is slow", "Keep graphics and per-frame work simple. Test each change on the Pi, not only on the laptop."],
];

function Code({ children }) {
  return <code className="cd-code">{children}</code>;
}

function SectionTitle({ kicker, children, light = false }) {
  return (
    <header className={`cd-section-heading${light ? " cd-section-heading--light" : ""}`}>
      <p>{kicker}</p>
      <h2>{children}</h2>
    </header>
  );
}

export default function CyberdeckWorkshop() {
  const [copiedPrompt, setCopiedPrompt] = React.useState("");

  React.useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = "Cyberdeck Workshop Guide — Wallflower Project";
    description?.setAttribute(
      "content",
      "Build a Raspberry Pi cyberdeck, install the workshop games, and use Codex to customise your own project.",
    );

    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.setAttribute("content", previousDescription);
    };
  }, []);

  const copyPrompt = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(prompt);
      window.setTimeout(() => setCopiedPrompt(""), 1800);
    } catch {
      setCopiedPrompt("");
    }
  };

  return (
    <div className="cd-page">
      <a className="cd-skip" href="#workshop-main">Skip to the workshop guide</a>

      <nav className="cd-nav" aria-label="Workshop navigation">
        <a className="cd-brand" href="/" aria-label="Back to Wallflower Project home">
          <img src="/wallflower-project-flower-transparent.png" alt="" />
          <span>WALLFLOWER PROJECT</span>
        </a>
        <div className="cd-nav-links">
          <a href="#equipment">equipment</a>
          <a href="#setup">setup</a>
          <a href="#customise">customise</a>
          <a href="#help">help</a>
          <a className="cd-nav-home" href="/">← community home</a>
        </div>
      </nav>

      <main id="workshop-main">
        <header className="cd-hero">
          <div className="cd-hero-copy">
            <p className="cd-kicker">CYBERDECK WORKSHOP · PARTICIPANT GUIDE</p>
            <h1>BUILD IT.<br />BOOT IT.<br /><span>MAKE IT YOURS.</span></h1>
            <p className="cd-hero-lede">
              Build a pocket-sized Raspberry Pi console, choose an included game,
              then use Codex to understand the code and turn one small idea into your own.
              No engineering experience required.
            </p>
            <div className="cd-actions" aria-label="Workshop downloads">
              <a className="cd-button cd-button--primary" href={archiveUrl}>
                DOWNLOAD THE TEST ZIP ↓
              </a>
              <a className="cd-button cd-button--outline" href={repoUrl} target="_blank" rel="noreferrer">
                VIEW SOURCE ON GITHUB ↗
              </a>
            </div>
            <p className="cd-release-note">
              v0.1.0-test is for independent friend testing, not the final public-workshop
              release. <a href={releaseUrl} target="_blank" rel="noreferrer">Read the release notes ↗</a>
            </p>
          </div>
          <aside className="cd-hero-card" aria-label="Known-good workshop build">
            <span className="cd-sticker">KNOWN-GOOD BUILD</span>
            <dl>
              <div><dt>Board</dt><dd>Pi Zero 2 W with header</dd></div>
              <div><dt>Screen</dt><dd>3.5″ · 480×320 · GPIO</dd></div>
              <div><dt>Touch</dt><dd>XPT2046 / ADS7846 + stylus</dd></div>
              <div><dt>Controls</dt><dd>Touch + wired keyboard</dd></div>
              <div><dt>Core</dt><dd>Python on Raspberry Pi OS</dd></div>
            </dl>
            <p>Other Raspberry Pis may work, but they are adaptations—not the identical workshop build.</p>
          </aside>
        </header>

        <section className="cd-session" aria-labelledby="session-title">
          <SectionTitle kicker="YOUR HALF-DAY ROUTE" light>
            <span id="session-title">ONE WORKING DECK. ONE GAME YOU MAKE YOURS.</span>
          </SectionTitle>
          <div className="cd-session-grid">
            {sessionSteps.map(([number, time, title, text]) => (
              <article key={number} className="cd-session-card">
                <div className="cd-session-meta"><span>{number}</span><time>{time}</time></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="cd-session-rule">
            The core win is a deck that boots and plays. Customising comes after that foundation works.
          </p>
        </section>

        <section id="equipment" className="cd-section">
          <SectionTitle kicker="PACK THIS BEFORE THE DAY">THE TESTED KIT.</SectionTitle>
          <div className="cd-equipment-layout">
            <div className="cd-equipment-list">
              {equipment.map((item) => (
                <article key={item.name} className="cd-equipment-item">
                  <div className="cd-check" aria-hidden="true">✓</div>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.note}</p>
                  </div>
                </article>
              ))}
            </div>
            <aside className="cd-note-card">
              <p className="cd-note-label">WHY THE HEADER VERSION?</p>
              <h3>Skip soldering. Save workshop time.</h3>
              <p>
                The screen plugs onto GPIO pins. A headerless Pi can run the software,
                but someone must solder a straight 40-pin header first. The pre-soldered
                version removes tools and risk for beginners.
              </p>
              <a href="https://my.cytron.io/p-raspberry-pi-zero-2-w-with-header" target="_blank" rel="noreferrer">
                See the reference board ↗
              </a>
              <hr />
              <p className="cd-note-label">FACILITATOR SPARES</p>
              <p>
                Bring 2–3 boot-tested SD cards, wired keyboards, OTG data adapters,
                one USB hub, a spare screen and a USB copy of the release ZIP.
              </p>
            </aside>
          </div>
        </section>

        <section className="cd-compat" aria-labelledby="compat-title">
          <SectionTitle kicker="CAN I USE ANOTHER PI?" light>
            <span id="compat-title">THE GAME CODE TRAVELS. THE HARDWARE LAYER NEEDS TESTING.</span>
          </SectionTitle>
          <p className="cd-compat-intro">
            Game rules and drawing code are ordinary Python. The current deck still assumes a
            480×320 RGB565 display, a Linux framebuffer, Linux input devices, a screen overlay,
            touch calibration and Raspberry Pi OS paths.
          </p>
          <div className="cd-compat-list">
            {compatibility.map(([board, status, note], index) => (
              <article key={board} className="cd-compat-row">
                <h3>{board}</h3>
                <span className={`cd-status cd-status--${index === 0 ? "ready" : index === 4 ? "no" : "test"}`}>
                  {status}
                </span>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="setup" className="cd-section">
          <SectionTitle kicker="FOLLOW IN ORDER">SET UP THE FOUNDATION.</SectionTitle>
          <ol className="cd-setup-list">
            <li>
              <div className="cd-step-number">1</div>
              <div>
                <h3>Flash the microSD card</h3>
                <p>
                  In Raspberry Pi Imager choose <strong>Raspberry Pi Zero 2 W</strong> and the
                  workshop-tested <strong>Raspberry Pi OS Legacy (Bookworm), 32-bit Lite</strong> image.
                  Before writing, set a hostname, username, password, 2.4GHz Wi-Fi and enable SSH
                  with password authentication. Write these details down.
                </p>
                <a className="cd-inline-link" href="https://www.raspberrypi.com/software/" target="_blank" rel="noreferrer">
                  Get Raspberry Pi Imager ↗
                </a>
              </div>
            </li>
            <li>
              <div className="cd-step-number">2</div>
              <div>
                <h3>Fit the screen, power on and connect</h3>
                <p>
                  With power disconnected, align the display on GPIO pins 1–26. Insert the card,
                  power the Pi and wait up to two minutes on first boot. From Terminal on Mac or
                  PowerShell on Windows, connect using the names you chose:
                </p>
                <Code>ssh yourusername@yourhostname.local</Code>
                <p className="cd-small">Your password will not appear while you type. That is normal.</p>
              </div>
            </li>
            <li>
              <div className="cd-step-number">3</div>
              <div>
                <h3>Enable the tested display</h3>
                <p>
                  Follow the facilitator's screen-driver checkpoint. The known-good configuration
                  enables SPI and uses the <code>waveshare35c</code> overlay with the tested rotation.
                  Screen drivers vary, so do not substitute a different display guide mid-workshop.
                </p>
                <Code>sudo raspi-config nonint do_spi 0</Code>
                <Code>git clone https://github.com/goodtft/LCD-show.git</Code>
                <Code>chmod -R 755 LCD-show</Code>
                <Code>cd LCD-show</Code>
                <Code>sudo nano /boot/firmware/config.txt</Code>
                <Code>dtparam=spi=on</Code>
                <Code>dtoverlay=waveshare35c,fps=50,speed=24000000,rotate=90</Code>
                <Code>sudo reboot</Code>
              </div>
            </li>
            <li>
              <div className="cd-step-number">4</div>
              <div>
                <h3>Install Cyberdeck 2.0 yourself</h3>
                <p>
                  These commands begin after Raspberry Pi OS, SSH and the touchscreen are working.
                  The tested account name is <code>ee</code>. Stay in the SSH terminal and complete
                  each checkpoint in order.
                </p>
                <div className="cd-install-checkpoints">
                  <div>
                    <strong>1 · Install the download tools</strong>
                    <Code>sudo apt update</Code>
                    <Code>sudo apt install -y curl unzip</Code>
                  </div>
                  <div>
                    <strong>2 · Download the ZIP and checksum</strong>
                    <Code>cd ~</Code>
                    <Code>mkdir -p cyberdeck-download</Code>
                    <Code>cd cyberdeck-download</Code>
                    <Code>curl -L -o cyberdeck-workshop.zip {archiveUrl}</Code>
                    <Code>curl -L -o SHA256SUMS {checksumUrl}</Code>
                  </div>
                  <div>
                    <strong>3 · Verify the download</strong>
                    <Code>sha256sum -c SHA256SUMS</Code>
                    <p>Continue only when it says <code>cyberdeck-workshop.zip: OK</code>.</p>
                  </div>
                  <div>
                    <strong>4 · Extract and run the checks</strong>
                    <Code>unzip cyberdeck-workshop.zip</Code>
                    <Code>cd cyberdeck-workshop</Code>
                    <Code>./scripts/check.sh</Code>
                  </div>
                  <div>
                    <strong>5 · Install all eight apps</strong>
                    <Code>sudo ./install.sh --all</Code>
                    <p>
                      To choose specific apps, run <code>./install.sh --list</code>, then use
                      <code> sudo ./install.sh --apps chinese-lingo,makan-ninja,paint</code>.
                    </p>
                  </div>
                </div>
                <div className="cd-actions cd-actions--left">
                  <a className="cd-button cd-button--primary" href={archiveUrl}>
                    DOWNLOAD ZIP ↓
                  </a>
                  <a className="cd-button cd-button--outline" href={releaseUrl} target="_blank" rel="noreferrer">
                    RELEASE NOTES ↗
                  </a>
                </div>
                <div className="cd-warning">
                  This is the friend-testing release. Record the exact command and terminal message
                  if anything does not match the guide.
                </div>
              </div>
            </li>
            <li>
              <div className="cd-step-number">5</div>
              <div>
                <h3>Launch and pass the checkpoint</h3>
                <p>
                  Plug the wired keyboard into the Pi's USB data port through the OTG adapter before
                  launching. Start the menu using the release instructions. Do not customise yet:
                  first confirm that the menu appears, touch lands correctly and keyboard arrows move.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section id="customise" className="cd-customise">
          <SectionTitle kicker="THE SECOND HALF" light>PLAY FIRST. PICK ONE. CHANGE ONE THING.</SectionTitle>
          <div className="cd-customise-grid">
            <div>
              <p className="cd-customise-lede">
                Everyone installs the same stable collection. Try the examples, choose the one that
                makes you curious, and make one small change. You are learning the loop you can reuse
                at home: read → change → test → keep or restore.
              </p>
              <div className="cd-game-list">
                {gameIdeas.map(([name, idea]) => (
                  <article key={name}>
                    <h3>{name}</h3>
                    <p>{idea}</p>
                  </article>
                ))}
              </div>
            </div>
            <aside className="cd-codex-card">
              <p className="cd-note-label">ASK CODEX LIKE A TEAMMATE</p>
              <h3>Small, specific prompts win.</h3>
              <p>Tell Codex what to change, what must stay the same, and how you want it tested.</p>
              <ol>
                <li>Open the cleaned workshop project in Codex.</li>
                <li>Ask it to explain the game before changing it.</li>
                <li>Request one small edit and a test.</li>
                <li>Run it on the Cyberdeck.</li>
                <li>If it works, save the version. If not, share the exact error.</li>
              </ol>
              <a href={repoUrl} target="_blank" rel="noreferrer">Browse the workshop code ↗</a>
            </aside>
          </div>

          <div className="cd-prompts" aria-labelledby="prompt-title">
            <h3 id="prompt-title">STARTER PROMPTS TO COPY</h3>
            <div>
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="cd-prompt"
                  onClick={() => copyPrompt(prompt)}
                  title="Copy this prompt"
                  aria-label={`Copy prompt: ${prompt}`}
                >
                  <span>{prompt}</span>
                  <strong>{copiedPrompt === prompt ? "copied" : "copy"}</strong>
                </button>
              ))}
            </div>
            <span className="cd-sr-only" role="status" aria-live="polite">
              {copiedPrompt ? "Prompt copied to clipboard." : ""}
            </span>
            <p>Tip: clicking a prompt copies it when your browser allows clipboard access.</p>
          </div>
        </section>

        <section id="help" className="cd-section">
          <SectionTitle kicker="FAST CHECKS FIRST">STUCK IS PART OF THE BUILD.</SectionTitle>
          <div className="cd-help-grid">
            {troubleshooting.map(([problem, fix]) => (
              <details key={problem} className="cd-help-item">
                <summary>{problem}<span aria-hidden="true">+</span></summary>
                <p>{fix}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cd-shutdown" aria-labelledby="shutdown-title">
          <div>
            <p className="cd-kicker">THE HABIT THAT SAVES YOUR WORK</p>
            <h2 id="shutdown-title">SHUT DOWN BEFORE YOU PULL POWER.</h2>
            <p>
              The Pi may still be writing to the microSD card. Pulling power while it runs can corrupt
              files. In your SSH terminal, run these commands and wait for the green activity light to stop.
            </p>
          </div>
          <div className="cd-shutdown-code" aria-label="Safe shutdown commands">
            <Code>sync</Code>
            <Code>sync</Code>
            <Code>sudo shutdown now</Code>
            <strong>Wait for the green light to stop. Then unplug power.</strong>
          </div>
        </section>

        <section className="cd-next">
          <p className="cd-kicker">TAKE THE WORKFLOW HOME</p>
          <h2>THE GAMES ARE THE HOOK.<br />THE CONFIDENCE IS THE PRIZE.</h2>
          <p>
            You flashed an operating system, connected two computers, installed a display,
            ran real code and changed software on a machine you built. Fork the project when the
            repository opens publicly, keep experimenting, and share what you make.
          </p>
          <div className="cd-actions">
            <a className="cd-button cd-button--primary" href={archiveUrl}>
              DOWNLOAD THE TEST ZIP ↓
            </a>
            <a className="cd-button cd-button--outline" href="/">BACK TO WALLFLOWER PROJECT</a>
          </div>
        </section>
      </main>

      <footer className="cd-footer">
        <span>WALLFLOWER PROJECT</span>
        <p>Hands busy, guard down. Build it together, then make it yours.</p>
        <a href="/">wallflower-project.vercel.app</a>
      </footer>
    </div>
  );
}
