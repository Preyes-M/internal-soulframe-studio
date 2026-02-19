import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { formatDate } from '../../../utils/timeFormat';

const ProfessionalTableRow = ({ professional, onEdit, onDelete, onViewDetails }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfessional, setEditedProfessional] = useState(professional);

  const handleSave = () => {
    console.log('Saving edited professional:', editedProfessional);
    onEdit(professional, editedProfessional);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfessional(professional);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <>
        <td className="px-4 py-3">
          <input
            type="text"
            value={editedProfessional?.name}
            onChange={(e) =>
              setEditedProfessional({ ...editedProfessional, name: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="tel"
            value={editedProfessional?.phone}
            onChange={(e) =>
              setEditedProfessional({ ...editedProfessional, phone: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="email"
            value={editedProfessional?.email}
            onChange={(e) =>
              setEditedProfessional({ ...editedProfessional, email: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="text"
            value={editedProfessional?.instagram}
            onChange={(e) =>
              setEditedProfessional({ ...editedProfessional, instagram: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="tel"
            value={editedProfessional?.whatsapp}
            onChange={(e) =>
              setEditedProfessional({ ...editedProfessional, whatsapp: e?.target?.value })
            }
            className="w-full px-2 py-1 text-sm bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
      <td className="px-4 py-3 text-sm text-foreground">{professional?.starred && <Icon name="Star" size={14} color="var(--color-warning)" />}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={professional?.avatar}
              alt={professional?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-foreground">
            {professional?.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-foreground">{professional?.phone}</td>
      <td className="px-4 py-3 text-sm text-foreground">{professional?.email}</td>
      <td className="px-4 py-3">
        <a
          href={`https://instagram.com/${professional?.instagram?.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1"
        >
          {professional?.instagram}
          <Icon name="ExternalLink" size={14} />
        </a>
      </td>
      <td className="px-4 py-3">
        <a
          href={`https://wa.me/${professional?.whatsapp?.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-success hover:text-success/80 transition-colors duration-200 flex items-center gap-1"
        >
          {professional?.whatsapp}
          <Icon name="MessageCircle" size={14} />
        </a>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(professional)}
            className="p-1 hover:bg-primary/20 rounded transition-colors duration-200"
            aria-label="View professional details"
          >
            <Icon name="Eye" size={18} color="var(--color-primary)" />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-secondary/20 rounded transition-colors duration-200"
            aria-label="Edit professional"
          >
            <Icon name="Edit" size={18} color="var(--color-secondary)" />
          </button>
          <button
            onClick={() => onDelete(professional?.id)}
            className="p-1 hover:bg-error/20 rounded transition-colors duration-200"
            aria-label="Delete professional"
          >
            <Icon name="Trash2" size={18} color="var(--color-error)" />
          </button>
        </div>
      </td>
    </>
  );
};

export default ProfessionalTableRow;