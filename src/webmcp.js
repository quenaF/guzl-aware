import { booking, experienceContract } from './state.js';

const bookingIdSchema = {
  type: 'object',
  properties: {
    bookingId: { type: 'string', description: 'Booking identifier.' },
  },
  required: ['bookingId'],
};

function assertBooking(bookingId) {
  if (bookingId !== booking.id) throw new Error('Booking not found.');
}

function emit(name, detail) {
  window.dispatchEvent(new CustomEvent('guzl:tool', { detail: { name, ...detail } }));
}

function detectSupportBoundary(text = '') {
  const normalized = text.toLowerCase();
  const patterns = [
    'not comfortable', 'uncomfortable', 'unsafe', 'not safe', 'scared', 'afraid',
    'staff', 'instructor', 'counselor', 'accessibility', 'accommodation', 'distress',
    'what happened',
  ];
  return patterns.some((pattern) => normalized.includes(pattern));
}

export async function registerGuzlTools() {
  if (!document.modelContext?.registerTool) {
    emit('webmcp_unavailable', { summary: 'WebMCP is not available in this browser.' });
    return { available: false };
  }

  const tools = [
    {
      name: 'get_experience_context',
      title: 'Get experience context',
      description: 'Get known facts, unknowns, non-inference boundaries, alternatives, and experience intent before acting on a camp booking.',
      inputSchema: bookingIdSchema,
      annotations: { readOnlyHint: true },
      execute: async ({ bookingId }) => {
        assertBooking(bookingId);
        const result = {
          bookingId,
          intent: experienceContract.intent,
          known: experienceContract.known,
          unknown: experienceContract.unknown,
          doNotInfer: experienceContract.doNotInfer,
          alternatives: experienceContract.alternatives.filter((x) => x.available).map((x) => x.label),
        };
        emit('get_experience_context', { summary: 'Agent discovered experience intent, unknowns, and alternatives.', result });
        return JSON.stringify(result);
      },
    },
    {
      name: 'get_decision_context',
      title: 'Get decision context',
      description: 'Check the human decision boundary before a consequential booking action.',
      inputSchema: {
        type: 'object',
        properties: {
          bookingId: { type: 'string' },
          action: { type: 'string', enum: ['cancel_booking'] },
        },
        required: ['bookingId', 'action'],
      },
      annotations: { readOnlyHint: true },
      execute: async ({ bookingId, action }) => {
        assertBooking(bookingId);
        const result = { action, ...experienceContract.decisionBoundary };
        emit('get_decision_context', { summary: 'Agent discovered that cancellation requires explicit confirmation.', result });
        return JSON.stringify(result);
      },
    },
    {
      name: 'clarify_uncertainty',
      title: 'Clarify uncertainty',
      description: 'Evaluate only context explicitly supplied by the human. Never infer a cancellation reason from sentiment or tone.',
      inputSchema: {
        type: 'object',
        properties: {
          bookingId: { type: 'string' },
          humanContext: { type: 'string', description: 'Context stated by the human, quoted or faithfully summarized.' },
        },
        required: ['bookingId', 'humanContext'],
      },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: async ({ bookingId, humanContext }) => {
        assertBooking(bookingId);
        const supportBoundary = detectSupportBoundary(humanContext);
        const result = {
          suppliedContext: humanContext,
          supportBoundary,
          remainsUnknown: supportBoundary ? ['The specific concern remains unknown unless the human chooses to share it.'] : [],
          availablePaths: supportBoundary
            ? ['Continue cancellation', 'Request human support']
            : ['Reschedule', 'Transfer', 'Shortened attendance', 'Continue cancellation'],
          instruction: 'Do not infer additional facts beyond what the human supplied.',
        };
        emit('clarify_uncertainty', { summary: supportBoundary ? 'Human context crossed a support boundary; the reason was not inferred.' : 'Human context was preserved without adding assumptions.', result });
        return JSON.stringify(result);
      },
    },
    {
      name: 'get_human_support_options',
      title: 'Get human support options',
      description: 'Return human-support routes when explicit user context indicates a sensitive concern, accessibility need, staff concern, or participant distress.',
      inputSchema: {
        type: 'object',
        properties: {
          bookingId: { type: 'string' },
          humanContext: { type: 'string' },
        },
        required: ['bookingId', 'humanContext'],
      },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: async ({ bookingId, humanContext }) => {
        assertBooking(bookingId);
        const boundary = detectSupportBoundary(humanContext);
        const result = boundary
          ? {
              available: true,
              routes: [
                { id: 'program_lead', label: 'Request a call from the program lead' },
                { id: 'participant_support', label: 'Contact participant support' },
              ],
              note: 'Support can be requested separately from cancellation.',
            }
          : { available: false, routes: [], note: 'No support boundary is established from the supplied context.' };
        emit('get_human_support_options', { summary: boundary ? 'Agent discovered a separate human-support path.' : 'No support path was triggered by explicit context.', result });
        return JSON.stringify(result);
      },
    },
    {
      name: 'report_experience_friction',
      title: 'Report experience friction',
      description: 'Record non-sensitive feedback about friction in this demo experience.',
      inputSchema: {
        type: 'object',
        properties: {
          bookingId: { type: 'string' },
          category: { type: 'string', enum: ['unclear_options', 'too_many_steps', 'missing_support', 'other'] },
          note: { type: 'string' },
        },
        required: ['bookingId', 'category'],
      },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute: async ({ bookingId, category, note = '' }) => {
        assertBooking(bookingId);
        const result = { recorded: true, category, note };
        emit('report_experience_friction', { summary: `Experience friction recorded: ${category}.`, result });
        return JSON.stringify(result);
      },
    },
    {
      name: 'cancel_booking',
      title: 'Cancel booking',
      description: 'Cancel the fictional camp booking. Explicit human confirmation must already be represented by confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          bookingId: { type: 'string' },
          confirmed: { type: 'boolean', description: 'True only after the human explicitly confirms cancellation.' },
        },
        required: ['bookingId', 'confirmed'],
      },
      annotations: { readOnlyHint: false },
      execute: async ({ bookingId, confirmed }) => {
        assertBooking(bookingId);
        if (confirmed !== true) {
          const result = { cancelled: false, reason: 'Explicit confirmation is required.' };
          emit('cancel_booking_blocked', { summary: 'Cancellation blocked because explicit confirmation was missing.', result });
          return JSON.stringify(result);
        }
        booking.status = 'cancelled';
        const result = { cancelled: true, bookingId, status: booking.status };
        emit('cancel_booking', { summary: 'Booking cancelled after explicit human confirmation.', result });
        return JSON.stringify(result);
      },
    },
  ];

  await Promise.all(tools.map((tool) => document.modelContext.registerTool(tool)));
  emit('webmcp_ready', { summary: `${tools.length} WebMCP tools registered.` });
  return { available: true, count: tools.length };
}
