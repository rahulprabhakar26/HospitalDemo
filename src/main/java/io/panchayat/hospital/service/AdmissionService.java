package io.panchayat.hospital.service;

import io.panchayat.hospital.domain.Admission;
import io.panchayat.hospital.domain.Doctor;
import io.panchayat.hospital.domain.Patient;
import io.panchayat.hospital.model.AdmissionDTO;
import io.panchayat.hospital.repos.AdmissionRepository;
import io.panchayat.hospital.repos.DoctorRepository;
import io.panchayat.hospital.repos.PatientRepository;
import io.panchayat.hospital.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AdmissionService(final AdmissionRepository admissionRepository,
            final PatientRepository patientRepository, final DoctorRepository doctorRepository) {
        this.admissionRepository = admissionRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<AdmissionDTO> findAll() {
        final List<Admission> admissions = admissionRepository.findAll(Sort.by("id"));
        return admissions.stream()
                .map(admission -> mapToDTO(admission, new AdmissionDTO()))
                .toList();
    }

    public AdmissionDTO get(final Long id) {
        return admissionRepository.findById(id)
                .map(admission -> mapToDTO(admission, new AdmissionDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final AdmissionDTO admissionDTO) {
        final Admission admission = new Admission();
        mapToEntity(admissionDTO, admission);
        return admissionRepository.save(admission).getId();
    }

    public void update(final Long id, final AdmissionDTO admissionDTO) {
        final Admission admission = admissionRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(admissionDTO, admission);
        admissionRepository.save(admission);
    }

    public void delete(final Long id) {
        admissionRepository.deleteById(id);
    }

    private AdmissionDTO mapToDTO(final Admission admission, final AdmissionDTO admissionDTO) {
        admissionDTO.setId(admission.getId());
        admissionDTO.setAdmissionDate(admission.getAdmissionDate());
        admissionDTO.setDischargeDate(admission.getDischargeDate());
        admissionDTO.setDiagnosis(admission.getDiagnosis());
        admissionDTO.setPatient(admission.getPatient() == null ? null : admission.getPatient().getPatientId());
        admissionDTO.setAttendingDoctor(admission.getAttendingDoctor() == null ? null : admission.getAttendingDoctor().getDoctorId());
        return admissionDTO;
    }

    private Admission mapToEntity(final AdmissionDTO admissionDTO, final Admission admission) {
        admission.setAdmissionDate(admissionDTO.getAdmissionDate());
        admission.setDischargeDate(admissionDTO.getDischargeDate());
        admission.setDiagnosis(admissionDTO.getDiagnosis());
        final Patient patient = admissionDTO.getPatient() == null ? null : patientRepository.findById(admissionDTO.getPatient())
                .orElseThrow(() -> new NotFoundException("patient not found"));
        admission.setPatient(patient);
        final Doctor attendingDoctor = admissionDTO.getAttendingDoctor() == null ? null : doctorRepository.findById(admissionDTO.getAttendingDoctor())
                .orElseThrow(() -> new NotFoundException("attendingDoctor not found"));
        admission.setAttendingDoctor(attendingDoctor);
        return admission;
    }

}
