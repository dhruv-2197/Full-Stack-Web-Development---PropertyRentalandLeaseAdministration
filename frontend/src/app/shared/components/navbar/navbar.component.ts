import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark app-navbar sticky-top mb-4">
      <div class="container">
        <a class="navbar-brand fw-bold text-light d-flex align-items-center gap-2 fs-6" routerLink="/dashboard">
          <i class="bi bi-buildings text-info"></i>
          <span>Property Lease Admin</span>
        </a>

        <button
          class="navbar-toggler"
          type="button"
          (click)="menuOpen.set(!menuOpen())"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" [class.show]="menuOpen()">
          <ul class="navbar-nav ms-auto gap-1">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active" (click)="menuOpen.set(false)">
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/properties" routerLinkActive="active" (click)="menuOpen.set(false)">
                Properties
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/units" routerLinkActive="active" (click)="menuOpen.set(false)">
                Units
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/tenants" routerLinkActive="active" (click)="menuOpen.set(false)">
                Tenants
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/leases" routerLinkActive="active" (click)="menuOpen.set(false)">
                Leases
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/maintenance" routerLinkActive="active" (click)="menuOpen.set(false)">
                Maintenance
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  readonly menuOpen = signal(false);
}
