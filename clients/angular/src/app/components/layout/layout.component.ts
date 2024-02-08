import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutNavbarComponent } from '../layout-navbar/layout-navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, LayoutNavbarComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {}
