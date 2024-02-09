import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject, catchError, map, Observable, switchMap,
} from 'rxjs';
import { Environment } from 'src/app/modules/env';
import { AuthService } from 'src/app/modules/auth';
import { List, User } from '../models';

@Injectable()
export class UsersMeApiService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject(null as any);

  currentUser$ = this.currentUserSubject.asObservable();

  private isGetCurrentUserRequestPendingSubject = new BehaviorSubject(false);

  isGetCurrentUserRequestPending$ = this.isGetCurrentUserRequestPendingSubject.asObservable();

  constructor(
    private environment: Environment,
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  getCurrentUser(): Observable<User | null> {
    this.isGetCurrentUserRequestPendingSubject.next(true);

    if (!this.authService.isAuthenticated()) {
      this.isGetCurrentUserRequestPendingSubject.next(false);
      this.currentUserSubject.next(null);

      return this.currentUser$;
    }

    return this.httpClient
      .get<User>(`${this.environment.apiUrl}users/me`)
      .pipe(
        map((userData) => {
          this.isGetCurrentUserRequestPendingSubject.next(false);

          const user = new User(userData);
          this.currentUserSubject.next(user);
        }),
        switchMap(() => this.currentUser$),
        catchError(() => {
          this.isGetCurrentUserRequestPendingSubject.next(false);
          this.currentUserSubject.next(null);

          return this.currentUser$;
        }),
      );
  }

  getCurrentUserLists(): Observable<List[]> {
    return this.httpClient
      .get<List[]>(`${this.environment.apiUrl}users/me/todos-lists`)
      .pipe(
        map((listsData) => (
          listsData.map((listData) => new List(listData))
        )),
        catchError(() => []),
      );
  }
}
