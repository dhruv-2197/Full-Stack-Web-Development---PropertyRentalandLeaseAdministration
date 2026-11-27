package com.property.rental.controller;

import com.property.rental.dto.MaintenanceRequestDto;
import com.property.rental.dto.MaintenanceResponse;
import com.property.rental.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-requests")
public class MaintenanceRequestController {

    private final MaintenanceRequestService maintenanceService;

    public MaintenanceRequestController(MaintenanceRequestService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public List<MaintenanceResponse> getAll(
            @RequestParam(required = false) Long unitId,
            @RequestParam(required = false) Long tenantId
    ) {
        return maintenanceService.getAll(unitId, tenantId);
    }

    @GetMapping("/{id}")
    public MaintenanceResponse getById(@PathVariable Long id) {
        return maintenanceService.getById(id);
    }

    @PostMapping
    public ResponseEntity<MaintenanceResponse> create(@Valid @RequestBody MaintenanceRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.create(request));
    }

    @PutMapping("/{id}")
    public MaintenanceResponse update(@PathVariable Long id, @Valid @RequestBody MaintenanceRequestDto request) {
        return maintenanceService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        maintenanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
