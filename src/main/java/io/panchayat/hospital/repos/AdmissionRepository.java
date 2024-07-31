package io.panchayat.hospital.repos;

import io.panchayat.hospital.domain.Admission;
import io.panchayat.hospital.domain.Doctor;
import io.panchayat.hospital.domain.Patient;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AdmissionRepository extends JpaRepository<Admission, Long> {

    Admission findFirstByPatient(Patient patient);

    Admission findFirstByAttendingDoctor(Doctor doctor);

}
