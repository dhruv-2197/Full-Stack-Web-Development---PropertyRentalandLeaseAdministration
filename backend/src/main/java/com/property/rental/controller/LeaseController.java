package com.property.rental.controller;

import com.property.rental.dto.LeaseRequest;
import com.property.rental.dto.LeaseResponse;
import com.property.rental.service.LeaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leases")
public class LeaseController {

    private final LeaseService leaseService;

    public LeaseController(LeaseService leaseService) {
        this.leaseService = leaseService;
    }

    @GetMapping
    public List<LeaseResponse> getAll(
            @RequestParam(required = false) Long unitId,
            @RequestParam(required = false) Long tenantId
    ) {
        return leaseService.getAll(unitId, tenantId);
    }

    @GetMapping("/{id}")
    public LeaseResponse getById(@PathVariable Long id) {
        return leaseService.getById(id);
    }

    @PostMapping
    public ResponseEntity<LeaseResponse> create(@Valid @RequestBody LeaseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaseService.create(request));
    }

    @PutMapping("/{id}")
    public LeaseResponse update(@PathVariable Long id, @Valid @RequestBody LeaseRequest request) {
        return leaseService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leaseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
