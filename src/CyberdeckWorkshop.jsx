import React from "react";
import { siteConfig } from "./config";
import { supabase, supabaseConfigured } from "./supabase";
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

const includedGames = [
  ["Chinese Lingo", "An offline, level-based trainer for learning simplified Chinese characters and practising the correct stroke order."],
  ["Makan Ninja", "A touchscreen action game where you slash Malaysian food with the stylus and avoid the bombs."],
  ["Tic-Tac-Toe", "A two-player touchscreen version of the classic three-in-a-row grid game."],
  ["Flappy Bird", "A touch-and-keyboard flying game set against a Kuala Lumpur-inspired pixel skyline."],
  ["Minesweeper", "A touchscreen version of the classic logic game: uncover safe squares without hitting a mine."],
  ["Paint", "A simple drawing canvas made for the touchscreen stylus."],
  ["E-Reader", "A plain-text reader that remembers your progress. Add your own or public-domain .txt books."],
  ["Journal", "A keyboard-driven typewriter journal that stores your entries locally on the Cyberdeck."],
];

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

function SectionTitle({ kicker, children }) {
  return (
    <header className="cd-section-heading">
      <p>{kicker}</p>
      <h2>{children}</h2>
    </header>
  );
}

function DownloadGate({ open, onClose, onDownload }) {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (!validEmail(email)) {
      setMessage("Please check your email address.");
      return;
    }

    setMessage("");
    setSubmitting(true);

    try {
      if (!supabaseConfigured) throw new Error("Download signup is not configured");
      const { error } = await supabase.from("guide_signups").insert({
        email: email.trim().toLowerCase(),
        guide_id: "cyberdeck-part-1-download",
        guide_title: "Cyberdeck Workshop Part 1 download",
      });
      if (error) throw error;
      onDownload();
    } catch (error) {
      console.error("Cyberdeck download signup failed:", error);
      setMessage("We could not unlock the download just now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cd-download-modal" role="presentation" onMouseDown={onClose}>
      <div
        className="cd-download-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="cd-download-close" type="button" onClick={onClose} aria-label="Close download form">×</button>
        <p className="cd-note-label">CYBERDECK WORKSHOP · PART 1</p>
        <h2 id="download-dialog-title">GET THE GUIDE.</h2>
        <p>Enter your email to unlock the Cyberdeck 2.0 workshop download.</p>
        <form className="cd-signup-form cd-download-form" onSubmit={submit}>
          <label htmlFor="download-email">Email address</label>
          <div>
            <input
              ref={inputRef}
              id="download-email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "UNLOCKING…" : "UNLOCK DOWNLOAD"}
            </button>
          </div>
          {message && <p role="alert">{message}</p>}
        </form>
      </div>
    </div>
  );
}

function PartTwoSignup() {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [joined, setJoined] = React.useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!validEmail(email)) {
      setMessage("Please check your email address.");
      return;
    }

    setMessage("");
    setSubmitting(true);

    try {
      if (!supabaseConfigured) throw new Error("Signup is not configured");
      const { error } = await supabase.from("guide_signups").insert({
        email: email.trim().toLowerCase(),
        guide_id: "cyberdeck-2",
        guide_title: "Cyberdeck Workshop Part 2",
      });
      if (error) throw error;
      setJoined(true);
    } catch (error) {
      console.error("Part 2 signup failed:", error);
      setMessage("We could not save your spot just now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (joined) {
    return <div className="cd-signup-success">You&apos;re on the Part 2 list. We&apos;ll email you when registration opens.</div>;
  }

  return (
    <form className="cd-signup-form" onSubmit={submit}>
      <label htmlFor="part-two-email">Email address</label>
      <div>
        <input
          id="part-two-email"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "SAVING…" : "SIGN UP FOR PART 2"}
        </button>
      </div>
      {message && <p role="alert">{message}</p>}
    </form>
  );
}

