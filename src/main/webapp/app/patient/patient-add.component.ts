import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { PatientService } from 'app/patient/patient.service';
import { PatientDTO } from 'app/patient/patient.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validNumeric } from 'app/common/utils';


@Component({
  selector: 'app-patient-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './patient-add.component.html'
})
export class PatientAddComponent implements OnInit {

  patientService = inject(PatientService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  provinceValues?: Record<string,string>;

  addForm = new FormGroup({
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
      created: $localize`:@@patient.create.success:Patient was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.patientService.getProvinceValues()
        .subscribe({
          next: (data) => this.provinceValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new PatientDTO(this.addForm.value);
    this.patientService.createPatient(data)
        .subscribe({
          next: () => this.router.navigate(['/patients'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
