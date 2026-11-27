package com.property.rental.controller;

import com.property.rental.dto.RentalUnitRequest;
import com.property.rental.dto.RentalUnitResponse;
import com.property.rental.service.RentalUnitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
public class RentalUnitController {

    private final RentalUnitService unitService;

    public RentalUnitController(RentalUnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping
    public List<RentalUnitResponse> getAll(@RequestParam(required = false) Long propertyId) {
        return unitService.getAll(propertyId);
    }

    @GetMapping("/{id}")
    public RentalUnitResponse getById(@PathVariable Long id) {
        return unitService.getById(id);
    }

    @PostMapping
    public ResponseEntity<RentalUnitResponse> create(@Valid @RequestBody RentalUnitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(unitService.create(request));
    }

    @PutMapping("/{id}")
    public RentalUnitResponse update(@PathVariable Long id, @Valid @RequestBody RentalUnitRequest request) {
        return unitService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        unitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
