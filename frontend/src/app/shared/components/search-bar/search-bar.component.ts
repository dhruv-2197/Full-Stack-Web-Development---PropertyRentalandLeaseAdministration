import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="input-group">
      <span class="input-group-text">
        <i class="bi bi-search text-muted"></i>
      </span>
      <input
        type="text"
        class="form-control"
        [placeholder]="placeholder()"
        [(ngModel)]="term"
        (keyup.enter)="searched.emit(term())"
      />
      @if (term()) {
        <button class="btn btn-outline-secondary" type="button" (click)="clear()">Clear</button>
      }
      <button class="btn btn-outline-primary" type="button" (click)="searched.emit(term())">Search</button>
    </div>
  `
})
export class SearchBarComponent {
  readonly placeholder = input('Search...');
  readonly term = model('');
  readonly searched = output<string>();

  clear(): void {
    this.term.set('');
    this.searched.emit('');
  }
}
