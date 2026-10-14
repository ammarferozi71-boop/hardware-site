// Rigwise compatibility checker logic. Pure functions, unit tested.
// Uses only maker spec-page values from content/tools/compatibility.json; no benchmarks, no FPS claims.
//
// Parts (rows with part_type and specs):
//   gpu:         { pcie_gen, pcie_lanes, power_connector: '12V-2x6'|'12VHPWR'|'8-pin'|'none', connector_count?, recommended_psu_w, length_mm? }
//   motherboard: { pcie_gen_x16, memory_type: 'DDR4'|'DDR5', socket }
//   psu:         { watts, native_connector: '12V-2x6'|'12VHPWR'|null, pcie_8pin_count }
//   cpu:         { socket, memory_types: ['DDR5', ...] }
//   ram:         { memory_type }
//   case:        { max_gpu_length_mm }
// Each rule in the dataset has { rule_key, logic: { type }, fact_ids }; results carry fact_ids as evidence.

export const VERDICT = { OK: 'ok', NOTE: 'note', WARN: 'warn', FAIL: 'fail' };

const checks = {
  // A card works in an older PCIe slot; the link runs at the lower generation.
  pcie_link({ gpu, motherboard }) {
    if (!gpu || !motherboard) return null;
    const link = Math.min(gpu.pcie_gen, motherboard.pcie_gen_x16);
    if (gpu.pcie_gen > motherboard.pcie_gen_x16)
      return { verdict: VERDICT.NOTE, message: `Fits and works. The card runs at PCIe ${link}.0 instead of ${gpu.pcie_gen}.0 in this board's slot.` };
    return { verdict: VERDICT.OK, message: `PCIe ${link}.0 link, the card's full generation.` };
  },
  psu_wattage({ gpu, psu }) {
    if (!gpu || !psu || !gpu.recommended_psu_w) return null;
    if (psu.watts >= gpu.recommended_psu_w)
      return { verdict: VERDICT.OK, message: `${psu.watts} W meets the maker's recommended ${gpu.recommended_psu_w} W.` };
    return { verdict: VERDICT.FAIL, message: `${psu.watts} W is below the maker's recommended ${gpu.recommended_psu_w} W for this card.` };
  },
  power_connector({ gpu, psu }) {
    if (!gpu || !psu || !gpu.power_connector || gpu.power_connector === 'none') return null;
    const c = gpu.power_connector;
    if (c === '8-pin') {
      const need = gpu.connector_count || 1;
      return psu.pcie_8pin_count >= need
        ? { verdict: VERDICT.OK, message: `The power supply has the ${need} PCIe 8-pin cable(s) this card needs.` }
        : { verdict: VERDICT.FAIL, message: `This card needs ${need} PCIe 8-pin cable(s); the power supply lists ${psu.pcie_8pin_count}.` };
    }
    // 12V-2x6 and 12VHPWR cards
    if (psu.native_connector === '12V-2x6' || psu.native_connector === '12VHPWR')
      return { verdict: VERDICT.OK, message: `The power supply has a native ${psu.native_connector} cable for this card's ${c} socket.` };
    return { verdict: VERDICT.WARN, message: `No native ${c} cable on this power supply. Use the adapter supplied with the card and check the card maker's guidance.` };
  },
  memory_type({ motherboard, ram }) {
    if (!motherboard || !ram) return null;
    return motherboard.memory_type === ram.memory_type
      ? { verdict: VERDICT.OK, message: `${ram.memory_type} matches the board.` }
      : { verdict: VERDICT.FAIL, message: `The board takes ${motherboard.memory_type}; ${ram.memory_type} will not fit.` };
  },
  cpu_socket({ cpu, motherboard }) {
    if (!cpu || !motherboard) return null;
    return cpu.socket === motherboard.socket
      ? { verdict: VERDICT.OK, message: `${cpu.socket} socket matches.` }
      : { verdict: VERDICT.FAIL, message: `The CPU uses ${cpu.socket}; the board is ${motherboard.socket}.` };
  },
  gpu_length({ gpu, case: pcCase }) {
    if (!gpu || !pcCase || !gpu.length_mm || !pcCase.max_gpu_length_mm) return null;
    return gpu.length_mm <= pcCase.max_gpu_length_mm
      ? { verdict: VERDICT.OK, message: `${gpu.length_mm} mm card fits the case's ${pcCase.max_gpu_length_mm} mm limit.` }
      : { verdict: VERDICT.FAIL, message: `${gpu.length_mm} mm card is longer than the case's ${pcCase.max_gpu_length_mm} mm limit.` };
  },
};

/**
 * selection: { gpu?, motherboard?, psu?, cpu?, ram?, case? } — each a dataset row ({ id, model, specs, fact_ids }).
 * rules: dataset rules ({ rule_key, logic: { type }, fact_ids }). Only rules present in the dataset are applied.
 */
export function checkBuild(selection, rules) {
  const specs = Object.fromEntries(Object.entries(selection).filter(([, v]) => v).map(([k, v]) => [k, v.specs]));
  const results = [];
  for (const rule of rules) {
    const fn = checks[rule.logic && rule.logic.type];
    if (!fn) continue;
    const r = fn(specs);
    if (!r) continue;
    const partFacts = Object.values(selection).filter(Boolean).flatMap((p) => p.fact_ids || []);
    results.push({ rule_key: rule.rule_key, ...r, fact_ids: [...new Set([...(rule.fact_ids || []), ...partFacts])] });
  }
  const order = [VERDICT.FAIL, VERDICT.WARN, VERDICT.NOTE, VERDICT.OK];
  results.sort((a, b) => order.indexOf(a.verdict) - order.indexOf(b.verdict));
  const overall = results.some((r) => r.verdict === VERDICT.FAIL) ? VERDICT.FAIL
    : results.some((r) => r.verdict === VERDICT.WARN) ? VERDICT.WARN : VERDICT.OK;
  return { overall, results };
}

export const SUPPORTED_RULE_TYPES = Object.keys(checks);
