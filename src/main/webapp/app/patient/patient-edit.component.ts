import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { PatientService } from 'app/patient/patient.service';
import { PatientDTO } from 'app/patient/patient.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validNumeric } from 'app/common/utils';


@Component({
  selector: 'app-patient-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './patient-edit.component.html'
})
export class PatientEditComponent implements OnInit {

  patientService = inject(PatientService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  provinceValues?: Record<string,string>;
  currentPatientId?: number;

  editForm = new FormGroup({
    patientId: new FormControl({ value: null, disabled: true }),
    firstName: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
    lastName: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
    gender: new FormControl(false),
    birthDate: new FormControl(null),
    city: new FormControl(null, [Validators.maxLength(30)]),
    allergies: new FormControl(null, [Validators.maxLength(80)]),
    height: new FormControl(null, [validNumeric(3, 2)]),
    weight: new FormControl(null, [validNumeric(4, 2)]),
    province: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@patient.update.success:Patient was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentPatientId = +this.route.snapshot.params['patientId'];
    this.patientService.getProvinceValues()
        .subscribe({
          next: (data) => this.provinceValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.patientService.getPatient(this.currentPatientId!)
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
    const data = new PatientDTO(this.editForm.value);
    this.patientService.updatePatient(this.currentPatientId!, data)
        .subscribe({
          next: () => this.router.navigate(['/patients'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
