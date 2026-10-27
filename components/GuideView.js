const LEVELS = ["instant", "hours", "days", "weeks"];
const LEVEL_TEXT = { instant: "Minutes", hours: "Hours", days: "Days", weeks: "Weeks" };
const WHO = { agent: "Agent can do this", you: "You do this", either: "Agent can help" };
const EVID = { tested: "Tested", sourced: "Sourced", unverified: "Unverified" };

function Evidence({ item }) {
  const e = item.evidence || "unverified";
  return (
    <span className={`ev ev-${e}`}>
      {EVID[e]}
      {item.source_url ? <> · <a href={item.source_url} target="_blank" rel="noreferrer">source</a></> : null}
    </span>
  );
}

export default function GuideView({ g }) {
  const v = g.verdict || {};
  const idx = LEVELS.indexOf(v.level);
  const ver = g.verification || {};
  return (
    <article className={`guide lvl-${v.level || "uncertain"}`}>
      <h1>{g.app}</h1>
      <p className="lede">{g.summary}</p>

      <section className="verdict">
        <div className="meter" role="img" aria-label={`Setup time: ${v.level || "uncertain"}`}>
          {LEVELS.map((l, i) => (
            <div key={l} className={`seg ${i === idx ? "on" : ""} ${idx >= 0 && i < idx ? "pass" : ""}`}>
              <span>{LEVEL_TEXT[l]}</span>
            </div>
          ))}
        </div>
        <h2>{v.label || "Timeline unclear"}</h2>
        <dl>
          <div><dt>Approval needed</dt><dd>{v.approval_required === true ? "Yes" : v.approval_required === false ? "No" : "Not clear from the docs"}</dd></div>
          <div><dt>Your effort</dt><dd>{v.effort || "Unknown"}</dd></div>
          <div><dt>Provider wait</dt><dd>{v.wait || "Unknown"}</dd></div>
        </dl>
        <p>{v.reason} <Evidence item={v} /></p>
      </section>

      <section>
        <h2>Steps</h2>
        <ol className="steps">
          {(g.steps || []).map((s, i) => (
            <li key={i}>
              <div className="row"><strong>{s.title}</strong><span className={`who who-${s.who}`}>{WHO[s.who] || WHO.either}</span></div>
              <p>{s.detail} <Evidence item={s} /></p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>What can block you</h2>
        {(g.blockers || []).map((b, i) => (
          <div className="blocker" key={i}>
            <strong>{b.title}</strong>
            <p>{b.detail} <Evidence item={b} /></p>
            <p className="todo"><b>If this happens:</b> {b.what_to_do}</p>
          </div>
        ))}
      </section>

      <section className="split">
        <div><h2>An agent can</h2><ul>{(g.agent_vs_you?.agent_can || []).map((t, i) => <li key={i}>{t}</li>)}</ul></div>
        <div><h2>You have to</h2><ul>{(g.agent_vs_you?.you_must || []).map((t, i) => <li key={i}>{t}</li>)}</ul></div>
      </section>

      <section className="trust">
        <h2>How much to trust this guide</h2>
        <p>
          Status: <b>{ver.status || "unverified"}</b>.
          {g.generated?.live ? ` Generated live on ${g.generated.at} by ${g.generated.model} from ${g.generated.pages_read} of ${g.generated.pages_tried} documentation pages it tried to read. Nobody has tested these steps.` : ""}
        </p>
        <p className="key"><span className="ev ev-tested">Tested</span> someone did it, or tried to. <span className="ev ev-sourced">Sourced</span> an official page we read says it. <span className="ev ev-unverified">Unverified</span> a best guess, check before relying on it.</p>
        {(ver.log || []).length > 0 && (<><h3>What was checked</h3><ul>{ver.log.map((l, i) => <li key={i}><b>{l.date}</b> {l.note}</li>)}</ul></>)}
        {(ver.checks_to_run || []).length > 0 && (<><h3>Still to check</h3><ul>{ver.checks_to_run.map((l, i) => <li key={i}>{l}</li>)}</ul></>)}
        {(g.sources || []).length > 0 && (<><h3>Sources</h3><ul>{g.sources.map((s, i) => <li key={i}><a href={s.url} target="_blank" rel="noreferrer">{s.title || s.url}</a></li>)}</ul></>)}
      </section>
    </article>
  );
}
