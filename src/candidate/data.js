const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const fmt = iso => { const [y, m, d] = iso.split('-').map(Number); return `${MON[m - 1]} ${d}, ${y}`; };
export const short = iso => { const [, m, d] = iso.split('-').map(Number); return `${MON[m - 1]} ${d}`; };

export const TAGS = {
  Pending: { status: 'Pending', label: 'Pending' },
  Approved: { status: 'Approved', label: 'Approved' },
  Rejected: { status: 'Rejected', label: 'Rejected' },
  Assigned: { status: 'Active', label: 'Assigned' },
  Completed: { status: 'Holiday', label: 'Completed' },
  PendingAcceptance: { status: 'Partial', label: 'Pending Acknowledgement' },
  UnderReview: { status: 'Pending', label: 'Under HR/IT Review' }
};

export const NAV = [
  ['Dashboard', 'IconHome'], ['Standup & Prosper', 'FamiconsDocumentTextOutline'], ['Leave details', 'SolarCalendarDateLinear'],
  ['Banks', 'FluentBuildingBank20Regular'], ['HR Policies', 'SystemUiconsDocumentStack'], ['Holidays', 'MaterialSymbolsLightEventOutline'],
  ['My Appraisals', 'HugeiconsAward05'], ['Attendance Record', 'MaterialSymbolsLightWorkHistory'],
  ['My Assets', 'PhDevicesLight'], ['Grace Time', 'BasilClockOutline'], ['Schedule Records', 'UilSchedule']
];

export const KINDS = {
  Damage: { label: 'Damage', title: 'Report damage', reqTitle: 'Damage Report', toastName: 'Damage report', tag: 'Damage reported', final: 'Resolved', submit: 'Submit report', reasonLabel: 'What happened', reasons: ['Accidental damage', 'Stopped working', 'Liquid spill', 'Lost or stolen', 'Other'], dateLabel: 'Date of incident', descRequired: true, descPh: 'e.g. Dropped the headset; the left ear cushion is torn and the mic cuts out.', sub: 'Tell HR/IT what happened so they can arrange a repair or replacement.', approved: 'HR/IT has approved a repair. They will contact you to collect the asset.' },
  Replacement: { label: 'Replacement', title: 'Request replacement', reqTitle: 'Replacement Request', toastName: 'Replacement request', tag: 'Replacement requested', final: 'Replacement issued', submit: 'Submit request', reasonLabel: 'Reason', reasons: ['Not working properly', 'Damaged beyond repair', 'Outdated or too slow', 'Wrong specification'], dateLabel: 'Required by', descRequired: true, descPh: 'e.g. Keys stick and the battery no longer holds a charge.', sub: 'You keep using this asset until HR/IT issues the replacement.', approved: 'Your replacement is approved. HR/IT will assign the new unit to you.' },
  Return: { label: 'Return', title: 'Return asset', reqTitle: 'Return Request', toastName: 'Return request', tag: 'Return pending', final: 'Returned', submit: 'Submit return', reasonLabel: 'Reason for return', reasons: ['Leaving the company', 'No longer needed', 'Upgraded to a new asset', 'Role change'], dateLabel: 'Return date', descRequired: false, descPh: 'Anything IT should know before the handover.', sub: 'The asset stays assigned to you until IT confirms receipt.', approved: 'Your return is approved. Hand the asset over to IT on or before the return date.' }
};

