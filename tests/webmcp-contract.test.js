import test from 'node:test';
import assert from 'node:assert/strict';
import { booking, experienceContract } from '../src/state.js';

function detectSupportBoundary(text = '') {
  const normalized = text.toLowerCase();
  const patterns = [
    'not comfortable', 'uncomfortable', 'unsafe', 'not safe', 'scared', 'afraid',
    'staff', 'instructor', 'counselor', 'accessibility', 'accommodation', 'distress',
    'what happened',
  ];
  return patterns.some((pattern) => normalized.includes(pattern));
}

test('experience contract preserves an explicit unknown cancellation reason', () => {
  assert.ok(experienceContract.unknown.includes('Why the parent wants to cancel.'));
  assert.ok(experienceContract.doNotInfer.includes('Safety concern'));
  assert.ok(experienceContract.doNotInfer.includes('Scheduling conflict'));
});

test('ordinary scheduling context does not cross the human-support boundary', () => {
  assert.equal(detectSupportBoundary('We have another commitment tomorrow.'), false);
});

test('explicit sensitive context crosses the human-support boundary', () => {
  assert.equal(detectSupportBoundary("She doesn't feel comfortable going back after what happened yesterday."), true);
});

test('experience contract exposes non-destructive alternatives before cancellation', () => {
  const available = experienceContract.alternatives.filter((item) => item.available).map((item) => item.id);
  assert.deepEqual(available, ['reschedule', 'transfer', 'shorten']);
});

test('cancellation is modeled as a consequential action requiring confirmation', () => {
  assert.equal(experienceContract.decisionBoundary.requiresConfirmation, true);
  assert.equal(booking.status, 'confirmed');
});
