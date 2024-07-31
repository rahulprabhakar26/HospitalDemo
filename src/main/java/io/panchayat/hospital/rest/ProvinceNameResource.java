package io.panchayat.hospital.rest;

import io.panchayat.hospital.model.ProvinceNameDTO;
import io.panchayat.hospital.service.ProvinceNameService;
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
@RequestMapping(value = "/api/provinceNames", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProvinceNameResource {

    private final ProvinceNameService provinceNameService;

    public ProvinceNameResource(final ProvinceNameService provinceNameService) {
        this.provinceNameService = provinceNameService;
    }

    @GetMapping
    public ResponseEntity<List<ProvinceNameDTO>> getAllProvinceNames() {
        return ResponseEntity.ok(provinceNameService.findAll());
    }

    @GetMapping("/{provinceId}")
    public ResponseEntity<ProvinceNameDTO> getProvinceName(
            @PathVariable(name = "provinceId") final String provinceId) {
        return ResponseEntity.ok(provinceNameService.get(provinceId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<String> createProvinceName(
            @RequestBody @Valid final ProvinceNameDTO provinceNameDTO) {
        final String createdProvinceId = provinceNameService.create(provinceNameDTO);
        return new ResponseEntity<>('"' + createdProvinceId + '"', HttpStatus.CREATED);
    }

    @PutMapping("/{provinceId}")
    public ResponseEntity<String> updateProvinceName(
            @PathVariable(name = "provinceId") final String provinceId,
            @RequestBody @Valid final ProvinceNameDTO provinceNameDTO) {
        provinceNameService.update(provinceId, provinceNameDTO);
        return ResponseEntity.ok('"' + provinceId + '"');
    }

    @DeleteMapping("/{provinceId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteProvinceName(
            @PathVariable(name = "provinceId") final String provinceId) {
        final ReferencedWarning referencedWarning = provinceNameService.getReferencedWarning(provinceId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        provinceNameService.delete(provinceId);
        return ResponseEntity.noContent().build();
    }

}
