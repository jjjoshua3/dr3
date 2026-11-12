import { Wave } from "./wave";
import { useRef } from "react";

export function NotFoundPage() {
  const hzRef = useRef<HTMLSpanElement>(null);

  return (
    <>
      <Wave hzRef={hzRef} />
      <main className="dr-miss">
        <p className="dr-kicker">
          <span>404</span> Niet op de setlist
        </p>
        <h1>Deze pagina bestaat niet.</h1>
        <p className="dr-miss-line">De solo die je zoekt staat niet in het programma.</p>
        <a className="dr-miss-back" href="/">
          Terug naar Daan
        </a>
        <footer className="dr-foot">
          <span>Daan Roosenbrand</span>
          <span>Saxofoon · Klarinet · Directie · Les</span>
          <span className="dr-credit">
            Ontworpen door{" "}
            <a href="https://jjjoshua3.netlify.app/" target="_blank" rel="noreferrer">
              Joshua
            </a>
          </span>
        </footer>
      </main>
    </>
  );
}
