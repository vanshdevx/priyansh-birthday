import { useEffect, useRef, useState } from 'react';
import { Activity, ArrowDown, ArrowLeft, ArrowRight, AudioLines, BadgeAlert, ChevronDown, CircleHelp, FileSearch, LockKeyhole, Volume2, VolumeX, X } from 'lucide-react';
import { caseFileData, type EvidenceRecord } from './data/caseFileData';

const sections = [
  { id: 'subject', file: 'FILE 01', title: 'THE SUBJECT', note: 'Profile & known offences' },
  { id: 'evidence', file: 'FILE 02', title: 'THE EVIDENCE', note: 'Selected exhibits' },
  { id: 'future', file: 'FILE 03', title: 'FUTURE OPERATIONS', note: 'Projected timeline: unknown' },
  { id: 'interrogation', file: 'FILE 04', title: 'INTERROGATION', note: 'Subject refuses to cooperate' },
  { id: 'final', file: 'FILE 05', title: 'FINAL TRANSMISSION', note: 'Restricted until end of file' },
];

function SectionHeading({ eyebrow, title, index }: { eyebrow: string; title: string; index: string }) {
  return <div className="mb-10 flex items-end justify-between gap-5">
    <div><div className="eyebrow mb-3">{index} / {eyebrow}</div><h2 className="section-title">{title}</h2></div>
    <span className="hidden sm:inline file-stamp">EVIDENCE COPY</span>
  </div>;
}

function PhotoPlaceholder({ className = '', label = 'IMAGE NOT ON FILE' }: { className?: string; label?: string }) {
  return <div className={`photo-placeholder scanlines ${className}`} aria-label={label} role="img">
    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#77736d]">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full border border-[#56534f]"><FileSearch size={23} strokeWidth={1} /></div>
      <span className="mono text-[9px] tracking-[.18em]">VISUAL EVIDENCE PENDING</span>
      <span className="mono mt-2 text-[8px] text-[#615e59]">ADD IMAGE PATH IN caseFileData.ts</span>
    </div>
  </div>;
}

function isVideoAsset(src: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src);
}

function MediaOrPlaceholder({ src, className, label, muted = true, autoPlay = false, loop = false, controls = false }: { src: string; className: string; label: string; muted?: boolean; autoPlay?: boolean; loop?: boolean; controls?: boolean }) {
  if (!src) return <PhotoPlaceholder className={className} label={label} />;

  if (isVideoAsset(src)) {
    return <video
      src={src}
      muted={muted}
      autoPlay={autoPlay}
      loop={loop}
      controls={controls}
      playsInline
      className={className}
      aria-label={label}
    />;
  }

  return <img src={src} alt={label} className={className} />;
}

