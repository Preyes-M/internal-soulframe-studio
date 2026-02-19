import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { lookupService } from '../../../services/supabaseService';
import { Constants } from '../../../types/supabase';
import { humanize } from '../../../utils/text';

const BookingForm = ({ onAddBooking, editingBooking, onCancelEdit }) => {
  const initialTaskForm = {
    id: null,
    clientName: '',
    phone: '',
    duration: '',
    shootType: '',
    date: '',
    time: '',
    price: '',
    status: 'pending',
    paymentDone: false,
    invoiceSent: false,
    deliverables: '',
    advance: 0,
    gst: '',
    notes: '',
    location: '',
    costBreakdown: []
  };

  const [formData, setFormData] = useState(initialTaskForm);

  const [errors, setErrors] = useState({});
  const [statusOptions, setStatusOptions] = useState([]);
  const [shootTypeOptions, setShootTypeOptions] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [shootLoading, setShootLoading] = useState(false);
  const gross = parseFloat(formData?.price || 0);
  const totalCosts = (formData?.costBreakdown || []).reduce(
    (sum, item) => sum + parseFloat(item?.cost || 0),
    0
  );
  let netRevenue = gross - totalCosts;
  if(formData?.gst > 0) {
    netRevenue = Math.round(netRevenue - (netRevenue * formData.gst / 100)); // Assuming GST is in percentage
  }

  const addCostItem = () => {
    setFormData(prev => ({
      ...prev,
      costBreakdown: [...(prev?.costBreakdown || []), { label: '', cost: '', vendor: '' }]
    }));
  };
  const removeCostItem = (index) => {
    setFormData(prev => ({
      ...prev,
      costBreakdown: prev?.costBreakdown?.filter((_, i) => i !== index)
    }));
  };

  const updateCostItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      costBreakdown: prev?.costBreakdown?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  useEffect(() => {
    // fetch booking status enums
    const fetchBookingStatus = async () => {
      try {
        const [statusData, shootTypes] = await Promise.all([
          lookupService.getEnumValues('booking_status'),
          lookupService.getEnumValues('shoot_type'),
        ]);
        const opts = (statusData || []).map((v) => ({ value: v, label: humanize(v) }));
        const shootOpts = (shootTypes || []).map((v) => ({ value: v, label: humanize(v) }));
        if (!formData?.status && opts?.length) setFormData((f) => ({ ...f, status: opts[0].value }));
        if (!formData?.shootType && shootOpts?.length) setFormData((f) => ({ ...f, shootType: shootOpts[0].value }));
        setStatusOptions(opts);
        setShootTypeOptions(shootOpts);
      }
      catch (err) {
        console.error('Failed to fetch booking_status enums:', err);
        const fallback = (Constants?.public?.Enums?.booking_status || []).map((v) => ({ value: v, label: humanize(v) }));
        const fallbackShoot = (Constants?.public?.Enums?.shoot_type || []).map((v) => ({ value: v, label: humanize(v) }));
        setStatusOptions(fallback);
        setShootTypeOptions(fallbackShoot);
        if (!formData?.status && fallback?.length) setFormData((f) => ({ ...f, status: fallback[0].value }));
        if (!formData?.shootType && fallbackShoot?.length) setFormData((f) => ({ ...f, shootType: fallbackShoot[0].value }));
      } finally {
          setStatusLoading(false);
          setShootLoading(false);
      }
    };
      
    fetchBookingStatus();
    if (editingBooking) {
      console.log('Received edit booking, populating form with:', editingBooking);
      setFormData({
        id: editingBooking?.booking?.id || null,
        clientName: editingBooking?.booking.clientName || '',
        phone: editingBooking?.booking.phone || '',
        duration: editingBooking?.booking.duration?.toString() || '',
        shootType:  editingBooking?.booking.shootType || '',
        date: editingBooking?.booking.date ||  '',
        time: editingBooking?.booking.time ||  '',
        price: editingBooking?.booking.price?.toString() || '',
        gst: editingBooking?.booking.gst ||  false,
        status: editingBooking?.booking.status || statusOptions?.[0]?.value || 'pending',
        invoiceSent: editingBooking?.booking.invoiceSent || false,
        advance: editingBooking?.booking.advance || 0,
        deliverables: editingBooking?.booking.deliverables || '',
        paymentDone: editingBooking?.booking.paymentDone || false,
        location: editingBooking?.booking.location || '',
        notes: editingBooking?.booking.notes || '',
        costBreakdown: editingBooking?.costBreakdown || []
      });
    }
  }, [editingBooking]);

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: 'HALF DAY' },
    { value: 480, label: 'FULL DAY' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.clientName?.trim()) newErrors.clientName = 'Client name is required';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData?.duration) newErrors.duration = 'Duration is required';
    if (!formData?.shootType) newErrors.shootType = 'Shoot type is required';
    if (!formData?.date) newErrors.date = 'Date is required';
    if (!formData?.time) newErrors.time = 'Time is required';
    if (!formData?.status) newErrors.status = 'Status is required';
    if (!formData?.deliverables?.trim()) newErrors.deliverables = 'Deliverables are required';
    if (!formData?.location) newErrors.location = 'Location is required';
    if (formData.advance > formData.price) newErrors.advance = 'Advance cannot be greater than total price';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onAddBooking(formData);
      setFormData(initialTaskForm);
    }
  };

  const handleCancel = () => {
    setFormData(initialTaskForm);
    setErrors({});
    onCancelEdit?.();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
          <Icon name={editingBooking ? "Edit" : "CalendarPlus"} size={20} color="var(--color-primary)" />
        </div>
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          {editingBooking ? 'Edit Booking' : 'Quick Booking'}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Client Name"
          type="text"
          placeholder="Enter client name"
          value={formData?.clientName}
          onChange={(e) => handleChange('clientName', e?.target?.value)}
          error={errors?.clientName}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 XXXXX XXXXX"
          value={formData?.phone}
          onChange={(e) => handleChange('phone', e?.target?.value)}
          error={errors?.phone}
          required
        />

        <Select
          label="Shoot Type"
          placeholder="Select shoot type"
          options={shootTypeOptions}
          value={formData?.shootType}
          onChange={(value) => handleChange('shootType', value)}
          error={errors?.shootType}
          loading={shootLoading}
          required
        />

        <Select
          label="Duration"
          placeholder="Select duration"
          options={durationOptions}
          value={formData?.duration}
          onChange={(value) => handleChange('duration', value)}
          error={errors?.duration}
          required
        />

        <Input
          label="Date"
          type="date"
          value={formData?.date}
          onChange={(e) => handleChange('date', e?.target?.value)}
          error={errors?.date}
          required
        />

        <Input
          label="Time"
          type="time"
          value={formData?.time}
          onChange={(e) => handleChange('time', e?.target?.value)}
          error={errors?.time}
          required
        />

        <Input
          label="Location"
          type="text"
          placeholder="Enter location"
          value={formData?.location}
          onChange={(e) => handleChange('location', e?.target?.value)}
          error={errors?.location}
          required
        />

        <Input
          label="Customer Price"
          type="number"
          placeholder="Enter price"
          value={formData?.price}
          onChange={(e) => handleChange('price', e?.target?.value)}
          min="1000"
          step="100"
        />

        <Input
          label="Deliverables"
          type="text"
          placeholder="Enter deliverables"
          value={formData?.deliverables}
          onChange={(e) => handleChange('deliverables', e?.target?.value)}
          error={errors?.deliverables}
          required
        />

        <div className="flex items-center justify-between">
          <Input
           label="GST"
            type="number"
            placeholder="Enter GST%"
            value={formData?.gst}
            onChange={(e) => handleChange('gst', e?.target?.value?.replace('%', ''))}
          />

          <Input
           label="Advance"
            type="number"
            placeholder="Advance amount"
            value={formData?.advance}
            onChange={(e) => handleChange('advance', e?.target?.value)}
          />
        </div>
    
        {/* Cost Breakdown Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-foreground">
              Cost Breakdown
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={addCostItem}
            >
              Add Item
            </Button>
          </div>
          
          {formData?.costBreakdown?.length > 0 && (
            <div className="space-y-2">
              {formData?.costBreakdown?.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="e.g., Videographer, Rentals, Equipment"
                      value={item?.label}
                      onChange={(e) => updateCostItem(index, 'label', e?.target?.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Cost"
                      value={item?.cost}
                      onChange={(e) => updateCostItem(index, 'cost', e?.target?.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Vendor"
                      value={item?.vendor}
                      onChange={(e) => updateCostItem(index, 'vendor', e?.target?.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCostItem(index)}
                    className="mt-2 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Icon name="Trash2" size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {formData?.costBreakdown?.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No cost items added. Click "Add Item" to break down costs.
            </p>
          )}
        </div>

        {/* Total Price Display */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Indicative Revenue</span>
            <span className="text-xl font-bold text-primary">
              ₹{netRevenue || '0.00'}
            </span>
          </div>
          {formData?.costBreakdown?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border space-y-1">
              {formData?.costBreakdown?.map((item, index) => (
                item?.label && item?.cost && (
                  <div key={index} className="flex justify-between text-xs text-muted-foreground">
                    <span>{item?.label}</span>
                    <span>₹{parseFloat(item?.cost || 0)?.toFixed(2)}</span>
                  </div>
                )
              ))}
            </div>
          )}
        </div>


        <Select
          label="Status"
          placeholder="Select status"
          options={statusOptions}
          value={formData?.status}
          onChange={(value) => handleChange('status', value)}
          error={errors?.status}
          required
        />

        <div className="flex items-center gap-2">
          <Checkbox
            id="paymentDone"
            checked={formData?.paymentDone}
             onChange={(e) => handleChange('paymentDone', e?.target?.checked)}
          />
          <label htmlFor="paymentDone" className="text-sm font-medium text-foreground cursor-pointer">
            Payment Received
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="invoiceSent"
            checked={formData?.invoiceSent}
             onChange={(e) => handleChange('invoiceSent', e?.target?.checked)}
          />
          <label htmlFor="invoiceSent" className="text-sm font-medium text-foreground cursor-pointer">
            Invoice Sent
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Notes (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows="3"
            placeholder="Add any special requirements or notes..."
            value={formData?.notes}
            onChange={(e) => handleChange('notes', e?.target?.value)}
          />
        </div>

        <Button type="submit" variant="default" fullWidth iconName={editingBooking ? "Check" : "Plus"} iconPosition="left">
          {editingBooking ? 'Update Booking' : 'Add Booking'}
        </Button>
        {editingBooking && (
          <Button 
            type="button" 
            variant="outline" 
            fullWidth 
            iconName="X" 
            iconPosition="left"
            onClick={handleCancel}
          >
            Cancel Edit
          </Button>
        )}
      </form>
    </div>
  );
};

export default BookingForm;