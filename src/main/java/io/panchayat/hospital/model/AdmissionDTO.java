package io.panchayat.hospital.model;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AdmissionDTO {

    private Long id;

    private LocalDate admissionDate;

    private LocalDate dischargeDate;

    @Size(max = 50)
    private String diagnosis;

    private Integer patient;

    private Integer attendingDoctor;

}
