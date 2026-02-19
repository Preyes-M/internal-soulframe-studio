import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const QuickAddForm = ({ onAdd, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'lights',
    quantity: 1,
    estimatedPrice: 0,
    vendor: '',
    notes: '',
    isPriority: false,
    status: 'needed'
  });

  const categoryOptions = categories?.map(cat => ({
    value: cat?.id,
    label: cat?.name
  }));

  const itemSuggestions = {
    lights: ['Softbox 60x90cm', 'LED Panel 600W', 'Ring Light 18"', 'Godox SL-60W', 'Light Stand 2.8m'],
    mics: ['Rode VideoMic Pro', 'Wireless Lavalier', 'Shotgun Mic', 'Audio Recorder H4n', 'XLR Cable 10m'],
    backdrops: ['White Muslin 3x6m', 'Green Screen 2x3m', 'Black Velvet 3x6m', 'Textured Canvas', 'Backdrop Stand'],
    consumables: ['AA Batteries Pack', 'Memory Cards 64GB', 'Gaffer Tape', 'Cleaning Kit', 'Cable Ties']
  };

  const vendorSuggestions = [
    'Amazon India',
    'Flipkart',
    'B&H Photo Video',
    'Vistek India',
    'Camera House Bangalore',
    'Studio Equipment Co.',
    'Local Electronics Store'
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!formData?.name?.trim()) return;

    onAdd({
      ...formData,
      id: crypto.randomUUID(),
      addedDate: new Date()?.toISOString()
    });

    setFormData({
      name: '',
      category: 'lights',
      quantity: 1,
      estimatedPrice: 0,
      vendor: '',
      notes: '',
      isPriority: false,
      status: 'needed'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
          <Icon name="Plus" size={20} className="text-primary" />
        </div>
        <h2 className="text-lg md:text-xl font-semibold text-foreground">Quick Add Item</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Item Name"
          required
          value={formData?.name}
          onChange={(e) => setFormData({ ...formData, name: e?.target?.value })}
          placeholder="Enter item name"
          description="Start typing for suggestions"
        />

        {formData?.name && itemSuggestions?.[formData?.category] && (
          <div className="flex flex-wrap gap-2">
            {itemSuggestions?.[formData?.category]?.filter(item => item?.toLowerCase()?.includes(formData?.name?.toLowerCase()))?.slice(0, 3)?.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, name: suggestion })}
                  className="px-3 py-1.5 text-xs bg-muted hover:bg-muted-foreground/20 text-foreground rounded-lg transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
          </div>
        )}

        <Select
          label="Category"
          required
          options={categoryOptions}
          value={formData?.category}
          onChange={(value) => setFormData({ ...formData, category: value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Quantity"
            type="number"
            required
            min="1"
            value={formData?.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e?.target?.value) || 1 })}
          />

          <Input
            label="Estimated Price (₹)"
            type="number"
            required
            min="0"
            value={formData?.estimatedPrice}
            onChange={(e) => setFormData({ ...formData, estimatedPrice: parseInt(e?.target?.value) || 0 })}
          />
        </div>

        <Input
          label="Vendor"
          value={formData?.vendor}
          onChange={(e) => setFormData({ ...formData, vendor: e?.target?.value })}
          placeholder="Select or enter vendor"
        />

        {formData?.vendor && (
          <div className="flex flex-wrap gap-2">
            {vendorSuggestions?.filter(vendor => vendor?.toLowerCase()?.includes(formData?.vendor?.toLowerCase()))?.slice(0, 4)?.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, vendor: suggestion })}
                  className="px-3 py-1.5 text-xs bg-muted hover:bg-muted-foreground/20 text-foreground rounded-lg transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
          </div>
        )}

        <Input
          label="Notes"
          value={formData?.notes}
          onChange={(e) => setFormData({ ...formData, notes: e?.target?.value })}
          placeholder="Additional details or specifications"
        />

        <Checkbox
          label="Mark as Priority"
          checked={formData?.isPriority}
          onChange={(e) => setFormData({ ...formData, isPriority: e?.target?.checked })}
        />

        <Button type="submit" variant="default" fullWidth iconName="Plus" iconPosition="left">
          Add to Shopping List
        </Button>
      </form>
    </div>
  );
};

export default QuickAddForm;