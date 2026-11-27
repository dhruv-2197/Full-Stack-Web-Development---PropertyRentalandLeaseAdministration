package com.property.rental.service;

import com.property.rental.dto.PropertyRequest;
import com.property.rental.entity.Property;
import com.property.rental.exception.ConflictException;
import com.property.rental.exception.ResourceNotFoundException;
import com.property.rental.repository.PropertyRepository;
import com.property.rental.repository.RentalUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final RentalUnitRepository unitRepository;

    public PropertyService(PropertyRepository propertyRepository, RentalUnitRepository unitRepository) {
        this.propertyRepository = propertyRepository;
        this.unitRepository = unitRepository;
    }

    @Transactional(readOnly = true)
    public List<Property> getAll(String search) {
        if (search != null && !search.isBlank()) {
            String q = search.trim();
            return propertyRepository.findByPropertyCodeContainingIgnoreCaseOrPropertyNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrManagerNameContainingIgnoreCase(
                    q, q, q, q
            );
        }
        return propertyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Property getById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
    }

    public Property create(PropertyRequest request) {
        String code = request.propertyCode().trim();
        if (propertyRepository.existsByPropertyCodeIgnoreCase(code)) {
            throw new ConflictException("Property code already exists: " + code);
        }
        Property property = new Property();
        applyRequest(property, request, code);
        return propertyRepository.save(property);
    }

    public Property update(Long id, PropertyRequest request) {
        Property property = getById(id);
        String code = request.propertyCode().trim();
        if (propertyRepository.existsByPropertyCodeIgnoreCaseAndPropertyIdNot(code, id)) {
            throw new ConflictException("Property code already exists: " + code);
        }
        applyRequest(property, request, code);
        return propertyRepository.save(property);
    }

    public void delete(Long id) {
        Property property = getById(id);
        if (unitRepository.existsByPropertyPropertyId(id)) {
            throw new ConflictException(
                    "Cannot delete property " + property.getPropertyCode() + " because rental units exist under it. Deactivate the property instead."
            );
        }
        propertyRepository.delete(property);
    }

    private void applyRequest(Property property, PropertyRequest request, String code) {
        property.setPropertyCode(code);
        property.setPropertyName(request.propertyName().trim());
        property.setPropertyType(request.propertyType().trim());
        property.setAddress(request.address().trim());
        property.setCity(request.city().trim());
        property.setManagerName(request.managerName().trim());
        property.setActive(request.active());
    }
}
