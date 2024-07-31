import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DoctorDTO } from 'app/doctor/doctor.model';


@Injectable({
  providedIn: 'root',
})
export class DoctorService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/doctors';

  getAllDoctors() {
    return this.http.get<DoctorDTO[]>(this.resourcePath);
  }

  getDoctor(doctorId: number) {
    return this.http.get<DoctorDTO>(this.resourcePath + '/' + doctorId);
  }

  createDoctor(doctorDTO: DoctorDTO) {
    return this.http.post<number>(this.resourcePath, doctorDTO);
  }

  updateDoctor(doctorId: number, doctorDTO: DoctorDTO) {
    return this.http.put<number>(this.resourcePath + '/' + doctorId, doctorDTO);
  }

  deleteDoctor(doctorId: number) {
    return this.http.delete(this.resourcePath + '/' + doctorId);
  }

}
