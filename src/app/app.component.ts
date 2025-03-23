import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from './create-task/create-task.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'task-manager-frontend';
  tasks: any[] = [];
  currentYear = new Date().getFullYear();

  constructor(private dialog: MatDialog) {}

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        // Optional: Refresh der Aufgabenliste
      }
    });
  }
}

