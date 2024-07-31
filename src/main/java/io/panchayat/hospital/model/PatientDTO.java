package io.panchayat.hospital.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PatientDTO {

    private Integer patientId;

    @NotNull
    @Size(max = 30)
    private String firstName;

    @NotNull
    @Size(max = 30)
    private String lastName;

    private Boolean gender;

    private LocalDate birthDate;

    @Size(max = 30)
    private String city;

    @Size(max = 80)
    private String allergies;

    @Digits(integer = 3, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "89.08")
    private BigDecimal height;

    @Digits(integer = 4, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "24.08")
    private BigDecimal weight;

    @Size(max = 2)
    private String province;

}
