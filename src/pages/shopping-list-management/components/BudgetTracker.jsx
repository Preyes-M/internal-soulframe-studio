import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { userService, inventoryService } from '../../../services/supabaseService';
import { useToast } from '../../../contexts/ToastContext';
import { useAuth } from '../../../contexts/AuthContext';

const BudgetTracker = ({ items }) => {
  const [budget, setBudget] = useState(null);
  const [loadingBudget, setLoadingBudget] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingBudget(true);
      const b = await inventoryService.getBudgetForMonth(currentMonth);
      if (!mounted) return;
      setBudget(b);
      setLoadingBudget(false);
    };
    load();
    return () => { mounted = false; };
  }, [currentMonth]);

  useEffect(() => {
    // check admin state
    let mounted = true;
    const check = async () => {
      const admin = await userService.isAdmin();
      if (!mounted) return;
      setIsAdmin(!!admin);
    };
    check();
    return () => { mounted = false; };
  }, []);

  const openSetModal = () => {
    setAmountInput(budget?.amount ? String(budget.amount) : '');
    setNoteInput(budget?.note || '');
    setShowModal(true);
  };

  const handleSetBudget = async () => {
    const amt = parseInt(amountInput?.replace(/\D/g, ''), 10);
    if (!amt || amt <= 0) {
      toast.addToast({ message: 'Please enter a valid amount', type: 'error' });
      return;
    }

    try {
      const newBudget = await inventoryService.setBudgetForMonth({ month: currentMonth, amount: amt, note: noteInput });
      if (newBudget) {
        setBudget(newBudget);
        setShowModal(false);
        toast.addToast({ message: 'Budget set for this month', type: 'success' });
      } else {
        toast.addToast({ message: 'Failed to set budget (maybe already set)', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      toast.addToast({ message: 'Failed to set budget', type: 'error', details: err?.message });
    }
  };

  const handleUpdateBudget = async () => {
    if (!budget) return;
    const amt = parseInt(amountInput?.replace(/\D/g, ''), 10);
    if (!amt || amt <= 0) {
      toast.addToast({ message: 'Please enter a valid amount', type: 'error' });
      return;
    }

    try {
      const updated = await inventoryService.updateBudget(budget?.id, { amount: amt, note: noteInput });
      if (updated) {
        setBudget(updated);
        setShowModal(false);
        toast.addToast({ message: 'Budget updated', type: 'success' });
      } else {
        toast.addToast({ message: 'Failed to update budget', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      toast.addToast({ message: 'Failed to update budget', type: 'error', details: err?.message });
    }
  };

  // Flag to determine whether to show the CTA-only view (no budget set)
  const showCTAOnly = !loadingBudget && !budget;
  const totalSpent = items?.filter(item => item?.status === 'received')?.reduce((sum, item) => sum + (item?.estimatedPrice * item?.quantity), 0);

  const totalPending = items?.filter(item => item?.status === 'needed' || item?.status === 'ordered')?.reduce((sum, item) => sum + (item?.estimatedPrice * item?.quantity), 0);

  const totalCommitted = totalSpent + totalPending;
  const effectiveMonthlyBudget = budget?.amount;
  const remaining = effectiveMonthlyBudget ? (effectiveMonthlyBudget - totalCommitted) : 0;
  const percentageUsed = effectiveMonthlyBudget ? ((totalCommitted / effectiveMonthlyBudget) * 100) : 0;

  const getStatusColor = () => {
    if (percentageUsed >= 90) return 'text-error';
    if (percentageUsed >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      {/* If no budget, show CTA card here so modal is part of same render tree */}
      {showCTAOnly ? (
        <div className="text-center">
          <h3 className="text-base font-semibold text-foreground mb-2">Monthly Budget not set</h3>
          <p className="text-sm text-muted-foreground mb-4">Set a budget for this month to track spending and get alerts.</p>
          <div className="flex justify-center">
            <button className="btn btn-primary" onClick={openSetModal}>Set Budget for {currentMonth}</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                <Icon name="IndianRupee" size={20} className="text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Budget Overview</h2>
            </div>

            <div>
              {!budget && !loadingBudget && (
                <button
                  className="text-sm text-primary underline"
                  onClick={openSetModal}
                >
                  Set budget for this month
                </button>
              )}

              {budget && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Set for {budget?.month}</span>
                  {isAdmin ? (
                    <button className="text-sm text-primary underline" onClick={openSetModal}>Edit</button>
                  ) : (
                    <span className="text-sm text-muted-foreground">(locked)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Monthly Budget</span>
                <span className="text-lg font-semibold text-foreground">
                  ₹{effectiveMonthlyBudget?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    percentageUsed >= 90 ? 'bg-error' :
                    percentageUsed >= 70 ? 'bg-warning': 'bg-success'
                  }`}
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {percentageUsed?.toFixed(1)}% Used
                </span>
                <span className="text-sm text-muted-foreground">
                  ₹{remaining?.toLocaleString('en-IN')} Remaining
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Spent</span>
                </div>
                <p className="text-xl md:text-2xl font-semibold text-foreground">
                  ₹{totalSpent?.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Clock" size={16} className="text-warning" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Pending</span>
                </div>
                <p className="text-xl md:text-2xl font-semibold text-foreground">
                  ₹{totalPending?.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {percentageUsed >= 90 && (
              <div className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg">
                <Icon name="AlertTriangle" size={20} className="text-error flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-error mb-1">Budget Alert</p>
                  <p className="text-xs text-muted-foreground">
                    You've used {percentageUsed?.toFixed(1)}% of your monthly budget. Consider reviewing pending purchases.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Set / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">{budget ? 'Edit Monthly Budget' : 'Set Monthly Budget'}</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Amount (₹)</label>
                <input
                  type="text"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e?.target?.value)}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Note (optional)</label>
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e?.target?.value)}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground"
                />
              </div>

              <div className="flex items-center gap-3 justify-end mt-4">
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                {!budget ? (
                  <button className="btn btn-primary" onClick={handleSetBudget}>Set Budget</button>
                ) : (
                  <button className="btn btn-primary" onClick={handleUpdateBudget}>Save Changes</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;