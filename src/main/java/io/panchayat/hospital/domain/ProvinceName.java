package io.panchayat.hospital.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class ProvinceName {

    @Id
    @Column(nullable = false, updatable = false, length = 2)
    private String provinceId;

    @Column(nullable = false, length = 30)
    private String provinceName;

    @OneToMany(mappedBy = "province")
    private Set<Patient> provincePatients;

}
