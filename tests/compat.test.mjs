import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBuild, SUPPORTED_RULE_TYPES } from '../lib/tools/compat.mjs';

const rules = SUPPORTED_RULE_TYPES.map((type, i) => ({ rule_key: type, logic: { type }, fact_ids: [100 + i] }));
const part = (specs, id = 1) => ({ id, model: 'x', specs, fact_ids: [id] });

const gpu5 = part({ pcie_gen: 5, power_connector: '12V-2x6', recommended_psu_w: 750, length_mm: 300 }, 1);
const board3 = part({ pcie_gen_x16: 3, memory_type: 'DDR4', socket: 'AM4' }, 2);
const psu650 = part({ watts: 650, native_connector: null, pcie_8pin_count: 2 }, 3);
const psu850 = part({ watts: 850, native_connector: '12V-2x6', pcie_8pin_count: 4 }, 4);

test('PCIe 5.0 card in a PCIe 3.0 board works at 3.0 (note, not a failure)', () => {
  const r = checkBuild({ gpu: gpu5, motherboard: board3 }, rules);
  const pcie = r.results.find((x) => x.rule_key === 'pcie_link');
  assert.equal(pcie.verdict, 'note');
  assert.match(pcie.message, /PCIe 3\.0/);
  assert.equal(r.overall, 'ok');
});

test('underpowered PSU fails against the maker recommendation', () => {
  const r = checkBuild({ gpu: gpu5, psu: psu650 }, rules);
  assert.equal(r.overall, 'fail');
  assert.equal(r.results[0].rule_key, 'psu_wattage'); // failures sorted first
});

test('12V-2x6 card without a native cable is a warning, with one it is ok', () => {
  assert.equal(checkBuild({ gpu: gpu5, psu: psu650 }, rules).results.find((x) => x.rule_key === 'power_connector').verdict, 'warn');
  assert.equal(checkBuild({ gpu: gpu5, psu: psu850 }, rules).results.find((x) => x.rule_key === 'power_connector').verdict, 'ok');
});

test('8-pin cable count is checked', () => {
  const gpu8 = part({ pcie_gen: 4, power_connector: '8-pin', connector_count: 3, recommended_psu_w: 700 }, 5);
  assert.equal(checkBuild({ gpu: gpu8, psu: psu650 }, rules).results.find((x) => x.rule_key === 'power_connector').verdict, 'fail');
});

test('memory type and socket mismatches fail', () => {
  const r = checkBuild({ motherboard: board3, ram: part({ memory_type: 'DDR5' }, 6), cpu: part({ socket: 'AM5' }, 7) }, rules);
  assert.equal(r.overall, 'fail');
  assert.equal(r.results.filter((x) => x.verdict === 'fail').length, 2);
});

test('card too long for the case fails', () => {
  const r = checkBuild({ gpu: gpu5, case: part({ max_gpu_length_mm: 280 }, 8) }, rules);
  assert.equal(r.results.find((x) => x.rule_key === 'gpu_length').verdict, 'fail');
});

test('every result carries evidence (rule facts plus part facts)', () => {
  const r = checkBuild({ gpu: gpu5, psu: psu850, motherboard: board3 }, rules);
  for (const res of r.results) assert.ok(res.fact_ids.length >= 2, res.rule_key);
});

test('rules missing from the dataset are not applied', () => {
  const r = checkBuild({ gpu: gpu5, psu: psu650 }, [{ rule_key: 'pcie_link', logic: { type: 'pcie_link' }, fact_ids: [1] }]);
  assert.equal(r.results.length, 0);
});
