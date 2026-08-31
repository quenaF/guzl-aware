export const booking = {
  id: 'camp-204',
  participant: 'Maya',
  relationship: 'Parent / guardian',
  program: 'Harbor Trail Outdoor Camp',
  session: 'Tuesday · Coastal Skills Session',
  startsAt: 'Tomorrow · 9:00 AM',
  status: 'confirmed',
};

export const experienceContract = {
  intent: 'Preserve trust and continuity when plans change.',
  known: [
    'The participant is a minor.',
    'The session is tomorrow.',
    'A parent or guardian controls the booking.',
  ],
  unknown: ['Why the parent wants to cancel.'],
  doNotInfer: [
    'Safety concern',
    'Illness',
    'Dissatisfaction with staff',
    'Scheduling conflict',
  ],
  alternatives: [
    { id: 'reschedule', label: 'Reschedule', available: true },
    { id: 'transfer', label: 'Transfer to another session', available: true },
    { id: 'shorten', label: 'Shortened attendance / early pickup', available: true },
  ],
  supportTriggers: [
    'safety concern',
    'staff conduct concern',
    'accessibility need',
    'participant distress',
  ],
  decisionBoundary: {
    requiresConfirmation: true,
    reason: 'Cancellation is consequential and changes the booking state.',
  },
};

export const initialActivity = [
  {
    kind: 'system',
    title: 'Experience contract ready',
    detail: 'The page can expose capability and experience context to a WebMCP-aware agent.',
  },
];
