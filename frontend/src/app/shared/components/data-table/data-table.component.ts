import { Component, input } from '@angular/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  template: `
    <div class="card overflow-hidden">
      @if (loading()) {
        <div class="p-4 text-center text-muted small">
          <div class="spinner-border spinner-border-sm me-2" role="status"></div>
          Loading...
        </div>
      } @else if (empty()) {
        <div class="p-4 text-center text-muted small">
          {{ emptyMessage() }}
        </div>
      } @else {
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <ng-content select="[table-head]" />
            <ng-content select="[table-body]" />
          </table>
        </div>
      }
    </div>
  `
})
export class DataTableComponent {
  readonly loading = input(false);
  readonly empty = input(false);
  readonly emptyMessage = input('No records.');
}
