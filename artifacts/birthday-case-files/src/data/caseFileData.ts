/**
 * PERSONALIZATION DESK
 * All friend-specific copy and local media paths live here. Replace bracketed
 * values only when the subject's details, stories, and photos are supplied.
 */
export const caseFileData = {
  subject: {
    name: 'Priyansh',
    nickname: '[NICKNAME NOT PROVIDED]',
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
      '[INSIDE JOKE — ADD LATER]',
      '[INSIDE JOKE — ADD LATER]',
    ],
    status: 'Still somehow getting away with everything.',
    portrait: '/subject-portrait.jpeg',
  },
  evidence: [
    { id: '017', date: '[DATE]', location: '[LOCATION]', label: 'UNEXPLAINED SCENE', caption: 'Investigators still don’t know what was happening here.', image: '' },
    { id: '024', date: '[DATE]', location: '[LOCATION]', label: 'KNOWN ASSOCIATES', caption: 'A deeply unserious operation. The paperwork was worse.', image: '' },
    { id: '031', date: '[DATE]', location: '[LOCATION]', label: 'UNEXPECTEDLY IMPORTANT', caption: 'One of those days that ended up meaning more than we expected.', image: '' },
    { id: '046', date: '[DATE]', location: '[LOCATION]', label: 'UNAUTHORIZED JOY', caption: '[ADD A REAL MEMORY OR INSIDE JOKE]', image: '' },
  ],
  future: {
    subjectA: ['[HER DREAM / AMBITION]', '[A PLACE SHE WANTS TO SEE]', '[A THING SHE WANTS TO EXPERIENCE]'],
    subjectB: ['[YOUR DREAM / AMBITION]', '[A PLACE YOU WANT TO SEE]', '[A THING YOU WANT TO EXPERIENCE]'],
    sharedObjective: 'Become people we’re proud of.',
    close: 'Nobody knows where this whole thing is going. Probably for the best.',
    reflection: 'But it’d be pretty cool if we got to look back at all this one day and realize we actually made it.',
  },
  questions: [
    { question: 'WHO IS MORE LIKELY TO BECOME FAMOUS?', options: ['Priyansh', 'Vansh'], answer: 0 },
    { question: 'WHO MAKES WORSE DECISIONS?', options: ['Priyansh', 'Vansh'], answer: 1 },
    { question: 'WHO SURVIVES A ZOMBIE APOCALYPSE?', options: ['Priyansh', 'Vansh'], answer: 1 },
    { question: 'WHO IS THE MAIN CHARACTER OF THIS CASE FILE?', options: ['Priyansh', 'Vansh'], answer: 0 },
    { question: 'WHO DISAPPEARS FOR SIX MONTHS AND RETURNS WITH A NEW PERSONALITY?', options: ['Priyansh', 'Vansh'], answer: 1 },
  ],
  finalTransmission: {
    portrait: '',
    message: 'I’m really glad we became friends. We’ve already collected a ridiculous amount of stories, and somehow there’s still a lot ahead of us. Nobody has the whole life thing figured out, which is reassuring and mildly concerning. I hope this next year is genuinely good to you — full of the kind of days we’ll still be laughing about later. Here’s to more questionable plans, good conversations, and evidence we probably shouldn’t submit in court.',
  },
  audioPath: '/tuyo-narcos-theme.mp3',
};

export type EvidenceRecord = (typeof caseFileData.evidence)[number];