import { useEffect, useMemo, useState } from 'react';
import { digitalProblems as problems } from './data/digitalProblems.js';
import { embeddedProblems } from './data/embeddedProblems.js';
import { topicSections as domains } from './data/topicSections.js';

const difficultyOptions = ['Foundational', 'Intermediate', 'Advanced'];
const embeddedTabs = [
  { id: 'embedded-c', label: 'Embedded C' },
  { id: 'rtos', label: 'RTOS', comingSoon: true },
  { id: 'drivers', label: 'Drivers', comingSoon: true },
];

function embeddedProblemSlug(problem) {
  return problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function problemIdFromPath(pathname) {
  const slug = pathname.match(/^\/embedded-c\/([^/]+)\/?$/)?.[1];
  return embeddedProblems.find((problem) => embeddedProblemSlug(problem) === slug)?.id ?? null;
}

function embeddedPath(problem) {
  return `/embedded-c/${embeddedProblemSlug(problem)}`;
}

function Brand() {
  return <a className="brand" href="#library" aria-label="SiliconRank home"><span className="brand-mark"><span /><span /><span /></span><span>silicon<span>rank</span></span></a>;
}

function Icon({ name }) {
  return <span className={`nav-icon ${name}-icon`} aria-hidden="true" />;
}

function LogicDiagram({ problem, compact = false }) {
  const diagram = problem.diagram;
  if (!diagram) return null;
  if (diagram.kind === 'majority') return <div className={`logic-diagram ${compact ? 'compact' : ''}`}><div className="diagram-caption">Four-input majority circuit</div><div className="majority-diagram"><div className="majority-term"><span className="term-input">A</span><b>·</b><span className="term-input">B</span><b>·</b><span className="term-input">C</span><span className="term-gate">AND <small>ABC</small></span></div><div className="majority-term"><span className="term-input">A</span><b>·</b><span className="term-input">B</span><b>·</b><span className="term-input">D</span><span className="term-gate">AND <small>ABD</small></span></div><div className="majority-term"><span className="term-input">A</span><b>·</b><span className="term-input">C</span><b>·</b><span className="term-input">D</span><span className="term-gate">AND <small>ACD</small></span></div><div className="majority-term"><span className="term-input">B</span><b>·</b><span className="term-input">C</span><b>·</b><span className="term-input">D</span><span className="term-gate">AND <small>BCD</small></span></div><div className="majority-or">OR</div><strong className="majority-output">F = 1</strong></div></div>;
  if (diagram.kind === 'truth') return <div className={`logic-diagram ${compact ? 'compact' : ''}`}><div className="diagram-caption">{diagram.title}</div><table className="truth-table"><thead><tr><th>Input XYZ</th><th>Output</th></tr></thead><tbody>{diagram.rows.map(([input, output]) => <tr key={input}><td>{input}</td><td className={output === '1' ? 'on' : ''}>{output}</td></tr>)}</tbody></table></div>;
  if (diagram.kind === 'mapping') return <div className={`logic-diagram ${compact ? 'compact' : ''}`}><div className="diagram-caption">N → N + 1, with 111 → 000</div><div className="mapping-row"><span>000</span><b>→</b><span>001</span><span>001</span><b>→</b><span>010</span><span>010</span><b>→</b><span>011</span><span>...</span><span>111</span><b>→</b><span>000</span></div></div>;
  if (diagram.kind === 'mux') return <div className={`logic-diagram ${compact ? 'compact' : ''}`}><div className="diagram-caption">F(A,B,C) = Σm(1,2,5,7)</div><div className="mux-diagram"><div className="mux-inputs"><span>D0 = C</span><span>D1 = C′</span><span>D2 = C′</span><span>D3 = C</span></div><div className="mux-box">4:1<br /><small>MUX</small></div><div className="mux-output">F</div></div><div className="select-label">select: A · B</div></div>;
  if (diagram.kind === 'kmap') return <div className={`logic-diagram ${compact ? 'compact' : ''}`}><div className="diagram-caption">F(A,B,C,D) = Σm(0,1,2,3,8,9,10,11)</div><div className="kmap"><span></span><span>00</span><span>01</span><span>11</span><span>10</span><span>00</span><i>1</i><i>1</i><i>1</i><i>1</i><span>01</span><i>1</i><i>1</i><i>1</i><i>1</i><span>11</span><i>0</i><i>0</i><i>0</i><i>0</i><span>10</span><i>0</i><i>0</i><i>0</i><i>0</i></div></div>;
  if (diagram.kind === 'circuit') return <div className={`logic-diagram ${compact ? 'compact' : ''}`}><div className="diagram-caption">Gate-level network</div><div className="circuit-diagram"><div className="wire-label input-a">A <b>→</b> NOT</div><div className="wire-label input-b">B · C <b>→</b> AND</div><div className="gate gate-or">OR</div><div className="gate gate-final">AND</div><div className="wire-label output-f">F</div></div></div>;
  if (diagram.kind === 'fsm') return <div className={`logic-diagram ${compact ? 'compact' : ''}`}><div className="diagram-caption">Safe state sequence</div><div className="state-row"><span>RED</span><b>→</b><span>YELLOW</span><b>→</b><span>GREEN</span><b>→</b><span>YELLOW</span></div></div>;
  if (diagram.kind === 'waveform') return <div className={`logic-diagram ${compact ? 'compact' : ''}`}><div className="diagram-caption">Rising-edge detector</div><div className="waveform"><span>X&nbsp;&nbsp;__|‾‾|__|‾‾‾‾</span><span>Xd _|‾‾|__|‾‾</span><strong>P&nbsp;&nbsp;__|‾|______</strong></div></div>;
  if (diagram.kind === 'register') return <div className={`logic-diagram ${compact ? 'compact' : ''}`}><div className="diagram-caption">Serial in → Q3 Q2 Q1 Q0</div><div className="register-row"><span>Q3</span><span>Q2</span><span>Q1</span><span>Q0</span></div><div className="register-bits"><b>1</b><b>0</b><b>1</b><b>1</b></div></div>;
  if (diagram.kind === 'parity') return <div className={`logic-diagram ${compact ? 'compact' : ''}`}><div className="diagram-caption">Odd parity generator</div><div className="parity-row"><span>A</span><b>⊕</b><span>B</span><b>⊕</b><span>C</span><b>⊕</b><span>P</span><strong>= 1</strong></div></div>;
  return <div className="logic-diagram"><div className="diagram-caption">Logic diagram</div></div>;
}

function ProblemCard({ problem, saved, onSave, onOpen, style }) {
  return <article className="problem-card" style={style} onClick={() => onOpen(problem)}>
    <div className="card-top"><span className="problem-type">{problem.type}</span><button className={`save-button ${saved ? 'saved' : ''}`} onClick={(event) => { event.stopPropagation(); onSave(problem); }} aria-label={`${saved ? 'Unsave' : 'Save'} ${problem.title}`}>{saved ? '★' : '☆'}</button></div>
    <h3>{problem.title}</h3><p>{problem.summary}</p>
    <div className="card-bottom"><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><span className="card-time">· {problem.time}</span><span className="solve-label">Solve</span><span className="card-arrow">↗</span></div>
  </article>;
}

function DetailDrawer({ problem, saved, onClose, onSave, onPractice }) {
  if (!problem) return null;
  return <div className="drawer-backdrop" onClick={onClose}>
    <aside className="detail-drawer" onClick={(event) => event.stopPropagation()} aria-label="Problem details">
      <button className="drawer-close" onClick={onClose} aria-label="Close problem details">×</button>
      <p className="eyebrow">PROBLEM / {String(problem.id).padStart(2, '0')}</p>
      <span className="problem-type">{problem.type}</span>
      <h2>{problem.title}</h2>
      <p className="drawer-summary">{problem.summary}</p>
      <LogicDiagram problem={problem} compact />
      <div className="drawer-meta"><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><span>⏱ {problem.time}</span></div>
      <div className="drawer-block"><p className="eyebrow">SKILLS COVERED</p><div className="skill-list">{problem.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
      <div className="drawer-block preview-block"><p className="eyebrow">WHY THIS MATTERS</p><p>Build evidence of practical engineering judgment. Your solution will be evaluated for correctness, clarity, and the decisions behind the implementation.</p></div>
      <div className="drawer-actions"><button className="primary-action" onClick={() => onPractice(problem)}>Practice this problem <span>↗</span></button><button className="secondary-action" onClick={() => onSave(problem)}>{saved ? 'Saved to your queue' : 'Save for later'} <span>★</span></button></div>
    </aside>
  </div>;
}

function PracticeWorkspace({ problem, onClose, onSave }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [runStatus, setRunStatus] = useState('');
  const expected = problem.answer?.toLowerCase().replace(/\s/g, '');
  const normalizedAnswer = answer.toLowerCase().replace(/\s/g, '');
  const isCorrect = Boolean(expected && normalizedAnswer === expected);
  const solutionSteps = [
    'Translate the specification into the smallest set of intermediate signals.',
    'Group terms that share the same inputs and apply Boolean algebra or a truth table.',
    `Compare the reduced result against the expected form: ${problem.answer || 'verify each output case'}.`,
  ];

  return (
    <div className="practice-backdrop">
      <section className="practice-workspace" aria-label="Practice workspace">
        <header className="practice-header">
          <div className="breadcrumb">
            <button onClick={onClose}>Library</button>
            <b>/</b>
            <strong>Practice</strong>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close practice workspace">×</button>
        </header>

        <nav className="practice-tabs" aria-label="Problem views">
          {['description', 'hint', 'solution'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'description' ? 'Description' : tab === 'hint' ? 'Hint' : 'Solution'}
              {tab === 'hint' && <span>1</span>}
            </button>
          ))}
        </nav>

        <div className="practice-content">
          {activeTab === 'description' && (
            <article className="problem-statement">
              <p className="eyebrow">PROBLEM / {String(problem.id).padStart(2, '0')}</p>
              <span className="problem-type">{problem.type}</span>
              <h1>{problem.title}</h1>
              <p className="statement-label">Problem statement</p>
              <p className="statement-copy">{problem.prompt || problem.summary}</p>
              <LogicDiagram problem={problem} />
              <div className="statement-details">
                <div>
                  <span>Difficulty</span>
                  <strong className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</strong>
                </div>
                <div>
                  <span>Expected time</span>
                  <strong>{problem.time}</strong>
                </div>
                <div>
                  <span>Skills</span>
                  <strong>{(problem.skills || []).join(' · ')}</strong>
                </div>
              </div>
            </article>
          )}

          {activeTab === 'hint' && (
            <article className="learning-panel">
              <p className="eyebrow">GUIDED REASONING</p>
              <h1>Use the signal, not the shortcut.</h1>
              <p className="learning-lead">A good hint should move your thinking one step forward without giving away the implementation.</p>
              <div className="hint-card">
                <span>HINT 01</span>
                <p>{problem.hint || 'Break the problem into named intermediate signals, then simplify one step at a time.'}</p>
              </div>
              <div className="learning-note">
                <strong>Try before revealing the solution</strong>
                <span>Write down the inputs, outputs, and one intermediate condition in the playground.</span>
              </div>
            </article>
          )}

          {activeTab === 'solution' && (
            <article className="learning-panel">
              <p className="eyebrow">EDITORIAL / SIGNAL PATH</p>
              <h1>How to approach it</h1>
              <p className="learning-lead">Use this path to review the reasoning after you have made an attempt.</p>
              <div className="solution-steps">
                {solutionSteps.map((step, index) => (
                  <div key={step}>
                    <b>{String(index + 1).padStart(2, '0')}</b>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
              <div className="answer-reveal">
                <span>REFERENCE ANSWER</span>
                <code>{problem.answer || 'No reference answer published yet.'}</code>
              </div>
            </article>
          )}

          <section className="answer-panel playground-panel">
            <div className="playground-kicker">
              <span className="playground-dot" />
              Live playground
              <span className="editor-mode">Digital logic</span>
            </div>

            <div className="answer-panel-heading">
              <div>
                <p className="eyebrow">YOUR RESPONSE</p>
                <h2>Work it through</h2>
              </div>
              <span className="practice-status">{submitted ? (isCorrect ? 'Correct' : 'Try again') : 'Not submitted'}</span>
            </div>

            <div className="editor-toolbar">
              <span>Expression editor</span>
              <button type="button" onClick={() => { setAnswer(''); setSubmitted(false); setRunStatus(''); }}>Reset</button>
            </div>

            <textarea
              value={answer}
              onChange={(event) => { setAnswer(event.target.value); setSubmitted(false); setRunStatus(''); }}
              placeholder="Type your Boolean expression, value, or reasoning here..."
              aria-label="Your answer"
            />

            {showHint && (
              <div className="hint">
                <span>i</span>
                <p>{problem.hint || 'Break the problem into named intermediate signals, then simplify one step at a time.'}</p>
              </div>
            )}

            <div className="test-cases">
              <span>Test cases</span>
              <button type="button" className="case active">Case 1</button>
              <button type="button" className="case">Case 2</button>
              <button type="button" className="case">Case 3</button>
            </div>

            <div className="answer-actions">
              <button
                type="button"
                className="hint-button"
                onClick={() => { setShowHint((visible) => !visible); setActiveTab('hint'); }}
              >
                {showHint ? 'Hide hint' : 'Need a hint?'}
              </button>

              <div className="run-submit">
                <button
                  type="button"
                  className="run-answer"
                  onClick={() => setRunStatus(answer.trim() ? 'Expression ready to evaluate.' : 'Enter an answer first.')}
                >
                  Run
                </button>
                <button
                  type="button"
                  className="submit-answer"
                  onClick={() => { setSubmitted(true); setRunStatus(''); }}
                >
                  Submit <span>→</span>
                </button>
              </div>
            </div>

            {runStatus && <div className="run-status">{runStatus}</div>}

            {submitted && (
              <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                <strong>{isCorrect ? 'Signal confirmed.' : 'Not there yet.'}</strong>
                <span>{isCorrect ? 'You can move on or save this result to your progress.' : 'Compare your structure with the hint and try again.'}</span>
              </div>
            )}
          </section>
        </div>

        <footer className="practice-footer">
          <span>Digital logic / {(problem.skills || []).join(' · ')}</span>
          <button type="button" onClick={() => onSave(problem)}>☆ Save to practice queue</button>
        </footer>
      </section>
    </div>
  );
}

function EmbeddedPracticeWorkspace({ problem, onClose, onSave }) {
  return (
    <div className="embedded-practice-panel">
      <div className="embedded-split-layout">
        <div className="embedded-question-panel">
          <div className="embedded-problem-heading">
            <div>
              <div className="embedded-problem-title-row"><h1>{problem.id}. {problem.title}</h1><span>○ Solved</span></div>
              <div className="embedded-problem-tags"><b>{problem.difficulty}</b><span>⌁ Topics</span><span>▣ Embedded C</span><span>♡ Hint</span></div>
            </div>
            <button type="button" className="embedded-save-link" onClick={() => onSave(problem)}>☆</button>
          </div>
          <nav className="problem-view-tabs" aria-label="Problem content">
            <button type="button" className="active">Description</button>
            <button type="button">Note</button>
            <button type="button">Editorial</button>
            <button type="button">Solutions</button>
          </nav>
          <div className="embedded-metadata">
            <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
            <span>{problem.time}</span>
            <span>{problem.type}</span>
          </div>

          <p className="statement-copy">{problem.prompt}</p>

          <div className="embedded-box">
            <h3>Constraints</h3>
            <ul>
              {problem.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}
            </ul>
          </div>

          <div className="embedded-box">
            <h3>Examples</h3>
            {problem.examples.map((example, index) => (
              <div key={`${example.input}-${index}`} className="example-block">
                <p><strong>Input:</strong> {example.input}</p>
                <p><strong>Output:</strong> {example.output}</p>
                <p><strong>Why:</strong> {example.explanation}</p>
              </div>
            ))}
          </div>

          <div className="embedded-box">
            <h3>Explanation</h3>
            <p>{problem.explanation}</p>
            <pre>{problem.referenceAnswer}</pre>
          </div>
        </div>

        <div className="embedded-editor-panel onecompiler-panel">
          <div className="editor-toolbar embedded-toolbar">
            <span className="code-pane-title"><b>&lt;/&gt;</b> Code</span>
            <button type="button" onClick={() => onSave(problem)}>Save problem</button>
          </div>
          <iframe
            title={`OneCompiler C editor for ${problem.title}`}
            src="https://onecompiler.com/embed/"
            frameBorder="0"
            height="450px"
            width="100%"
          />
          <div className="test-result-bar"><span>▣ Testcase</span><strong>› Test Result</strong><small>Run your code in OneCompiler to see the result.</small></div>
        </div>
      </div>
    </div>
  );
}

function EmbeddedSystemsPage({ problems: embeddedProblemList, onSelect, onBack }) {
  return (
    <div className="embedded-page">
      <header className="embedded-page-header">
        <div className="embedded-page-brand">
          <button type="button" onClick={onBack} aria-label="Back to problem library">‹</button>
          <span className="embedded-page-title">Embedded systems</span>
          <span className="embedded-page-separator">/</span>
          <strong>Embedded C</strong>
        </div>
        <div className="embedded-page-actions">
          <span>5 problems</span>
          <button type="button" onClick={onBack}>Back to library</button>
        </div>
      </header>

      <main className="embedded-catalog-page">
        <div className="embedded-catalog-intro">
          <p className="eyebrow">EMBEDDED SYSTEMS / EMBEDDED C</p>
          <h1>Choose a problem.<br /><em>Build the firmware.</em></h1>
          <p>Practice the low-level patterns that show up in registers, sensors, timers, communication, and control loops.</p>
        </div>
        <div className="embedded-catalog-grid">
          {embeddedProblemList.map((problem) => (
            <button type="button" className="embedded-catalog-card" key={problem.id} onClick={() => onSelect(problem.id)}>
              <span className="embedded-catalog-number">{String(problem.id).padStart(2, '0')}</span>
              <span className="embedded-catalog-type">{problem.type}</span>
              <strong>{problem.title}</strong>
              <p>{problem.summary}</p>
              <span className="embedded-catalog-meta"><i className={problem.difficulty.toLowerCase()} />{problem.difficulty} <b>·</b> {problem.time}<span>Open problem →</span></span>
            </button>
          ))}
        </div>
        <div className="embedded-catalog-footer"><span>RTOS</span><small>Coming soon</small><span>Drivers</span><small>Coming soon</small></div>
      </main>
    </div>
  );
}

function EmbeddedProblemPage({ problem, onBack, onSave }) {
  return (
    <div className="embedded-page embedded-problem-page">
      <header className="embedded-page-header">
        <div className="embedded-page-brand">
          <button type="button" onClick={onBack} aria-label="Back to Embedded C problems">‹</button>
          <span className="embedded-product-mark">SR</span>
          <strong>Problem list</strong>
          <span className="embedded-page-chevron">‹</span><span className="embedded-page-chevron">›</span><span className="embedded-page-shuffle">⌁</span>
        </div>
        <div className="embedded-page-actions">
          <button type="button">⚙</button><button type="button">♧</button><button type="button" className="embedded-submit" onClick={() => onSave(problem)}>✓ Save</button><button type="button">⋯</button>
        </div>
      </header>
      <main className="embedded-page-main">
        <EmbeddedPracticeWorkspace key={problem.id} problem={problem} onSave={onSave} onClose={onBack} />
      </main>
    </div>
  );
}

function App() {
  const [domain, setDomain] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(() => new Set());
  const initialProblemId = problemIdFromPath(window.location.pathname);
  const [activeView, setActiveView] = useState(() => window.location.pathname.startsWith('/embedded-c') ? 'embedded' : 'library');
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);
  const [embeddedTab, setEmbeddedTab] = useState('embedded-c');
  const [embeddedSelectedId, setEmbeddedSelectedId] = useState(embeddedProblems[0]?.id ?? 1);
  const [embeddedProblemPageId, setEmbeddedProblemPageId] = useState(initialProblemId);

  useEffect(() => {
    const handlePopState = () => {
      const problemId = problemIdFromPath(window.location.pathname);
      if (window.location.pathname.startsWith('/embedded-c')) {
        setDomain('embedded');
        setEmbeddedProblemPageId(problemId);
        setEmbeddedSelectedId(problemId ?? embeddedProblems[0].id);
        setActiveView('embedded');
      } else {
        setDomain('all');
        setEmbeddedProblemPageId(null);
        setActiveView('library');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const filteredProblems = useMemo(() => {
    const sourceProblems = domain === 'embedded' ? embeddedProblems : problems;
    const results = sourceProblems.filter((problem) => {
      const matchesView = activeView !== 'saved' || saved.has(problem.id);
      const matchesDomain = domain === 'all' || problem.domain === domain;
      const matchesDifficulty = difficulty === 'all' || problem.difficulty === difficulty;
      const searchText = `${problem.title} ${problem.summary} ${problem.type} ${(problem.skills || []).join(' ')}`.toLowerCase();
      return matchesView && matchesDomain && matchesDifficulty && searchText.includes(query.toLowerCase());
    });
    return sortNewest ? results : [...results].reverse();
  }, [activeView, difficulty, domain, query, saved, sortNewest]);

  const saveProblem = (problem) => setSaved((current) => {
    const next = new Set(current);
    next.has(problem.id) ? next.delete(problem.id) : next.add(problem.id);
    return next;
  });

  const chooseDomain = (nextDomain) => {
    setDomain(nextDomain);
    if (nextDomain === 'embedded') {
      setEmbeddedSelectedId(embeddedProblems[0].id);
      setEmbeddedProblemPageId(null);
      setActiveView('embedded');
      window.history.pushState({}, '', '/embedded-c');
    } else {
      setActiveView('library');
      window.history.pushState({}, '', '/');
    }
  };

  const openEmbeddedProblem = (problemId) => {
    const problem = embeddedProblems.find((item) => item.id === problemId);
    if (!problem) return;
    setEmbeddedSelectedId(problemId);
    setEmbeddedProblemPageId(problemId);
    window.history.pushState({}, '', embeddedPath(problem));
  };

  const closeEmbeddedProblem = () => {
    setEmbeddedProblemPageId(null);
    window.history.pushState({}, '', '/embedded-c');
  };

  const leaveEmbedded = () => {
    setDomain('all');
    setEmbeddedProblemPageId(null);
    setActiveView('library');
    window.history.pushState({}, '', '/');
  };

  const currentDomainLabel = domains.find((item) => item.id === domain)?.label ?? 'All problems';
  const embeddedSelectedProblem = embeddedProblems.find((problem) => problem.id === embeddedSelectedId) ?? embeddedProblems[0];

  return <div className="app-shell">
    <aside className="sidebar" aria-label="Main navigation">
      <Brand />
      <div className="workspace-label">Workspace</div>
      <nav className="main-nav">
        <button className={`nav-item ${activeView === 'library' ? 'active' : ''}`} onClick={() => setActiveView('library')}><Icon name="grid" />Problem library</button>
        <button className="nav-item" onClick={() => alert('Skill paths are being prepared for the first cohort.')}><Icon name="path" />Skill paths <small>soon</small></button>
        <button className="nav-item" onClick={() => alert('Assessment builder is coming next.')}><Icon name="chart" />Assessments <small>soon</small></button>
        <button className={`nav-item ${activeView === 'saved' ? 'active' : ''}`} onClick={() => setActiveView('saved')}><Icon name="bookmark" />Saved problems {saved.size > 0 && <small>{saved.size}</small>}</button>
      </nav>
      <div className="sidebar-bottom"><div className="progress-card"><div className="progress-card-head"><span>Your progress</span><strong>18%</strong></div><div className="progress-track"><span /></div><p>Keep going. You are building signal.</p></div><a className="profile" href="#profile"><span className="avatar">VC</span><span><strong>Varshan C</strong><small>Explorer tier</small></span><span className="chevron">›</span></a></div>
    </aside>

    <main className="main-content" id="library">
      <header className="topbar"><div className="breadcrumb"><span>{activeView === 'saved' ? 'Workspace' : 'Library'}</span><b>/</b><strong>{activeView === 'saved' ? 'Saved problems' : currentDomainLabel}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">◌<i /></button><button className="help-button" onClick={() => alert('Tell us what you are building and we will help.')}>?</button></div></header>
      {activeView === 'embedded' ? (
        embeddedProblemPageId ? (
          <EmbeddedProblemPage
            problem={embeddedProblems.find((problem) => problem.id === embeddedProblemPageId) ?? embeddedSelectedProblem}
            onBack={closeEmbeddedProblem}
            onSave={saveProblem}
          />
        ) : (
          <EmbeddedSystemsPage
            problems={embeddedProblems}
            onSelect={openEmbeddedProblem}
            onBack={leaveEmbedded}
          />
        )
      ) : <>
      {activeView === 'library' && <section className="hero-section"><div className="hero-copy"><p className="eyebrow">CORE ENGINEERING / 01</p><h1>Build the<br /><em>right</em> signal.</h1><p className="hero-description">Practice the problems that reveal how hardware really works. From first principles to production-grade thinking.</p></div><div className="hero-visual" aria-hidden="true"><div className="circuit-line line-one" /><div className="circuit-line line-two" /><div className="circuit-line line-three" /><div className="node node-one" /><div className="node node-two" /><div className="node node-three" /><div className="chip"><span>SR</span><i /><i /><i /></div><span className="visual-label">SIGNAL / NOISE</span></div></section>}

      <section className="library-section" aria-labelledby="library-title">
        <div className="section-heading"><div><p className="eyebrow">{activeView === 'saved' ? 'YOUR QUEUE' : 'THE COLLECTION'}</p><h2 id="library-title">{activeView === 'saved' ? 'Saved problems' : 'Problem library'} <span>{filteredProblems.length}</span></h2></div><button className="filter-toggle" onClick={() => setFiltersOpen((open) => !open)}>Filters <span>≡</span></button></div>
        <div className={`controls ${filtersOpen ? 'open' : ''}`}><label className="search-box"><span>⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by topic, skill, or keyword" /></label><div className="control-group"><label htmlFor="domain-select">Domain</label><select id="domain-select" value={domain} onChange={(event) => chooseDomain(event.target.value)}><option value="all">All domains</option>{domains.slice(1).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div><div className="control-group"><label htmlFor="difficulty-select">Difficulty</label><select id="difficulty-select" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="all">All levels</option>{difficultyOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></div></div>
        {activeView === 'library' && <div className="domain-tabs" role="tablist" aria-label="Filter by topic">{domains.map((item) => <button key={item.id} disabled={item.status === 'dummy'} className={`domain-tab ${domain === item.id ? 'active' : ''} ${item.status === 'dummy' ? 'dummy' : ''}`} onClick={() => chooseDomain(item.id)}>{item.label}<b>{item.status === 'dummy' ? 'soon' : String(item.id === 'all' ? problems.length : problems.filter((problem) => problem.domain === item.id).length).padStart(2, '0')}</b></button>)}</div>}

        {
          <>
            <div className="results-meta"><span>Showing {filteredProblems.length} problem{filteredProblems.length === 1 ? '' : 's'}</span><button onClick={() => setSortNewest((current) => !current)}>{sortNewest ? 'Recently added' : 'Oldest first'} <span>↕</span></button></div>
            {filteredProblems.length > 0 ? <div className="problem-grid">{filteredProblems.map((problem, index) => <ProblemCard key={problem.id} problem={problem} saved={saved.has(problem.id)} onSave={saveProblem} onOpen={setPracticeProblem} style={{ animationDelay: `${index * 35}ms` }} />)}</div> : <div className="empty-state"><span>∅</span><h3>{activeView === 'saved' ? 'Your queue is clear' : 'No matching problems'}</h3><p>{activeView === 'saved' ? 'Save problems from the library to build a focused practice queue.' : 'Try a different search term or widen your filters.'}</p></div>}
          </>
        }
      </section>
      </>}
    </main>
    {practiceProblem && <PracticeWorkspace problem={practiceProblem} onClose={() => setPracticeProblem(null)} onSave={saveProblem} />}
  </div>;
}

export default App;
