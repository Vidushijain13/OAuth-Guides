import Generator from "@/components/Generator";
import { getLibrary } from "@/lib/library";

export default function Home() {
  const lib = getLibrary();
  return (
    <>
      <section className="hero">
        <h1>Before you launch an integration, know what the OAuth app will cost you.</h1>
        <p>Look up an app to see how long setup takes, whether the provider has to approve you, what can block you, and which steps an agent can do for you.</p>
        <Generator />
      </section>
      <section>
        <h2 className="libhead">Guide library</h2>
        <ul className="lib">
          {lib.map((g) => (
            <li key={g.slug} className={`lvl-${g.verdict.level}`}>
              <a href={`/guides/${g.slug}`}>
                <span className="pill">{g.verdict.label}</span>
                <strong>{g.app}</strong>
                <span>{g.summary}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
