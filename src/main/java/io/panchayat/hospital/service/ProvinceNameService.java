package io.panchayat.hospital.service;

import io.panchayat.hospital.domain.Patient;
import io.panchayat.hospital.domain.ProvinceName;
import io.panchayat.hospital.model.ProvinceNameDTO;
import io.panchayat.hospital.repos.PatientRepository;
import io.panchayat.hospital.repos.ProvinceNameRepository;
import io.panchayat.hospital.util.NotFoundException;
import io.panchayat.hospital.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ProvinceNameService {

    private final ProvinceNameRepository provinceNameRepository;
    private final PatientRepository patientRepository;

    public ProvinceNameService(final ProvinceNameRepository provinceNameRepository,
            final PatientRepository patientRepository) {
        this.provinceNameRepository = provinceNameRepository;
        this.patientRepository = patientRepository;
    }

    public List<ProvinceNameDTO> findAll() {
        final List<ProvinceName> provinceNames = provinceNameRepository.findAll(Sort.by("provinceId"));
        return provinceNames.stream()
                .map(provinceName -> mapToDTO(provinceName, new ProvinceNameDTO()))
                .toList();
    }

    public ProvinceNameDTO get(final String provinceId) {
        return provinceNameRepository.findById(provinceId)
                .map(provinceName -> mapToDTO(provinceName, new ProvinceNameDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public String create(final ProvinceNameDTO provinceNameDTO) {
        final ProvinceName provinceName = new ProvinceName();
        mapToEntity(provinceNameDTO, provinceName);
        provinceName.setProvinceId(provinceNameDTO.getProvinceId());
        return provinceNameRepository.save(provinceName).getProvinceId();
    }

    public void update(final String provinceId, final ProvinceNameDTO provinceNameDTO) {
        final ProvinceName provinceName = provinceNameRepository.findById(provinceId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(provinceNameDTO, provinceName);
        provinceNameRepository.save(provinceName);
    }

    public void delete(final String provinceId) {
        provinceNameRepository.deleteById(provinceId);
    }

    private ProvinceNameDTO mapToDTO(final ProvinceName provinceName,
            final ProvinceNameDTO provinceNameDTO) {
        provinceNameDTO.setProvinceId(provinceName.getProvinceId());
        provinceNameDTO.setProvinceName(provinceName.getProvinceName());
        return provinceNameDTO;
    }

    private ProvinceName mapToEntity(final ProvinceNameDTO provinceNameDTO,
            final ProvinceName provinceName) {
        provinceName.setProvinceName(provinceNameDTO.getProvinceName());
        return provinceName;
    }

    public boolean provinceIdExists(final String provinceId) {
        return provinceNameRepository.existsByProvinceIdIgnoreCase(provinceId);
    }

    public ReferencedWarning getReferencedWarning(final String provinceId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final ProvinceName provinceName = provinceNameRepository.findById(provinceId)
                .orElseThrow(NotFoundException::new);
        final Patient provincePatient = patientRepository.findFirstByProvince(provinceName);
        if (provincePatient != null) {
            referencedWarning.setKey("provinceName.patient.province.referenced");
            referencedWarning.addParam(provincePatient.getPatientId());
            return referencedWarning;
        }
        return null;
    }

}
