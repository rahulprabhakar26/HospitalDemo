package io.panchayat.hospital.service;

import io.panchayat.hospital.domain.Admission;
import io.panchayat.hospital.domain.Patient;
import io.panchayat.hospital.domain.ProvinceName;
import io.panchayat.hospital.model.PatientDTO;
import io.panchayat.hospital.repos.AdmissionRepository;
import io.panchayat.hospital.repos.PatientRepository;
import io.panchayat.hospital.repos.ProvinceNameRepository;
import io.panchayat.hospital.util.NotFoundException;
import io.panchayat.hospital.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final ProvinceNameRepository provinceNameRepository;
    private final AdmissionRepository admissionRepository;

    public PatientService(final PatientRepository patientRepository,
            final ProvinceNameRepository provinceNameRepository,
            final AdmissionRepository admissionRepository) {
        this.patientRepository = patientRepository;
        this.provinceNameRepository = provinceNameRepository;
        this.admissionRepository = admissionRepository;
    }

    public List<PatientDTO> findAll() {
        final List<Patient> patients = patientRepository.findAll(Sort.by("patientId"));
        return patients.stream()
                .map(patient -> mapToDTO(patient, new PatientDTO()))
                .toList();
    }

    public PatientDTO get(final Integer patientId) {
        return patientRepository.findById(patientId)
                .map(patient -> mapToDTO(patient, new PatientDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final PatientDTO patientDTO) {
        final Patient patient = new Patient();
        mapToEntity(patientDTO, patient);
        return patientRepository.save(patient).getPatientId();
    }

    public void update(final Integer patientId, final PatientDTO patientDTO) {
        final Patient patient = patientRepository.findById(patientId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(patientDTO, patient);
        patientRepository.save(patient);
    }

    public void delete(final Integer patientId) {
        patientRepository.deleteById(patientId);
    }

    private PatientDTO mapToDTO(final Patient patient, final PatientDTO patientDTO) {
        patientDTO.setPatientId(patient.getPatientId());
        patientDTO.setFirstName(patient.getFirstName());
        patientDTO.setLastName(patient.getLastName());
        patientDTO.setGender(patient.getGender());
        patientDTO.setBirthDate(patient.getBirthDate());
        patientDTO.setCity(patient.getCity());
        patientDTO.setAllergies(patient.getAllergies());
        patientDTO.setHeight(patient.getHeight());
        patientDTO.setWeight(patient.getWeight());
        patientDTO.setProvince(patient.getProvince() == null ? null : patient.getProvince().getProvinceId());
        return patientDTO;
    }

    private Patient mapToEntity(final PatientDTO patientDTO, final Patient patient) {
        patient.setFirstName(patientDTO.getFirstName());
        patient.setLastName(patientDTO.getLastName());
        patient.setGender(patientDTO.getGender());
        patient.setBirthDate(patientDTO.getBirthDate());
        patient.setCity(patientDTO.getCity());
        patient.setAllergies(patientDTO.getAllergies());
        patient.setHeight(patientDTO.getHeight());
        patient.setWeight(patientDTO.getWeight());
        final ProvinceName province = patientDTO.getProvince() == null ? null : provinceNameRepository.findById(patientDTO.getProvince())
                .orElseThrow(() -> new NotFoundException("province not found"));
        patient.setProvince(province);
        return patient;
    }

    public ReferencedWarning getReferencedWarning(final Integer patientId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Patient patient = patientRepository.findById(patientId)
                .orElseThrow(NotFoundException::new);
        final Admission patientAdmission = admissionRepository.findFirstByPatient(patient);
        if (patientAdmission != null) {
            referencedWarning.setKey("patient.admission.patient.referenced");
            referencedWarning.addParam(patientAdmission.getId());
            return referencedWarning;
        }
        return null;
    }

}
