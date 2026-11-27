package com.property.rental.service;

import com.property.rental.dto.LeaseRequest;
import com.property.rental.dto.LeaseResponse;
import com.property.rental.entity.Lease;
import com.property.rental.entity.RentalUnit;
import com.property.rental.entity.Tenant;
import com.property.rental.exception.BusinessValidationException;
import com.property.rental.exception.ConflictException;
import com.property.rental.exception.ResourceNotFoundException;
import com.property.rental.repository.LeaseRepository;
import com.property.rental.repository.RentalUnitRepository;
import com.property.rental.repository.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LeaseService {

    private final LeaseRepository leaseRepository;
    private final RentalUnitRepository unitRepository;
    private final TenantRepository tenantRepository;

    public LeaseService(
            LeaseRepository leaseRepository,
            RentalUnitRepository unitRepository,
            TenantRepository tenantRepository
    ) {
        this.leaseRepository = leaseRepository;
        this.unitRepository = unitRepository;
        this.tenantRepository = tenantRepository;
    }

    @Transactional(readOnly = true)
    public List<LeaseResponse> getAll(Long unitId, Long tenantId) {
        List<Lease> leases;
        if (unitId != null) {
            leases = leaseRepository.findByUnitUnitId(unitId);
        } else if (tenantId != null) {
            leases = leaseRepository.findByTenantTenantId(tenantId);
        } else {
            leases = leaseRepository.findAll();
        }
        return leases.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public LeaseResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public LeaseResponse create(LeaseRequest request) {
        String leaseNumber = request.leaseNumber().trim();
        if (leaseRepository.existsByLeaseNumberIgnoreCase(leaseNumber)) {
            throw new ConflictException("Lease number already exists: " + leaseNumber);
        }

        validateDates(request);
        String status = normalizeStatus(request.leaseStatus());

        RentalUnit unit = findUnit(request.unitId());
        Tenant tenant = findTenant(request.tenantId());

        if ("Active".equals(status)) {
            if ("Inactive".equalsIgnoreCase(unit.getUnitStatus())) {
                throw new BusinessValidationException("Cannot create an active lease on an inactive unit.");
            }
            if (leaseRepository.existsOverlappingActiveLease(
                    unit.getUnitId(), request.startDate(), request.endDate(), null
            )) {
                throw new ConflictException(
                        "Unit " + unit.getUnitNumber() + " already has an overlapping active lease during "
                                + request.startDate() + " to " + request.endDate() + "."
                );
            }
        }

        Lease lease = new Lease();
        lease.setLeaseNumber(leaseNumber);
        lease.setUnit(unit);
        lease.setTenant(tenant);
        lease.setStartDate(request.startDate());
        lease.setEndDate(request.endDate());
        lease.setMonthlyRent(request.monthlyRent());
        lease.setDepositAmount(request.depositAmount());
        lease.setLeaseStatus(status);

        Lease saved = leaseRepository.save(lease);
        syncUnitStatus(unit);
        return toResponse(saved);
    }

    public LeaseResponse update(Long id, LeaseRequest request) {
        Lease existing = findEntity(id);
        RentalUnit previousUnit = existing.getUnit();

        String leaseNumber = request.leaseNumber().trim();
        if (leaseRepository.existsByLeaseNumberIgnoreCaseAndLeaseIdNot(leaseNumber, id)) {
            throw new ConflictException("Lease number already exists: " + leaseNumber);
        }

        validateDates(request);
        String status = normalizeStatus(request.leaseStatus());

        RentalUnit unit = findUnit(request.unitId());
        Tenant tenant = findTenant(request.tenantId());

        if ("Active".equals(status)) {
            if ("Inactive".equalsIgnoreCase(unit.getUnitStatus())) {
                throw new BusinessValidationException("Cannot activate a lease on an inactive unit.");
            }
            if (leaseRepository.existsOverlappingActiveLease(
                    unit.getUnitId(), request.startDate(), request.endDate(), id
            )) {
                throw new ConflictException(
                        "Unit " + unit.getUnitNumber() + " already has an overlapping active lease during "
                                + request.startDate() + " to " + request.endDate() + "."
                );
            }
        }

        existing.setLeaseNumber(leaseNumber);
        existing.setUnit(unit);
        existing.setTenant(tenant);
        existing.setStartDate(request.startDate());
        existing.setEndDate(request.endDate());
        existing.setMonthlyRent(request.monthlyRent());
        existing.setDepositAmount(request.depositAmount());
        existing.setLeaseStatus(status);

        Lease saved = leaseRepository.save(existing);
        syncUnitStatus(unit);
        if (!previousUnit.getUnitId().equals(unit.getUnitId())) {
            syncUnitStatus(previousUnit);
        }
        return toResponse(saved);
    }

    public void delete(Long id) {
        Lease existing = findEntity(id);
        RentalUnit unit = existing.getUnit();
        leaseRepository.delete(existing);
        leaseRepository.flush();
        syncUnitStatus(unit);
    }

    private void syncUnitStatus(RentalUnit unit) {
        boolean hasActiveLease = leaseRepository.existsByUnitUnitIdAndLeaseStatusIgnoreCase(unit.getUnitId(), "Active");
        if (hasActiveLease) {
            unit.setUnitStatus("Occupied");
            unitRepository.save(unit);
        } else if ("Occupied".equalsIgnoreCase(unit.getUnitStatus())) {
            unit.setUnitStatus("Vacant");
            unitRepository.save(unit);
        }
    }

    private Lease findEntity(Long id) {
        return leaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lease not found with id: " + id));
    }

    private RentalUnit findUnit(Long id) {
        return unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental unit not found with id: " + id));
    }

    private Tenant findTenant(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + id));
    }

    private void validateDates(LeaseRequest request) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new BusinessValidationException("Lease end date cannot be earlier than start date.");
        }
    }

    private String normalizeStatus(String raw) {
        String s = raw == null ? "" : raw.trim();
        if (s.equalsIgnoreCase("Active")) return "Active";
        if (s.equalsIgnoreCase("Expired")) return "Expired";
        if (s.equalsIgnoreCase("Terminated")) return "Terminated";
        if (s.equalsIgnoreCase("Pending")) return "Pending";
        throw new BusinessValidationException("Invalid lease status. Allowed values: Active, Pending, Expired, Terminated.");
    }

    private LeaseResponse toResponse(Lease l) {
        return new LeaseResponse(
                l.getLeaseId(),
                l.getLeaseNumber(),
                l.getUnit().getUnitId(),
                l.getUnit().getUnitNumber(),
                l.getUnit().getProperty().getPropertyId(),
                l.getUnit().getProperty().getPropertyName(),
                l.getTenant().getTenantId(),
                l.getTenant().getTenantCode(),
                l.getTenant().getFullName(),
                l.getStartDate(),
                l.getEndDate(),
                l.getMonthlyRent(),
                l.getDepositAmount(),
                l.getLeaseStatus()
        );
    }
}
