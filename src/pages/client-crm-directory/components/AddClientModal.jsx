import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Constants } from '../../../types/supabase';
import { humanize } from '../../../utils/text';
import { lookupService } from '../../../services/supabaseService';

const AddClientModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    instagram: '',
    whatsapp: '',
    status: '',
    shootType: '',
    projectValue: '',
    notes: '',
  });

  const [statusOptions, setStatusOptions] = useState([]);
  const [shootTypeOptions, setShootTypeOptions] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [shootLoading, setShootLoading] = useState(false);

  const [errors, setErrors] = useState({});


  // Fetch enum values from the DB at runtime via lookupService. Falls back to generated Constants on error.
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;

    const fetchEnums = async () => {
      setStatusLoading(true);
      setShootLoading(true);
      try {
        const [statusData, shootData] = await Promise.all([
          lookupService.getEnumValues('client_status'),
          lookupService.getEnumValues('shoot_type'),
        ]);

        if (!mounted) return;

        const statusOpts = (statusData || []).map((v) => ({ value: v, label: humanize(v) }));
        const shootOpts = (shootData || []).map((v) => ({ value: v, label: humanize(v) }));

        setStatusOptions(statusOpts);
        setShootTypeOptions(shootOpts);

        if (!formData?.status && statusOpts?.length) setFormData((f) => ({ ...f, status: statusOpts[0].value }));
        if (!formData?.shootType && shootOpts?.length) setFormData((f) => ({ ...f, shootType: shootOpts[0].value }));
      } catch (err) {
        console.error('Failed to fetch enum values from DB:', err);
        const fallback = (Constants?.public?.Enums?.client_status || []).map((v) => ({ value: v, label: humanize(v) }));
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

    fetchEnums();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // shootTypeOptions are fetched from the DB at runtime via RPC and stored in state
  

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors?.[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+91\d{10}$/?.test(formData?.phone?.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format (+91XXXXXXXXXX)';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData?.shootType) {
      newErrors.shootType = 'Shoot type is required';
    }

    if (!formData?.projectValue) {
      newErrors.projectValue = 'Project value is required';
    } else if (isNaN(formData?.projectValue) || Number(formData?.projectValue) <= 0) {
      newErrors.projectValue = 'Invalid project value';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (validateForm()) {
      const newClient = {
        id:  crypto.randomUUID(),
        name: formData?.name,
        phone: formData?.phone,
        email: formData?.email,
        instagram: formData?.instagram || '@username',
        whatsapp: formData?.whatsapp || formData?.phone,
        status: formData?.status,
        shootTypes: [formData?.shootType],
        projectValue: Number(formData?.projectValue),
        lastContact: new Date()?.toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData?.name}`,
        avatarAlt: `Profile picture of ${formData?.name} with professional attire and friendly expression`,
        timeline: [
          {
            title: 'Client Added',
            date: new Date()?.toISOString(),
            completed: true,
          },
        ],
        communications: [],
        attachments: [],
      };

      onAdd(newClient);
      setFormData({
        name: '',
        phone: '',
        email: '',
        instagram: '',
        whatsapp: '',
        status: 'Lead',
        shootType: '',
        projectValue: '',
        notes: '',
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 lg:p-6 flex items-center justify-between">
          <h3 className="text-lg lg:text-xl font-semibold text-foreground">
            Add New Client
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter client name"
              value={formData?.name}
              onChange={(e) => handleChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 XXXXXXXXXX"
              value={formData?.phone}
              onChange={(e) => handleChange('phone', e?.target?.value)}
              error={errors?.phone}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="client@example.com"
            value={formData?.email}
            onChange={(e) => handleChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Instagram Handle"
              type="text"
              placeholder="@username"
              value={formData?.instagram}
              onChange={(e) => handleChange('instagram', e?.target?.value)}
            />

            <Input
              label="WhatsApp Number"
              type="tel"
              placeholder="+91 XXXXXXXXXX"
              value={formData?.whatsapp}
              onChange={(e) => handleChange('whatsapp', e?.target?.value)}
              description="Leave blank to use phone number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Client Status"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => handleChange('status', value)}
              required
              loading={statusLoading}
            />

            <Select
              label="Shoot Type"
              options={shootTypeOptions}
              value={formData?.shootType}
              onChange={(value) => handleChange('shootType', value)}
              error={errors?.shootType}
              required
              loading={shootLoading}
            />
          </div>

          <Input
            label="Project Value (₹)"
            type="number"
            placeholder="50000"
            value={formData?.projectValue}
            onChange={(e) => handleChange('projectValue', e?.target?.value)}
            error={errors?.projectValue}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes
            </label>
            <textarea
              value={formData?.notes}
              onChange={(e) => handleChange('notes', e?.target?.value)}
              placeholder="Additional notes about the client..."
              rows={4}
              className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              type="submit"
              variant="default"
              fullWidth
              iconName="UserPlus"
            >
              Add Client
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;