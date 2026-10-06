import { useState, useEffect, useRef, useCallback } from 'react';
import './tokens.css';
import { Icon, StatusTag, Button, Tabs, SubTabs, Dropdown, InputField, TextArea, RadioButton, Checkbox, Message, Toast, Avatar } from './hajir';
import { fmt, short, TAGS, NAV, KINDS, CATALOG, availTag, MENU_ICONS, nextId, media, INITIAL_ASSETS, INITIAL_REQUESTS, buildSteps } from './data';

const EMPTY_FORM = { type: '', model: '', reason: '', other: '', date: '', desc: '' };
const TODAY = '2026-10-05';
const ACK_DATE = '2026-10-07';

const col = (gap, extra) => ({ display: 'flex', flexDirection: 'column', gap, ...extra });
const card = { borderRadius: 7, boxShadow: 'inset 0 0 0 1px var(--line-200)', background: 'var(--surface-0)' };
const iconBtn = { border: 'none', background: 'none', cursor: 'pointer', width: 32, height: 32, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--hajir-navy-500)' };
const hover = bg => ({ onMouseEnter: e => { e.currentTarget.style.background = bg; }, onMouseLeave: e => { e.currentTarget.style.background = 'transparent'; } });
const overlay = z => ({ position: 'fixed', inset: 0, zIndex: z, display: 'flex', alignItems: 'center', justifyContent: 'center' });
const scrim = { position: 'absolute', inset: 0, background: 'rgba(30,30,30,.32)' };

