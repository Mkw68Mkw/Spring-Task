import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  title = 'Task List';
  tasks: any[] = [];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTasks();
    
    // Auf Refresh-Events reagieren
    this.taskService.refresh
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadTasks());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  deleteTask(taskId: number) {
    if(confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== taskId);
        },
        error: (err) => console.error('Error deleting task:', err)
      });
    }
  }

  openEditDialog(task: any): void {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '600px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(updatedTask => {
      if(updatedTask) {
        this.tasks = this.tasks.map(t => 
          t.id === updatedTask.id ? updatedTask : t
        );
      }
    });
  }
}
