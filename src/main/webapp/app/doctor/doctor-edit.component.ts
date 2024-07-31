import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DoctorService } from 'app/doctor/doctor.service';
import { DoctorDTO } from 'app/doctor/doctor.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-doctor-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './doctor-edit.component.html'
})
export class DoctorEditComponent implements OnInit {

  doctorService = inject(DoctorService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentDoctorId?: number;

  editForm = new FormGroup({
    doctorId: new FormControl({ value: null, disabled: true }),
    firstName: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
    lastName: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
    specialty: new FormControl(null, [Validators.maxLength(25)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@doctor.update.success:Doctor was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentDoctorId = +this.route.snapshot.params['doctorId'];
    this.doctorService.getDoctor(this.currentDoctorId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new DoctorDTO(this.editForm.value);
    this.doctorService.updateDoctor(this.currentDoctorId!, data)
        .subscribe({
          next: () => this.router.navigate(['/doctors'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
