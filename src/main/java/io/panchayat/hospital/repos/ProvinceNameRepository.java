package io.panchayat.hospital.repos;

import io.panchayat.hospital.domain.ProvinceName;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProvinceNameRepository extends JpaRepository<ProvinceName, String> {

    boolean existsByProvinceIdIgnoreCase(String provinceId);

}
