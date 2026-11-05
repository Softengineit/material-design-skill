// Material 3 button, icon button and outlined text field in React.
// Tokens come from material-tokens.css (imported once at the app root).
// CSS lives in react-button.css (same rules as starter.html, scoped to these class names).
import { forwardRef, useId } from 'react';
import './react-button.css';

const VARIANTS = ['filled', 'tonal', 'elevated', 'outlined', 'text'];

export const Button = forwardRef(function Button(
  { variant = 'filled', icon, children, className = '', ...rest },
  ref,
) {
  if (!VARIANTS.includes(variant)) variant = 'filled';
  return (
    <button ref={ref} className={`md-button md-button--${variant} ${className}`} {...rest}>
      {icon && (
        <span className="material-symbols-outlined" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="md-button__label">{children}</span>
    </button>
  );
});

// Icon-only buttons need an accessible name: the `label` prop is required.
export function IconButton({ icon, label, selected, ...rest }) {
  return (
    <button
      className="md-icon-button"
      aria-label={label}
      aria-pressed={selected === undefined ? undefined : selected}
      {...rest}
    >
      <span
        className="material-symbols-outlined"
        aria-hidden="true"
        style={{ fontVariationSettings: selected ? '"FILL" 1' : '"FILL" 0' }}
      >
        {icon}
      </span>
    </button>
  );
}

export function OutlinedTextField({ label, supportingText, error, value, onChange, ...rest }) {
  const id = useId();
  return (
    <div className="md-text-field" data-error={error ? '' : undefined}>
      <input
        id={id}
        placeholder=" "
        value={value}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={supportingText ? `${id}-help` : undefined}
        {...rest}
      />
      <label htmlFor={id}>{label}</label>
      {supportingText && (
        <div id={`${id}-help`} className="md-text-field__supporting">
          {supportingText}
        </div>
      )}
    </div>
  );
}

// Usage
// <Button variant="filled" icon="add" onClick={save}>Save</Button>
// <IconButton icon="favorite" label="Add to favorites" selected={liked} onClick={toggle} />
// <OutlinedTextField label="Email" value={email} onChange={e => setEmail(e.target.value)}
//   supportingText="We only use it to send the receipt" error={!valid} />
