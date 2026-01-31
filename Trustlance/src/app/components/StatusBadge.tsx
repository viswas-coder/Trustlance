import { Badge } from '@/app/components/ui/badge';
import { EscrowStatus, MilestoneStatus, DisputeStatus } from '@/app/context/AppContext';

interface StatusBadgeProps {
  status: EscrowStatus | MilestoneStatus | DisputeStatus;
  type: 'escrow' | 'milestone' | 'dispute';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const getVariant = () => {
    if (type === 'escrow') {
      switch (status) {
        case 'locked':
          return 'default';
        case 'released':
          return 'success';
        case 'refunded':
          return 'secondary';
        case 'disputed':
          return 'destructive';
      }
    }

    if (type === 'milestone') {
      switch (status) {
        case 'pending':
          return 'secondary';
        case 'in_progress':
          return 'default';
        case 'submitted':
          return 'warning';
        case 'approved':
          return 'success';
        case 'rejected':
          return 'destructive';
      }
    }

    if (type === 'dispute') {
      switch (status) {
        case 'open':
          return 'destructive';
        case 'under_review':
          return 'default';
        case 'resolved':
          return 'success';
      }
    }

    return 'default';
  };

  const getLabel = () => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const variant = getVariant() as 'default' | 'secondary' | 'destructive' | 'outline';

  return (
    <Badge 
      variant={variant}
      className={
        variant === 'default' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
        getVariant() === 'success' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
        getVariant() === 'warning' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
        ''
      }
    >
      {getLabel()}
    </Badge>
  );
}
