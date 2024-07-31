import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdmissionDTO } from 'app/admission/admission.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class AdmissionService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/admissions';

  getAllAdmissions() {
    return this.http.get<AdmissionDTO[]>(this.resourcePath);
  }

  getAdmission(id: number) {
    return this.http.get<AdmissionDTO>(this.resourcePath + '/' + id);
  }

  createAdmission(admissionDTO: AdmissionDTO) {
    return this.http.post<number>(this.resourcePath, admissionDTO);
  }

  updateAdmission(id: number, admissionDTO: AdmissionDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, admissionDTO);
  }

  deleteAdmission(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getPatientValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/patientValues')
        .pipe(map(transformRecordToMap));
  }

  getAttendingDoctorValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/attendingDoctorValues')
        .pipe(map(transformRecordToMap));
  }

}