export const CATALOG = {
  'Laptop': [['Dell Latitude 5450', 'Core Ultra 7 · 32 GB RAM · 1 TB SSD', 'in', 'LAP-1024'], ['Lenovo ThinkPad T14 Gen 5', 'Ryzen 7 · 16 GB RAM · 512 GB SSD', 'low:2'], ['MacBook Pro 14" M4', '16 GB RAM · 512 GB · Design and engineering roles', 'order:~2 weeks']],
  'Desktop': [['Dell OptiPlex 7020', 'Core i7 · 16 GB RAM · 512 GB SSD', 'in'], ['HP Elite Mini 800 G9', 'Core i5 · 16 GB RAM · Compact form factor', 'low:1']],
  'Monitor': [['Dell P2422H 24"', 'Full HD IPS · Height-adjustable stand', 'in', 'MON-2041'], ['Dell U2723QE 27"', '4K IPS · USB-C hub', 'low:3']],
  'Mobile Phone': [['Samsung Galaxy A55', '128 GB · Dual SIM', 'in'], ['iPhone 15', '128 GB · Manager and sales roles', 'order:~3 weeks']],
  'Headset': [['Jabra Evolve2 40', 'Wired USB-C · Noise-cancelling mic', 'in', 'HDS-3042'], ['Poly Voyager Focus 2', 'Wireless · Active noise cancelling', 'low:2']],
  'Keyboard': [['Logitech MX Keys', 'Wireless · Backlit', 'in', 'KBD-1187'], ['Logitech K120', 'Wired USB · Full size', 'in']],
  'Mouse': [['Logitech MX Master 3S', 'Wireless · Ergonomic', 'low:4'], ['Logitech M185', 'Wireless · Compact', 'in']]
};
export const availTag = a => { const [k, v] = a.split(':'); return k === 'in' ? { status: 'Approved', label: 'In stock' } : k === 'low' ? { status: 'Partial', label: 'Low stock · ' + v + ' left' } : { status: 'Inactive', label: 'On order · ' + v }; };

export const MENU_ICONS = {
  Damage: ['M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', 'M12 9v4', 'M12 17h.01'],
  Replacement: ['M3 12a9 9 0 0 1 15-6.7L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-15 6.7L3 16', 'M3 21v-5h5'],
  Return: ['M9 14 4 9l5-5', 'M4 9h10.5a5.5 5.5 0 0 1 0 11H11'],
  View: ['M2.06 12.35a1 1 0 0 1 0-.7C3.42 8.36 7.4 5 12 5s8.58 3.36 9.94 6.65a1 1 0 0 1 0 .7C20.58 15.64 16.6 19 12 19s-8.58-3.36-9.94-6.65', 'M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0']
};
export const nextId = reqs => 'AR-' + (Math.max.apply(null, reqs.map(q => +q.id.split('-')[1])) + 1);

const IMG = { 'LAP-1024': ['photo-1651614422674-1f51818f27b1', 'dlxmedia.hu', 'https://unsplash.com/@dlxmedia'], 'MON-2041': ['photo-1588789060769-5a30b843d6b6', 'Brandon Cormier', 'https://unsplash.com/@brandoncormier'], 'HDS-3042': ['photo-1680466457036-30e400aeabab', 'Maria Lin Kim', 'https://unsplash.com/@mrsmaria'], 'KBD-1187': ['photo-1562075950-23ba332df71c', 'C. G.', 'https://unsplash.com/@cg'] };
const u = (id, w) => 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&q=70&w=' + w;
export const media = a => { const m = IMG[a.id]; return m ? { thumbCss: 'url("' + u(m[0], 160) + '")', coverCss: 'url("' + u(m[0], 1600) + '")', credit: 'Photo by ' + m[1] + ' on Unsplash', creditHref: m[2] } : {}; };

