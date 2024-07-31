import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AdmissionService } from 'app/admission/admission.service';
import { AdmissionDTO } from 'app/admission/admission.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-admission-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './admission-add.component.html'
})
export class AdmissionAddComponent implements OnInit {

  admissionService = inject(AdmissionService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  patientValues?: Map<number,string>;
  attendingDoctorValues?: Map<number,string>;

  addForm = new FormGroup({
    admissionDate: new FormControl(null),
    dischargeDate: new FormControl(null),
    diagnosis: new FormControl(null, [Validators.maxLength(50)]),
    patient: new FormControl(null),
    attendingDoctor: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@admission.create.success:Admission was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.admissionService.getPatientValues()
        .subscribe({
          next: (data) => this.patientValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.admissionService.getAttendingDoctorValues()
        .subscribe({
          next: (data) => this.attendingDoctorValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new AdmissionDTO(this.addForm.value);
    this.admissionService.createAdmission(data)
        .subscribe({
          next: () => this.router.navigate(['/admissions'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
