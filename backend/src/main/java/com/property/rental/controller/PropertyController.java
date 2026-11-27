package com.property.rental.controller;

import com.property.rental.dto.PropertyRequest;
import com.property.rental.entity.Property;
import com.property.rental.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public List<Property> getAll(@RequestParam(required = false) String search) {
        return propertyService.getAll(search);
    }

    @GetMapping("/{id}")
    public Property getById(@PathVariable Long id) {
        return propertyService.getById(id);
    }

    @PostMapping
    public ResponseEntity<Property> create(@Valid @RequestBody PropertyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyService.create(request));
    }

    @PutMapping("/{id}")
    public Property update(@PathVariable Long id, @Valid @RequestBody PropertyRequest request) {
        return propertyService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        propertyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
