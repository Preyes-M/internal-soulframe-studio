import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BulkActionsBar from '../BulkActionsBar';
import FilterSidebar from '../client-crm-directory/components/FilterSidebar';
import ProfessionalTableRow from './components/ProfessionalTableRow';
// import ClientDetailPanel from './components/ClientDetailPanel';
import AddProfessionalModal from './components/AddProfessionalModal';
import { professionalService } from '../../services/supabaseService';

const ProfessionalCRMDirectory = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: [],

  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfessionals, setSelectedProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isAddProfessionalModalOpen, setIsAddProfessionalModalOpen] = useState(false);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const data = await professionalService?.getAll();
      setProfessionals(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load professionals:', err);
      setError('Failed to load professionals');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = professionals?.filter((professional) => {
    const matchesSearch =
      searchQuery === '' ||
      professional?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      professional?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      professional?.phone?.includes(searchQuery) ||
      professional?.instagram?.toLowerCase()?.includes(searchQuery?.toLowerCase());

    const matchesCategory =
      filters?.category?.length === 0 || filters?.category?.includes(professional?.category);

    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedProfessionals(filteredProfessionals?.map((p) => p?.id));
    } else {
      setSelectedProfessionals([]);
    }
  };

  const handleSelectProfessional = (professionalId) => {
    setSelectedProfessionals((prev) =>
      prev?.includes(professionalId) ?
        prev?.filter((id) => id !== professionalId) :
        [...prev, professionalId]
    );
  };

  const handleEditProfessional = async (professionalOriginalData, updatedProfessional) => {
    const success = await professionalService?.update(updatedProfessional?.id, updatedProfessional);
    if (success) {
      setProfessionals((prev) =>
        prev?.map((p) => p?.id === updatedProfessional?.id ? updatedProfessional : p)
      );
    } else {
      alert('Failed to update professional. Please try again.');
      setSelectedProfessional(professionalOriginalData);
    }
  };

  const handleDeleteProfessional = async (professionalId) => {
    try {
      const success = await professionalService?.delete(professionalId);
      if (success) {
        setProfessionals(professionals?.filter(p => p?.id !== professionalId));
        setSelectedProfessional(null);
      }
    } catch (err) {
      console.error('Failed to delete professional:', err);
      setError('Failed to delete professional');
    }
  };

  const handleAddProfessional = async (professionalData) => {
    try {
      const newProfessional = await professionalService?.create(professionalData);
      if (newProfessional) {
        setProfessionals([newProfessional, ...professionals]);
        setIsAddProfessionalModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to add professional:', err);
      setError('Failed to add professional');
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'export':
        console.log('Exporting selected professionals:', selectedProfessionals);
        alert(`Exporting ${selectedProfessionals?.length} professionals to CSV...`);
        break;
      case 'delete':
        if (
          window.confirm(
            `Are you sure you want to delete ${selectedProfessionals?.length} professionals?`
          )) {
          setProfessionals((prev) =>
            prev?.filter((p) => !selectedProfessionals?.includes(p?.id))
          );
          setSelectedProfessionals([]);
        }
        break;
      case 'status': alert('Status change functionality would open a modal here');
        break;
      case 'email': alert('Email campaign functionality would open a modal here');
        break;
      default:
        break;
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting all professionals to ${format}`);
    alert(`Exporting ${filteredProfessionals?.length} professionals to ${format?.toUpperCase()}...`);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.key === '/' && !isAddProfessionalModalOpen && !selectedProfessional) {
        e?.preventDefault();
        document.getElementById('professional-search')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isAddProfessionalModalOpen, selectedProfessional]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading professionals...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-screen">
        <button
          className="lg:hidden fixed top-24 left-4 z-50 flex items-center justify-center w-12 h-12 rounded-lg bg-card border border-border shadow-md"
          onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
          aria-label="Toggle filters">

          <Icon name="Filter" size={20} />
        </button>

        {isFilterSidebarOpen &&
          <div
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsFilterSidebarOpen(false)} />

        }

        {/* <div
          className={`fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ${
          isFilterSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
          }>

          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={() =>
            setFilters({ category: [] })
            } />

        </div> */}

        <div className="flex-1 space-y-4 lg:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
                Professional Directory
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your professional relationships
              </p>
            </div>
            <Button
              variant="default"
              onClick={() => setIsAddProfessionalModalOpen(true)}
              iconName="UserPlus"
              className="w-full sm:w-auto">

              Add Professional
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
              <div className="relative flex-1 w-full">
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="professional-search"
                  type="text"
                  placeholder="Search professional by name, email, phone, or Instagram... (Press / to focus)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 lg:py-3 text-sm bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />

              </div>

              {/* <div className="flex items-center gap-2 w-full lg:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv')}
                  iconName="Download"
                  className="flex-1 lg:flex-none">

                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('excel')}
                  iconName="FileSpreadsheet"
                  className="flex-1 lg:flex-none">

                  Excel
                </Button>
              </div> */}
            </div>

            <div className="overflow-x-auto -mx-4 lg:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            filteredProfessionals?.length > 0 &&
                            selectedProfessionals?.length === filteredProfessionals?.length
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0" />

                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Starred
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Instagram
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        WhatsApp
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProfessionals?.length === 0 ?
                      <tr>
                        <td colSpan="10" className="px-4 py-12 text-center">
                          <Icon
                            name="Users"
                            size={48}
                            className="mx-auto text-muted-foreground mb-3" />

                          <p className="text-sm text-muted-foreground">
                            No professionals found matching your criteria
                          </p>
                        </td>
                      </tr> :

                      filteredProfessionals?.map((professional) => (
                        <tr key={professional?.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedProfessionals?.includes(professional?.id)}
                              onChange={() => handleSelectProfessional(professional?.id)}
                              className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0" />
                          </td>

                          <ProfessionalTableRow
                            professional={professional}
                            onEdit={handleEditProfessional}
                            onDelete={handleDeleteProfessional}
                            onViewDetails={setSelectedProfessional} />
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProfessionals?.length} of {professionals?.length} professionals
              </p>
              {/* <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="ChevronLeft">
                  Previous
                </Button>
                <Button variant="outline" size="sm" iconName="ChevronRight">
                  Next
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        {/* {selectedProfessional &&
        <ProfessionalDetailPanel
          professional={selectedProfessional}
          onClose={() => setSelectedProfessional(null)} />

        } */}
      </div>
      <AddProfessionalModal
        isOpen={isAddProfessionalModalOpen}
        onClose={() => setIsAddProfessionalModalOpen(false)}
        onAdd={handleAddProfessional} />
      <BulkActionsBar
        selectedCount={selectedProfessionals?.length}
        onClearSelection={() => setSelectedProfessionals([])}
        onBulkAction={handleBulkAction} />
    </Layout>
  );

};

export default ProfessionalCRMDirectory;