package io.panchayat.hospital.rest;

import io.panchayat.hospital.domain.Doctor;
import io.panchayat.hospital.domain.Patient;
import io.panchayat.hospital.model.AdmissionDTO;
import io.panchayat.hospital.repos.DoctorRepository;
import io.panchayat.hospital.repos.PatientRepository;
import io.panchayat.hospital.service.AdmissionService;
import io.panchayat.hospital.util.CustomCollectors;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/admissions", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdmissionResource {

    private final AdmissionService admissionService;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AdmissionResource(final AdmissionService admissionService,
            final PatientRepository patientRepository, final DoctorRepository doctorRepository) {
        this.admissionService = admissionService;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public ResponseEntity<List<AdmissionDTO>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdmissionDTO> getAdmission(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(admissionService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createAdmission(
            @RequestBody @Valid final AdmissionDTO admissionDTO) {
        final Long createdId = admissionService.create(admissionDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateAdmission(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final AdmissionDTO admissionDTO) {
        admissionService.update(id, admissionDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteAdmission(@PathVariable(name = "id") final Long id) {
        admissionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patientValues")
    public ResponseEntity<Map<Integer, String>> getPatientValues() {
        return ResponseEntity.ok(patientRepository.findAll(Sort.by("patientId"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Patient::getPatientId, Patient::getFirstName)));
    }

    @GetMapping("/attendingDoctorValues")
    public ResponseEntity<Map<Integer, String>> getAttendingDoctorValues() {
        return ResponseEntity.ok(doctorRepository.findAll(Sort.by("doctorId"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Doctor::getDoctorId, Doctor::getFirstName)));
    }

}
