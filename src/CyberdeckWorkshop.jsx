import React from "react";
import { siteConfig } from "./config";
import "./cyberdeck-workshop.css";

const repoUrl = siteConfig.cyberdeckRepository;
const releaseUrl = `${repoUrl}/releases/latest`;
const archiveUrl = `${releaseUrl}/download/cyberdeck-workshop.zip`;
const piZero2Url = "https://my.cytron.io/p-raspberry-pi-zero-2-w-with-header";
const piZeroWhUrl = "https://my.cytron.io/p-raspberry-pi-zero-wh-with-header";
const screenUrl = "https://my.cytron.io/p-3.5-inch-tft-touch-screen-for-rpi-3b-3b-plus-4b";

const equipment = [
  {
    name: "Raspberry Pi Zero 2 W with header",
    note: "The fully supported workshop board. Its pre-soldered header accepts the GPIO screen.",
    price: "RM89",
    link: piZero2Url,
  },
  {
    name: "3.5-inch GPIO touchscreen + stylus",
    note: "The linked 480×320 resistive screen includes the small pen and plugs onto the Pi.",
    price: "RM65",
    link: screenUrl,
  },
  {
    name: "16GB microSD card + reader",
    note: "The card becomes the Pi's storage. Bring a reader that works with your laptop.",
  },
  {
    name: "Micro-USB power wire",
    note: "Use a reliable wire with a suitable 5V/2A power bank or wall plug.",
  },
  {
    name: "Mac or Windows laptop",
    note: "Needed for Raspberry Pi Imager and the terminal or PowerShell steps.",
    price: "bring your own",
  },
  {
    name: "Wired or Bluetooth keyboard",
    note: "Optional for the first workshop. We can explore direct keyboard setup in a later session.",
    price: "optional",
    optional: true,
  },
  {
    name: "Phone hotspot with 2.4GHz support",
    note: "Use your own hotspot so the same connection can travel home with you. Connect the laptop to it too.",
    price: "bring your own",
  },
];

const compatibility = [
  ["Pi Zero 2 W with header", "Fully supported", "The board used in the workshop. It matches the tested size, GPIO header, power arrangement and every instruction.", piZero2Url],
  ["Pi Zero W / Zero WH", "Experimental", "The workshop uses the Pi Zero 2 W with header. If you choose a Zero W or Zero WH, you will need to explore and troubleshoot its setup and performance on your own. Animation-heavy games may stutter.", piZeroWhUrl],
];

const gameIdeas = [
  ["Chinese Lingo", "Change the practice set, hints, difficulty or feedback while keeping correct stroke order."],
  ["Makan Ninja", "Swap the foods, rebalance points or add one new hazard."],
  ["Flappy Bird", "Adjust speed, gap size, colours or the city backdrop."],
  ["Paint", "Add a palette colour, brush size or clear-screen confirmation."],
  ["Journal + e-reader", "Change the typewriter theme or add your own licensed plain-text writing."],
];

const troubleshooting = [
  ["SSH cannot find the hostname", "Check that the Pi and laptop use the same network. If local names fail, find the Pi's IP in the router or hotspot device list and use that address."],
  ["Host key changed after reflashing", "Remove only the saved key for that hostname with ssh-keygen -R yourhostname.local, then reconnect and verify the new key."],
  ["Screen stays white", "The games are written in Python, but a white screen happens before the Python menu can draw. Shut down, disconnect power, reseat the linked screen carefully, reconnect by SSH and rerun the display setup for this exact screen."],
  ["Touches land in the wrong place", "Use the calibration instructions linked on the Cytron screen page. Do not copy another participant's calibration numbers; each screen can differ."],
  ["Optional keyboard is missing", "Finish the first workshop using SSH and touch. Later, a wired keyboard needs the Pi's USB data port and an OTG adapter; Bluetooth models need pairing and enough battery."],
  ["A game is slow", "Keep graphics and per-frame work simple. Test each change on the Pi, not only on the laptop."],
];

