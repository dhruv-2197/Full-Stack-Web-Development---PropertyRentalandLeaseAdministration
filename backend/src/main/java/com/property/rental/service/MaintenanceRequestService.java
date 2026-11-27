package com.property.rental.service;

import com.property.rental.dto.MaintenanceRequestDto;
import com.property.rental.dto.MaintenanceResponse;
import com.property.rental.entity.MaintenanceRequest;
import com.property.rental.entity.RentalUnit;
import com.property.rental.entity.Tenant;
import com.property.rental.exception.BusinessValidationException;
import com.property.rental.exception.ResourceNotFoundException;
import com.property.rental.repository.MaintenanceRequestRepository;
import com.property.rental.repository.RentalUnitRepository;
import com.property.rental.repository.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository maintenanceRepository;
    private final RentalUnitRepository unitRepository;
    private final TenantRepository tenantRepository;

    public MaintenanceRequestService(
            MaintenanceRequestRepository maintenanceRepository,
            RentalUnitRepository unitRepository,
            TenantRepository tenantRepository
    ) {
        this.maintenanceRepository = maintenanceRepository;
        this.unitRepository = unitRepository;
        this.tenantRepository = tenantRepository;
    }

    @Transactional(readOnly = true)
    public List<MaintenanceResponse> getAll(Long unitId, Long tenantId) {
        List<MaintenanceRequest> list;
        if (unitId != null) {
            list = maintenanceRepository.findByUnitUnitId(unitId);
        } else if (tenantId != null) {
            list = maintenanceRepository.findByTenantTenantId(tenantId);
        } else {
            list = maintenanceRepository.findAll();
        }
        return list.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public MaintenanceResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public MaintenanceResponse create(MaintenanceRequestDto request) {
        RentalUnit unit = findUnit(request.unitId());
        Tenant tenant = findTenant(request.tenantId());

        MaintenanceRequest entity = new MaintenanceRequest();
        applyRequest(entity, request, unit, tenant);
        return toResponse(maintenanceRepository.save(entity));
    }

    public MaintenanceResponse update(Long id, MaintenanceRequestDto request) {
        MaintenanceRequest existing = findEntity(id);
        RentalUnit unit = findUnit(request.unitId());
        Tenant tenant = findTenant(request.tenantId());

        applyRequest(existing, request, unit, tenant);
        return toResponse(maintenanceRepository.save(existing));
    }

    public void delete(Long id) {
        MaintenanceRequest existing = findEntity(id);
        maintenanceRepository.delete(existing);
    }

    private void applyRequest(
            MaintenanceRequest entity,
            MaintenanceRequestDto request,
            RentalUnit unit,
            Tenant tenant
    ) {
        entity.setUnit(unit);
        entity.setTenant(tenant);
        entity.setRequestDate(request.requestDate());
        entity.setIssueCategory(request.issueCategory().trim());
        entity.setDescription(request.description().trim());
        entity.setPriority(normalizePriority(request.priority()));
        entity.setStatus(normalizeStatus(request.status()));
        entity.setResolutionNotes(request.resolutionNotes() != null && !request.resolutionNotes().isBlank()
                ? request.resolutionNotes().trim()
                : null);
    }

    private MaintenanceRequest findEntity(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance request not found with id: " + id));
    }

    private RentalUnit findUnit(Long id) {
        return unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental unit not found with id: " + id));
    }

    private Tenant findTenant(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + id));
    }

    private String normalizePriority(String raw) {
        String p = raw == null ? "" : raw.trim();
        if (p.equalsIgnoreCase("Low")) return "Low";
        if (p.equalsIgnoreCase("Medium")) return "Medium";
        if (p.equalsIgnoreCase("High")) return "High";
        if (p.equalsIgnoreCase("Urgent")) return "Urgent";
        throw new BusinessValidationException("Invalid priority. Allowed values: Low, Medium, High, Urgent.");
    }

    private String normalizeStatus(String raw) {
        String s = raw == null ? "" : raw.trim();
        if (s.equalsIgnoreCase("Open")) return "Open";
        if (s.equalsIgnoreCase("Assigned")) return "Assigned";
        if (s.equalsIgnoreCase("In Progress")) return "In Progress";
        if (s.equalsIgnoreCase("Resolved")) return "Resolved";
        throw new BusinessValidationException("Invalid status. Allowed values: Open, Assigned, In Progress, Resolved.");
    }

    private MaintenanceResponse toResponse(MaintenanceRequest r) {
        return new MaintenanceResponse(
                r.getRequestId(),
                r.getUnit().getUnitId(),
                r.getUnit().getUnitNumber(),
                r.getUnit().getProperty().getPropertyName(),
                r.getTenant().getTenantId(),
                r.getTenant().getTenantCode(),
                r.getTenant().getFullName(),
                r.getRequestDate(),
                r.getIssueCategory(),
                r.getDescription(),
                r.getPriority(),
                r.getStatus(),
                r.getResolutionNotes()
        );
    }
}
