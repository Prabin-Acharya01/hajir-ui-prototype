import { useState } from 'react';
import ICONS from './icons';

// Minimal React ports of the Hajir design-system components used by My Assets.

export function Icon({ name, size = 20, style }) {
  const ic = ICONS[name];
  if (!ic) return <span style={{ width: size, height: size, display: 'inline-block' }} />;
  return (
    <svg width={size} height={size} viewBox={ic.viewBox} fill="none" aria-hidden="true"
      style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: ic.body }} />
  );
}

const TONES = {
  Approved: ['var(--success-tint)', 'var(--success-500)'], Active: ['var(--success-tint)', 'var(--success-500)'],
  Inactive: ['var(--danger-tint)', 'var(--danger-500)'], Rejected: ['var(--danger-tint)', 'var(--danger-500)'],
  Pending: ['var(--warning-tint)', 'var(--warning-500)'], Holiday: ['var(--ink-tint)', 'var(--ink-900)'],
  Partial: ['var(--purple-tint)', 'var(--purple-500)'], Leave: ['var(--magenta-tint)', 'var(--magenta-500)'],
  WFH: ['var(--blue-tint)', 'var(--hajir-blue-500)']
};
export function StatusTag({ status = 'Approved', label }) {
  const [bg, fg] = TONES[status] || TONES.Approved;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 22, padding: '3px 8px', borderRadius: 'var(--radius-4)', background: bg, color: fg, fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: 12, lineHeight: '16px', letterSpacing: 'var(--ls-tight)', whiteSpace: 'nowrap' }}>
      {label || status}
    </span>
  );
}

export function Button({ variant = 'primary', icon, disabled, onClick, children, height = 40 }) {
  const [hover, setHover] = useState(false);
  const primary = variant === 'primary';
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height, padding: '0 16px',
        borderRadius: 'var(--radius-8)', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
        fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: 14, letterSpacing: 'var(--ls-tight)',
        background: primary ? (hover && !disabled ? 'var(--hajir-blue-600)' : 'var(--hajir-navy-500)') : (hover && !disabled ? 'var(--surface-50)' : 'var(--surface-0)'),
        color: primary ? '#fff' : 'var(--ink-900)',
        boxShadow: primary ? 'none' : 'inset 0 0 0 1px var(--line-400)',
        opacity: disabled ? 0.5 : 1
      }}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

export function Tabs({ items, value, onChange }) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 24, boxShadow: 'inset 0 -1px 0 var(--line-200)' }}>
      {items.map((it, i) => (
        <button key={i} role="tab" aria-selected={i === value} onClick={() => onChange(i)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', height: 40, padding: '0 2px', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, letterSpacing: 'var(--ls-loose)', color: i === value ? 'var(--hajir-navy-500)' : 'var(--ink-500)', boxShadow: i === value ? 'inset 0 -2px 0 var(--hajir-navy-500)' : 'none' }}>
          {it}
        </button>
      ))}
    </div>
  );
}

export function SubTabs({ items, value, onChange }) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map((it, i) => {
        const on = i === value;
        return (
          <button key={it.label} role="tab" aria-selected={on} onClick={() => onChange(i)}
            style={{ border: 'none', cursor: 'pointer', height: 36, padding: '0 8px 0 14px', borderRadius: 'var(--radius-8)', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, background: on ? 'var(--navy-tint)' : 'var(--surface-0)', color: on ? 'var(--hajir-navy-500)' : 'var(--ink-500)', boxShadow: on ? 'inset 0 0 0 1px var(--hajir-navy-500)' : 'inset 0 0 0 1px var(--line-200)' }}>
            {it.label}
            <span style={{ minWidth: 22, height: 22, padding: '0 6px', borderRadius: 'var(--radius-13)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, background: on ? 'var(--hajir-navy-500)' : 'var(--surface-100)', color: on ? '#fff' : 'var(--ink-700)' }}>{it.count}</span>
          </button>
        );
      })}
    </div>
  );
}

const fieldShell = { position: 'relative', width: '100%' };
const floatLabel = { position: 'absolute', left: 10, top: -8, padding: '0 4px', background: 'var(--surface-0)', fontSize: 12, lineHeight: '16px', color: 'var(--ink-700)', zIndex: 1 };

