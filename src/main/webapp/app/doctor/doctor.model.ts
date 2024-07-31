export class DoctorDTO {

  constructor(data:Partial<DoctorDTO>) {
    Object.assign(this, data);
  }

  doctorId?: number|null;
  firstName?: string|null;
  lastName?: string|null;
  specialty?: string|null;

}
