import test from 'node:test';
import assert from 'node:assert/strict';
import { registerGuzlTools } from '../src/webmcp.js';

test('registerGuzlTools registers the complete WebMCP tool surface', async () => {
  const registered = [];
  globalThis.window = { dispatchEvent() {} };
  globalThis.CustomEvent = class CustomEvent { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } };
  globalThis.document = {
    modelContext: {
      registerTool: async (tool) => { registered.push(tool); },
    },
  };

  const result = await registerGuzlTools();
  assert.deepEqual(result, { available: true, count: 6 });
  assert.deepEqual(registered.map((tool) => tool.name), [
    'get_experience_context',
    'get_decision_context',
    'clarify_uncertainty',
    'get_human_support_options',
    'report_experience_friction',
    'cancel_booking',
  ]);

  delete globalThis.window;
  delete globalThis.CustomEvent;
  delete globalThis.document;
});
