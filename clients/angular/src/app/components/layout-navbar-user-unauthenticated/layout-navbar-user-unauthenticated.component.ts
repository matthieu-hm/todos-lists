import { Component, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BtnConnectGoogleComponent } from '../btn-connect-google/btn-connect-google.component';

@Component({
  selector: 'app-layout-navbar-user-unauthenticated',
  standalone: true,
  imports: [BtnConnectGoogleComponent, NgTemplateOutlet, ReactiveFormsModule],
  templateUrl: './layout-navbar-user-unauthenticated.component.html',
  styleUrls: ['./layout-navbar-user-unauthenticated.component.scss'],
})
export class LayoutNavbarUserUnauthenticatedComponent {
  modalRef?: BsModalRef;

  rememberMeFormControl = new FormControl(false);

  constructor(private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
