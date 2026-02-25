/**
 * Honeypot Fields Component
 * 
 * Hidden fields that are invisible to humans but bots will fill them.
 * If any of these fields are filled, the submission is likely from a bot.
 * 
 * IMPORTANT: These fields must remain hidden via CSS, not display:none
 * as some bots can detect that. We use positioning off-screen instead.
 */

import { getHoneypotFields } from '@/lib/anti-spam';

export function HoneypotFields({ register, onChange }) {
  const { fields, hideClass } = getHoneypotFields();

  return (
    <div 
      aria-hidden="true" 
      className={hideClass}
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
        tabIndex: -1,
      }}
    >
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={`hp_${field.name}`}>{field.label}</label>
          {register ? (
            // For react-hook-form
            <input
              type={field.type}
              id={`hp_${field.name}`}
              autoComplete="off"
              tabIndex={-1}
              {...register(field.name)}
            />
          ) : (
            // For controlled forms
            <input
              type={field.type}
              id={`hp_${field.name}`}
              name={field.name}
              autoComplete="off"
              tabIndex={-1}
              onChange={onChange}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default HoneypotFields;