const Svg = ({ children, size = 18, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const EyeIcon = () => <Svg><path d="M2.06 12.35a1 1 0 0 1 0-.7C3.42 8.36 7.4 5 12 5s8.58 3.36 9.94 6.65a1 1 0 0 1 0 .7C20.58 15.64 16.6 19 12 19s-8.58-3.36-9.94-6.65" /><circle cx="12" cy="12" r="3" /></Svg>;
const EditIcon = () => <Svg><path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-4-4L4 16v4z" /><path d="M13.5 6.5l4 4" /></Svg>;
const MoreIcon = () => <Svg fill><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></Svg>;

const Thumb = ({ css, label, size }) => (
  <div role="img" aria-label={label} style={{ width: size, height: size, flexShrink: 0, borderRadius: 8, background: 'var(--surface-50)', boxShadow: 'inset 0 0 0 1px var(--line-200)', backgroundImage: css || 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} />
);
const KV = ({ k, v, labelW = 130 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `${labelW}px 1fr`, gap: 12, fontSize: 13 }}>
    <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ color: 'var(--text-primary)', textWrap: 'pretty' }}>{v}</span>
  </div>
);
const SummaryRow = ({ k, v }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
    <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
  </div>
);
const Mini = ({ k, v }) => (
  <span style={col(2)}><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{k}</span><span style={{ fontSize: 13, color: 'var(--ink-800)' }}>{v}</span></span>
);
const Banner = ({ tone, children, action }) => (
  <div style={{ borderRadius: 6, background: `var(--${tone}-tint-5)`, padding: action ? '10px 10px 10px 14px' : '12px 14px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
    <div style={{ flex: 1, minWidth: 220 }}><Message type={tone}>{children}</Message></div>
    {action}
  </div>
);
const CloseBtn = ({ onClick, style }) => (
  <button onClick={onClick} aria-label="Close" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--icon-default)', display: 'flex', ...style }}><Icon name="IcRoundClose" size={20} /></button>
);
const UploadBox = ({ onClick, hint }) => (
  <button onClick={onClick} style={{ border: '1px dashed var(--line-400)', background: 'var(--surface-50)', borderRadius: 8, padding: '18px 16px', cursor: 'pointer', ...col(6, { alignItems: 'center' }), fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>
    <span style={{ fontSize: 13 }}><span style={{ fontWeight: 600, color: 'var(--hajir-navy-500)' }}>Click to upload</span> or drag and drop</span>
    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</span>
  </button>
);
const FileRow = ({ name, meta, onRemove }) => (
  <div style={{ borderRadius: 8, boxShadow: 'inset 0 0 0 1px var(--line-200)', padding: '10px 10px 10px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ ...col(2), flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{meta}</span>
    </span>
    <button onClick={onRemove} aria-label="Remove file" style={{ ...iconBtn, color: 'var(--icon-default)' }}><Icon name="IcRoundClose" size={18} /></button>
  </div>
);
const DialogShell = ({ title, onClose, pad, maxW = 520, maxH = 760, children }) => (
  <div style={{ ...overlay(40), padding: pad }}>
    <div onClick={onClose} style={scrim} />
    <div role="dialog" style={{ position: 'relative', width: '100%', maxWidth: maxW, maxHeight: `min(${maxH}px,100%)`, background: 'var(--surface-0)', borderRadius: 7, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-dialog)' }}>
      <div style={{ height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--line-200)' }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{title}</h2>
        <CloseBtn onClick={onClose} style={{ padding: 6 }} />
      </div>
      {children}
    </div>
  </div>
);
const SmallDialog = ({ maxW, gap = 16, children }) => (
  <div style={{ ...overlay(50), padding: 20, background: 'rgba(30,30,30,.32)' }}>
    <div style={{ width: '100%', maxWidth: maxW, background: 'var(--surface-0)', borderRadius: 7, boxShadow: 'var(--shadow-dialog)', padding: 24, ...col(gap) }}>{children}</div>
  </div>
);
const DetailShell = ({ onClose, outerPad, pad, children }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 45, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: outerPad, overflowY: 'auto' }}>
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(30,30,30,.32)' }} />
    <div style={{ position: 'relative', width: '100%', maxWidth: 920, margin: 'auto', background: 'var(--surface-0)', borderRadius: 7, boxShadow: 'var(--shadow-dialog)', padding: pad, ...col(20) }}>
      <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 18, right: 18, zIndex: 2, border: 'none', background: 'var(--surface-0)', cursor: 'pointer', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--icon-default)' }}><Icon name="IcRoundClose" size={20} /></button>
      {children}
    </div>
  </div>
);
const Title = ({ children }) => <h1 style={{ margin: 0, fontSize: 22, lineHeight: '28px', fontWeight: 600, letterSpacing: '-0.01em' }}>{children}</h1>;

export default function MyAssets() {
  const [s, setS] = useState({
    modal: null, w: typeof window === 'undefined' ? 1280 : window.innerWidth, navOpen: false, pageTab: 0, reqTab: 0, reqId: null, assetId: null,
    panel: null, editId: null, editFrom: null, form: EMPTY_FORM, attached: false, dd: null, acceptOpen: false, confirmChecked: false,
    issueOpen: false, issue: { type: '', desc: '' }, photo: false, toast: null, lastId: null, svc: null, rowMenu: null,
    assets: INITIAL_ASSETS, requests: INITIAL_REQUESTS
  });
  const setState = useCallback(p => setS(st => ({ ...st, ...(typeof p === 'function' ? p(st) : p) })), []);
  const toastTimer = useRef();

  useEffect(() => {
    const onR = () => setState({ w: window.innerWidth });
    window.addEventListener('resize', onR);
    return () => { window.removeEventListener('resize', onR); clearTimeout(toastTimer.current); };
  }, [setState]);

  const showToast = msg => { clearTimeout(toastTimer.current); setState({ toast: msg }); toastTimer.current = setTimeout(() => setState({ toast: null }), 3500); };
  const go = p => { const q = { dd: null, ...p }; if (q.view === 'asset' || q.view === 'request') { q.modal = q.view; } else if (q.view === 'list') q.modal = null; delete q.view; setState(q); };
  const toggleDd = key => () => setState(st => ({ dd: st.dd === key ? null : key }));
  const pickDd = fn => v => setState(st => ({ dd: null, ...fn(st, v) }));

  const editReq = (r, from) => setState({ modal: null, panel: 'form', editId: r.id, editFrom: from, form: { type: r.type, model: r.model || '', reason: ['New Requirement', 'New Joiner', 'Additional Equipment'].includes(r.reason) ? r.reason : 'Other', other: ['New Requirement', 'New Joiner', 'Additional Equipment', 'Other'].includes(r.reason) ? '' : r.reason, date: r.required, desc: r.desc || '' }, attached: !!r.attached, dd: null });
  const openSvc = (kind, assetId, q) => setState({ rowMenu: null, dd: null, svc: q ? { kind, assetId, reason: q.reason, date: q.required, cond: q.cond || '', desc: q.desc || '', photo: !!q.photo, acc: q.acc !== false, editId: q.id } : { kind, assetId, reason: '', date: '', cond: '', desc: '', photo: false, acc: true, editId: null } });

  // ---- derived data ----
  const pending = s.assets.filter(a => a.status === 'PendingAcceptance');
  const assigned = s.assets.filter(a => a.status === 'Assigned');
  const openSvcOf = id => s.requests.find(q => q.assetId === id && KINDS[q.kind] && (q.status === 'Pending' || q.status === 'Approved'));
  const kindLabel = q => KINDS[q.kind] ? KINDS[q.kind].label + ' · ' + (q.assetId || q.assetRef) : 'New asset';
  const tagFor = x => { const o = openSvcOf(x.id); if (o) return { status: 'Pending', label: KINDS[o.kind].tag }; return x.status === 'PendingAcceptance' && x.issue ? TAGS.UnderReview : TAGS[x.status]; };
  const reqFilters = [null, ['Pending'], ['Approved', 'Assigned', 'Completed'], ['Rejected']];
  const filtered = s.requests.filter(r => !reqFilters[s.reqTab] || reqFilters[s.reqTab].includes(r.status));
  const cnt = st => s.requests.filter(r => st.includes(r.status)).length;
  const r = s.requests.find(x => x.id === s.reqId) || s.requests[1];
  const linked = s.assets.find(a => a.id === r.assetId);
  const a = s.assets.find(x => x.id === s.assetId) || s.assets[0];
  const aSvc = openSvcOf(a.id);
  const last = s.requests.find(x => x.id === s.lastId);
  const w = s.w, narrow = w < 760, small = w < 520;
  const outerPad = small ? 0 : '40px 20px';
  const modalPad = small ? '20px 16px 24px' : '24px 28px 28px';
  const F = s.form;

  const history = [];
  s.requests.filter(q => q.assetId === a.id && KINDS[q.kind]).forEach(q => history.push({ date: fmt(q.requested), text: KINDS[q.kind].toastName + ' ' + q.id + ' submitted' }));
  if (a.acceptedOn) history.push({ date: fmt(a.acceptedOn), text: 'Asset acknowledged' });
  if (a.issue) history.push({ date: fmt(a.issue.on), text: `Issue reported: ${a.issue.type}` });
  history.push({ date: fmt(a.assigned), text: 'Assigned to you' });
  if (a.prevOwner) history.push({ date: fmt(a.prevOwner), text: 'Asset was previously assigned to another employee' });

  const openAsset = id => () => go({ view: 'asset', assetId: id });
  const openReq = id => () => go({ view: 'request', reqId: id });
  const openRowMenu = (e, id) => { const b = e.currentTarget.getBoundingClientRect(); setState({ rowMenu: { id, top: Math.min(b.bottom + 4, window.innerHeight - 150), right: window.innerWidth - b.right } }); };
  const onEditReq = x => () => KINDS[x.kind] ? openSvc(x.kind, x.assetId, x) : editReq(x, 'list');

  // ---- actions ----
  const submitRequest = () => {
    const reason = F.reason === 'Other' ? F.other.trim() : F.reason;
    if (s.editId) {
      const eid = s.editId;
      setState(st => ({ requests: st.requests.map(q => q.id === eid ? { ...q, type: F.type, model: F.model, reason, required: F.date, desc: F.desc, attached: st.attached } : q), panel: null, editId: null, dd: null, modal: 'request', reqId: eid }));
      showToast('Request ' + eid + ' updated');
      return;
    }
    const id = nextId(s.requests);
    const nr = { id, type: F.type, model: F.model, reason, requested: TODAY, required: F.date, status: 'Pending', desc: F.desc };
    setState(st => ({ requests: [nr, ...st.requests], panel: 'success', lastId: id, dd: null }));
  };
  const confirmAccept = () => {
    setState(st => ({ acceptOpen: false, assets: st.assets.map(x => x.id === a.id ? { ...x, status: 'Assigned', acceptedOn: ACK_DATE } : x), requests: st.requests.map(q => q.assetId === a.id ? { ...q, status: 'Completed', acceptedOn: ACK_DATE } : q) }));
    go({ view: 'asset', assetId: a.id });
    showToast('Asset acknowledged');
  };
  const submitIssue = () => {
    setState(st => ({ issueOpen: false, dd: null, assets: st.assets.map(x => x.id === a.id ? { ...x, issue: { type: st.issue.type, on: ACK_DATE } } : x) }));
    showToast('Your issue has been reported to HR/IT.');
  };
  const submitSvc = () => {
    const v = s.svc, K = KINDS[v.kind];
    if (v.editId) {
      setState(st => ({ svc: null, dd: null, requests: st.requests.map(q => q.id === v.editId ? { ...q, reason: v.reason, required: v.date, cond: v.cond, desc: v.desc, photo: v.photo, acc: v.acc } : q) }));
      showToast('Request ' + v.editId + ' updated'); return;
    }
    const id = nextId(s.requests), as = s.assets.find(x => x.id === v.assetId);
    const nr = { id, kind: v.kind, assetId: v.assetId, type: as.name, reason: v.reason, requested: TODAY, required: v.date, status: 'Pending', desc: v.desc, cond: v.cond, photo: v.photo, acc: v.acc };
    setState(st => ({ svc: null, dd: null, requests: [nr, ...st.requests] }));
    showToast(K.toastName + ' ' + id + ' submitted');
  };
  const closePanel = () => setState(st => ({ panel: null, dd: null, editId: null, ...(st.editId && st.editFrom === 'detail' ? { modal: 'request', reqId: st.editId } : {}) }));

  const approverName = KINDS[r.kind] ? 'HR/IT' : 'Department Manager';
  const reqInfo = KINDS[r.kind] ? (() => { const K = KINDS[r.kind], ra = s.assets.find(x => x.id === r.assetId); return [{ k: 'Asset', v: ra ? ra.model + ' · ' + ra.id : r.type + ' · ' + r.assetRef }, { k: 'Request type', v: K.label }, { k: K.reasonLabel, v: r.reason }, { k: 'Requested date', v: fmt(r.requested) }, { k: K.dateLabel, v: fmt(r.required) }].concat(r.kind === 'Return' ? [{ k: 'Condition', v: r.cond || '—' }, { k: 'Accessories', v: r.acc === false ? 'Not all included' : 'All included' }] : [], [{ k: 'Details', v: r.desc || '—' }]); })()
    : [{ k: 'Asset type', v: r.type }, { k: 'Preferred model', v: r.model || 'No preference' }, { k: 'Reason', v: r.reason }, { k: 'Requested date', v: fmt(r.requested) }, { k: 'Required date', v: fmt(r.required) }, { k: 'Description', v: r.desc || '—' }];
  const approvalInfo = r.status === 'Rejected' ? [{ k: 'Rejected by', v: approverName }, { k: 'Rejected on', v: fmt(r.rejectedOn) }]
    : r.approvedOn ? [{ k: 'Approved by', v: approverName }, { k: 'Approved on', v: fmt(r.approvedOn) }]
      : [{ k: 'Approver', v: approverName }, { k: 'Status', v: 'Awaiting review' }];
  const assetInfo = [{ k: 'Asset ID', v: a.id }, { k: 'Serial number', v: a.serial }, { k: 'Category', v: a.category }, { k: 'Condition', v: a.condition }, { k: 'Assigned on', v: fmt(a.assigned) }, { k: 'Request', v: a.requestId || '—' }];
  const descPlaceholders = { 'New Requirement': 'e.g. Joining the design team on 12 Oct, need a laptop that runs Figma.', 'Additional Equipment': 'e.g. A second monitor for reviewing designs side by side.' };
  const modelOptions = [['No preference', 'HR/IT will assign a suitable model.']].concat(CATALOG[F.type] || []);

  const S = s.svc, SK = S && KINDS[S.kind], sa = S && s.assets.find(x => x.id === S.assetId);
  const rm = s.rowMenu && s.assets.find(x => x.id === s.rowMenu.id), rmSvc = rm && openSvcOf(rm.id);
  const rowMenuItems = !rm ? [] : rmSvc
    ? [{ icon: 'View', label: 'View ' + KINDS[rmSvc.kind].toastName.toLowerCase(), onClick: () => { setState({ rowMenu: null }); go({ view: 'request', reqId: rmSvc.id }); } }]
    : ['Damage', 'Replacement', 'Return'].map(k => ({ icon: k, label: KINDS[k].title, onClick: () => openSvc(k, rm.id) }));

  const stepRows = buildSteps(r);
  const showOrg = w >= 1000, showSearch = w >= 640;

  const AssetActions = ({ x }) => (
    <span style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
      <button onClick={openAsset(x.id)} title="View details" aria-label="View details" style={iconBtn} {...hover('var(--navy-tint)')}><EyeIcon /></button>
      <button onClick={e => openRowMenu(e, x.id)} title="More actions" aria-label="More actions" style={iconBtn} {...hover('var(--navy-tint)')}><MoreIcon /></button>
    </span>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-100)', fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', gap: narrow ? 8 : 20, padding: '0 16px 0 12px' }}>
        {narrow && <button onClick={() => setState(st => ({ navOpen: !st.navOpen }))} aria-label="Menu" style={{ border: 'none', background: 'none', cursor: 'pointer', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--icon-strong)' }}><Icon name="SolarHamburgerMenuLinear" size={20} /></button>}
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--hajir-navy-500)' }}>hajir</span>
        {showOrg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-0)', boxShadow: 'inset 0 0 0 1px var(--line-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 16 }}>N</div>
            <div style={col(2)}><span style={{ fontSize: 13, fontWeight: 500 }}>Nepal SBI Bank Li...</span><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Head</span></div>
            <Icon name="IconParkOutlineDown" size={16} />
          </div>
        )}
        {showSearch && (
          <div style={{ flex: 1, maxWidth: 380, height: 36, borderRadius: 8, background: 'var(--surface-0)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', color: 'var(--text-placeholder)', fontSize: 13 }}>
            <Icon name="Search" size={16} /><span>Search ...</span>
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: small ? 12 : 18, color: 'var(--icon-strong)' }}>
          <Icon name="IconMessage" /><Icon name="IconInbox" /><Icon name="IconNotification" /><Avatar />
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {narrow && s.navOpen && <div onClick={() => setState({ navOpen: false })} style={{ position: 'fixed', inset: '60px 0 0 0', background: 'rgba(30,30,30,.32)', zIndex: 29 }} />}
        <nav style={{ width: 84, flexShrink: 0, overflowY: 'auto', display: !narrow || s.navOpen ? 'flex' : 'none', flexDirection: 'column', gap: 2, padding: '8px 6px', background: 'var(--surface-100)', position: narrow ? 'fixed' : 'static', top: 60, bottom: 0, left: 0, zIndex: 30 }}>
          {NAV.map(([label, icon]) => {
            const active = label === 'My Assets';
            return (
              <button key={label} onClick={active ? () => go({ view: 'list', pageTab: 0, navOpen: false }) : undefined}
                style={{ position: 'relative', border: 'none', cursor: 'pointer', flexShrink: 0, minHeight: 70, padding: '10px 4px', borderRadius: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-ui)', fontSize: 11, lineHeight: '13px', textAlign: 'center', background: active ? 'var(--surface-0)' : 'transparent', color: active ? 'var(--hajir-navy-500)' : 'var(--text-primary)', boxShadow: active ? 'inset 0 0 0 1px var(--line-200)' : 'none' }}>
                <Icon name={icon} size={22} />
                <span>{label}</span>
                {active && <span style={{ position: 'absolute', left: -6, top: 22, bottom: 22, width: 3, borderRadius: '0 3px 3px 0', background: 'var(--hajir-navy-500)' }} />}
              </button>
            );
          })}
        </nav>

        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', background: 'var(--surface-0)', borderRadius: narrow ? 0 : '7px 0 0 0', boxShadow: 'inset 0 0 0 1px var(--line-200)', padding: small ? '16px 14px 40px' : narrow ? '20px 20px 40px' : '24px 28px 48px' }}>
          <div style={{ ...col(20), width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={col(6)}>
                <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 13, lineHeight: '18px' }}>
                  <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a><span style={{ color: 'var(--line-400)' }}>/</span>
                  <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Assets</a><span style={{ color: 'var(--line-400)' }}>/</span>
                  <span aria-current="page" style={{ fontWeight: 500 }}>My Assets</span>
                </nav>
                <Title>My Assets</Title>
              </div>
              <Button icon="IconAdd" onClick={() => setState({ panel: 'form', editId: null, form: EMPTY_FORM, attached: false, dd: null })}>Request asset</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
              {[
                { label: 'Assigned assets', value: assigned.length, icon: 'PhDevicesLight', onClick: () => go({ view: 'list', pageTab: 0 }) },
                { label: 'Pending requests', value: cnt(['Pending']), icon: 'FamiconsDocumentTextOutline', onClick: () => go({ view: 'list', pageTab: 1, reqTab: 1 }) },
                { label: 'Pending acknowledgement', value: pending.length, icon: 'QlementineIconsSuccess16', onClick: () => pending[0] && go({ view: 'asset', assetId: pending[0].id }) }
              ].map(x => (
                <button key={x.label} onClick={x.onClick} style={{ ...card, textAlign: 'left', border: 'none', cursor: 'pointer', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-ui)' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--navy-tint)', color: 'var(--hajir-navy-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={x.icon} size={18} /></span>
                  <span style={col(2)}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{x.label}</span>
                    <span style={{ fontSize: 20, lineHeight: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>{x.value}</span>
                  </span>
                </button>
              ))}
            </div>

            <Tabs items={[`Assigned assets (${assigned.length})`, `Requests (${s.requests.length})`]} value={s.pageTab} onChange={i => setState({ pageTab: i })} />

            {s.pageTab === 0 && (
              <div style={col(16)}>
                {pending.map(p => (
                  <div key={p.id} style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <Thumb css={media(p).thumbCss} label={p.model} size={56} />
                    <div style={{ ...col(4), flex: 1, minWidth: 240 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{p.model}</span>
                        <StatusTag {...tagFor(p)} />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {p.issue ? `${p.id} · Issue reported on ${fmt(p.issue.on)}. HR/IT is reviewing it.` : `${p.id} · Assigned ${fmt(p.assigned)} for request ${p.requestId}. Please acknowledge receipt.`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Button variant="secondary" onClick={openAsset(p.id)}>View details</Button>
                      {!p.issue && <Button onClick={() => setState({ assetId: p.id, acceptOpen: true, confirmChecked: false })}>Acknowledge</Button>}
                    </div>
                  </div>
                ))}

                {narrow ? (
                  <div style={col(10)}>
                    {assigned.map(x => (
                      <div key={x.id} style={{ ...card, padding: 14, ...col(12) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Thumb css={media(x).thumbCss} label={x.model} size={44} />
                          <span style={{ ...col(2), flex: 1, minWidth: 0 }}><span style={{ fontSize: 14, fontWeight: 500 }}>{x.name}</span><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{x.model}</span></span>
                          <StatusTag {...tagFor(x)} />
                          <AssetActions x={x} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
                          <Mini k="Asset ID" v={x.id} /><Mini k="Category" v={x.category} /><Mini k="Assigned date" v={fmt(x.assigned)} /><Mini k="Condition" v={x.condition} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ ...card, overflowX: 'auto' }}>
                    <div style={{ minWidth: 640 }}>
                      {(() => {
                        const cols = 'minmax(0,2.2fr) minmax(0,1.1fr) minmax(0,1fr) minmax(0,1.1fr) minmax(0,0.9fr) minmax(0,1.2fr) 88px';
                        return (<>
                          <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, padding: '0 16px', height: 44, alignItems: 'center', background: 'var(--surface-50)', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', borderRadius: '7px 7px 0 0' }}>
                            <span>Asset</span><span>Asset ID</span><span>Category</span><span>Assigned date</span><span>Condition</span><span>Status</span><span style={{ textAlign: 'right' }}>Action</span>
                          </div>
                          {assigned.map(x => (
                            <div key={x.id} style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, padding: '0 16px', minHeight: 58, alignItems: 'center', borderTop: '1px solid var(--line-200)', fontSize: 13, color: 'var(--ink-800)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                <Thumb css={media(x).thumbCss} label={x.model} size={40} />
                                <span style={{ ...col(2), minWidth: 0 }}><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{x.name}</span><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{x.model}</span></span>
                              </span>
                              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{x.id}</span><span>{x.category}</span><span>{fmt(x.assigned)}</span><span>{x.condition}</span>
                              <span><StatusTag {...tagFor(x)} /></span>
                              <AssetActions x={x} />
                            </div>
                          ))}
                        </>);
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}

            {s.pageTab === 1 && (
              <div style={col(16)}>
                <SubTabs items={[{ label: 'All', count: s.requests.length }, { label: 'Pending', count: cnt(['Pending']) }, { label: 'Approved', count: cnt(['Approved', 'Assigned', 'Completed']) }, { label: 'Rejected', count: cnt(['Rejected']) }]} value={s.reqTab} onChange={i => setState({ reqTab: i })} />
                {narrow ? (
                  <div style={col(10)}>
                    {filtered.map(x => (
                      <div key={x.id} style={{ ...card, padding: 14, ...col(12) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ ...col(2), flex: 1, minWidth: 0 }}><span style={{ fontSize: 14, fontWeight: 500 }}>{x.type}</span><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{x.id} · {kindLabel(x)}</span></span>
                          <StatusTag {...TAGS[x.status]} />
                          <button onClick={openReq(x.id)} aria-label="View details" style={iconBtn}><EyeIcon /></button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
                          <Mini k="Reason" v={x.reason} /><Mini k="Requested" v={short(x.requested)} /><Mini k="Required by" v={short(x.required)} />
                        </div>
                      </div>
                    ))}
                    {!filtered.length && <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>No requests in this view.</div>}
                  </div>
                ) : (
                  <div style={{ ...card, overflowX: 'auto' }}>
                    <div style={{ minWidth: 640 }}>
                      {(() => {
                        const cols = 'minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1.3fr) 88px';
                        return (<>
                          <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, padding: '0 16px', height: 44, alignItems: 'center', background: 'var(--surface-50)', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', borderRadius: '7px 7px 0 0' }}>
                            <span>Request ID</span><span>Asset</span><span>Reason</span><span>Requested date</span><span>Due date</span><span>Status</span><span style={{ textAlign: 'right' }}>Action</span>
                          </div>
                          {filtered.map(x => (
                            <div key={x.id} style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, padding: '0 16px', minHeight: 54, alignItems: 'center', borderTop: '1px solid var(--line-200)', fontSize: 13, color: 'var(--ink-800)' }}>
                              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{x.id}</span>
                              <span style={{ ...col(2), minWidth: 0 }}><span>{x.type}</span><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{kindLabel(x)}</span></span>
                              <span>{x.reason}</span><span>{short(x.requested)}</span><span>{short(x.required)}</span>
                              <span><StatusTag {...TAGS[x.status]} /></span>
                              <span style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                                {x.status === 'Pending' && <button onClick={onEditReq(x)} title="Edit request" aria-label="Edit request" style={iconBtn} {...hover('var(--navy-tint)')}><EditIcon /></button>}
                                <button onClick={openReq(x.id)} title="View details" aria-label="View details" style={iconBtn} {...hover('var(--navy-tint)')}><EyeIcon /></button>
                              </span>
                            </div>
                          ))}
                          {!filtered.length && <div style={{ borderTop: '1px solid var(--line-200)', padding: '40px 18px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>No requests in this view.</div>}
                        </>);
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Request detail */}
          {s.modal === 'request' && (
            <DetailShell onClose={() => setState({ modal: null })} outerPad={outerPad} pad={modalPad}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Title>{KINDS[r.kind] ? KINDS[r.kind].reqTitle : 'Asset Request'} #{r.id}</Title>
                <StatusTag {...TAGS[r.status]} />
              </div>
              <div style={{ ...card, padding: '22px 24px' }}>
                <div style={{ display: 'flex' }}>
                  {stepRows.map(st => (
                    <div key={st.label} style={{ ...col(10), flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: 26, height: 26, borderRadius: 100, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: st.dotBg, boxShadow: st.ring, color: '#fff' }}>
                          {st.done && <Icon name="QlementineIconsCheckTickSmall" size={16} />}
                          {st.failed && <Icon name="IcRoundClose" size={14} />}
                          {st.current && <span style={{ width: 8, height: 8, borderRadius: 100, background: 'var(--hajir-navy-500)' }} />}
                        </span>
                        {st.hasLine && <span style={{ flex: 1, height: 2, margin: '0 8px', borderRadius: 2, background: st.lineBg }} />}
                      </div>
                      <div style={{ ...col(2), paddingRight: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: st.weight, color: st.labelColor }}>{st.label}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{st.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {r.status === 'Approved' && <Banner tone="info">{KINDS[r.kind] ? KINDS[r.kind].approved : 'Your request has been approved. The asset will be assigned by HR/IT.'}</Banner>}
              {r.status === 'Pending' && <Banner tone="warning" action={<Button variant="secondary" height={36} onClick={onEditReq(r)}>Edit request</Button>}>{KINDS[r.kind] ? "Your request is with HR/IT for review. You can edit it until it's reviewed." : "Your request is with your department manager for review. You can edit it until it's reviewed."}</Banner>}
              {r.status === 'Assigned' && (
                <div style={{ borderRadius: 7, boxShadow: 'inset 0 0 0 1px var(--hajir-navy-500)', background: 'var(--info-tint-5)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ ...col(4), flex: 1, minWidth: 240 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>HR/IT has assigned a {linked ? linked.model : ''} to you</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Acknowledge receipt to complete this request.</span>
                  </div>
                  <Button onClick={() => linked && go({ view: 'asset', assetId: linked.id })}>Review &amp; acknowledge</Button>
                </div>
              )}
              {r.status === 'Rejected' && (
                <div style={{ ...card, padding: '16px 18px', ...col(8) }}>
                  <Message type="error">Rejection reason</Message>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: '21px', color: 'var(--ink-600)' }}>{r.rejectReason}</p>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 16 }}>
                <div style={{ ...card, padding: '18px 20px', ...col(14) }}><h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Request information</h2>{reqInfo.map(i => <KV key={i.k} {...i} />)}</div>
                <div style={{ ...card, padding: '18px 20px', ...col(14) }}><h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Approval information</h2>{approvalInfo.map(i => <KV key={i.k} {...i} />)}</div>
              </div>
            </DetailShell>
          )}

          {/* Asset detail */}
          {s.modal === 'asset' && (
            <DetailShell onClose={() => setState({ modal: null })} outerPad={outerPad} pad={modalPad}>
              <div style={{ ...col(4), paddingRight: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><Title>{a.model}</Title><StatusTag {...tagFor(a)} /></div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.category} · {a.id}</span>
              </div>
              {a.status === 'PendingAcceptance' && (
                <div style={{ borderRadius: 7, boxShadow: 'inset 0 0 0 1px var(--hajir-navy-500)', padding: '20px 22px', ...col(14) }}>
                  <div style={col(4)}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Please acknowledge this asset</h2>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Assigned by HR/IT against request {a.requestId}</span>
                  </div>
                  {a.issue ? (
                    <Banner tone="warning">{`Your issue (${a.issue.type}) has been reported to HR/IT. This asset stays in Pending Acceptance until it is resolved.`}</Banner>
                  ) : (<>
                    <Banner tone="info">Please confirm that you have received this asset and that the condition shown below is correct.</Banner>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Button onClick={() => setState({ acceptOpen: true, confirmChecked: false })}>Acknowledge</Button>
                      <Button variant="secondary" onClick={() => setState({ issueOpen: true, issue: { type: '', desc: '' }, photo: false, dd: null })}>Report an issue</Button>
                    </div>
                  </>)}
                </div>
              )}
              {a.status === 'Assigned' && !aSvc && (
                <div style={{ ...card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ ...col(2), flex: 1, minWidth: 220 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Need help with this asset?</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Report damage, request a replacement or return it to HR/IT.</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button variant="secondary" onClick={() => openSvc('Damage', a.id)}>Report damage</Button>
                    <Button variant="secondary" onClick={() => openSvc('Replacement', a.id)}>Request replacement</Button>
                    <Button variant="secondary" onClick={() => openSvc('Return', a.id)}>Return asset</Button>
                  </div>
                </div>
              )}
              {aSvc && <Banner tone="warning" action={<Button variant="secondary" height={36} onClick={() => go({ view: 'request', reqId: aSvc.id })}>View request</Button>}>{KINDS[aSvc.kind].toastName + ' ' + aSvc.id + (aSvc.status === 'Approved' ? ' has been approved by HR/IT.' : ' is with HR/IT for review.')}</Banner>}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 24, alignItems: 'start' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 7, overflow: 'hidden', background: 'var(--surface-50)', boxShadow: 'inset 0 0 0 1px var(--line-200)' }}>
                  <div role="img" aria-label={a.model} style={{ position: 'absolute', inset: 0, backgroundImage: media(a).coverCss || 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  {media(a).credit && <a href={media(a).creditHref} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', left: 8, bottom: 8, fontSize: 11, lineHeight: '16px', padding: '2px 6px', borderRadius: 4, background: 'rgba(0,0,0,.5)', color: '#fff', textDecoration: 'none' }}>{media(a).credit}</a>}
                </div>
                <div style={{ ...col(20), minWidth: 0 }}>
                  <div style={col(8)}>
                    <h2 style={{ margin: 0, fontSize: 12, lineHeight: '16px', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>About this asset</h2>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: '22px', color: 'var(--ink-600)', textWrap: 'pretty' }}>{a.description || 'No description provided.'}</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', borderRadius: 7, overflow: 'hidden', gap: 1, padding: 1, background: 'var(--line-200)' }}>
                    {assetInfo.map(i => (
                      <div key={i.k} style={{ background: 'var(--surface-0)', padding: '12px 14px', ...col(2), minWidth: 0 }}>
                        <span style={{ fontSize: 12, lineHeight: '16px', color: 'var(--text-muted)' }}>{i.k}</span>
                        <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500, overflowWrap: 'anywhere' }}>{i.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={col(12)}>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Asset history</h2>
                <div style={{ ...card, padding: '16px 20px 2px', ...col(0) }}>
                  {history.map((h, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '14px minmax(0,1fr) auto', columnGap: 14 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ width: 10, height: 10, borderRadius: 100, marginTop: 5, flexShrink: 0, background: i === 0 ? 'var(--hajir-navy-500)' : 'var(--line-400)' }} />
                        {i < history.length - 1 && <span style={{ flex: 1, width: 1, background: 'var(--line-200)', margin: '4px 0' }} />}
                      </div>
                      <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500, paddingBottom: 18 }}>{h.text}</span>
                      <span style={{ fontSize: 13, lineHeight: '20px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DetailShell>
          )}
        </main>
      </div>

      {/* Request / edit form */}
      {s.panel && (
        <DialogShell title={s.panel === 'success' ? 'Request an asset' : s.editId ? 'Edit request ' + s.editId : 'Request an asset'} onClose={closePanel} pad={outerPad}>
          {s.panel === 'form' ? (<>
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', ...col(26) }}>
              <Dropdown label="Asset type" value={F.type} options={['Laptop', 'Desktop', 'Monitor', 'Mobile Phone', 'Headset', 'Keyboard', 'Mouse', 'Other']} open={s.dd === 'type'} onToggle={toggleDd('type')} style={{ zIndex: 3 }}
                onSelect={pickDd((st, v) => ({ form: { ...st.form, type: v, model: st.form.type === v ? st.form.model : '' } }))} />
              {CATALOG[F.type] && (
                <div style={col(10)}>
                  <div style={col(2)}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Preferred model <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></span>
                    <span style={{ fontSize: 12, lineHeight: '18px', color: 'var(--text-muted)' }}>Models HR/IT currently provides in this category.</span>
                  </div>
                  <div role="radiogroup" style={{ ...col(8), maxHeight: 288, overflowY: 'auto', padding: '1px 6px 1px 1px', marginRight: -6, overscrollBehavior: 'contain' }}>
                    {modelOptions.map(([name, specs, av, img], i) => {
                      const key = i === 0 ? '' : name, sel = F.model === key;
                      return (
                        <div key={name} role="radio" aria-checked={sel} onClick={() => setState(st => ({ form: { ...st.form, model: key } }))}
                          style={{ cursor: 'pointer', borderRadius: 8, boxShadow: sel ? 'inset 0 0 0 1px var(--hajir-navy-500)' : 'inset 0 0 0 1px var(--line-200)', background: sel ? 'var(--navy-tint)' : 'var(--surface-0)', padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                          <RadioButton selected={sel} />
                          {img ? <Thumb css={media({ id: img }).thumbCss} label={name} size={44} /> : i > 0 && (
                            <span style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 8, background: 'var(--surface-50)', boxShadow: 'inset 0 0 0 1px var(--line-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--icon-default)' }}><Icon name="PhDevicesLight" size={20} /></span>
                          )}
                          <span style={{ ...col(2), flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500 }}>{name}</span>
                            <span style={{ fontSize: 12, lineHeight: '16px', color: 'var(--text-muted)' }}>{specs}</span>
                          </span>
                          {av && <span style={{ flexShrink: 0 }}><StatusTag {...availTag(av)} /></span>}
                        </div>
                      );
                    })}
                  </div>
                  <span style={{ fontSize: 12, lineHeight: '16px', color: 'var(--text-muted)' }}>Availability is indicative. HR/IT may assign an equivalent model.</span>
                </div>
              )}
              <div style={col(6)}>
                <Dropdown label="Reason" value={F.reason} options={['New Requirement', 'New Joiner', 'Additional Equipment', 'Other']} open={s.dd === 'reason'} onToggle={toggleDd('reason')} style={{ zIndex: 2 }}
                  onSelect={pickDd((st, v) => ({ form: { ...st.form, reason: v } }))} />
                <span style={{ fontSize: 12, lineHeight: '16px', color: 'var(--text-muted)' }}>Pick the closest category. It decides who reviews your request.</span>
              </div>
              {F.reason === 'Other' && <InputField label="Specify reason" placeholder="e.g. Temporary project requirement" value={F.other} onChange={v => setState(st => ({ form: { ...st.form, other: v } }))} />}
              <InputField label="Required date" type="date" value={F.date} onChange={v => setState(st => ({ form: { ...st.form, date: v } }))} />
              <TextArea label="Details" rows={5} value={F.desc} onChange={v => setState(st => ({ form: { ...st.form, desc: v } }))} placeholder={descPlaceholders[F.reason] || 'Explain your situation: what you need it for, which asset it replaces, any specs.'} />
              <div style={col(8)}>
                <div style={col(2)}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Supporting document <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></span>
                  <span style={{ fontSize: 12, lineHeight: '18px', color: 'var(--text-muted)', textWrap: 'pretty' }}>Attach an approval, quotation or any document that supports your request.</span>
                </div>
                {s.attached ? <FileRow name="quotation-requirement.pdf" meta="182 KB · Uploaded" onRemove={() => setState({ attached: false })} /> : <UploadBox onClick={() => setState({ attached: true })} hint="PDF, JPG or PNG · max 5 MB" />}
              </div>
            </div>
            <div style={{ flexShrink: 0, padding: '16px 24px', borderTop: '1px solid var(--line-200)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button variant="secondary" onClick={closePanel}>Cancel</Button>
              <Button disabled={!(F.type && F.reason && F.date && (F.reason !== 'Other' || (F.other || '').trim()))} onClick={submitRequest}>{s.editId ? 'Save changes' : 'Submit request'}</Button>
            </div>
          </>) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: '40px 32px', ...col(14, { alignItems: 'center', textAlign: 'center' }) }}>
              <span style={{ width: 56, height: 56, borderRadius: 100, background: 'var(--success-tint)', color: 'var(--success-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="QlementineIconsCheckTickSmall" size={30} /></span>
              <h3 style={{ margin: '6px 0 0', fontSize: 17, fontWeight: 600 }}>Asset request submitted successfully.</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)' }}>Your request has been sent for approval.</p>
              {last && (
                <div style={{ ...card, width: '100%', maxWidth: 320, marginTop: 10, padding: '14px 16px', textAlign: 'left', ...col(10) }}>
                  <SummaryRow k="Request ID" v={last.id} /><SummaryRow k="Asset" v={last.model || last.type} /><SummaryRow k="Required by" v={fmt(last.required)} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <Button variant="secondary" onClick={closePanel}>Done</Button>
                <Button onClick={() => { setState({ panel: null }); go({ view: 'request', reqId: s.lastId }); }}>View request</Button>
              </div>
            </div>
          )}
        </DialogShell>
      )}

      {/* Acknowledge */}
      {s.acceptOpen && (
        <SmallDialog maxW={440}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Acknowledge asset</h2>
          <p style={{ margin: 0, fontSize: 14, lineHeight: '21px', color: 'var(--ink-600)' }}>By acknowledging, you confirm this asset has been handed over to you in the condition recorded below. You'll be responsible for it until it's returned.</p>
          <div style={{ borderRadius: 6, background: 'var(--surface-50)', padding: '14px 16px', ...col(10) }}>
            <SummaryRow k="Asset" v={a.model} /><SummaryRow k="Asset ID" v={a.id} /><SummaryRow k="Condition" v={a.condition} />
          </div>
          <Checkbox checked={s.confirmChecked} onChange={() => setState(st => ({ confirmChecked: !st.confirmChecked }))} label="I have received this asset and the details are correct." />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setState({ acceptOpen: false })}>Cancel</Button>
            <Button disabled={!s.confirmChecked} onClick={confirmAccept}>Acknowledge</Button>
          </div>
        </SmallDialog>
      )}

      {/* Report issue */}
      {s.issueOpen && (
        <SmallDialog maxW={480} gap={22}>
          <div style={col(4)}><h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Report asset issue</h2><span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.model} · {a.id}</span></div>
          <Dropdown label="Issue type" value={s.issue.type} options={['Damaged', 'Wrong Asset', 'Missing Item', 'Condition Incorrect', 'Other']} open={s.dd === 'issue'} onToggle={toggleDd('issue')} style={{ zIndex: 3 }}
            onSelect={pickDd((st, v) => ({ issue: { ...st.issue, type: v } }))} />
          <TextArea label="Description" placeholder="Describe the issue..." value={s.issue.desc} onChange={v => setState(st => ({ issue: { ...st.issue, desc: v } }))} />
          <button onClick={() => setState(st => ({ photo: !st.photo }))} style={{ border: '1px dashed var(--line-400)', background: 'var(--surface-50)', borderRadius: 8, padding: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-ui)', textAlign: 'left', color: 'var(--text-primary)' }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-0)', boxShadow: 'inset 0 0 0 1px var(--line-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--icon-default)' }}><Icon name="LucideArrowUpToLine" size={16} /></span>
            <span style={col(2)}><span style={{ fontSize: 13, fontWeight: 500 }}>{s.photo ? 'IMG_2041.jpg · Click to remove' : 'Upload photo'}</span><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Optional · JPG or PNG, up to 5 MB</span></span>
          </button>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setState({ issueOpen: false, dd: null })}>Cancel</Button>
            <Button disabled={!(s.issue.type && s.issue.desc.trim())} onClick={submitIssue}>Submit issue</Button>
          </div>
        </SmallDialog>
      )}

      {/* Row action menu */}
      {rm && (<>
        <div onClick={() => setState({ rowMenu: null })} style={{ position: 'fixed', inset: 0, zIndex: 55 }} />
        <div role="menu" style={{ position: 'fixed', top: s.rowMenu.top, right: s.rowMenu.right, zIndex: 56, minWidth: 200, background: 'var(--surface-0)', borderRadius: 7, boxShadow: 'var(--shadow-menu)', padding: 6, display: 'flex', flexDirection: 'column' }}>
          {rowMenuItems.map(m => (
            <button key={m.label} role="menuitem" onClick={m.onClick} {...hover('var(--surface-50)')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', height: 36, padding: '0 10px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--hajir-navy-500)', display: 'flex' }}><Svg>{MENU_ICONS[m.icon].map(d => <path key={d} d={d} />)}</Svg></span>
              {m.label}
            </button>
          ))}
        </div>
      </>)}

      {/* Damage / replacement / return form */}
      {S && (
        <DialogShell title={S.editId ? 'Edit request ' + S.editId : SK.title} onClose={() => setState({ svc: null, dd: null })} pad={outerPad} maxH={780}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 24, ...col(24) }}>
            <div style={col(12)}>
              <div style={{ borderRadius: 7, background: 'var(--surface-50)', padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Thumb css={media(sa).thumbCss} label={sa.model} size={48} />
                <span style={{ ...col(2), minWidth: 0 }}><span style={{ fontSize: 14, fontWeight: 600 }}>{sa.model}</span><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sa.category + ' · ' + sa.id}</span></span>
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: '19px', color: 'var(--text-muted)', textWrap: 'pretty' }}>{SK.sub}</p>
            </div>
            <Dropdown label={SK.reasonLabel} value={S.reason} options={SK.reasons} open={s.dd === 'svcReason'} onToggle={toggleDd('svcReason')} style={{ zIndex: 3 }}
              onSelect={pickDd((st, v) => ({ svc: { ...st.svc, reason: v } }))} />
            <InputField label={SK.dateLabel} type="date" value={S.date} onChange={v => setState(st => ({ svc: { ...st.svc, date: v } }))} />
            {S.kind === 'Return' && <Dropdown label="Current condition" value={S.cond} options={['Good', 'Fair', 'Damaged']} open={s.dd === 'svcCond'} onToggle={toggleDd('svcCond')} style={{ zIndex: 2 }} onSelect={pickDd((st, v) => ({ svc: { ...st.svc, cond: v } }))} />}
            <TextArea label={SK.descRequired ? 'Details' : 'Notes (optional)'} placeholder={SK.descPh} value={S.desc} onChange={v => setState(st => ({ svc: { ...st.svc, desc: v } }))} />
            {S.kind === 'Damage' && (
              <div style={col(8)}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Photos <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></span>
                {S.photo ? <FileRow name="IMG_3042.jpg" meta="1.2 MB · Uploaded" onRemove={() => setState(st => ({ svc: { ...st.svc, photo: false } }))} /> : <UploadBox onClick={() => setState(st => ({ svc: { ...st.svc, photo: true } }))} hint="JPG or PNG · max 5 MB" />}
              </div>
            )}
            {S.kind === 'Return' && <Checkbox checked={S.acc} onChange={() => setState(st => ({ svc: { ...st.svc, acc: !st.svc.acc } }))} label="All accessories (charger, cables, case) will be returned" />}
          </div>
          <div style={{ flexShrink: 0, padding: '16px 24px', borderTop: '1px solid var(--line-200)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setState({ svc: null, dd: null })}>Cancel</Button>
            <Button disabled={!(S.reason && S.date && (!SK.descRequired || S.desc.trim()) && (S.kind !== 'Return' || S.cond))} onClick={submitSvc}>{S.editId ? 'Save changes' : SK.submit}</Button>
          </div>
        </DialogShell>
      )}

      {s.toast && (
        <div style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 60 }}>
          <Toast onDismiss={() => setState({ toast: null })}>{s.toast}</Toast>
        </div>
      )}
    </div>
  );
}
