import { format, formatDistanceToNow } from 'date-fns';

export const formatTimestamp = (ts) =>
  format(new Date(ts), 'MMM dd, yyyy HH:mm:ss');

export const formatRelativeTime = (ts) =>
  formatDistanceToNow(new Date(ts), { addSuffix: true });

export const formatDuration = (ms) => {
  if (!ms) return 'N/A';
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
};

export const formatPercentage = (val) => {
  if (!val) return '0%';
  return `${Number(val).toFixed(1)}%`;
};

export const truncateId = (id, len = 8) =>
  id.length <= len ? id : `${id.slice(0, len)}...`;
