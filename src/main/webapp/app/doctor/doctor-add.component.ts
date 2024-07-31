import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DoctorService } from 'app/doctor/doctor.service';
import { DoctorDTO } from 'app/doctor/doctor.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-doctor-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './doctor-add.component.html'
})
export class DoctorAddComponent {

  doctorService = inject(DoctorService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    firstName: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
    lastName: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
    specialty: new FormControl(null, [Validators.maxLength(25)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@doctor.create.success:Doctor was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new DoctorDTO(this.addForm.value);
    this.doctorService.createDoctor(data)
        .subscribe({
          next: () => this.router.navigate(['/doctors'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
