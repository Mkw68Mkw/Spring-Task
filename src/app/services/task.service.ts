import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../..//environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl + '/tasks';
  private http = inject(HttpClient);
  private refresh$ = new Subject<void>();


  // Neues Observable für Refresh-Events
  get refresh() {
    return this.refresh$.asObservable();
  }

  getAllTasks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task).pipe(
      tap(() => this.refresh$.next())
    );
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task).pipe(
      tap(() => this.refresh$.next())
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refresh$.next())
    );
  }
} 