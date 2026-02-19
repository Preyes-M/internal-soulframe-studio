import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import ClientStatusBadge from './ClientStatusBadge';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatDate } from '../../../utils/timeFormat';

const ClientDetailPanel = ({ client, onClose }) => {

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 lg:relative lg:inset-auto w-full lg:w-96 bg-card border-l border-border overflow-y-auto z-50">
      <div className="sticky top-0 bg-card border-b border-border p-4 lg:p-6 flex items-center justify-between">
        <h3 className="text-base lg:text-lg font-semibold text-foreground">
          Client Details
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          iconName="X"
          iconSize={20}
        />
      </div>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col items-center text-center pb-6 border-b border-border">
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden mb-4 bg-muted">
            <Image
              src={client?.avatar}
              alt={client?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="text-lg lg:text-xl font-semibold text-foreground mb-2">
            {client?.name}
          </h4>
          <ClientStatusBadge status={client?.status} />
        </div>

        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Contact Information
          </h5>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Icon
                name="Phone"
                size={18}
                className="text-muted-foreground mt-0.5"
              />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm text-foreground">{client?.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon
                name="Mail"
                size={18}
                className="text-muted-foreground mt-0.5"
              />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">{client?.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon
                name="Instagram"
                size={18}
                className="text-muted-foreground mt-0.5"
              />
              <div>
                <p className="text-xs text-muted-foreground">Instagram</p>
                <a
                  href={`https://instagram.com/${client?.instagram?.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  {client?.instagram}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon
                name="MessageCircle"
                size={18}
                className="text-muted-foreground mt-0.5"
              />
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <a
                  href={`https://wa.me/${client?.whatsapp?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-success hover:text-success/80 transition-colors duration-200"
                >
                  {client?.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h5 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Project Information
          </h5>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Value
              </span>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(client?.projectValue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Last Contact
              </span>
              <span className="text-sm text-foreground">
                {formatDate(client?.lastContact)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Shoot Types
              </span>
              <span className="text-sm text-foreground">
                {client?.shootTypes?.join(', ')}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h5 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Project Timeline
          </h5>
          <div className="space-y-3">
            {client?.timeline?.map((event, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      event?.completed ? 'bg-success' : 'bg-muted-foreground'
                    }`}
                  />
                  {index < client?.timeline?.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-foreground">
                    {event?.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(event?.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h5 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Communication History
          </h5>
          <div className="space-y-3">
            {client?.communications?.map((comm) => (
              <div
                key={comm?.id}
                className="p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-start gap-2 mb-2">
                  <Icon
                    name={comm?.type === 'call' ? 'Phone' : 'Mail'}
                    size={16}
                    className="text-muted-foreground mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {comm?.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateTime(comm?.date)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground">{comm?.notes}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h5 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Attachments
          </h5>
          <div className="space-y-2">
            {client?.attachments?.map((file) => (
              <div
                key={file?.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name="FileText"
                    size={20}
                    className="text-muted-foreground"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {file?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file?.size}
                    </p>
                  </div>
                </div>
                <button
                  className="p-1 hover:bg-primary/20 rounded transition-colors duration-200"
                  aria-label="Download file"
                >
                  <Icon name="Download" size={18} color="var(--color-primary)" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <Button variant="default" fullWidth iconName="MessageSquare">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPanel;