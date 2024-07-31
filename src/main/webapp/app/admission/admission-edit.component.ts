import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AdmissionService } from 'app/admission/admission.service';
import { AdmissionDTO } from 'app/admission/admission.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-admission-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './admission-edit.component.html'
})
export class AdmissionEditComponent implements OnInit {

  admissionService = inject(AdmissionService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  patientValues?: Map<number,string>;
  attendingDoctorValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    admissionDate: new FormControl(null),
    dischargeDate: new FormControl(null),
    diagnosis: new FormControl(null, [Validators.maxLength(50)]),
    patient: new FormControl(null),
    attendingDoctor: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@admission.update.success:Admission was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
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
    this.admissionService.getAdmission(this.currentId!)
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
    const data = new AdmissionDTO(this.editForm.value);
    this.admissionService.updateAdmission(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/admissions'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
