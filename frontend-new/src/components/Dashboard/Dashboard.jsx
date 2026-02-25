import { ChartBarIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import StatsCard from './StatsCard';
import { useStats } from '../../hooks/useStats';
import { formatPercentage } from '../../utils/formatters';

const Dashboard = () => {
  const { stats, loading } = useStats();

  if (loading) return (
    <div className='flex justify-center items-center h-64'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
    </div>
  );

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <StatsCard
        title='Total Events'
        value={stats?.total_events || 0}
        icon={ChartBarIcon}
        color='blue'
      />
      <StatsCard
        title='Successful'
        value={stats?.successful || 0}
        subtitle={`${formatPercentage(stats?.success_rate || 0)} rate`}
        icon={CheckCircleIcon}
        color='green'
      />
      <StatsCard
        title='Failed'
        value={stats?.failed || 0}
        subtitle={`${stats?.permanent_failures || 0} permanent`}
        icon={XCircleIcon}
        color='red'
      />
      <StatsCard
        title='Processing'
        value={stats?.processing || 0}
        icon={ClockIcon}
        color='yellow'
      />
    </div>
  );
};

export default Dashboard;
