import { METRIC_CATEGORIES } from '@/data/metrics';
import { MetricCategory } from '@/types';

interface Props {
  category: MetricCategory | string;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'md' }: Props) {
  const cat = METRIC_CATEGORIES[category] ?? { label: category, color: 'text-slate-700', bgColor: 'bg-slate-100' };
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-block rounded-full font-medium ${sizeClass} ${cat.color} ${cat.bgColor}`}>
      {cat.label}
    </span>
  );
}
