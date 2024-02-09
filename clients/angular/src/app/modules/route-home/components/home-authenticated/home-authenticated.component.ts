import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { List, TodosListsApiService, UsersMeApiService } from 'src/app/modules/api';

@Component({
  selector: 'app-home-authenticated',
  templateUrl: './home-authenticated.component.html',
  styleUrls: ['./home-authenticated.component.scss'],
})
export class HomeAuthenticatedComponent implements OnInit {
  lists: List[] = [];

  modalRef?: BsModalRef;

  listForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    private usersMeApiService: UsersMeApiService,
    private todosListsApiService: TodosListsApiService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
  ) {}

  async ngOnInit(): Promise<void> {
    this.usersMeApiService.getCurrentUserLists()
      .subscribe((lists) => {
        this.lists = lists;
      });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);

    if (!this.modalRef || !this.modalRef.onHide) {
      return;
    }

    this.modalRef.onHide.subscribe(() => {
      this.listForm.reset({ title: '' });
    });
  }

  addList(): void {
    if (this.listForm.invalid) {
      return;
    }

    this.listForm.disable();

    this.todosListsApiService.createList(this.listForm.value.title!)
      .subscribe((list) => {
        this.lists.unshift(list);

        // Re-enable the form
        this.listForm.enable();

        this.modalRef?.hide();
      });
  }
}
