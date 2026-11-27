package com.property.rental.service;

import com.property.rental.dto.TenantRequest;
import com.property.rental.entity.Tenant;
import com.property.rental.exception.ConflictException;
import com.property.rental.exception.ResourceNotFoundException;
import com.property.rental.repository.LeaseRepository;
import com.property.rental.repository.MaintenanceRequestRepository;
import com.property.rental.repository.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TenantService {

    private final TenantRepository tenantRepository;
    private final LeaseRepository leaseRepository;
    private final MaintenanceRequestRepository maintenanceRepository;

    public TenantService(
            TenantRepository tenantRepository,
            LeaseRepository leaseRepository,
            MaintenanceRequestRepository maintenanceRepository
    ) {
        this.tenantRepository = tenantRepository;
        this.leaseRepository = leaseRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    @Transactional(readOnly = true)
    public List<Tenant> getAll(String search) {
        if (search != null && !search.isBlank()) {
            String q = search.trim();
            return tenantRepository.findByTenantCodeContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                    q, q, q, q
            );
        }
        return tenantRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tenant getById(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + id));
    }

    public Tenant create(TenantRequest request) {
        String code = request.tenantCode().trim();
        if (tenantRepository.existsByTenantCodeIgnoreCase(code)) {
            throw new ConflictException("Tenant code already exists: " + code);
        }
        Tenant tenant = new Tenant();
        applyRequest(tenant, request, code);
        return tenantRepository.save(tenant);
    }

    public Tenant update(Long id, TenantRequest request) {
        Tenant tenant = getById(id);
        String code = request.tenantCode().trim();
        if (tenantRepository.existsByTenantCodeIgnoreCaseAndTenantIdNot(code, id)) {
            throw new ConflictException("Tenant code already exists: " + code);
        }
        applyRequest(tenant, request, code);
        return tenantRepository.save(tenant);
    }

    public void delete(Long id) {
        Tenant tenant = getById(id);
        if (leaseRepository.existsByTenantTenantId(id)) {
            throw new ConflictException(
                    "Cannot delete tenant " + tenant.getTenantCode() + " because lease history exists."
            );
        }
        if (maintenanceRepository.existsByTenantTenantId(id)) {
            throw new ConflictException(
                    "Cannot delete tenant " + tenant.getTenantCode() + " because maintenance requests exist for this tenant."
            );
        }
        tenantRepository.delete(tenant);
    }

    private void applyRequest(Tenant tenant, TenantRequest request, String code) {
        tenant.setTenantCode(code);
        tenant.setFullName(request.fullName().trim());
        tenant.setPhone(request.phone().trim());
        tenant.setEmail(request.email().trim());
        tenant.setCurrentAddress(request.currentAddress() != null && !request.currentAddress().isBlank()
                ? request.currentAddress().trim()
                : null);
    }
}