export default function CyberdeckWorkshop() {
  const [downloadGateOpen, setDownloadGateOpen] = React.useState(false);

  React.useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = "Cyberdeck Workshop Part 1 — Wallflower Project";
    description?.setAttribute(
      "content",
      "Set up a Raspberry Pi Cyberdeck, install two included games, and sign up for Cyberdeck Workshop Part 2.",
    );

    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.setAttribute("content", previousDescription);
    };
  }, []);

  const beginDownload = () => setDownloadGateOpen(true);
  const releaseDownload = () => {
    setDownloadGateOpen(false);
    window.location.assign(archiveUrl);
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
          <a href="#games">games</a>
          <a href="#part-2">part 2</a>
          <a className="cd-nav-home" href="/">← community home</a>
        </div>
      </nav>

      <main id="workshop-main">
        <header className="cd-hero">
          <div className="cd-hero-copy">
            <p className="cd-kicker">CYBERDECK WORKSHOP · PART 1</p>
            <h1>BUILD IT.<br />BOOT IT.<br /><span>MAKE IT YOURS.</span></h1>
            <p className="cd-hero-lede">
              LET&apos;S GET BUILDING.
            </p>
            <div className="cd-actions" aria-label="Workshop downloads">
              <button className="cd-button cd-button--primary" type="button" onClick={beginDownload}>
                DOWNLOAD CYBERDECK 2.0 ↓
              </button>
              <a className="cd-button cd-button--outline" href={repoUrl} target="_blank" rel="noreferrer">
                VIEW SOURCE ON GITHUB ↗
              </a>
            </div>
          </div>
        </header>

        <section className="cd-community-note" aria-labelledby="community-note-title">
          <div>
            <p className="cd-note-label">A NOTE BEFORE WE BEGIN</p>
            <h2 id="community-note-title">WE&apos;RE LEARNING AND BUILDING TOGETHER.</h2>
            <p>
              We are not professional engineers or teachers. This guide and workshop grew
              from my own experience building this Cyberdeck, getting stuck, and learning as
              I went. We are here to support one another, solve problems together, and enjoy
              the process of making something real.
            </p>
          </div>
        </section>

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
          <SectionTitle kicker="CAN I USE ANOTHER PI?">
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
                <details className="cd-help-dropdown">
                  <summary>How do I enter my phone hotspot in Raspberry Pi Imager?</summary>
                  <div className="cd-help-dropdown-content">
                    <p>
                      Turn on your phone hotspot first. On the Imager&apos;s <strong>Choose Wi-Fi</strong>
                      screen, enter the hotspot details exactly as they appear on your phone:
                    </p>
                    <dl className="cd-wifi-fields">
                      <div>
                        <dt>Network type</dt>
                        <dd>Choose <strong>Secure Network</strong>.</dd>
                      </div>
                      <div>
                        <dt>SSID</dt>
                        <dd>Enter the exact name of your phone hotspot.</dd>
                      </div>
                      <div>
                        <dt>Password</dt>
                        <dd>Enter your hotspot password, then enter it again to confirm.</dd>
                      </div>
                      <div>
                        <dt>Hidden SSID</dt>
                        <dd>Leave this unchecked.</dd>
                      </div>
                    </dl>
                    <div className="cd-hotspot-platforms">
                      <div>
                        <strong>iPhone</strong>
                        <ol className="cd-hotspot-steps">
                          <li>
                            Open Settings → General → About → Name. This is the hotspot name you
                            will enter as the <strong>SSID</strong>.
                          </li>
                          <li>Open Settings → Personal Hotspot.</li>
                          <li>Turn on <strong>Allow Others to Join</strong>.</li>
                          <li>
                            Turn on <strong>Maximise Compatibility</strong>. The iPhone chooses the
                            compatible 2.4 GHz Wi-Fi band for you.
                          </li>
                          <li>
                            Enter the displayed Wi-Fi Password in Imager and keep the Personal
                            Hotspot screen open while the Pi connects for the first time.
                          </li>
                        </ol>
                      </div>
                      <div>
                        <strong>Android</strong>
                        <p>
                          Open the Wi-Fi hotspot settings and select <strong>2.4 GHz</strong> for
                          AP band, frequency band or compatibility mode. The wording varies by phone.
                        </p>
                      </div>
                    </div>
                    <div className="cd-hotspot-note">
                      <strong>Can my phone still use 5G?</strong>
                      <p>
                        Yes. <strong>5G</strong> is your phone&apos;s mobile-data connection;
                        <strong> 5 GHz</strong> is a Wi-Fi frequency. Your phone can receive internet
                        over 5G while sharing it with the Pi over a compatible 2.4 GHz hotspot.
                      </p>
                    </div>
                    <p className="cd-small">
                      Connect your laptop to this same hotspot before continuing. Capital letters,
                      spaces and punctuation in the hotspot name and password must match exactly.
                    </p>
                  </div>
                </details>
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
                  <strong>Reconnect to your phone hotspot later</strong>
                  <p>Once connected by SSH, you can save your phone hotspot without reflashing:</p>
                  <Code>sudo nmcli dev wifi connect "YOUR_HOTSPOT_NAME" password "YOUR_HOTSPOT_PASSWORD"</Code>
                </div>
              </div>
            </li>
            <li>
              <div className="cd-step-number">4</div>
              <div>
                <h3>Enable the linked Cytron screen</h3>
                <p>
                  This workshop uses only the display overlay needed by Cyberdeck 2.0. It avoids the
                  older all-in-one installer, which changes unrelated Raspberry Pi packages. Run the
                  complete block inside SSH. The checksum protects against a changed or incomplete
                  download. The final command restarts the Pi, so SSH will disconnect.
                </p>
                <Code>{`cd ~ &&
wget -O tft35a.dtbo https://raw.githubusercontent.com/goodtft/LCD-show/a36c00a55e11f0de3b4be0e66f0a2cec47076e23/usr/tft35a-overlay.dtb &&
echo "601ea7056da5d7864648798fd3656b4205f01d6b9a6a8a5cfad6ca5601bbbe1e  tft35a.dtbo" | sha256sum -c - &&
sudo install -m 0644 tft35a.dtbo /boot/overlays/tft35a.dtbo &&
(grep -q '^dtparam=spi=on$' /boot/firmware/config.txt || echo 'dtparam=spi=on' | sudo tee -a /boot/firmware/config.txt) &&
(grep -q '^dtoverlay=tft35a:rotate=90$' /boot/firmware/config.txt || echo 'dtoverlay=tft35a:rotate=90' | sudo tee -a /boot/firmware/config.txt) &&
sudo reboot`}</Code>
                <div className="cd-warning">
                  Use this only with the linked 3.5-inch Cytron screen. After rebooting, the screen
                  may stay white until Cyberdeck 2.0 draws directly to it in Step 5. Wait two minutes,
                  reconnect by SSH and run the checks below before continuing.
                </div>
                <Code>{`test -e /dev/fb1 && echo "[OK] Display framebuffer ready"
grep -A 6 -i "ADS7846 Touchscreen" /proc/bus/input/devices`}</Code>
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
                    <strong>Confirm that the touchscreen really responds</strong>
                    <Code>sudo ./scripts/check-touch.sh</Code>
                    <p>
                      Tap, press and drag with the stylus during the ten-second test. Continue only
                      when it reports <strong>[OK] Touchscreen responded</strong>. Seeing the menu or
                      the ADS7846 driver alone does not confirm that the touch layer works.
                    </p>
                  </div>
                  <div>
                    <strong>Choose the games for your deck</strong>
                    <Code>{`./install.sh --list
sudo ./install.sh`}</Code>
                    <p>
                      Enter the numbers of the two games you picked. The installer also enables the
                      Cyberdeck menu to start automatically whenever the Pi boots. You can run it
                      again later to add more games.
                    </p>
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
                  selects an app, and both games you chose open and respond to their controls. A wired
                  or Bluetooth keyboard is optional; set one up later if you want typing and arrow controls.
                </p>
                <div className="cd-info-card">
                  <strong>Adding a Bluetooth keyboard later?</strong>
                  <p>
                    Pair and trust it once, note its MAC address, then use the included optional
                    reconnect installer. Replace the example address with your keyboard's address:
                  </p>
                  <Code>sudo ./scripts/install-keyboard-reconnect.sh AA:BB:CC:DD:EE:FF</Code>
                  <p>The keyboard must still be charged and switched on.</p>
                </div>
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

        <section id="games" className="cd-customise">
          <SectionTitle kicker="GAMES INCLUDED IN THE PACK">PICK TWO GAMES YOU LIKE.</SectionTitle>
          <p className="cd-customise-lede">
            Cyberdeck 2.0 includes eight ready-to-play apps. Choose any two during Part 1.
            You can run the installer again and add the others whenever you are ready.
          </p>
          <div className="cd-games-grid">
            {includedGames.map(([name, description]) => (
              <article key={name}>
                <h3>{name}</h3>
                <p>{description}</p>
              </article>
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
            <button className="cd-button cd-button--primary" type="button" onClick={beginDownload}>
              DOWNLOAD CYBERDECK 2.0 ↓
            </button>
            <a className="cd-button cd-button--outline" href="#part-2">SIGN UP FOR PART 2 ↑</a>
          </div>
        </section>

        <section id="part-2" className="cd-part-two">
          <div className="cd-part-two-inner">
            <p className="cd-kicker">CYBERDECK WORKSHOP · PART 2</p>
            <h2>CREATE YOUR OWN GAME.</h2>
            <p>
              Part 1 gets your Cyberdeck set up and running. In Part 2, bring it back and
              turn your own idea into a playable game—plan the rules, build it, test it on
              the touchscreen, and take the code home to keep improving.
            </p>
            <PartTwoSignup />
          </div>
        </section>
      </main>

      <DownloadGate
        open={downloadGateOpen}
        onClose={() => setDownloadGateOpen(false)}
        onDownload={releaseDownload}
      />
    </div>
  );
}
