import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProvinceNameListComponent } from './province-name/province-name-list.component';
import { ProvinceNameAddComponent } from './province-name/province-name-add.component';
import { ProvinceNameEditComponent } from './province-name/province-name-edit.component';
import { DoctorListComponent } from './doctor/doctor-list.component';
import { DoctorAddComponent } from './doctor/doctor-add.component';
import { DoctorEditComponent } from './doctor/doctor-edit.component';
import { PatientListComponent } from './patient/patient-list.component';
import { PatientAddComponent } from './patient/patient-add.component';
import { PatientEditComponent } from './patient/patient-edit.component';
import { AdmissionListComponent } from './admission/admission-list.component';
import { AdmissionAddComponent } from './admission/admission-add.component';
import { AdmissionEditComponent } from './admission/admission-edit.component';
import { ErrorComponent } from './error/error.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: $localize`:@@home.index.headline:Welcome to your new app!`
  },
  {
    path: 'provinceNames',
    component: ProvinceNameListComponent,
    title: $localize`:@@provinceName.list.headline:Province Names`
  },
  {
    path: 'provinceNames/add',
    component: ProvinceNameAddComponent,
    title: $localize`:@@provinceName.add.headline:Add Province Name`
  },
  {
    path: 'provinceNames/edit/:provinceId',
    component: ProvinceNameEditComponent,
    title: $localize`:@@provinceName.edit.headline:Edit Province Name`
  },
  {
    path: 'doctors',
    component: DoctorListComponent,
    title: $localize`:@@doctor.list.headline:Doctors`
  },
  {
    path: 'doctors/add',
    component: DoctorAddComponent,
    title: $localize`:@@doctor.add.headline:Add Doctor`
  },
  {
    path: 'doctors/edit/:doctorId',
    component: DoctorEditComponent,
    title: $localize`:@@doctor.edit.headline:Edit Doctor`
  },
  {
    path: 'patients',
    component: PatientListComponent,
    title: $localize`:@@patient.list.headline:Patients`
  },
  {
    path: 'patients/add',
    component: PatientAddComponent,
    title: $localize`:@@patient.add.headline:Add Patient`
  },
  {
    path: 'patients/edit/:patientId',
    component: PatientEditComponent,
    title: $localize`:@@patient.edit.headline:Edit Patient`
  },
  {
    path: 'admissions',
    component: AdmissionListComponent,
    title: $localize`:@@admission.list.headline:Admissions`
  },
  {
    path: 'admissions/add',
    component: AdmissionAddComponent,
    title: $localize`:@@admission.add.headline:Add Admission`
  },
  {
    path: 'admissions/edit/:id',
    component: AdmissionEditComponent,
    title: $localize`:@@admission.edit.headline:Edit Admission`
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: $localize`:@@error.headline:Error`
  },
  {
    path: '**',
    component: ErrorComponent,
    title: $localize`:@@notFound.headline:Page not found`
  }
];
