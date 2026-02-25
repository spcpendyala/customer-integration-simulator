const colorMap = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
};

const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  return (
    <div className={`rounded-lg border p-6 ${colorMap[color]}`}>
      <div className='flex justify-between items-start'>
        <p className='text-sm font-medium opacity-75'>{title}</p>
        {Icon && <Icon className='h-5 w-5 opacity-50' />}
      </div>
      <p className='text-3xl font-bold mt-2'>{value ?? '—'}</p>
      {subtitle && <p className='text-sm mt-1 opacity-75'>{subtitle}</p>}
    </div>
  );
};

export default StatsCard;
