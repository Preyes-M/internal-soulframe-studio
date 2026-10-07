import React, { useEffect, useRef, useState } from 'react';
import Input from '../../../components/ui/Input';
import { normalizePhone } from '../../../services/supabaseService';

const findClients = (clients, query, mode) => {
  const text = String(query || '').trim();
  if (mode === 'phone') {
    const digits = text.replace(/\D/g, '');
    if (digits.length < 3) return [];
    return clients.filter((c) => normalizePhone(c?.phone).includes(normalizePhone(digits)));
  }
  if (text.length < 2) return [];
  const lower = text.toLowerCase();
  return clients.filter((c) => c?.name?.toLowerCase()?.includes(lower));
};

// Input that suggests existing clients while typing a phone number (mode="phone") or name (mode="name")
const ClientPhoneLookup = ({ mode = 'phone', label, type = 'text', placeholder, value, clients, onChange, onSelectClient, error }) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef(null);

  const matches = findClients(clients || [], value, mode).slice(0, 6);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const select = (client) => {
    onSelectClient(client);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open || matches.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((i) => (i - 1 + matches.length) % matches.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      select(matches[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        label={label}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e?.target?.value);
          setOpen(true);
          setHighlighted(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        error={error}
        autoComplete="off"
        required
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {matches.map((client, index) => (
            <li
              key={client?.id}
              onMouseDown={(e) => {
                e.preventDefault();
                select(client);
              }}
              onMouseEnter={() => setHighlighted(index)}
              className={`px-3 py-2 cursor-pointer flex items-center justify-between gap-3 ${
                index === highlighted ? 'bg-muted' : 'hover:bg-muted'
              }`}
            >
              <span className="text-sm font-medium text-foreground truncate">{client?.name}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{client?.phone || 'No phone'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientPhoneLookup;
