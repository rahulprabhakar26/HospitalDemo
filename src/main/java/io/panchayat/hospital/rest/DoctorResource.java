package io.panchayat.hospital.rest;

import io.panchayat.hospital.model.DoctorDTO;
import io.panchayat.hospital.service.DoctorService;
import io.panchayat.hospital.util.ReferencedException;
import io.panchayat.hospital.util.ReferencedWarning;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping(value = "/api/doctors", produces = MediaType.APPLICATION_JSON_VALUE)
public class DoctorResource {

    private final DoctorService doctorService;

    public DoctorResource(final DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.findAll());
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorDTO> getDoctor(
            @PathVariable(name = "doctorId") final Integer doctorId) {
        return ResponseEntity.ok(doctorService.get(doctorId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createDoctor(@RequestBody @Valid final DoctorDTO doctorDTO) {
        final Integer createdDoctorId = doctorService.create(doctorDTO);
        return new ResponseEntity<>(createdDoctorId, HttpStatus.CREATED);
    }

    @PutMapping("/{doctorId}")
    public ResponseEntity<Integer> updateDoctor(
            @PathVariable(name = "doctorId") final Integer doctorId,
            @RequestBody @Valid final DoctorDTO doctorDTO) {
        doctorService.update(doctorId, doctorDTO);
        return ResponseEntity.ok(doctorId);
    }

    @DeleteMapping("/{doctorId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteDoctor(
            @PathVariable(name = "doctorId") final Integer doctorId) {
        final ReferencedWarning referencedWarning = doctorService.getReferencedWarning(doctorId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        doctorService.delete(doctorId);
        return ResponseEntity.noContent().build();
    }

}
