import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import MetricCard from './components/MetricCard';
import RevenueChart from './components/RevenueChart';
import { supabase } from '../../lib/supabase';
import { lookupService } from '../../services/supabaseService';
import { Constants } from '../../types/supabase';
import { humanize } from '../../utils/text';
import ShootTypeBreakdown from './components/ShootTypeBreakdown';
import RevenueTable from './components/RevenueTable';
import FilterToolbar from './components/FilterToolbar';
import ClientValueDistribution from './components/ClientValueDistribution';
import { getChangeType, formatPercentage, formatCurrency } from '../../utils/currencyUtils';

const RevenueAnalyticsDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: 'thisMonth',
    shootTypes: [],
    clientSegment: 'all'
  });
  const [metricsData, setMetricsData] = useState([
    { title: 'Monthly Revenue', value: '₹0', change: '0%', changeType: 'neutral', icon: 'CurrencyRupee', iconColor: 'text-green-500' },
    { title: 'Shoots Completed', value: '0', change: '0%', changeType: 'neutral', icon: 'TrendingUp', iconColor: 'text-blue-500' },
    { title: 'Average Booking Value', value: '₹0', change: '0%', changeType: 'neutral', icon: 'BarChart3', iconColor: 'text-yellow-500' },
    { title: 'Growth Rate', value: '0%', change: '0%', changeType: 'neutral', icon: 'LineChart', iconColor: 'text-purple-500' }
  ]);
  const [loading, setLoading] = useState(true);
  const [shootTypes, setShootTypeOptions] = useState([]);
  const [sixMonthRevenue, setSixMonthRevenue] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [shootTypePercentage, setShootTypePercentage] = useState([]);
  const [shootWiseSplit, setShootWiseSplit] = useState([]);
  const [revenueBuckets, setRevenueBuckets] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const fetchAnalytics = async () => {
      const [
        bookingAnalyticsRes,
        shootTypesRes,
        sixMonthRevenueRes,
        txnRes,
        shootSplitRes,
        revenueBucketsRes
      ] = await Promise.all([
        supabase.rpc('get_booking_analytics'),
        lookupService.getEnumValues('shoot_type'),
        supabase.rpc('get_last_6_months_revenue'),
        supabase.rpc('get_recent_transactions'),
        supabase.rpc('get_shoot_type_split'),
        supabase.rpc('get_revenue_buckets')
      ]);

      if (bookingAnalyticsRes.error || sixMonthRevenueRes.error || txnRes.error || shootSplitRes.error || revenueBucketsRes.error) {
        setLoading(false);
        throw new Error('Failed to load dashboard data');
      }

      const bookingAnalytics = bookingAnalyticsRes.data?.[0] ?? null;
      const sixMonthRevenue = sixMonthRevenueRes.data ?? [];
      const revenueBuckets = revenueBucketsRes.data ?? [];
      const txnData = txnRes.data ?? [];
      const shootWiseSplit = shootSplitRes.data ?? [];
      try {
        setShootTypeOptions(shootTypesRes || []).map((v) => ({ value: v, label: v }));
      } catch (err) {
        const fallbackShoot = (Constants?.public?.Enums?.shoot_type || []).map((v) => ({ value: v, label: humanize(v) }));
        setShootTypeOptions(fallbackShoot);
      }
      if (!mounted) return;

      console.log('Analytics data:', bookingAnalytics, shootTypes, sixMonthRevenue, txnData, shootWiseSplit);
      setMetricsData(mapAnalyticsToMetrics(bookingAnalytics));
      setSixMonthRevenue(map6MonthRevenueToTimeline(sixMonthRevenue));
      setShootWiseSplit(mapRevenueDataToShootTypes(shootWiseSplit));
      setShootTypePercentage(mapRevenueDataToShootPercentage(shootWiseSplit));
      setRecentTransactions(mapRecentTxnToTransactionData(txnData));
      setRevenueBuckets(mapRevenueBuckets(revenueBuckets));
    };
    fetchAnalytics();
    const handleKeyDown = (event) => {
      if (event?.key === 'f' && !event?.ctrlKey && !event?.metaKey) {
        event?.preventDefault();
        document.querySelector('[aria-label="Date Range"]')?.focus();
      }
      if ((event?.ctrlKey || event?.metaKey) && event?.key === 'e') {
        event?.preventDefault();
        console.log('Export triggered');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mapAnalyticsToMetrics = (data) => [
    {
      title: 'Monthly Revenue',
      value: formatCurrency(data?.revenue_this_month),
      change: formatPercentage(data?.growth_percentage),
      changeType: getChangeType(data?.growth_percentage),
      icon: '₹',
      iconColor: 'text-green-500',
    },
    {
      title: 'Shoots Completed',
      value: String(data?.shoots_completed ?? 0),
      change: formatPercentage(data?.growth_percentage),
      changeType: getChangeType(data?.growth_percentage),
      icon: 'TrendingUp',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Average Monthly Booking Value',
      value: formatCurrency(data?.avg_monthly_booking_value),
      change: 'N/A',
      changeType: '',
      icon: '₹',
      iconColor: 'text-yellow-500'
    },
    {
      title: 'Growth Rate',
      value: data?.growth_percentage ? `${data.growth_percentage.toFixed(2)}%` : 'Fresh start',
      change: data?.previous_growth_percentage ? `${data.previous_growth_percentage > 0 ? '+' : ''}${data.previous_growth_percentage.toFixed(2)}%` : 'N/A',
      changeType: data?.previous_growth_percentage > 0 ? 'positive' : (data?.previous_growth_percentage < 0 ? 'negative' : 'neutral'),
      icon: 'LineChart',
      iconColor: 'text-purple-500'
    }
  ];

  const map6MonthRevenueToTimeline = (sixMonthRevenue) => sixMonthRevenue.map((item) => ({
    month: item.month_name ?? 'N/A',
    revenue: item.revenue ?? 0
  }));

  const mapRevenueDataToShootTypes = (shootWiseSplit) => shootWiseSplit.map((item) => ({
    type: humanize(item.shoot_type),
    revenue: item.revenue
  }));

  const mapRevenueDataToShootPercentage = (shootWiseSplit) => shootWiseSplit.map((item) => ({
    name: humanize(item.shoot_type),
    value: item.revenue,
    percentage: item.percentage
  }));

  const mapRevenueBuckets = (buckets) => buckets.map((item) => ({
    range: item.revenue_range,
    shootCount: item.shoot_count
  }));

  const mapRecentTxnToTransactionData = (txnData) => txnData.map((item) => ({
    id: crypto.randomUUID(),
    date: item.booking_date,
    bookingName: item.booking_name,
    shootType: humanize(item.shoot_type),
    amount: item.total_price,
    netRevenue: item.net_revenue,
    profitMargin: item.profit_percentage
  }));

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters applied:', newFilters);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Revenue Analytics Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Comprehensive financial performance monitoring and business intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {metricsData?.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* <div className="mb-6 md:mb-8">
          <FilterToolbar onFilterChange={handleFilterChange} />
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <RevenueChart
            data={sixMonthRevenue}
            chartType="line"
            title={`Revenue Timeline (Last ${sixMonthRevenue.length} Months)`}
          />
          <ShootTypeBreakdown data={shootTypePercentage} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <RevenueChart
            data={shootWiseSplit}
            chartType="bar"
            title="Shoot Type Revenue Comparison"
          />
          <ClientValueDistribution data={revenueBuckets} />
        </div>

        <div className="mb-6 md:mb-8">
          <RevenueTable transactions={recentTransactions} />
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Integration Status
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time sync with booking system and client CRM
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-foreground">Booking System</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-foreground">Client CRM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 border border-border rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">F</kbd> Focus filters •
            <kbd className="px-2 py-1 bg-muted rounded text-xs ml-2">Ctrl+E</kbd> Export report •
            <kbd className="px-2 py-1 bg-muted rounded text-xs ml-2">←→</kbd> Navigate dates
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RevenueAnalyticsDashboard;