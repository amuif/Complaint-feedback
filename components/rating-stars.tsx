import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useController, Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RatingProps {
  name: string;
  control: Control<any>;
}

export function RatingStars({ name, control }: RatingProps) {
  const {
    field: { value = 0, onChange },
  } = useController({
    name,
    control,
    defaultValue: 0,
  });

  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex items-center gap-5 justify-start">
      {[...Array(5)].map((_, index) => (
        <Button
          key={index}
          type="button"
          onClick={() => onChange(index + 1)}
          onMouseEnter={() => setHoverValue(index + 1)}
          onMouseLeave={() => setHoverValue(0)}
          variant="ghost"
          className="p-1"
        >
          <Star
            className={cn(
              'h-6 w-6 transition-colors',
              index < (hoverValue || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        </Button>
      ))}
    </div>
  );
}
