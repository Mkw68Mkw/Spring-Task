import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class CreateTaskComponent implements OnInit {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      status: ['pending']
    });
  }

  ngOnInit() {
    if(this.data?.task) {
      this.taskForm.patchValue({
        ...this.data.task,
        dueDate: this.formatDate(this.data.task.dueDate)
      });
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const operation = this.data?.task 
        ? this.taskService.updateTask(this.data.task.id, this.taskForm.value)
        : this.taskService.createTask(this.taskForm.value);

      operation.subscribe({
        next: (result) => {
          this.dialogRef.close(result || true);
        },
        error: (err) => console.error('Error:', err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 