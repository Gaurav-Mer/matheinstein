import { Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center gap-2 text-primary', className)}>
            <Waves className="h-7 w-7" />
            <span className="text-xl font-bold font-headline tracking-tighter">
                TutorWave
            </span>
        </div>
    );
}
