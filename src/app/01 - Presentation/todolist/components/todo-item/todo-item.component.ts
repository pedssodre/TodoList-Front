import { ICreateTodoItemResponse } from './../../../../02 - Domain/todo-list/model/model';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TodoListService } from './../../../../02 - Domain/todo-list/service/todo-list.service';
import { Component, HostBinding, Injector, Input, OnInit, inject } from '@angular/core';
import { TodoItem, TodoItemStatus } from '../../../../02 - Domain/todo-list/model/model';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/ui-dialog-brain';
import { CommonModule, DatePipe } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Observable } from 'rxjs';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { TodoListSharedService } from '../../../../02 - Domain/shared/service/todo-list-shared.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButtonDirective,
    HlmSpinnerComponent,
    CommonModule
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent implements OnInit {
  private readonly _dialogRef = inject<BrnDialogRef<TodoItem>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{ todoItem: TodoItem, isView: boolean, selectedTab: number }>();

  protected readonly todoItem = this._dialogContext.todoItem;
  protected readonly selectedTab = this._dialogContext.selectedTab;
  protected readonly isView = this._dialogContext.isView;

  form!: FormGroup;
  showSpinner: boolean = false;
  dialogTitle: string = "Add Task";


  constructor(
    private fb: FormBuilder,
    private todolistService: TodoListService,
    private todoListSharedService: TodoListSharedService
  ) {
    this.form = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', Validators.maxLength(80)],
      dueDate: ['', [Validators.required, this.dateNotPastValidator()]],
      todoItemStatus: [TodoItemStatus.Pending]
    });
  }

  ngOnInit(): void {
    if (this.todoItem?.id != null) {
      this.dialogTitle = "Edit Task"
      this.updateForm(this.todoItem);
    }
    if(this.isView){
      this.dialogTitle= "Task Info"
    }
  }

  private updateForm(todoItem: TodoItem): void {
    const dueDate = new Date(todoItem.dueDate).toISOString().split('T')[0];
    this.form.patchValue({
      id: todoItem.id,
      title: todoItem.title,
      description: todoItem.description,
      dueDate: dueDate,
      todoItemStatus: todoItem.todoItemStatus
    });
  }

  validateField(form: FormGroup, field: string, error: string = 'required'): boolean | undefined {
    if (form.get(field)?.valid) {
      return false;
    }
    if (!form.get(field)?.touched) {
      return false;
    }
    return form.get(field)?.hasError(error);
  }

  private dateNotPastValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date().setHours(0, 0, 0, 0);
      const controlDate = new Date(control.value).setHours(0, 0, 0, 0);
      return controlDate < currentDate ? { pastDate: { value: control.value } } : null;
    };
  }

  public onSave(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: any = Object.assign(this.form.value);
    payload.dueDate = new Date(payload.dueDate).toISOString();
    let callApi = new Observable<ICreateTodoItemResponse | any>();
    if (payload.id === null) {
      callApi = this.todolistService.create(payload)
    } else {
      callApi = this.todolistService.update(payload);
    }

    this.showSpinner = true;
    callApi.subscribe(
      {
        next: () => {
          this.showSpinner = false;
          this.todoListSharedService.notifyRefreshList(this.selectedTab);
          this._dialogRef.close();
        },
        error: (err) => {
          this.showSpinner = false;
          console.log(err)
        }
    })
  }
}
