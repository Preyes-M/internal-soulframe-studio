import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FilterSidebar from './components/FilterSidebar';
import ClientTableRow from './components/ClientTableRow';
import ClientDetailPanel from './components/ClientDetailPanel';
import AddClientModal from './components/AddClientModal';
import BulkActionsBar from '../BulkActionsBar';
import { clientsService } from '../../services/supabaseService';

const ClientCRMDirectory = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    shootType: [],
    dateRange: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsService?.getAll();
      setClients(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load clients:', err);
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients?.filter((client) => {
    const matchesSearch =
    searchQuery === '' ||
    client?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    client?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    client?.phone?.includes(searchQuery) ||
    client?.instagram?.toLowerCase()?.includes(searchQuery?.toLowerCase());

    const matchesStatus =
    filters?.status?.length === 0 || filters?.status?.includes(client?.status);

    const matchesShootType =
    filters?.shootType?.length === 0 ||
    client?.shootTypes?.some((type) => filters?.shootType?.includes(type));

    return matchesSearch && matchesStatus && matchesShootType;
  });

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedClients(filteredClients?.map((c) => c?.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId) => {
    setSelectedClients((prev) =>
    prev?.includes(clientId) ?
    prev?.filter((id) => id !== clientId) :
    [...prev, clientId]
    );
  };

  const handleEditClient = (updatedClient) => {
    setClients((prev) =>
    prev?.map((c) => c?.id === updatedClient?.id ? updatedClient : c)
    );
  };

  const handleDeleteClient = async (clientId) => {
    try {
      const success = await clientsService?.delete(clientId);
      if (success) {
        setClients(clients?.filter(c => c?.id !== clientId));
        setSelectedClient(null);
      }
    } catch (err) {
      console.error('Failed to delete client:', err);
      setError('Failed to delete client');
    }
  };

  const handleAddClient = async (clientData) => {
    try {
      const newClient = await clientsService?.create(clientData);
      if (newClient) {
        setClients([newClient, ...clients]);
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to add client:', err);
      setError('Failed to add client');
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'export':
        console.log('Exporting selected clients:', selectedClients);
        alert(`Exporting ${selectedClients?.length} clients to CSV...`);
        break;
      case 'delete':
        if (
        window.confirm(
          `Are you sure you want to delete ${selectedClients?.length} clients?`
        ))
        {
          setClients((prev) =>
          prev?.filter((c) => !selectedClients?.includes(c?.id))
          );
          setSelectedClients([]);
        }
        break;
      case 'status':alert('Status change functionality would open a modal here');
        break;
      case 'email':alert('Email campaign functionality would open a modal here');
        break;
      default:
        break;
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting all clients to ${format}`);
    alert(`Exporting ${filteredClients?.length} clients to ${format?.toUpperCase()}...`);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.key === '/' && !isAddModalOpen && !selectedClient) {
        e?.preventDefault();
        document.getElementById('client-search')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isAddModalOpen, selectedClient]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading clients...</p>
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

        <div
          className={`fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ${
          isFilterSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
          }>

          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={() =>
            setFilters({ status: [], shootType: [], dateRange: '' })
            } />

        </div>

        <div className="flex-1 space-y-4 lg:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
                Client Directory
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your client relationships and project pipeline
              </p>
            </div>
            <Button
              variant="default"
              onClick={() => setIsAddModalOpen(true)}
              iconName="UserPlus"
              className="w-full sm:w-auto">

              Add Client
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
                  id="client-search"
                  type="text"
                  placeholder="Search clients by name, email, phone, or Instagram... (Press / to focus)"
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
                          filteredClients?.length > 0 &&
                          selectedClients?.length === filteredClients?.length
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0" />

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
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Last Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Project Value
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredClients?.length === 0 ?
                    <tr>
                        <td colSpan="10" className="px-4 py-12 text-center">
                          <Icon
                          name="Users"
                          size={48}
                          className="mx-auto text-muted-foreground mb-3" />

                          <p className="text-sm text-muted-foreground">
                            No clients found matching your criteria
                          </p>
                        </td>
                      </tr> :

                    filteredClients?.map((client) => (
                      <tr key={client?.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedClients?.includes(client?.id)}
                            onChange={() => handleSelectClient(client?.id)}
                            className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0" />
                        </td>

                        <ClientTableRow
                          client={client}
                          onEdit={handleEditClient}
                          onDelete={handleDeleteClient}
                          onViewDetails={setSelectedClient} />
                      </tr>
                    ))
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredClients?.length} of {clients?.length} clients
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

        {selectedClient &&
        <ClientDetailPanel
          client={selectedClient}
          onClose={() => setSelectedClient(null)} />

        }
      </div>
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddClient} />
      <BulkActionsBar
        selectedCount={selectedClients?.length}
        onClearSelection={() => setSelectedClients([])}
        onBulkAction={handleBulkAction} />
    </Layout>
  );

};

export default ClientCRMDirectory;