export class AdmissionDTO {

  constructor(data:Partial<AdmissionDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  admissionDate?: string|null;
  dischargeDate?: string|null;
  diagnosis?: string|null;
  patient?: number|null;
  attendingDoctor?: number|null;

}
