export class PatientDTO {

  constructor(data:Partial<PatientDTO>) {
    Object.assign(this, data);
  }

  patientId?: number|null;
  firstName?: string|null;
  lastName?: string|null;
  gender?: boolean|null;
  birthDate?: string|null;
  city?: string|null;
  allergies?: string|null;
  height?: string|null;
  weight?: string|null;
  province?: string|null;

}
