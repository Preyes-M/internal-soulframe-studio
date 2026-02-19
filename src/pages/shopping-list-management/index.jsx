import React, { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { Helmet } from 'react-helmet';
import Layout from '../../components/Layout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ShoppingListItem from './components/ShoppingListItem';
import QuickAddForm from './components/QuickAddForm';
import BudgetTracker from './components/BudgetTracker';
import PurchaseHistory from './components/PurchaseHistory';
import CategoryFilter from './components/CategoryFilter';
import BulkActionsBar from './components/BulkActionsBar';
import { inventoryService } from '../../services/supabaseService';

const ShoppingListManagement = () => {
  const categories = [
    { id: 'lights', name: 'Lights', icon: 'Lightbulb' },
    { id: 'mics', name: 'Mics', icon: 'Mic' },
    { id: 'backdrops', name: 'Backdrops', icon: 'Image' },
    { id: 'consumables', name: 'Consumables', icon: 'Package' }
  ];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);



  const sortOptions = [
    { value: 'priority', label: 'Priority First' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price', label: 'Price (Low to High)' },
    { value: 'status', label: 'Status' },
    { value: 'date', label: 'Recently Added' }
  ];

  const getItemCounts = () => {
    const counts = { all: items?.length };
    categories?.forEach(cat => {
      counts[cat.id] = items?.filter(item => item?.category === cat?.id)?.length;
    });
    return counts;
  };

  const filteredAndSortedItems = () => {
    let filtered = items;

    if (activeCategory !== 'all') {
      filtered = filtered?.filter(item => item?.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filtered?.filter(item =>
        item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        item?.vendor?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        item?.notes?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    const sorted = [...filtered]?.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          if (a?.isPriority && !b?.isPriority) return -1;
          if (!a?.isPriority && b?.isPriority) return 1;
          return 0;
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'price':
          return (a?.estimatedPrice * a?.quantity) - (b?.estimatedPrice * b?.quantity);
        case 'status':
          const statusOrder = { needed: 0, ordered: 1, received: 2, cancelled: 3 };
          return statusOrder?.[a?.status] - statusOrder?.[b?.status];
        case 'date':
          return new Date(b.addedDate) - new Date(a.addedDate);
        default:
          return 0;
      }
    });

    return sorted;
  };

  const groupedItems = () => {
    let filtered = filteredAndSortedItems();
    const grouped = {};

    categories?.forEach(cat => {
      grouped[cat.id] = filtered?.filter(item => item?.category === cat?.id);
    });

    return grouped;
  };

  useEffect(() => {
    loadItems();
  }, []);

  const { addToast } = useToast();



  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await inventoryService?.getAll();
      setItems(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load inventory:', err);
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      const newItem = await inventoryService?.create(itemData);
      if (newItem) {
        setItems([newItem, ...items]);
      }
    } catch (err) {
      console.error('Failed to add item:', err);
      setError('Failed to add item');
    }
  };

  const handleUpdateItem = async (itemId, updates) => {
    // Optimistic update: apply changes locally immediately and rollback on failure
    let previousItems = null;
    setItems(prev => {
      previousItems = prev;
      return prev?.map(i => (i?.id === itemId ? { ...i, ...updates } : i));
    });

    try {
      const updated = await inventoryService?.update(itemId, updates);
      if (updated) {
        setItems(prev => prev?.map(i => (i?.id === updated?.id ? updated : i)));
        addToast({ message: 'Item saved', type: 'success' });
      } else {
        throw new Error('No updated item returned from server');
      }
    } catch (err) {
      console.error('Failed to update item:', err);
      // Roll back to previous state
      setItems(previousItems || []);
      addToast({ message: 'Failed to save item changes', type: 'error', details: err?.message || '' });
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const success = await inventoryService?.delete(itemId);
      if (success) {
        setItems(items?.filter(i => i?.id !== itemId));
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
      setError('Failed to delete item');
    }
  };

  const handleTogglePriority = (itemId) => {
    setItems(items?.map(item =>
      item?.id === itemId ? { ...item, isPriority: !item?.isPriority } : item
    ));
  };

  const handleToggleSelect = (itemId) => {
    setSelectedItems(prev =>
      prev?.includes(itemId)
        ? prev?.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkStatusChange = (newStatus) => {
    setItems(items?.map(item =>
      selectedItems?.includes(item?.id) ? { ...item, status: newStatus } : item
    ));
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedItems?.length} selected items?`)) {
      setItems(items?.filter(item => !selectedItems?.includes(item?.id)));
      setSelectedItems([]);
    }
  };

  const handleExport = () => {
    const exportData = filteredAndSortedItems()?.map(item => ({
      Name: item?.name,
      Category: categories?.find(c => c?.id === item?.category)?.name,
      Quantity: item?.quantity,
      'Price (₹)': item?.estimatedPrice,
      'Total (₹)': item?.estimatedPrice * item?.quantity,
      Vendor: item?.vendor,
      Status: item?.status,
      Priority: item?.isPriority ? 'Yes' : 'No',
      Notes: item?.notes
    }));

    const csv = [
      Object.keys(exportData?.[0])?.join(','),
      ...exportData?.map(row => Object.values(row)?.join(','))
    ]?.join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping-list-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
  };

  const displayItems = activeCategory === 'all' ? groupedItems() : { [activeCategory]: filteredAndSortedItems() };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading inventory...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping List Management - StudioFlow Bangalore</title>
        <meta name="description" content="Manage studio equipment procurement and inventory shopping list with budget tracking and vendor management" />
      </Helmet>
      <Layout>
        <div className="min-h-screen">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2">
              Shopping List Management
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Track equipment needs, manage purchases, and monitor procurement budget
            </p>
          </div>

          <div className="mb-6">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              itemCounts={getItemCounts()}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search items, vendors, or notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      className="w-full"
                    />
                  </div>

                  <Select
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-full sm:w-48"
                  />

                  <Button
                    variant="outline"
                    onClick={handleExport}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Package" size={16} />
                    <span>{filteredAndSortedItems()?.length} items</span>
                  </div>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                    iconName={showQuickAdd ? "X" : "Plus"}
                    iconPosition="left"
                    className="lg:hidden"
                  >
                    {showQuickAdd ? 'Close' : 'Quick Add'}
                  </Button>
                </div>

                {showQuickAdd && (
                  <div className="mb-6 lg:hidden">
                    <QuickAddForm onAdd={handleAddItem} categories={categories} />
                  </div>
                )}
              </div>

              {Object.entries(displayItems)?.map(([categoryId, categoryItems]) => {
                if (categoryItems?.length === 0) return null;

                const category = categories?.find(c => c?.id === categoryId);

                return (
                  <div key={categoryId} className="mb-6">
                    {activeCategory === 'all' && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                          <Icon name={category?.icon} size={20} className="text-primary" />
                        </div>
                        <h2 className="text-lg md:text-xl font-semibold text-foreground">
                          {category?.name}
                        </h2>
                        <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                          {categoryItems?.length}
                        </span>
                      </div>
                    )}
                    <div className="space-y-4">
                      {categoryItems?.map(item => (
                        <ShoppingListItem
                          key={item?.id}
                          item={item}
                          onUpdate={handleUpdateItem}
                          onDelete={handleDeleteItem}
                          onTogglePriority={handleTogglePriority}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredAndSortedItems()?.length === 0 && (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <Icon name="ShoppingCart" size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {searchQuery ? 'Try adjusting your search' : 'Start by adding items to your shopping list'}
                  </p>
                  <Button
                    variant="default"
                    onClick={() => setShowQuickAdd(true)}
                    iconName="Plus"
                    iconPosition="left"
                    className="lg:hidden"
                  >
                    Add First Item
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="hidden lg:block">
                <QuickAddForm onAdd={handleAddItem} categories={categories} />
              </div>

              <BudgetTracker items={items} />

              <PurchaseHistory items={items} />
            </div>
          </div>

          <BulkActionsBar
            selectedCount={selectedItems?.length}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkDelete={handleBulkDelete}
            onClearSelection={() => setSelectedItems([])}
          />
        </div>
      </Layout>
    </>
  );
};

export default ShoppingListManagement;