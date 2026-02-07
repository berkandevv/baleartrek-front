export default function TrekDetailsMeta({ dateLabel, timeLabel }) {
  const cardClass =
    'flex flex-col gap-1 rounded-lg p-4 border border-[#dbe4e6] dark:border-[#2a3c40] bg-white dark:bg-[#1a2c30]'
  const items = [
    { icon: 'calendar_today', label: 'Fecha', value: dateLabel },
    { icon: 'schedule', label: 'Hora', value: timeLabel },
  ]
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div className={cardClass} key={item.label}>
          <div className="text-primary mb-1">
            <span className="material-symbols-outlined">{item.icon}</span>
          </div>
          <p className="text-[#618389] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">{item.label}</p>
          <p className="text-[#111718] dark:text-white text-lg font-bold leading-tight">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