export function Dropdown({ label, value, options, open, onSelect, onToggle, style }) {
  return (
    <div style={{ ...fieldShell, ...style }}>
      <span style={floatLabel}>{label}</span>
      <button type="button" onClick={onToggle} aria-haspopup="listbox" aria-expanded={open}
        style={{ width: '100%', height: 42, padding: '0 12px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-6)', background: 'var(--surface-0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: 14, letterSpacing: 'var(--ls-normal)', color: value ? 'var(--text-primary)' : 'var(--text-placeholder)', boxShadow: open ? 'var(--ring-focus)' : 'inset 0 0 0 1px var(--line-200)' }}>
        <span>{value || 'Select'}</span>
        <Icon name="IconParkOutlineDown" size={16} style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div role="listbox" style={{ position: 'absolute', left: 0, right: 0, top: 46, maxHeight: 220, overflowY: 'auto', background: 'var(--surface-0)', borderRadius: 'var(--radius-7)', boxShadow: 'var(--shadow-menu)', padding: 6, zIndex: 5 }}>
          {options.map(o => (
            <div key={o} role="option" aria-selected={o === value} onClick={() => onSelect(o)}
              style={{ height: 36, padding: '0 10px', borderRadius: 'var(--radius-4)', display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer', color: o === value ? 'var(--hajir-navy-500)' : 'var(--text-primary)', background: o === value ? 'var(--navy-tint)' : 'transparent' }}
              onMouseEnter={e => { if (o !== value) e.currentTarget.style.background = 'var(--surface-50)'; }}
              onMouseLeave={e => { if (o !== value) e.currentTarget.style.background = 'transparent'; }}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export function InputField({ label, placeholder, type = 'text', value, onChange }) {
  return (
    <label style={{ ...fieldShell, display: 'block' }}>
      <span style={floatLabel}>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', height: 42, padding: '0 12px', border: 'none', outline: 'none', borderRadius: 'var(--radius-6)', boxShadow: 'inset 0 0 0 1px var(--line-200)', fontFamily: 'var(--font-ui)', fontSize: 14, letterSpacing: 'var(--ls-normal)', color: 'var(--text-primary)', background: 'var(--surface-0)' }} />
    </label>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label style={{ position: 'relative', display: 'block' }}>
      <span style={floatLabel}>{label}</span>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width: '100%', resize: 'vertical', border: 'none', outline: 'none', borderRadius: 8, boxShadow: 'inset 0 0 0 1px var(--line-200)', padding: '14px 12px', fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: '20px', color: 'var(--text-primary)' }} />
    </label>
  );
}

export function RadioButton({ selected }) {
  return (
    <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--surface-0)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: selected ? 'var(--ring-radio-selected)' : 'var(--ring-control)' }}>
      {selected && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--hajir-navy-500)' }} />}
    </span>
  );
}

export function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: 'var(--text-primary)' }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{ width: 16, height: 16, flexShrink: 0, borderRadius: 'var(--radius-4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: checked ? 'var(--hajir-navy-500)' : 'var(--surface-0)', color: '#fff', boxShadow: checked ? 'none' : 'var(--ring-control)' }}>
        {checked && <Icon name="QlementineIconsCheckTickSmall" size={14} />}
      </span>
      {label}
    </label>
  );
}

const MSG = { info: 'var(--hajir-blue-400)', warning: 'var(--warning-500)', error: 'var(--danger-500)', success: 'var(--success-500)' };
export function Message({ type = 'info', children }) {
  return (
    <span style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, lineHeight: '20px', letterSpacing: 'var(--ls-loose)', color: MSG[type] }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5h.01" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

export function Toast({ children, onDismiss }) {
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--radius-6)', background: 'var(--surface-0)', boxShadow: 'var(--shadow-menu), inset 0 0 0 1px var(--success-500)', color: 'var(--success-500)', fontSize: 14, fontWeight: 500 }}>
      <Icon name="QlementineIconsCheckTickSmall" size={18} />
      <span style={{ color: 'var(--text-primary)' }}>{children}</span>
      <button onClick={onDismiss} aria-label="Dismiss" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', color: 'var(--icon-default)' }}><Icon name="IcRoundClose" size={16} /></button>
    </div>
  );
}

export function Avatar({ size = 32 }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: 'var(--hajir-blue-050)', color: 'var(--hajir-navy-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>SS</span>;
}
