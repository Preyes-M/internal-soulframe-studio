import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import ClientStatusBadge from './ClientStatusBadge';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatDate } from '../../../utils/timeFormat';

const ClientTableRow = ({ client, onEdit, onDelete, onViewDetails }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(client);

  const handleSave = () => {
    onEdit(editedClient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedClient(client);
    setIsEditing(false);
  };



  if (isEditing) {
    return (
      <>
        <td className="px-4 py-3">
          <input
            type="text"
            value={editedClient?.name}
            onChange={(e) =>
              setEditedClient({ ...editedClient, name: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="tel"
            value={editedClient?.phone}
            onChange={(e) =>
              setEditedClient({ ...editedClient, phone: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="email"
            value={editedClient?.email}
            onChange={(e) =>
              setEditedClient({ ...editedClient, email: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="text"
            value={editedClient?.instagram}
            onChange={(e) =>
              setEditedClient({ ...editedClient, instagram: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="tel"
            value={editedClient?.whatsapp}
            onChange={(e) =>
              setEditedClient({ ...editedClient, whatsapp: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </td>
        <td className="px-4 py-3">
          <select
            value={editedClient?.status}
            onChange={(e) =>
              setEditedClient({ ...editedClient, status: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Lead">Lead</option>
            <option value="Booked">Booked</option>
            <option value="Shoot Done">Shoot Done</option>
            <option value="Editing">Editing</option>
            <option value="Delivered">Delivered</option>
          </select>
        </td>
        <td className="px-4 py-3 text-sm text-foreground">
          {formatDate(editedClient?.lastContact)}
        </td>
        <td className="px-4 py-3 text-sm font-medium text-foreground">
          {formatCurrency(editedClient?.projectValue)}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="p-1 hover:bg-success/20 rounded transition-colors duration-200"
              aria-label="Save changes"
            >
              <Icon name="Check" size={18} color="var(--color-success)" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-error/20 rounded transition-colors duration-200"
              aria-label="Cancel editing"
            >
              <Icon name="X" size={18} color="var(--color-error)" />
            </button>
          </div>
        </td>
      </>
    );
  }

  return (
    <>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={client?.avatar}
              alt={client?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-foreground">
            {client?.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-foreground">{client?.phone}</td>
      <td className="px-4 py-3 text-sm text-foreground">{client?.email}</td>
      <td className="px-4 py-3">
        <a
          href={`https://instagram.com/${client?.instagram?.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1"
        >
          {client?.instagram}
          <Icon name="ExternalLink" size={14} />
        </a>
      </td>
      <td className="px-4 py-3">
        <a
          href={`https://wa.me/${client?.whatsapp?.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-success hover:text-success/80 transition-colors duration-200 flex items-center gap-1"
        >
          {client?.whatsapp}
          <Icon name="MessageCircle" size={14} />
        </a>
      </td>
      <td className="px-4 py-3">
        <ClientStatusBadge status={client?.status} />
      </td>
      <td className="px-4 py-3 text-sm text-foreground">
        {formatDate(client?.lastContact)}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-foreground">
        {formatCurrency(client?.projectValue)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(client)}
            className="p-1 hover:bg-primary/20 rounded transition-colors duration-200"
            aria-label="View client details"
          >
            <Icon name="Eye" size={18} color="var(--color-primary)" />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-secondary/20 rounded transition-colors duration-200"
            aria-label="Edit client"
          >
            <Icon name="Edit" size={18} color="var(--color-secondary)" />
          </button>
          <button
            onClick={() => onDelete(client?.id)}
            className="p-1 hover:bg-error/20 rounded transition-colors duration-200"
            aria-label="Delete client"
          >
            <Icon name="Trash2" size={18} color="var(--color-error)" />
          </button>
        </div>
      </td>
    </>
  );
};

export default ClientTableRow;