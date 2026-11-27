import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge rounded-pill" [class]="badgeClass()">
      {{ label() }}
    </span>
  `
})
export class StatusBadgeComponent {
  readonly status = input<string | boolean | null | undefined>('');

  readonly label = computed(() => {
    const val = this.status();
    if (typeof val === 'boolean') {
      return val ? 'Active' : 'Inactive';
    }
    return val || 'Unknown';
  });

  readonly badgeClass = computed(() => {
    const text = this.label().toLowerCase();
    switch (text) {
      case 'active':
      case 'vacant':
      case 'resolved':
      case 'low':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'occupied':
      case 'assigned':
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'pending':
      case 'in progress':
      case 'maintenance':
      case 'medium':
        return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'open':
      case 'high':
      case 'urgent':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      case 'expired':
      case 'terminated':
      case 'inactive':
        return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
      default:
        return 'bg-secondary-subtle text-light border border-secondary-subtle';
    }
  });
}