function Code({ children, label }) {
  const [copied, setCopied] = React.useState(false);
  const command = React.Children.toArray(children).join("");
  const isBlock = command.includes("\n");
  const copyLabel = label || (isBlock ? "Copy command block" : "Copy command");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`cd-command${isBlock ? " cd-command--block" : ""}`}>
      <code className="cd-code">{command}</code>
      <button type="button" onClick={copy} aria-label={`${copyLabel}: ${command}`}>
        {copied ? "COPIED ✓" : isBlock ? "COPY BLOCK" : "COPY"}
      </button>
      <span className="cd-sr-only" role="status" aria-live="polite">
        {copied ? "Command copied to clipboard." : ""}
      </span>
    </div>
  );
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
  React.useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = "Cyberdeck Workshop Guide — Wallflower Project";
    description?.setAttribute(
      "content",
      "Build a Raspberry Pi cyberdeck with a step-by-step equipment, hotspot, display and game installation guide.",
    );

    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.setAttribute("content", previousDescription);
    };
  }, []);

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
          <a href="#customise">make it yours</a>
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
              Follow one path from a blank microSD card to a pocket-sized Raspberry Pi
              console. Choose an included game, improve it, and keep building at home.
              No engineering experience required.
            </p>
            <div className="cd-actions" aria-label="Workshop downloads">
              <a className="cd-button cd-button--primary" href={archiveUrl}>
                DOWNLOAD CYBERDECK 2.0 ↓
              </a>
              <a className="cd-button cd-button--outline" href={repoUrl} target="_blank" rel="noreferrer">
                VIEW SOURCE ON GITHUB ↗
              </a>
            </div>
          </div>
        </header>

        <section id="equipment" className="cd-section">
          <SectionTitle kicker="PACK THIS BEFORE THE DAY">WHAT YOU NEED.</SectionTitle>
          <div className="cd-equipment-layout">
            <div className="cd-equipment-list">
              {equipment.map((item) => (
                <article key={item.name} className="cd-equipment-item">
                  <div className={`cd-check${item.optional ? " cd-check--optional" : ""}`} aria-hidden="true">
                    {item.optional ? "+" : "✓"}
                  </div>
                  <div>
                    <div className="cd-equipment-title">
                      <h3>{item.name}</h3>
                      {item.price && <span>{item.price}</span>}
                    </div>
                    <p>{item.note}</p>
                    {item.link && (
                      <a className="cd-inline-link" href={item.link} target="_blank" rel="noreferrer">
                        View and buy from Cytron ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cd-compat" aria-labelledby="compat-title">
          <SectionTitle kicker="CAN I USE ANOTHER PI?" light>
            <span id="compat-title">TWO BOARD CHOICES. ONE WORKSHOP STANDARD.</span>
          </SectionTitle>
          <p className="cd-compat-intro">
            In the workshop we will use the Pi Zero 2 W with header. The Zero W and Zero WH
            are experimental alternatives that participants must explore independently.
          </p>
          <div className="cd-compat-list">
            {compatibility.map(([board, status, note, link], index) => (
              <article key={board} className="cd-compat-row">
                <h3><a href={link} target="_blank" rel="noreferrer">{board} ↗</a></h3>
                <span className={`cd-status cd-status--${index === 0 ? "ready" : "test"}`}>
                  {status}
                </span>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="setup" className="cd-section">
          <SectionTitle kicker="FOLLOW 1 THROUGH 7">STEP BY STEP GUIDE.</SectionTitle>
          <ol className="cd-setup-list">
            <li>
              <div className="cd-step-number">1</div>
              <div>
                <h3>Start your phone hotspot</h3>
                <p>
                  Turn on your hotspot before you flash the card. If your phone offers a band or
                  compatibility choice, use <strong>2.4GHz</strong>; the Pi Zero 2 W does not use a
                  5GHz-only network. Give the hotspot a simple name and password, then connect your
                  laptop to that same hotspot.
                </p>
                <div className="cd-info-card">
                  <strong>Is the Pi tied to one local network?</strong>
                  <p>
                    No. It remembers Wi-Fi networks. SSH works when the laptop and Pi are on the same
                    local network, so your own hotspot is convenient at the workshop and at home.
                    The Pi's IP address may change; try its hostname first or check the hotspot's
                    connected-device list.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="cd-step-number">2</div>
              <div>
                <h3>Flash the microSD card</h3>
                <p>
                  Install Raspberry Pi Imager. Choose <strong>Raspberry Pi Zero 2 W</strong> and the
                  workshop-tested <strong>Raspberry Pi OS Legacy (Bookworm), 32-bit Lite</strong> image.
                  In the customisation screen, set a hostname, username and password; enter your
                  hotspot name and password; choose Malaysia as the WLAN country; and enable SSH
                  with password authentication. Write those four details down before writing the card.
                </p>
                <a className="cd-inline-link" href="https://www.raspberrypi.com/software/" target="_blank" rel="noreferrer">
                  Download Raspberry Pi Imager for Mac or Windows ↗
                </a>
                <div className="cd-os-grid">
                  <div><strong>Mac</strong><p>Open the Terminal app.</p></div>
                  <div><strong>Windows</strong><p>Open PowerShell or Windows Terminal.</p></div>
                </div>
                <p className="cd-small">The Imager buttons look slightly different, but the Pi settings and every command after SSH are the same.</p>
              </div>
            </li>
            <li>
              <div className="cd-step-number">3</div>
              <div>
                <h3>Fit the screen, boot and connect</h3>
                <p>
                  With power disconnected, carefully align the display on GPIO pins 1–26. Insert the
                  card, power the Pi and wait up to two minutes. In Terminal or PowerShell, use the
                  hostname and username you created:
                </p>
                <Code>ssh yourusername@yourhostname.local</Code>
                <p className="cd-small">
                  Type <strong>yes</strong> if asked to trust the new host. Your password will not
                  appear while you type—that is normal. If the hostname fails, find the Pi's IP in
                  your hotspot device list and use <code>ssh yourusername@192.168.x.x</code>.
                </p>
                <div className="cd-info-card">
                  <strong>Add another Wi-Fi network later</strong>
                  <p>Once connected by SSH, you can save a home network without reflashing:</p>
                  <Code>sudo nmcli dev wifi connect "YOUR_WIFI_NAME" password "YOUR_WIFI_PASSWORD"</Code>
                </div>
              </div>
            </li>
            <li>
              <div className="cd-step-number">4</div>
              <div>
                <h3>Install the linked Cytron screen driver</h3>
                <p>
                  These commands follow the driver method on the linked Cytron product page for this
                  exact screen. Run them inside the SSH session. The final command restarts the Pi
                  automatically, so your SSH window will disconnect.
                </p>
                <Code>{`sudo raspi-config nonint do_spi 0
cd ~
git clone --depth 1 https://github.com/goodtft/LCD-show.git
cd LCD-show
chmod +x LCD35-show
sudo ./LCD35-show`}</Code>
                <div className="cd-warning">
                  Use this driver only with the linked 3.5-inch Cytron screen. After the reboot,
                  wait two minutes, reconnect by SSH and confirm that the console appears on the display.
                </div>
              </div>
            </li>
            <li>
              <div className="cd-step-number">5</div>
              <div>
                <h3>Download and install Cyberdeck 2.0</h3>
                <p>
                  Participants need <strong>cyberdeck-workshop.zip</strong>. Stay inside SSH and run
                  each block in order. The <code>-f</code> option stops if GitHub does not return the real file.
                </p>
                <div className="cd-install-checkpoints">
                  <div>
                    <strong>Install the download tools</strong>
                    <Code>{`sudo apt update
sudo apt install -y curl unzip`}</Code>
                  </div>
                  <div>
                    <strong>Download the prepared workshop ZIP</strong>
                    <Code>{`cd ~
mkdir -p cyberdeck-download
cd cyberdeck-download
curl -fL -o cyberdeck-workshop.zip ${archiveUrl}`}</Code>
                  </div>
                  <div>
                    <strong>Extract and run the package checks</strong>
                    <Code>{`unzip -o cyberdeck-workshop.zip
cd cyberdeck-workshop
./scripts/check.sh`}</Code>
                  </div>
                  <div>
                    <strong>Choose the games for your deck</strong>
                    <Code>{`./install.sh --list
sudo ./install.sh`}</Code>
                    <p>Press Enter to install every game, or enter the numbers of the games you want.</p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="cd-step-number">6</div>
              <div>
                <h3>Reboot, touch and play</h3>
                <p>Restart once the installer finishes. Your SSH connection will close again.</p>
                <Code>sudo reboot</Code>
                <p>
                  Wait two minutes. Confirm that <strong>CYBERDECK 2.0</strong> appears, the stylus
                  selects an app, and Chinese Lingo and Makan Ninja respond to touch. A wired or
                  Bluetooth keyboard is optional; set one up later if you want typing and arrow controls.
                </p>
              </div>
            </li>
            <li>
              <div className="cd-step-number">7</div>
              <div>
                <h3>Shut down before you pull power</h3>
                <p>
                  The Pi may still be writing to the microSD card. Pulling power while it runs can
                  corrupt files. In your SSH terminal, run these commands in order:
                </p>
                <Code>{`sync
sync
sudo shutdown now`}</Code>
                <div className="cd-warning">
                  Wait until the green activity light has completely stopped blinking. Only then
                  unplug the Micro-USB power wire.
                </div>
              </div>
            </li>
          </ol>
        </section>

        <section id="customise" className="cd-customise">
          <SectionTitle kicker="AFTER THE DECK WORKS" light>PLAY FIRST. PICK ONE. CHANGE ONE THING.</SectionTitle>
          <div className="cd-customise-grid">
            <div>
              <p className="cd-customise-lede">
                Try the examples, choose the one that makes you curious, and make one small change.
                Take the reusable loop home: read → change → test → keep or restore.
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
            <aside className="cd-make-card">
              <p className="cd-note-label">THE CREATIVE LOOP</p>
              <h3>Small experiments become your own game.</h3>
              <ol>
                <li>Play the working version.</li>
                <li>Choose one rule, colour, character or sound.</li>
                <li>Change only that one thing.</li>
                <li>Run the checks and test it on the Cyberdeck.</li>
                <li>Keep what works. Restore and try again when it does not.</li>
              </ol>
              <a href={repoUrl} target="_blank" rel="noreferrer">Browse the workshop code ↗</a>
            </aside>
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

        <section className="cd-next">
          <p className="cd-kicker">TAKE IT HOME. MAKE IT YOURS.</p>
          <h2>BUILD YOUR OWN GAMES.<br />CREATIVITY IS YOUR OCEAN.</h2>
          <p>
            You flashed an operating system, connected two computers, installed a display,
            and ran real code on a machine you built. Go home and improve it. Change a game,
            invent a new one, redesign the case, and share what you discover. This deck is a
            starting point—not the edge of the map.
          </p>
          <div className="cd-actions">
            <a className="cd-button cd-button--primary" href={archiveUrl}>
              DOWNLOAD CYBERDECK 2.0 ↓
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
