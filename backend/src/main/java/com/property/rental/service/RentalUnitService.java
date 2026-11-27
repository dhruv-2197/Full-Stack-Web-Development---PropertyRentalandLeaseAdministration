package com.property.rental.service;

import com.property.rental.dto.RentalUnitRequest;
import com.property.rental.dto.RentalUnitResponse;
import com.property.rental.entity.Property;
import com.property.rental.entity.RentalUnit;
import com.property.rental.exception.BusinessValidationException;
import com.property.rental.exception.ConflictException;
import com.property.rental.exception.ResourceNotFoundException;
import com.property.rental.repository.LeaseRepository;
import com.property.rental.repository.MaintenanceRequestRepository;
import com.property.rental.repository.PropertyRepository;
import com.property.rental.repository.RentalUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RentalUnitService {

    private final RentalUnitRepository unitRepository;
    private final PropertyRepository propertyRepository;
    private final LeaseRepository leaseRepository;
    private final MaintenanceRequestRepository maintenanceRepository;

    public RentalUnitService(
            RentalUnitRepository unitRepository,
            PropertyRepository propertyRepository,
            LeaseRepository leaseRepository,
            MaintenanceRequestRepository maintenanceRepository
    ) {
        this.unitRepository = unitRepository;
        this.propertyRepository = propertyRepository;
        this.leaseRepository = leaseRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    @Transactional(readOnly = true)
    public List<RentalUnitResponse> getAll(Long propertyId) {
        List<RentalUnit> units = (propertyId != null)
                ? unitRepository.findByPropertyPropertyId(propertyId)
                : unitRepository.findAll();
        return units.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public RentalUnitResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public RentalUnitResponse create(RentalUnitRequest request) {
        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + request.propertyId()));
        if (!Boolean.TRUE.equals(property.getActive())) {
            throw new BusinessValidationException("Cannot add a rental unit to an inactive property.");
        }

        String unitNumber = request.unitNumber().trim();
        if (unitRepository.existsByPropertyPropertyIdAndUnitNumberIgnoreCase(property.getPropertyId(), unitNumber)) {
            throw new ConflictException(
                    "Unit " + unitNumber + " already exists in property " + property.getPropertyName() + "."
            );
        }

        RentalUnit unit = new RentalUnit();
        unit.setProperty(property);
        unit.setUnitNumber(unitNumber);
        unit.setFloor(request.floor());
        unit.setBedrooms(request.bedrooms());
        unit.setMonthlyRent(request.monthlyRent());
        unit.setUnitStatus(normalizeStatus(request.unitStatus()));

        return toResponse(unitRepository.save(unit));
    }

    public RentalUnitResponse update(Long id, RentalUnitRequest request) {
        RentalUnit unit = findEntity(id);
        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + request.propertyId()));

        String unitNumber = request.unitNumber().trim();
        if (unitRepository.existsByPropertyPropertyIdAndUnitNumberIgnoreCaseAndUnitIdNot(
                property.getPropertyId(), unitNumber, id
        )) {
            throw new ConflictException(
                    "Unit " + unitNumber + " already exists in property " + property.getPropertyName() + "."
            );
        }

        unit.setProperty(property);
        unit.setUnitNumber(unitNumber);
        unit.setFloor(request.floor());
        unit.setBedrooms(request.bedrooms());
        unit.setMonthlyRent(request.monthlyRent());
        unit.setUnitStatus(normalizeStatus(request.unitStatus()));

        return toResponse(unitRepository.save(unit));
    }

    public void delete(Long id) {
        RentalUnit unit = findEntity(id);
        if (leaseRepository.existsByUnitUnitId(id)) {
            throw new ConflictException(
                    "Cannot delete unit " + unit.getUnitNumber() + " because lease history exists. Mark the unit Inactive instead."
            );
        }
        if (maintenanceRepository.existsByUnitUnitId(id)) {
            throw new ConflictException(
                    "Cannot delete unit " + unit.getUnitNumber() + " because maintenance requests exist for it."
            );
        }
        unitRepository.delete(unit);
    }

    private RentalUnit findEntity(Long id) {
        return unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental unit not found with id: " + id));
    }

    private String normalizeStatus(String raw) {
        String s = raw == null ? "" : raw.trim();
        if (s.equalsIgnoreCase("Vacant")) return "Vacant";
        if (s.equalsIgnoreCase("Occupied")) return "Occupied";
        if (s.equalsIgnoreCase("Maintenance")) return "Maintenance";
        if (s.equalsIgnoreCase("Inactive")) return "Inactive";
        throw new BusinessValidationException("Invalid unit status. Allowed values: Vacant, Occupied, Maintenance, Inactive.");
    }

    private RentalUnitResponse toResponse(RentalUnit u) {
        return new RentalUnitResponse(
                u.getUnitId(),
                u.getProperty().getPropertyId(),
                u.getProperty().getPropertyCode(),
                u.getProperty().getPropertyName(),
                u.getProperty().getCity(),
                u.getUnitNumber(),
                u.getFloor(),
                u.getBedrooms(),
                u.getMonthlyRent(),
                u.getUnitStatus()
        );
    }
}
