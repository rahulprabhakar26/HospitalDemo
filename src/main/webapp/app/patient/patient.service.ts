import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { PatientDTO } from 'app/patient/patient.model';


@Injectable({
  providedIn: 'root',
})
export class PatientService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/patients';

  getAllPatients() {
    return this.http.get<PatientDTO[]>(this.resourcePath);
  }

  getPatient(patientId: number) {
    return this.http.get<PatientDTO>(this.resourcePath + '/' + patientId);
  }

  createPatient(patientDTO: PatientDTO) {
    return this.http.post<number>(this.resourcePath, patientDTO);
  }

  updatePatient(patientId: number, patientDTO: PatientDTO) {
    return this.http.put<number>(this.resourcePath + '/' + patientId, patientDTO);
  }

  deletePatient(patientId: number) {
    return this.http.delete(this.resourcePath + '/' + patientId);
  }

  getProvinceValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/provinceValues');
  }

}
