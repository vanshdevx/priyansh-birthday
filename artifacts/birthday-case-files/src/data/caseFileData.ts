/**
 * PERSONALIZATION DESK
 * All friend-specific copy and local media paths live here. Replace bracketed
 * values only when the subject's details, stories, and photos are supplied.
 */
export const caseFileData = {
  subject: {
    name: 'Priyansh',
    nickname: 'JAAT INDIA WALA ',
    age: '16',
    city: 'Kishangarh',
    birthdayMonthDay: '10-10',
    caseYear: '2010',
    occupation: 'Professional Menace',
    threatLevel: '9.7 / 10',
    offenses: [
      'Excessive yapping',
      'Questionable decision-making',
      'Emotional damage via sarcasm',
      'Being unnecessarily dramatic',
      'Underage Drinking',
      'Being obssesively loud in public',
    ],
    status: 'Still somehow getting away with everything.',
    portrait: '/subject-portrait.jpeg',
  },
  evidence: [
    { id: '017', date: '2026-09-20', location: 'STUCK IN DA ELEVATOR', label: 'UNEXPLAINED SCENE', caption: 'Investigators still don’t know what was happening here.', image: '/evidence-02-weird.jpeg' },
    { id: '024', date: '2026-09-20', location: 'UNKNOWN STAR', label: 'A DEEPLY UNSERIOUS OPERATION', caption: 'A deeply unserious operation. The paperwork was worse.', image: '/evidence-024-deeply-unserious-operation.mp4' },
    { id: '031', date: '2026-09-20', location: 'DARK LANDS', label: 'UNEXPECTEDLY IMPORTANT', caption: 'One of those days that ended up meaning more than we expected.', image: '/evidence-04-bestday.png' },
    { id: '046', date: '2025-12-11', location: 'Student Asylum', label: 'BARELY ESCAPED', caption: 'Hide your face the police is here', image: '/evidence-03-hideout.jpeg' },
  ],
  future: {
    subjectA: ['Andha Paisa 🤑', 'World Tour with Close ones', 'Sukhe Nashe'],
    subjectB: ['Andha Paisa', 'Living Abroad ', 'Bandi Banwado koi 😭'],
    sharedObjective: 'Become people we’re proud of.',
    close: 'Nobody knows where this whole thing is going. Probably for the best.',
    reflection: 'But it’d be pretty cool if we got to look back at all this one day and realize we actually made it.',
  },
  questions: [
    { question: 'WHO IS MORE LIKELY TO BECOME FAMOUS?', options: ['Priyansh', 'Vansh'], answer: 0 },
    { question: 'WHO MAKES WORSE DECISIONS?', options: ['Priyansh', 'Vansh'], answer: 1 },
    { question: 'WHO WOULD MOST PROBABLY GET AWAY WITH MURDER?', options: ['Priyansh', 'Vansh'], answer: 0 },
    { question: 'WHO IS THE MOST LIKELY TO END UP IN JAIL?', options: ['Priyansh', 'Vansh'], answer: 1   },
    { question: 'WHO TREATS KAND AS PERSONALITY DEVEOPMENT? ', options: ['Priyansh', 'Vansh'], answer: 1 },
  ],
  finalTransmission: {
    video: '/final-transmission.mp4',
    message: "Bro, we've been figuring life out together for a while now, and honestly, we're still pretty clueless 💀 Between all the bakchodi, bullying each other for absolutely no reason, and the random conversations where we actually talk about life and what we wanna do with it, we've collected a fair share of memories. And we've still got so much shit left to do. Places to go, dreams to chase, questionable decisions to make, and a whole lot of lore to add. No clue where we'll end up or what life has planned for us, but I hope we get to look back at all this someday and laugh at how stupid we were. Anyway, enough of the emotional bullshit. Happy birthday, idiot. 🩶 Hope this year's full of good memories, unhinged stories, and way less bullshit (although knowing you, no promises). Now go be a menace. You're only 16 once. 🥂\nP.S. I spent an unreasonable amount of time making this. Please appreciate it accordingly.",
  },
  audioPath: '/tuyo-narcos-theme.mp3',
};

export type EvidenceRecord = (typeof caseFileData.evidence)[number];