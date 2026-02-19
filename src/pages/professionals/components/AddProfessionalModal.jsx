import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Constants } from '../../../types/supabase';
import { humanize } from '../../../utils/text';
import { lookupService } from '../../../services/supabaseService';

const AddProfessionalModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    starred: false,
    work_name: '',
    phone: '',
    email: '',
    instagram: '',
    whatsapp: '',
    category: ''
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [errors, setErrors] = useState({});


  // Fetch enum values from the DB at runtime via lookupService. Falls back to generated Constants on error.
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;

    const fetchEnums = async () => {
      setCategoryLoading(true);
      try {
        const categoryData  = await lookupService.getEnumValues('professionals_category');
        if (!mounted) return;
        console.log('Fetched category options from DB:', categoryData);
        const categoryOpts = (categoryData || []).map((v) => ({ value: v, label: humanize(v) }));
        setCategoryOptions(categoryOpts);
        if (!formData?.category && categoryOpts?.length) setFormData((f) => ({ ...f, category: categoryOpts[0].value }));
      } catch (err) {
        console.error('Failed to fetch enum values from DB:', err);
        const fallback = (Constants?.public?.Enums?.professionals_category || []).map((v) => ({ value: v, label: humanize(v) }));
        setCategoryOptions(fallback);
        if (!formData?.category && fallback?.length) setFormData((f) => ({ ...f, category: fallback[0].value }));
      } finally {
        setCategoryLoading(false);
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

    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (validateForm()) {
      const newProfessional = {
        id:  crypto.randomUUID(),
        starred: formData?.starred,
        name: formData?.name,
        phone: formData?.phone,
        email: formData?.email,
        instagram: formData?.instagram || '@username',
        whatsapp: formData?.whatsapp || formData?.phone,
        category: formData?.category,
        lastContact: new Date()?.toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData?.name}`,
        avatarAlt: `Profile picture of ${formData?.name} with professional attire and friendly expression`
      };

      onAdd(newProfessional);
      setFormData({
        starred: false,
        name: '',
        phone: '',
        email: '',
        instagram: '',
        whatsapp: '',
        status: 'Lead',
        category: '',
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
            Add New Professional
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
              placeholder="Enter professional name"
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
            placeholder="professional@example.com"
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
              label="Professional Category"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => handleChange('category', value)}
              required
              loading={categoryLoading}
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              type="submit"
              variant="default"
              fullWidth
              iconName="UserPlus"
            >
              Add Data
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

export default AddProfessionalModal;