export const INITIAL_ASSETS = [
  { id: 'LAP-1024', name: 'Laptop', model: 'Dell Latitude 5450', category: 'Laptop', serial: 'SN-458921', assigned: '2026-10-07', condition: 'Good', status: 'PendingAcceptance', requestId: 'AR-1024', issue: null, description: '14" business laptop with Intel Core Ultra 7, 32 GB RAM and 1 TB SSD. Comes with a 65 W USB-C charger and a laptop sleeve.', prevOwner: '2026-09-20' },
  { id: 'MON-2041', name: 'Monitor', model: 'Dell P2422H 24"', category: 'Monitor', serial: 'SN-772310', assigned: '2026-09-15', condition: 'Good', status: 'Assigned', requestId: 'AR-1021', description: '24" Full HD IPS monitor with a height-adjustable stand. HDMI and USB-C cables included.', acceptedOn: '2026-09-15' },
  { id: 'HDS-3042', name: 'Headset', model: 'Jabra Evolve2 40', category: 'Accessory', serial: 'SN-310877', assigned: '2026-09-18', condition: 'New', status: 'Assigned', description: 'Wired USB-C headset with a noise-cancelling microphone, certified for Teams and Zoom.', acceptedOn: '2026-09-18' },
  { id: 'KBD-1187', name: 'Keyboard', model: 'Logitech MX Keys', category: 'Accessory', serial: 'SN-118702', assigned: '2026-09-15', condition: 'Good', status: 'Assigned', description: 'Wireless backlit keyboard. Pairs over Bluetooth or the included Logi Bolt receiver.', acceptedOn: '2026-09-15' }
];
export const INITIAL_REQUESTS = [
  { id: 'AR-1027', type: 'Mouse', model: 'Logitech MX Master 3S', reason: 'Additional Equipment', requested: '2026-10-05', required: '2026-10-12', status: 'Pending', desc: 'Ergonomic mouse for long design review sessions.' },
  { id: 'AR-1025', kind: 'Damage', assetId: 'HDS-3042', type: 'Headset', reason: 'Accidental damage', requested: '2026-10-03', required: '2026-10-02', status: 'Pending', desc: 'Left ear cushion tore and the microphone cuts out intermittently.', photo: true },
  { id: 'AR-1024', type: 'Laptop', model: 'Dell Latitude 5450', reason: 'New Requirement', requested: '2026-10-05', required: '2026-10-10', status: 'Assigned', desc: 'Need laptop for development work.', approvedOn: '2026-10-06', assignedOn: '2026-10-07', assetId: 'LAP-1024' },
  { id: 'AR-1022', type: 'Desktop', reason: 'Additional Equipment', requested: '2026-09-28', required: '2026-10-08', status: 'Approved', desc: 'Build machine for running local test suites.', approvedOn: '2026-09-30' },
  { id: 'AR-1021', type: 'Monitor', reason: 'Additional Equipment', requested: '2026-09-10', required: '2026-09-15', status: 'Completed', desc: 'Second screen for code reviews.', approvedOn: '2026-09-11', assignedOn: '2026-09-15', acceptedOn: '2026-09-15', assetId: 'MON-2041' },
  { id: 'AR-1018', kind: 'Replacement', assetRef: 'MOB-0712', type: 'Mobile Phone', reason: 'Not working properly', requested: '2026-09-08', required: '2026-09-15', status: 'Rejected', desc: 'Current phone battery drains within a few hours.', rejectedOn: '2026-09-09', rejectReason: 'Your current device is within its 3-year replacement cycle. Please raise a repair ticket with IT; if it cannot be repaired, submit a new request with the IT assessment attached.' }
];

// Progress stepper model for a request detail view.
export function buildSteps(r) {
  const navy = 'var(--hajir-navy-500)', line = 'var(--line-200)';
  let defs, done, current = -1, failIdx = -1;
  if (r.status === 'Rejected') {
    defs = [['Submitted', r.requested], ['Under review', r.requested], ['Rejected', r.rejectedOn]]; done = 2; failIdx = 2;
  } else if (KINDS[r.kind]) {
    defs = [['Submitted', r.requested], ['HR/IT review', r.requested], ['Approved', r.approvedOn], [KINDS[r.kind].final, r.resolvedOn]];
    done = { Pending: 1, Approved: 3, Completed: 4 }[r.status]; current = done < 4 ? done : -1;
  } else {
    defs = [['Submitted', r.requested], ['Under review', r.requested], ['Approved', r.approvedOn], ['Assigned', r.assignedOn], ['Acknowledged', r.acceptedOn]];
    done = { Pending: 1, Approved: 3, Assigned: 4, Completed: 5 }[r.status];
    if (done < 5) current = done;
    if (r.status === 'Pending') { done = 1; current = 1; }
  }
  const waiting = KINDS[r.kind] ? { 1: 'With HR/IT', 3: r.kind === 'Return' ? 'Hand over to IT' : 'Awaiting HR/IT' } : { 1: 'With your manager', 3: 'Awaiting HR/IT', 4: 'Awaiting you' };
  return defs.map(([label, d], i) => {
    const isDone = i < done && i !== failIdx, isCur = i === current, failed = i === failIdx;
    return {
      label, done: isDone, current: isCur, failed, hasLine: i < defs.length - 1,
      date: d && (isDone || failed) ? fmt(d) : (isCur ? waiting[i] || '' : ''),
      dotBg: failed ? 'var(--danger-500)' : isDone ? navy : 'var(--surface-0)',
      ring: isDone || failed ? 'none' : `inset 0 0 0 2px ${isCur ? navy : line}`,
      lineBg: i + 1 < done || (i + 1 === current) || (i + 1 === failIdx) ? navy : line,
      labelColor: failed ? 'var(--danger-600)' : isCur ? navy : isDone ? 'var(--text-primary)' : 'var(--text-muted)',
      weight: isCur || failed ? 600 : 500
    };
  });
}
