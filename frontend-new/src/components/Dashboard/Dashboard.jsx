import StatsCard from './StatsCard';
import { useStats } from '../../hooks/useStats';
import { formatPercentage, formatDuration } from '../../utils/formatters';

const Dashboard = () => {
  const { stats, loading } = useStats();

  if (loading) return <div className="text-gray-500 p-4">Loading stats...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <StatsCard
        title="Total Events"
        value={stats?.total_events ?? 0}
        subtitle="All time"
        color="blue"
      />
      <StatsCard
        title="Success Rate"
        value={formatPercentage(stats?.success_rate)}
        subtitle={`${stats?.successful ?? 0} successful`}
        color="green"
      />
      <StatsCard
        title="Failures"
        value={stats?.permanent_failures ?? 0}
        subtitle={`${stats?.failed ?? 0} retryable`}
        color="red"
      />
      <StatsCard
        title="Avg Latency"
        value={formatDuration(stats?.avg_latency_ms)}
        subtitle="Processing time"
        color="orange"
      />
    </div>
  );
};

export default Dashboard;
