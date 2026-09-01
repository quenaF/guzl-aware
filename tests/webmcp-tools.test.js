import test from 'node:test';
import assert from 'node:assert/strict';
import { booking } from '../src/state.js';
import { createGuzlTools } from '../src/webmcp.js';

function getTool(name) {
  const tool = createGuzlTools().find((candidate) => candidate.name === name);
  assert.ok(tool, `Expected WebMCP tool ${name} to exist`);
  return tool;
}

function resetBooking() {
  booking.status = 'confirmed';
}

test('experience context preserves unknowns and exposes alternatives', async () => {
  const result = JSON.parse(await getTool('get_experience_context').execute({ bookingId: booking.id }));
  assert.ok(result.unknown.includes('Why the parent wants to cancel.'));
  assert.ok(result.doNotInfer.includes('Safety concern'));
  assert.deepEqual(result.alternatives, ['Reschedule', 'Transfer to another session', 'Shortened attendance / early pickup']);
});

test('ordinary scheduling context does not trigger support', async () => {
  const result = JSON.parse(await getTool('clarify_uncertainty').execute({
    bookingId: booking.id,
    humanContext: 'We have another commitment tomorrow.',
  }));
  assert.equal(result.supportBoundary, false);
  assert.deepEqual(result.availablePaths, ['Reschedule', 'Transfer', 'Shortened attendance', 'Continue cancellation']);
});

test('explicit sensitive context triggers support without inventing the reason', async () => {
  const humanContext = "She doesn't feel comfortable going back after what happened yesterday.";
  const result = JSON.parse(await getTool('clarify_uncertainty').execute({ bookingId: booking.id, humanContext }));
  assert.equal(result.supportBoundary, true);
  assert.equal(result.suppliedContext, humanContext);
  assert.deepEqual(result.availablePaths, ['Continue cancellation', 'Request human support']);
  assert.deepEqual(result.remainsUnknown, ['The specific concern remains unknown unless the human chooses to share it.']);
});

test('support routes appear only after an explicit boundary is established', async () => {
  const supportTool = getTool('get_human_support_options');
  const ordinary = JSON.parse(await supportTool.execute({ bookingId: booking.id, humanContext: 'We have another commitment tomorrow.' }));
  assert.equal(ordinary.available, false);
  const sensitive = JSON.parse(await supportTool.execute({ bookingId: booking.id, humanContext: 'She feels unsafe with the instructor.' }));
  assert.equal(sensitive.available, true);
  assert.deepEqual(sensitive.routes.map((route) => route.id), ['program_lead', 'participant_support']);
});

test('decision context requires explicit confirmation for cancellation', async () => {
  const result = JSON.parse(await getTool('get_decision_context').execute({ bookingId: booking.id, action: 'cancel_booking' }));
  assert.equal(result.requiresConfirmation, true);
});

test('cancel_booking cannot mutate state without confirmation', async () => {
  resetBooking();
  const result = JSON.parse(await getTool('cancel_booking').execute({ bookingId: booking.id, confirmed: false }));
  assert.equal(result.cancelled, false);
  assert.equal(booking.status, 'confirmed');
});

test('cancel_booking mutates state after explicit confirmation', async () => {
  resetBooking();
  const result = JSON.parse(await getTool('cancel_booking').execute({ bookingId: booking.id, confirmed: true }));
  assert.equal(result.cancelled, true);
  assert.equal(booking.status, 'cancelled');
  resetBooking();
});

test('tool annotations expose read-only and untrusted-content boundaries', () => {
  assert.equal(getTool('get_experience_context').annotations.readOnlyHint, true);
  assert.equal(getTool('clarify_uncertainty').annotations.untrustedContentHint, true);
  assert.equal(getTool('report_experience_friction').annotations.readOnlyHint, false);
  assert.equal(getTool('cancel_booking').annotations.readOnlyHint, false);
});

test('wrong booking ids fail safely', async () => {
  await assert.rejects(() => getTool('get_experience_context').execute({ bookingId: 'wrong-id' }), /Booking not found/);
});
