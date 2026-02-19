import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Constants } from '../../../types/supabase';
import { humanize } from '../../../utils/text';
import { lookupService } from '../../../services/supabaseService';

const ShoppingListItem = ({ item, onUpdate, onDelete, onTogglePriority }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const statusConfig = {
    needed: { label: 'Needed', color: 'bg-error text-error-foreground', icon: 'AlertCircle' },
    ordered: { label: 'Ordered', color: 'bg-warning text-warning-foreground', icon: 'Clock' },
    received: { label: 'Received', color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
    cancelled: { label: 'Cancelled', color: 'bg-muted text-muted-foreground', icon: 'XCircle' }
  };
  
  const [statusOptions, setStatusOptions] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);

  // Keep editedItem in sync if parent item changes
  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  // Fetch enum values from the DB at runtime via lookupService when entering edit mode. Falls back to generated Constants on error.
  useEffect(() => {
    if (!isEditing) return;
    let mounted = true;

    const fetchEnums = async () => {
      setStatusLoading(true);
      try {
        const statusData = await lookupService.getEnumValues('inventory_status');
        if (!mounted) return;
        const statusOpts = (statusData || []).map((v) => ({ value: v, label: humanize(v) }));

        setStatusOptions(statusOpts);

        // Ensure editedItem has a default status
        if ((!editedItem?.status || editedItem?.status === '') && statusOpts?.length) {
          setEditedItem((e) => e ? ({ ...e, status: statusOpts[0].value }) : e);
        }
      } catch (err) {
        console.error('Failed to fetch enum values from DB:', err);
        const fallback = (Constants?.public?.Enums?.inventory_status || []).map((v) => ({ value: v, label: humanize(v) }));
        setStatusOptions(fallback);
        if ((!editedItem?.status || editedItem?.status === '') && fallback?.length) {
          setEditedItem((e) => e ? ({ ...e, status: fallback[0].value }) : e);
        }
      } finally {
        setStatusLoading(false);
      }
    };
    fetchEnums();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, item]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { id, ...updates } = editedItem || {};
      await onUpdate(id, updates);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save item:', err);
      // Optionally show a toast / error state here
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const currentStatus = statusConfig?.[item?.status];

  if (isEditing) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Item Name"
            value={editedItem?.name}
            onChange={(e) => setEditedItem({ ...editedItem, name: e?.target?.value })}
            placeholder="Enter item name"
          />
          
          <Input
            label="Quantity"
            type="number"
            value={editedItem?.quantity}
            onChange={(e) => setEditedItem({ ...editedItem, quantity: parseInt(e?.target?.value) || 1 })}
            min="1"
          />
          
          <Input
            label="Estimated Price (₹)"
            type="number"
            value={editedItem?.estimatedPrice}
            onChange={(e) => setEditedItem({ ...editedItem, estimatedPrice: parseInt(e?.target?.value) || 0 })}
            min="0"
          />
          
          <Select
            label="Status"
            options={statusOptions}
            value={editedItem?.status}
            onChange={(value) => setEditedItem({ ...editedItem, status: value })}
            loading={statusLoading}
          />
          
          <Input
            label="Vendor"
            value={editedItem?.vendor}
            onChange={(e) => setEditedItem({ ...editedItem, vendor: e?.target?.value })}
            placeholder="Vendor name"
            className="md:col-span-2"
          />
          
          <Input
            label="Notes"
            value={editedItem?.notes}
            onChange={(e) => setEditedItem({ ...editedItem, notes: e?.target?.value })}
            placeholder="Additional notes"
            className="md:col-span-2"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button variant="default" onClick={handleSave} iconName="Check" iconPosition="left" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={handleCancel} iconName="X" iconPosition="left">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 hover:border-primary/50 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base md:text-lg font-semibold text-foreground">{item?.name}</h3>
            {item?.isPriority && (
              <span className="flex items-center gap-1 px-2 py-1 bg-error/20 text-error text-xs font-medium rounded">
                <Icon name="Flag" size={14} />
                Priority
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Package" size={16} />
              <span>Qty: {item?.quantity}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="IndianRupee" size={16} />
              <span className="font-medium text-foreground">₹{item?.estimatedPrice?.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Store" size={16} />
              <span>{item?.vendor}</span>
            </div>
          </div>
          
          {item?.notes && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item?.notes}</p>
          )}
          
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${currentStatus?.color}`}>
              <Icon name={currentStatus?.icon} size={14} />
              {currentStatus?.label}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTogglePriority(item?.id)}
            iconName={item?.isPriority ? "Flag" : "FlagOff"}
            className={item?.isPriority ? "text-error" : ""}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            iconName="Edit"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item?.id)}
            iconName="Trash2"
            className="text-error hover:text-error"
          />
        </div>
      </div>
    </div>
  );
};

export default ShoppingListItem;