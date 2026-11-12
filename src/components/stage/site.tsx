import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Play } from "lucide-react";
import { armAudio, audioArmed, playNote } from "./audio";
import { keys, spotlights, subjects, type Film, type SubjectId } from "./data";
import { Preloader } from "./preloader";
import { burst } from "./wave-bus";
import { Wave } from "./wave";
import "lenis/dist/lenis.css";

export function Site() {
  const hzRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef<{ stop: () => void; start: () => void } | null>(null);
  const [ready, setReady] = useState(false);
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [film, setFilm] = useState<Film | null>(null);
  const [subject, setSubject] = useState<SubjectId | null>(null);
  const [sent, setSent] = useState<{ name: string; email: string; subject: string } | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const finish = useCallback(() => setReady(true), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return;
    let ctx: { revert: () => void } | null = null;
    let dead = false;
    let gsapRef: {
      ticker: {
        add: (fn: (time: number) => void) => void;
        remove: (fn: (time: number) => void) => void;
        lagSmoothing: (n: number) => void;
      };
    } | null = null;
    let lenis: {
      destroy: () => void;
      raf: (time: number) => void;
      on: (event: "scroll", cb: () => void) => void;
      scrollTo: (target: HTMLElement, opts: { offset: number }) => void;
      stop: () => void;
      start: () => void;
    } | null = null;
    let onTick: ((time: number) => void) | null = null;
    let onAnchor: ((event: MouseEvent) => void) | null = null;

    void (async () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      gsapRef = gsap;

      if (!reduce) {
        lenis = new Lenis({
          lerp: 0.1,
          smoothWheel: true,
          syncTouch: false,
          gestureOrientation: "vertical",
          prevent: (node: HTMLElement) =>
            Boolean(node.closest("[data-lenis-prevent], textarea, input, select")),
        });
        lenis.on("scroll", ScrollTrigger.update);
        onTick = (time: number) => {
          lenis?.raf(time * 1000);
        };
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);
        lenisRef.current = lenis;
        onAnchor = (event: MouseEvent) => {
          const link = (event.target as HTMLElement | null)?.closest?.("a[href^='#']");
          if (!link || !root.contains(link)) return;
          const id = link.getAttribute("href")?.slice(1);
          const target = id ? document.getElementById(id) : null;
          if (!target || !lenis) return;
          event.preventDefault();
          lenis.scrollTo(target, { offset: -72 });
        };
        root.addEventListener("click", onAnchor);
      }

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 960px)", () => {
          const track = trackRef.current;
          const pin = pinRef.current;
          if (!track || !pin) return;
          const tween = gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => "+=" + Math.max(track.scrollWidth - window.innerWidth, 1),
              pin: true,
              scrub: 0.65,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
              },
            },
          });
          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        });

        gsap.to(".dr-photo-main", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".dr-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".dr-daan", {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: ".dr-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        mm.add("(min-width: 960px) and (pointer: fine)", () => {
          const move = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth - 0.5;
            gsap.to(".dr-daan", {
              x: x * -22,
              duration: 0.7,
              overwrite: "auto",
              ease: "power3.out",
            });
            gsap.to(".dr-last", {
              x: x * 16,
              duration: 0.8,
              overwrite: "auto",
              ease: "power3.out",
            });
            gsap.to(".dr-photo-main", { x: x * 12, duration: 0.8, overwrite: "auto" });
          };
          window.addEventListener("mousemove", move);
          return () => window.removeEventListener("mousemove", move);
        });

        void document.fonts?.ready.then(() => ScrollTrigger.refresh());
      }, root);
      ScrollTrigger.refresh();
    })();

    return () => {
      dead = true;
      if (onAnchor) root.removeEventListener("click", onAnchor);
      ctx?.revert();
      if (onTick) gsapRef?.ticker.remove(onTick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [ready]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (film) lenis.stop();
    else lenis.start();
  }, [film]);

  const triggerKey = (index: number, el: HTMLButtonElement) => {
    setActiveKey(index);
    const rect = el.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 1.1);
    if (audioArmed()) playNote(index);
  };

  const enableSound = async () => {
    const ok = await armAudio();
    if (ok) {
      setSoundOn(true);
      burst(window.innerWidth * 0.5, window.innerHeight * 0.45, 1.6);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("naam") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("tel") ?? "").trim();
    const message = String(data.get("bericht") ?? "").trim();
    if (!subject) {
      setError("Kies eerst waar je bericht over gaat.");
      return;
    }
    if (name.length < 2) {
      setError("Zet je naam erbij.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Dat e-mailadres klopt niet.");
      return;
    }
    if (message.length < 8) {
      setError("Schrijf een kort bericht, dan weet Daan waar het over gaat.");
      return;
    }
    setError("");
    setSending(true);
    const chosen = subjects.find((s) => s.id === subject);
    window.setTimeout(() => {
      setSending(false);
      setSent({
        name,
        email,
        subject: `${chosen?.label ?? ""}${phone ? ` · ${phone}` : ""}`,
      });
    }, 700);
  };

  const placeholder =
    subjects.find((s) => s.id === subject)?.placeholder ?? "Kies links een onderwerp.";

  return (
    <>
      <Wave hzRef={hzRef} />
      {!ready && <Preloader onDone={finish} />}
      <div ref={rootRef} className="dr-root">
        <a className="dr-skip-link" href="#solo">
          Naar de solo
        </a>
        <header className="dr-nav">
          <a className="dr-brand" href="#solo">
            Daan <em>R.</em>
          </a>
          <nav aria-label="Hoofdnavigatie">
            <a href="#solo">Solo</a>
            <a href="#podium">Podium</a>
            <a href="#pad">Pad</a>
            <a href="#bericht">Bericht</a>
          </nav>
          <span className="dr-hz" ref={hzRef}>
            440.0 Hz
          </span>
        </header>

        <main id="inhoud">
          <section className="dr-hero" id="solo" aria-labelledby="hero-title">
            <p className="dr-kicker">
              <span>00:00</span> Rotterdam · Codarts alumnus
            </p>
            <h1 id="hero-title">
              <span className="dr-daan">Daan</span>
              <span className="dr-last">Roosenbrand</span>
              <span className="dr-h1-role">
                Saxofonist Rotterdam, klarinettist en Codarts-saxofonist
              </span>
            </h1>
            <div className="dr-hero-visual">
              <figure className="dr-photo-main">
                <img
                  src="/photos/portrait.jpg"
                  alt="Portret van Daan Roosenbrand, saxofonist in Rotterdam"
                  width={400}
                  height={400}
                  fetchPriority="high"
                  decoding="async"
                />
                <figcaption>Portret</figcaption>
              </figure>
              <figure className="dr-photo-back">
                <img
                  src="/photos/blue.jpg"
                  alt="Daan Roosenbrand, klarinettist en saxofonist, in blauw podiumlicht"
                  width={960}
                  height={960}
                  decoding="async"
                />
                <figcaption>Live</figcaption>
              </figure>
            </div>
            <div className="dr-hero-copy">
              <p>
                Solo of met DJ. Dirigent van bigbands, saxofoondocent in Papendrecht, Oud Gastel en
                de regio.
              </p>
              <p className="dr-hero-line">Van intieme solo tot Rotterdam Ahoy.</p>
            </div>

            <div className="dr-keys-block">
              <div className="dr-keys-head">
                <button
                  type="button"
                  className={soundOn ? "dr-arm is-on" : "dr-arm"}
                  aria-pressed={soundOn}
                  aria-label={soundOn ? "Geluidsgolf staat aan" : "Activeer geluidsgolf"}
                  onClick={() => void enableSound()}
                >
                  <i />
                  {soundOn ? "Geluidsgolf aan" : "Activeer geluidsgolf"}
                </button>
                <span className="dr-keys-hint">Vijf kleppen. Eén noot per hoofdstuk.</span>
              </div>
              <div className="dr-keys" role="list">
                {keys.map((key, i) => (
                  <button
                    key={key.n}
                    type="button"
                    role="listitem"
                    className={activeKey === i ? "dr-key is-on" : "dr-key"}
                    aria-pressed={activeKey === i}
                    aria-label={`${key.n} ${key.title}`}
                    onMouseEnter={(e) => triggerKey(i, e.currentTarget)}
                    onFocus={(e) => triggerKey(i, e.currentTarget)}
                    onClick={(e) => triggerKey(i, e.currentTarget)}
                  >
                    <span className="dr-key-ring" />
                    <span className="dr-key-n">{key.n}</span>
                  </button>
                ))}
              </div>
              <div className="dr-readout" aria-live="polite">
                {activeKey === null ? (
                  <p>Beweeg over de kleppen — of tik — en een stuk van zijn pad licht op.</p>
                ) : (
                  <p>
                    <strong>
                      {keys[activeKey].n} · {keys[activeKey].title}
                    </strong>
                    <span>{keys[activeKey].body}</span>
                    <em>{keys[activeKey].hz} Hz</em>
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="dr-lead" id="podium" aria-labelledby="podium-title">
            <p className="dr-kicker">
              <span>02:14</span> Podiumhoogtepunten
            </p>
            <h2 id="podium-title">
              Vier schijnwerpers.
              <em> Sax & DJ, Ahoy, de solo's.</em>
            </h2>
          </section>

          <section className="dr-podium" ref={pinRef} aria-labelledby="podium-title">
            <div className="dr-track" ref={trackRef}>
              {spotlights.map((spot) => (
                <article
                  className="dr-spot"
                  key={spot.index}
                  aria-labelledby={`spot-${spot.index}`}
                >
                  <header>
                    <p className="dr-kicker">
                      <span>{spot.index} / 04</span> {spot.kicker}
                    </p>
                    <h3 id={`spot-${spot.index}`}>{spot.title}</h3>
                    <p>{spot.dek}</p>
                  </header>
                  <div
                    className={spot.notes ? "dr-spot-grid is-mixed" : "dr-spot-grid"}
                    data-lenis-prevent
                  >
                    {spot.films.map((item) => (
                      <VideoCard key={item.id} film={item} onOpen={setFilm} />
                    ))}
                    {spot.notes?.map((note) => {
                      const noteId = `note-${spot.index}-${note.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
                      return (
                        <article className="dr-ncard" key={note.title} aria-labelledby={noteId}>
                          <img
                            src={note.image}
                            alt={note.alt}
                            width={note.width}
                            height={note.height}
                            loading="lazy"
                            decoding="async"
                          />
                          <div>
                            <p className="dr-kicker">{note.meta}</p>
                            <h4 id={noteId}>{note.title}</h4>
                            <p>{note.body}</p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
            <div className="dr-podium-bar" aria-hidden="true">
              <span ref={barRef} />
            </div>
          </section>

          <section className="dr-pad" id="pad" aria-labelledby="pad-title">
            <div className="dr-pad-intro">
              <p className="dr-kicker">
                <span>06:40</span> Het pad
              </p>
              <h2 id="pad-title">
                Echte Rotterdammer.
                <em> Bigband-dirigent in Delft.</em>
              </h2>
              <div className="dr-prose">
                <p>
                  Daan Roosenbrand is saxofonist én klarinettist, opgeleid aan Codarts Rotterdam.
                  Lichte muziek is zijn terrein: hij schakelt moeiteloos tussen poporkesten,
                  bigbands, coverbands en Sax & DJ-sets.
                </p>
                <p>
                  Saxofonist boeken kan solo, met coverband IMPAKT in Roosendaal, bij Night at the
                  Jukebox, in de Dave Warmerdam Band, of tot op de vloer van Rotterdam Ahoy.
                  Saxofoonles Papendrecht en saxofoonles Oud Gastel geeft hij bij de verenigingen
                  hieronder.
                </p>
              </div>
            </div>
            <div className="dr-pad-photos">
              <figure>
                <img
                  src="/photos/stage.jpg"
                  alt="Daan Roosenbrand op het podium met saxofoon, naast een zangeres"
                  width={1066}
                  height={1066}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Podium · saxofoon</figcaption>
              </figure>
              <figure>
                <img
                  src="/photos/close.jpg"
                  alt="Close-up van Daan Roosenbrand terwijl hij saxofoon speelt"
                  width={1110}
                  height={1110}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Solo</figcaption>
              </figure>
            </div>

            <div className="dr-hub">
              <p className="dr-hub-lead">
                Hij deelt het vak graag. Het beleven van plezier aan muziek staat altijd centraal —
                in de repetitie, de les en op de basisschool.
              </p>
              <div className="dr-hub-grid">
                <article className="dr-hub-col" aria-labelledby="dirigent-title">
                  <header>
                    <p className="dr-kicker">Directie</p>
                    <h3 id="dirigent-title">De dirigent</h3>
                    <p>Bigbands & ensembles</p>
                  </header>
                  <ul>
                    <li>
                      <span>Dirigent</span>
                      <strong>Let's Swing Delft</strong>
                      <em>Bigband-dirigent Delft</em>
                    </li>
                    <li>
                      <span>Dirigent</span>
                      <strong>JD's Big Band</strong>
                      <em>Dirigent & muzikaal leider</em>
                    </li>
                  </ul>
                </article>
                <article className="dr-hub-col" aria-labelledby="docent-title">
                  <header>
                    <p className="dr-kicker">Les & educatie</p>
                    <h3 id="docent-title">De docent</h3>
                    <p>Verenigingen, privé & scholen</p>
                  </header>
                  <ul>
                    <li className="is-live">
                      <span>Nu actief</span>
                      <strong>Muziekvereniging Excelsior Papendrecht</strong>
                      <em>Saxofoonles Papendrecht</em>
                    </li>
                    <li className="is-live">
                      <span>Nu actief · sinds 2023</span>
                      <strong>Gastels Fanfare</strong>
                      <em>Saxofoonles Oud Gastel</em>
                    </li>
                    <li className="is-live">
                      <span>Nu actief</span>
                      <strong>Individueel & basisscholen</strong>
                      <em>Saxofoonlessen en muziekles, focus op spelplezier</em>
                    </li>
                    <li>
                      <span>Ervaring</span>
                      <strong>De Ambachtse Muziekschool & Muziekschool de Rover</strong>
                      <em>Voormalig saxofoondocent</em>
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section className="dr-desk" id="bericht" aria-labelledby="desk-title">
            <p className="dr-kicker">
              <span>09:05</span> Bericht mij
            </p>
            <h2 id="desk-title">
              Saxofonist boeken.
              <em> Haal Daan naar jouw podium.</em>
            </h2>
            <p className="dr-desk-lead">
              Solo, klarinet, Sax & DJ of een bigband-dirigent — voor Rotterdam, Delft, Papendrecht
              en Roosendaal.
            </p>
            {sent ? (
              <div className="dr-thanks" role="status">
                <p className="dr-kicker">Genoteerd</p>
                <h3>Dank je, {sent.name}.</h3>
                <p>
                  Je bericht over <em>{sent.subject}</em> staat klaar voor Daan. Hij neemt contact
                  op via {sent.email}.
                </p>
                <p className="dr-sim">
                  Voorproef van de boekingsdesk — er is nog geen inbox gekoppeld.
                </p>
                <button type="button" onClick={() => setSent(null)}>
                  Nog een bericht
                </button>
              </div>
            ) : (
              <div className="dr-desk-grid">
                <div className="dr-plates" role="listbox" aria-label="Onderwerp">
                  {subjects.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={subject === item.id}
                      aria-label={`${item.n}. ${item.label}. ${item.detail}`}
                      className={subject === item.id ? "dr-plate is-on" : "dr-plate"}
                      onClick={() => {
                        setSubject(item.id);
                        setError("");
                      }}
                    >
                      <span>{item.n}</span>
                      <span>
                        <strong>{item.label}</strong>
                        <em>{item.detail}</em>
                      </span>
                    </button>
                  ))}
                </div>
                <form className="dr-form" onSubmit={onSubmit} noValidate data-lenis-prevent>
                  <label>
                    Naam
                    <input
                      name="naam"
                      autoComplete="name"
                      placeholder="Je naam"
                      suppressHydrationWarning
                    />
                  </label>
                  <label>
                    E-mail
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="jij@podium.nl"
                      suppressHydrationWarning
                    />
                  </label>
                  <label>
                    Telefoonnummer
                    <input
                      name="tel"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Niet verplicht"
                      suppressHydrationWarning
                    />
                  </label>
                  <label>
                    Bericht
                    <textarea
                      name="bericht"
                      rows={5}
                      placeholder={placeholder}
                      suppressHydrationWarning
                    />
                  </label>
                  {error ? <p className="dr-form-error">{error}</p> : null}
                  <button
                    type="submit"
                    className="dr-send"
                    disabled={sending}
                    aria-label="Stuur het bericht naar Daan"
                  >
                    {sending ? "Noteren…" : "Stuur naar Daan"}
                  </button>
                </form>
              </div>
            )}
          </section>
        </main>
        <footer className="dr-foot">
          <span>© {new Date().getFullYear()} Daan Roosenbrand</span>
          <span>Saxofoon · Klarinet · Directie · Les</span>
          <span>Rotterdam</span>
          <span className="dr-credit">
            Ontworpen door{" "}
            <a href="https://jjjoshua3.netlify.app/" target="_blank" rel="noreferrer">
              Joshua
            </a>
          </span>
        </footer>
      </div>
      {film ? <Lightbox film={film} onClose={() => setFilm(null)} /> : null}
    </>
  );
}

function VideoCard({ film, onOpen }: { film: Film; onOpen: (film: Film) => void }) {
  const headingId = `film-${film.id}`;
  return (
    <article
      className={film.vertical ? "dr-vcard is-short" : "dr-vcard"}
      aria-labelledby={headingId}
    >
      <button
        type="button"
        className="dr-thumb"
        aria-label={`Speel video: ${film.title}`}
        onClick={() => onOpen(film)}
      >
        <img
          src={`https://img.youtube.com/vi/${film.id}/maxresdefault.jpg`}
          alt={film.alt}
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
        />
        <span className="dr-play" aria-hidden="true">
          <Play aria-hidden="true" />
        </span>
        {film.vertical ? <span className="dr-badge">Short</span> : null}
      </button>
      <h4 id={headingId}>{film.title}</h4>
      <p>{film.meta}</p>
      {film.href ? (
        <a href={film.href} target="_blank" rel="noreferrer">
          {film.hrefLabel}
        </a>
      ) : null}
    </article>
  );
}

function Lightbox({ film, onClose }: { film: Film; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="dr-lb"
      role="dialog"
      aria-modal="true"
      aria-label={film.title}
      data-lenis-prevent
      onClick={onClose}
    >
      <div
        className={film.vertical ? "dr-lb-frame is-short" : "dr-lb-frame"}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&rel=0`}
          title={film.alt}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        <button
          ref={closeRef}
          type="button"
          className="dr-lb-close"
          onClick={onClose}
          aria-label="Sluit de video"
        >
          Sluiten
        </button>
      </div>
    </div>
  );
}
