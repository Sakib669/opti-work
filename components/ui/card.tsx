import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-3xl border border-slate-800/90 bg-slate-950/90 p-6 shadow-glow',
      className
    )}
    {...props}
  />
));

Card.displayName = 'Card';
export { Card };