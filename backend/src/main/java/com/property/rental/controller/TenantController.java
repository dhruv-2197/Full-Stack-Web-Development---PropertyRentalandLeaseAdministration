package com.property.rental.controller;

import com.property.rental.dto.TenantRequest;
import com.property.rental.entity.Tenant;
import com.property.rental.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping
    public List<Tenant> getAll(@RequestParam(required = false) String search) {
        return tenantService.getAll(search);
    }

    @GetMapping("/{id}")
    public Tenant getById(@PathVariable Long id) {
        return tenantService.getById(id);
    }

    @PostMapping
    public ResponseEntity<Tenant> create(@Valid @RequestBody TenantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tenantService.create(request));
    }

    @PutMapping("/{id}")
    public Tenant update(@PathVariable Long id, @Valid @RequestBody TenantRequest request) {
        return tenantService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tenantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
