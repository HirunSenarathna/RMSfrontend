import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-owner-navbar',
  imports: [RouterModule,CommonModule,MatToolbarModule,MatIconModule],
  templateUrl: './owner-navbar.component.html',
  styleUrl: './owner-navbar.component.css'
})
export class OwnerNavbarComponent {

  menuClass: boolean = false;

  toggleMobOption() {
    this.menuClass = !this.menuClass;
  }
}
