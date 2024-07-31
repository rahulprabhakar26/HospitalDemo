package io.panchayat.hospital.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ProvinceNameDTO {

    @Size(max = 2)
    @ProvinceNameProvinceIdValid
    private String provinceId;

    @NotNull
    @Size(max = 30)
    private String provinceName;

}
