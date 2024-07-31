package io.panchayat.hospital.service;

import io.panchayat.hospital.domain.Admission;
import io.panchayat.hospital.domain.Doctor;
import io.panchayat.hospital.model.DoctorDTO;
import io.panchayat.hospital.repos.AdmissionRepository;
import io.panchayat.hospital.repos.DoctorRepository;
import io.panchayat.hospital.util.NotFoundException;
import io.panchayat.hospital.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AdmissionRepository admissionRepository;

    public DoctorService(final DoctorRepository doctorRepository,
            final AdmissionRepository admissionRepository) {
        this.doctorRepository = doctorRepository;
        this.admissionRepository = admissionRepository;
    }

    public List<DoctorDTO> findAll() {
        final List<Doctor> doctors = doctorRepository.findAll(Sort.by("doctorId"));
        return doctors.stream()
                .map(doctor -> mapToDTO(doctor, new DoctorDTO()))
                .toList();
    }

    public DoctorDTO get(final Integer doctorId) {
        return doctorRepository.findById(doctorId)
                .map(doctor -> mapToDTO(doctor, new DoctorDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final DoctorDTO doctorDTO) {
        final Doctor doctor = new Doctor();
        mapToEntity(doctorDTO, doctor);
        return doctorRepository.save(doctor).getDoctorId();
    }

    public void update(final Integer doctorId, final DoctorDTO doctorDTO) {
        final Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(doctorDTO, doctor);
        doctorRepository.save(doctor);
    }

    public void delete(final Integer doctorId) {
        doctorRepository.deleteById(doctorId);
    }

    private DoctorDTO mapToDTO(final Doctor doctor, final DoctorDTO doctorDTO) {
        doctorDTO.setDoctorId(doctor.getDoctorId());
        doctorDTO.setFirstName(doctor.getFirstName());
        doctorDTO.setLastName(doctor.getLastName());
        doctorDTO.setSpecialty(doctor.getSpecialty());
        return doctorDTO;
    }

    private Doctor mapToEntity(final DoctorDTO doctorDTO, final Doctor doctor) {
        doctor.setFirstName(doctorDTO.getFirstName());
        doctor.setLastName(doctorDTO.getLastName());
        doctor.setSpecialty(doctorDTO.getSpecialty());
        return doctor;
    }

    public ReferencedWarning getReferencedWarning(final Integer doctorId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(NotFoundException::new);
        final Admission attendingDoctorAdmission = admissionRepository.findFirstByAttendingDoctor(doctor);
        if (attendingDoctorAdmission != null) {
            referencedWarning.setKey("doctor.admission.attendingDoctor.referenced");
            referencedWarning.addParam(attendingDoctorAdmission.getId());
            return referencedWarning;
        }
        return null;
    }

}
