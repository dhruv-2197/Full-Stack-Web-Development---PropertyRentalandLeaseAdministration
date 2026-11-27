package com.property.rental.repository;

import com.property.rental.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    boolean existsByUnitUnitId(Long unitId);
    boolean existsByTenantTenantId(Long tenantId);

    @Override
    @EntityGraph(attributePaths = {"unit", "unit.property", "tenant"})
    List<MaintenanceRequest> findAll();

    @Override
    @EntityGraph(attributePaths = {"unit", "unit.property", "tenant"})
    Optional<MaintenanceRequest> findById(Long id);

    @EntityGraph(attributePaths = {"unit", "unit.property", "tenant"})
    List<MaintenanceRequest> findByUnitUnitId(Long unitId);

    @EntityGraph(attributePaths = {"unit", "unit.property", "tenant"})
    List<MaintenanceRequest> findByTenantTenantId(Long tenantId);
}
