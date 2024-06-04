import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoListSharedService {
  private refreshListSubject = new Subject<{ selectedTab: number | undefined }>();
  refreshList$ = this.refreshListSubject.asObservable();

  notifyRefreshList(selectedTab: number | undefined) {
    this.refreshListSubject.next({ selectedTab });
  }
}
