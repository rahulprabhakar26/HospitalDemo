package io.panchayat.hospital.repos;

import io.panchayat.hospital.domain.Patient;
import io.panchayat.hospital.domain.ProvinceName;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PatientRepository extends JpaRepository<Patient, Integer> {

    Patient findFirstByProvince(ProvinceName provinceName);

}
