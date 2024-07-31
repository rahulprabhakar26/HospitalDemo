package io.panchayat.hospital.repos;

import io.panchayat.hospital.domain.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
}