function App() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [policeCaseNoteVisible, setPoliceCaseNoteVisible] = useState(false);
  const [policeCaseNoteKey, setPoliceCaseNoteKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [closedResponse, setClosedResponse] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const policeCaseNoteTimeoutRef = useRef<number | null>(null);
  const person = caseFileData.subject;

  useEffect(() => {
    if (viewerIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setViewerIndex(null);
      if (event.key === 'ArrowRight') setViewerIndex((current) => current === null ? null : (current + 1) % caseFileData.evidence.length);
      if (event.key === 'ArrowLeft') setViewerIndex((current) => current === null ? null : (current - 1 + caseFileData.evidence.length) % caseFileData.evidence.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewerIndex]);

  useEffect(() => () => {
    if (policeCaseNoteTimeoutRef.current !== null) window.clearTimeout(policeCaseNoteTimeoutRef.current);
  }, []);

  const openSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((old) => ({ ...old, [questionIndex]: optionIndex }));
    if (questionIndex !== 0) return;
    if (policeCaseNoteTimeoutRef.current !== null) window.clearTimeout(policeCaseNoteTimeoutRef.current);
    policeCaseNoteTimeoutRef.current = null;
    setPoliceCaseNoteVisible(optionIndex === 0);
    if (optionIndex === 0) {
      setPoliceCaseNoteKey((key) => key + 1);
      policeCaseNoteTimeoutRef.current = window.setTimeout(() => {
        setPoliceCaseNoteVisible(false);
        policeCaseNoteTimeoutRef.current = null;
      }, 3000);
    }
  };
  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); return; }
    setAudioError(false);
    try { await audio.play(); setIsPlaying(true); } catch { setAudioError(true); }
  };
  const currentEvidence: EvidenceRecord | null = viewerIndex === null ? null : caseFileData.evidence[viewerIndex];

  return <main className={`grain min-h-[100dvh] overflow-hidden text-[#ded9cf] ${accessGranted ? 'flash-in' : ''}`}>
    <audio ref={audioRef} src={caseFileData.audioPath} loop preload="none" onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} />
    {!accessGranted ? <section className="relative flex min-h-[100dvh] items-center justify-center bg-[#090a0b] px-5 py-12">
      <div className="scanlines absolute inset-0 opacity-30" />
      <div className="relative z-10 w-full max-w-[720px] border border-[#343332] bg-[#111214]/90 px-6 py-10 sm:px-14 sm:py-14">
        <div className="mb-12 flex items-center justify-between">
          <span className="eyebrow">FEDERAL BUREAU / UNAUTHORIZED COPY</span><span className="mono text-xs text-[#777]">{person.birthdayMonthDay}—{person.caseYear}</span>
        </div>
        <div className="mb-8">
          <p className="condensed text-5xl font-bold tracking-[.06em] text-[#a73331] sm:text-7xl">CLASSIFIED<span className="blink">_</span></p>
          <div className="mt-3 h-px w-full bg-[#5f2425]" />
        </div>
        <div className="grid gap-x-12 gap-y-3 sm:grid-cols-2">
          {[
            ['CASE NO.', `${person.birthdayMonthDay}-${person.caseYear}`],
            ['SUBJECT', person.name],
            ['STATUS', 'ACTIVE'],
            ['THREAT LEVEL', 'QUESTIONABLE'],
            ['AGE', person.age],
          ].map(([label, value]) => <div className="flex justify-between border-b border-[#292a2b] py-2 mono text-[10px] sm:text-xs" key={label}>
            <span className="text-[#827f78]">{label}</span><span className="text-[#d1ccc2]">{value}</span>
          </div>)}
        </div>
        <div className="mt-11 flex items-center gap-3 text-sm text-[#c4beb4]"><BadgeAlert size={17} className="text-[#a33a36]" /><span>Unauthorized access detected.</span></div>
        <button data-testid="button-access-file" onClick={() => setAccessGranted(true)} className="mt-7 flex min-h-14 w-full items-center justify-between border border-[#9e3330] bg-[#791f21] px-5 text-left font-mono text-xs tracking-[.16em] text-[#f0e8df] transition-colors hover:bg-[#912b2b] focus-visible:outline-2 focus-visible:outline-[#b39a66]">
          <span>ACCESS FILE</span><ArrowRight size={18} />
        </button>
        <p className="mono mt-5 text-center text-[9px] uppercase tracking-[.12em] text-[#615f5a]">There is no legitimate reason you should be here.</p>
      </div>
      <div className="absolute bottom-7 left-0 right-0 text-center mono text-[9px] tracking-[.2em] text-[#57544f]">SECURE TERMINAL / INPUT REQUIRED</div>
    </section> : <>
      <header className="relative border-b border-[#393735] bg-[#151618]">
        <div className="mx-auto flex w-[min(1120px,calc(100%-32px))] items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center border border-[#87302d] text-[#af3e3a]"><LockKeyhole size={16} /></div>
            <div><div className="mono text-[9px] tracking-[.17em] text-[#a89a77]">CONFIDENTIAL // DO NOT DISTRIBUTE</div><div className="condensed text-xl font-bold tracking-wide">THE {person.name} FILES</div></div>
          </div>
          <div className="hidden items-center gap-2 mono text-[9px] text-[#8f8a81] sm:flex"><span className="h-2 w-2 rounded-full bg-[#91302e]" />CASE STATUS: ACTIVE</div>
          <button onClick={toggleMusic} data-testid="button-music-toggle" aria-label={isPlaying ? 'Pause case-file radio' : 'Play case-file radio'} className="group flex min-h-11 items-center gap-2 border border-[#45413a] bg-[#202022] px-3 hover:border-[#8e7950]">
            {isPlaying ? <Volume2 size={16} className="text-[#ac965f]" /> : <VolumeX size={16} className="text-[#99948b]" />}
            <span className="hidden text-left sm:block"><span className="block mono text-[9px] tracking-wider">TUYO / CASE RADIO</span><span className="block mono text-[8px] text-[#77736c]">{isPlaying ? 'NOW PLAYING · RODRIGO AMARANTE' : 'STANDBY · MANUAL PLAY'}</span></span>
            <AudioLines size={14} className={isPlaying ? 'text-[#a88c54]' : 'text-[#5e5c58]'} />
          </button>
        </div>
        {audioError && <div role="status" className="mx-auto max-w-[1120px] px-4 pb-3 mono text-[10px] text-[#bd7970]">RADIO OFFLINE — add an audio file at {caseFileData.audioPath}</div>}
      </header>

      <section className="relative mx-auto w-[min(1120px,calc(100%-32px))] pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="pointer-events-none absolute right-0 top-16 hidden rotate-[-8deg] border-2 border-[#642b2a] px-4 py-2 mono text-sm tracking-[.18em] text-[#85322f] md:block">EYES ONLY</div>
        <div className="eyebrow mb-5 flex items-center gap-2"><Activity size={13} /> CASE INDEX / UNSEALED</div>
        <h1 className="condensed max-w-4xl text-[clamp(62px,12vw,150px)] font-extrabold leading-[.76] tracking-[-.025em]">THE<br /><span className="text-[#a33330]">{person.name}</span><br />FILES<span className="text-[#77736d]">.</span></h1>
        <p className="mono mt-8 max-w-[500px] text-xs leading-6 text-[#aaa69e] sm:text-sm">An absurdly serious investigation into one person’s continued ability to get away with everything.</p>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-[#393735] py-4 mono text-[9px] uppercase tracking-[.1em] text-[#8e8980]">
          <span>CASE {person.birthdayMonthDay}-{person.caseYear}</span><span>SUBJECT: {person.name}</span><span>THREAT: QUESTIONABLE</span>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, i) => <button key={section.id} data-testid={`button-open-${section.id}`} onClick={() => openSection(section.id)} className="file-card paper-panel group relative min-h-[128px] overflow-hidden p-5 text-left">
            <div className="absolute right-4 top-4 mono text-[9px] text-[#66615a]">{String(i + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</div>
            <div className="mono text-[9px] tracking-[.15em] text-[#a33a36]">{section.file}</div>
            <div className="condensed mt-3 text-[27px] font-bold leading-none tracking-wide text-[#ddd8ce]">{section.title}</div>
            <div className="mt-3 flex items-center justify-between mono text-[9px] text-[#858078]"><span>{section.note}</span><ArrowRight size={14} className="text-[#8b3834] transition-transform group-hover:translate-x-1" /></div>
          </button>)}
        </div>
        <button onClick={() => openSection('subject')} className="mt-9 inline-flex min-h-11 items-center gap-2 mono text-[10px] tracking-[.1em] text-[#9d978d] hover:text-[#ddd8ce]"><ArrowDown size={14} /> BEGIN INVESTIGATION</button>
      </section>

      <section id="subject" className="section-shell scroll-mt-8">
        <SectionHeading eyebrow="Subject dossier" title="The Subject" index="01" />
        <div className="grid gap-8 lg:grid-cols-[.92fr_1.08fr]">
          <MediaOrPlaceholder src={person.portrait} className="aspect-[4/5] w-full object-cover object-bottom" label={`Portrait of ${person.name}`} />
          <div className="paper-panel p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-[#3d3b38] pb-4"><span className="eyebrow">SUBJECT PROFILE</span><span className="file-stamp">ACTIVE</span></div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mono text-[10px] sm:text-xs">
              {[
                ['NAME', person.name], ['ALIAS', person.nickname], ['AGE', person.age],
                ['KNOWN LOCATION', person.city], ['OCCUPATION', person.occupation], ['THREAT LEVEL', person.threatLevel],
              ].map(([label, value]) => <div key={label}><div className="mb-1 text-[9px] tracking-[.1em] text-[#817c73]">{label}</div><div className="break-words text-[#ded9cf]">{value}</div></div>)}
            </div>
            <div className="mt-8 border-t border-[#3d3b38] pt-6">
              <div className="eyebrow mb-4">KNOWN OFFENCES</div>
              <ul className="grid gap-2 sm:grid-cols-2">{person.offenses.map((offense, i) => <li className="flex items-start gap-2 text-sm text-[#c5c0b7]" key={`${offense}-${i}`}><span className="mono text-[#a53b37]">0{i + 1}</span>{offense}</li>)}</ul>
            </div>
            <div className="mt-7 border-l-2 border-[#8f2928] bg-[#111214]/70 p-4"><div className="eyebrow mb-2">CURRENT STATUS</div><p className="condensed text-2xl">{person.status}</p></div>
          </div>
        </div>
      </section>

      <section id="evidence" className="section-shell scroll-mt-8">
        <SectionHeading eyebrow="Memory records" title="Evidence Locker" index="02" />
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-xl text-sm leading-6 text-[#a7a198]">Exhibits recovered from an ongoing friendship. Some context may have been lost. Some was never present.</p>
          <div className="flex items-center gap-2 mono text-[9px] tracking-[.12em] text-[#89847a]"><span className="h-px w-7 bg-[#9d3834]" />{String(caseFileData.evidence.length).padStart(2, '0')} RECORDS / UNSOLVED</div>
        </div>
        <div className="evidence-board relative isolate overflow-hidden p-4 sm:p-7">
          <div className="evidence-threads pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#3c3934] pb-5">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center border border-[#69413a] bg-[#261c1b] text-[#b14a42]"><FileSearch size={16} strokeWidth={1.4} /></div>
              <div>
                <div className="mono text-[9px] tracking-[.15em] text-[#c2b8a4]">INVESTIGATION WALL / RECORDS RECOVERED</div>
                <div className="mono mt-1 text-[8px] text-[#77736c]">Pinned for review · chronology uncertain</div>
              </div>
            </div>
            <span className="file-stamp">OPEN CASE</span>
          </div>
          <div className="relative z-10 grid gap-5 sm:grid-cols-2">
            {caseFileData.evidence.map((item, i) => {
              return <button
                data-testid={`button-evidence-${item.id}`}
                onClick={() => setViewerIndex(i)}
                className="evidence-tile file-card paper-panel group relative min-w-0 overflow-hidden p-4 text-left"
                key={item.id}
              >
                <span className="evidence-pin" aria-hidden="true" />
                <div className={`evidence-print relative mb-5 bg-[#cbc5b9] p-2 pb-4 shadow-[5px_6px_0_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover:rotate-0 ${i % 2 === 0 ? '-rotate-[.65deg]' : 'rotate-[.65deg]'}`}>
                  <MediaOrPlaceholder src={item.image} className="aspect-[4/3] w-full object-cover" label={`Evidence ${item.id}`} muted autoPlay loop />
                  <div className="absolute right-4 top-4 rotate-6 border border-[#a53a36] bg-[#242426]/85 px-2 py-1 mono text-[8px] tracking-wider text-[#c77b70]">EXHIBIT / {String(i + 1).padStart(2, '0')}</div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mono text-[8px] tracking-[.13em] text-[#8d8980]">EVIDENCE FILE #{item.id}</div>
                    <div className="mono mt-2 text-[9px] tracking-[.12em] text-[#b34a43]">{item.label}</div>
                  </div>
                  <span className="shrink-0 border border-[#403c36] px-2 py-1 mono text-[8px] text-[#9c968b]">{item.date}</span>
                </div>
                <p className="mt-4 min-h-[48px] text-xs leading-5 text-[#c6c1b7]">“{item.caption}”</p>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#393735] pt-3 mono text-[8px] text-[#77736b]">
                  <span className="truncate">LOC: {item.location}</span>
                  <span className="flex shrink-0 items-center gap-1 text-[#a79b83]">OPEN RECORD <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" /></span>
                </div>
              </button>;
            })}
          </div>
        </div>
      </section>

      <section id="future" className="section-shell scroll-mt-8">
        <SectionHeading eyebrow="Projected timeline: unknown" title="Future Operations" index="03" />
        <div className="grid gap-4 md:grid-cols-2">
          {[['SUBJECT A', caseFileData.future.subjectA], ['SUBJECT B', caseFileData.future.subjectB]].map(([label, plans]) => <div className="paper-panel p-6 sm:p-8" key={label as string}>
            <div className="eyebrow mb-5">{label as string} / UNCONFIRMED AMBITIONS</div>
            <ul className="space-y-4">{(plans as string[]).map((plan, i) => <li key={`${plan}-${i}`} className="flex gap-3 border-b border-[#393735] pb-3 text-sm text-[#c9c3b8]"><span className="mono text-[#a58955]">0{i + 1}</span><span>{plan}</span></li>)}</ul>
          </div>)}
        </div>
        <div className="relative mt-8 overflow-hidden border border-[#64563d] bg-[#201f1c] px-6 py-9 text-center sm:px-12 sm:py-14">
          <span className="absolute left-4 top-4 mono text-[8px] tracking-[.2em] text-[#8d7952]">SHARED OBJECTIVE / ACTIVE</span>
          <div className="condensed mt-5 text-[clamp(33px,6vw,58px)] font-bold leading-none text-[#e2dcd0]">{caseFileData.future.sharedObjective}</div>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[#c4bdb1]">{caseFileData.future.close}</p>
          <p className="mx-auto mt-8 max-w-xl border-t border-[#554c3c] pt-6 text-sm italic leading-6 text-[#d5c8a8]">{caseFileData.future.reflection}</p>
          <span className="file-stamp mt-7">NO END DATE ON RECORD</span>
        </div>
      </section>

      <section id="interrogation" className="section-shell scroll-mt-8">
        <SectionHeading eyebrow="Interview recording 04-A" title="Interrogation Room" index="04" />
        <div className="paper-panel p-5 sm:p-8">
          <div className="mb-7 flex items-center gap-3 border-b border-[#3b3936] pb-5"><CircleHelp size={18} className="text-[#a58c58]" /><p className="mono text-xs text-[#b9b3a9]">“The subject has refused to cooperate.”</p></div>
          <div className="space-y-8">
            {caseFileData.questions.map((item, index) => <div key={item.question}>
              <div className="mb-3 flex gap-3"><span className="mono text-[10px] text-[#a23a36]">Q0{index + 1}</span><h3 className="mono text-[10px] leading-5 tracking-[.06em] text-[#d5d0c7] sm:text-xs">{item.question}</h3></div>
              <div className="grid grid-cols-2 gap-3">
                {item.options.map((option, optionIndex) => <button key={option} data-testid={`button-answer-${index}-${optionIndex}`} onClick={() => handleAnswer(index, optionIndex)} className={`min-h-12 border px-4 text-left mono text-[10px] tracking-wider transition-colors ${answers[index] === optionIndex ? 'border-[#906e42] bg-[#322b20] text-[#e1d1ad]' : 'border-[#44413c] bg-[#1c1d1e] text-[#aaa59b] hover:border-[#82413a] hover:text-[#e1dcd2]'}`}>
                  <span className="mr-2 text-[#9e3b37]">{optionIndex === 0 ? 'A /' : 'B /'}</span>{option}
                </button>)}
              </div>
              {answers[index] !== undefined && <p role="status" className="mt-3 mono text-[10px] text-[#a78f5d]">{answers[index] === item.answer ? 'CORRECT. THIS WAS OBVIOUS.' : 'INCORRECT. INVESTIGATORS ARE DISAPPOINTED.'}</p>}
                {index === 0 && policeCaseNoteVisible && answers[index] === 0 && <p key={policeCaseNoteKey} aria-live="polite" className="police-case-note mt-2 mono text-[9px]">maybe because of a police case</p>}
            </div>)}
          </div>
          <div className="mt-8 border-t border-[#3b3936] pt-4 mono text-[9px] text-[#706c65]">TRANSCRIPT MAY BE EDITED BY THE SUBJECT. NO APPEAL PROCESS.</div>
        </div>
      </section>

      <section id="final" className="quiet-mode relative scroll-mt-0 px-4 py-24 sm:py-36">
        <div className="mx-auto max-w-[760px]">
          <div className="mb-10 text-center mono text-[9px] tracking-[.2em] text-[#706d66]">— END OF INVESTIGATION / PRIVATE TRANSMISSION —</div>
          <video
            src={caseFileData.finalTransmission.video}
            controls
            playsInline
            preload="metadata"
            aria-label={`Final transmission video for ${person.name}`}
            className="mx-auto block h-auto w-full max-w-[620px] border border-[#343436] bg-[#08090a]"
          >
            Your browser does not support embedded video.
          </video>
          <div className="mx-auto mt-12 max-w-[600px]">
            <div className="eyebrow mb-6 text-center">FINAL TRANSMISSION</div>
            <p className="text-base leading-8 text-[#c8c5bf] sm:text-lg sm:leading-9">{caseFileData.finalTransmission.message}</p>
            <div className="mt-12 border-t border-[#343436] pt-10 text-center">
              <p className="condensed text-[clamp(38px,7vw,70px)] font-bold leading-none text-[#e5e0d7]">HAPPY BIRTHDAY,<br /><span className="text-[#a33734]">{person.name}.</span></p>
              <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-[#615d54] to-transparent" />
              <div className="mono text-xs tracking-[.14em] text-[#aaa59b]">CASE STATUS: ONGOING</div>
              <div className="mono mt-3 text-[10px] tracking-[.16em] text-[#77736c]">MORE EVIDENCE EXPECTED.</div>
              <button data-testid="button-close-file" onClick={() => setClosedResponse(true)} className="mt-10 min-h-12 border border-[#77736a] px-8 mono text-[10px] tracking-[.18em] text-[#d2cdc4] transition-colors hover:border-[#a93a37] hover:bg-[#351b1b]">[ CLOSE FILE ]</button>
              {closedResponse && <p role="status" className="reveal mt-5 mono text-xs text-[#b49b66]">Nice try. The case remains open.</p>}
            </div>
          </div>
        </div>
      </section>
      <footer className="flex flex-col items-center justify-between gap-3 border-t border-[#28292a] bg-[#090a0b] px-5 py-6 mono text-[8px] tracking-[.13em] text-[#64615b] sm:flex-row">
        <span>UNAUTHORIZED COPY / FRIENDSHIP INVESTIGATION UNIT</span><button onClick={() => openSection('interrogation')} className="flex min-h-10 items-center gap-2 text-[#827d73] hover:text-[#c9c2b5]">REOPEN INTERROGATION <ChevronDown size={12} /></button>
      </footer>
    </>}
    {currentEvidence && viewerIndex !== null && <div role="dialog" aria-modal="true" aria-label={`Evidence ${currentEvidence.id}`} className="fixed inset-0 z-50 flex items-center justify-center bg-[#050607]/95 p-4 backdrop-blur-sm" onClick={() => setViewerIndex(null)}>
      <div className="relative w-full max-w-4xl border border-[#494641] bg-[#17181a] p-4 sm:p-7" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between mono text-[9px] tracking-[.14em] text-[#aaa399]"><span>EVIDENCE LOCKER / RECORD {currentEvidence.id}</span><button data-testid="button-close-viewer" onClick={() => setViewerIndex(null)} aria-label="Close evidence viewer" className="grid h-10 w-10 place-items-center border border-[#46433e] hover:border-[#9f3936]"><X size={17} /></button></div>
        <MediaOrPlaceholder src={currentEvidence.image} className="max-h-[65vh] min-h-[260px] w-full object-contain" label={`Evidence ${currentEvidence.id} fullscreen`} muted controls />
        <div className="mt-4 flex items-center justify-between gap-3">
          <button onClick={() => setViewerIndex((viewerIndex - 1 + caseFileData.evidence.length) % caseFileData.evidence.length)} aria-label="Previous evidence" className="grid h-11 w-11 place-items-center border border-[#45413b] hover:border-[#9c3733]"><ArrowLeft size={16} /></button>
          <div className="flex-1 text-center"><div className="mono text-[9px] text-[#a88c58]">{currentEvidence.label} / {currentEvidence.date} / {currentEvidence.location}</div><p className="mt-2 text-sm text-[#c9c3b9]">{currentEvidence.caption}</p></div>
          <button onClick={() => setViewerIndex((viewerIndex + 1) % caseFileData.evidence.length)} aria-label="Next evidence" className="grid h-11 w-11 place-items-center border border-[#45413b] hover:border-[#9c3733]"><ArrowRight size={16} /></button>
        </div>
      </div>
    </div>}
  </main>;
}

export default App;