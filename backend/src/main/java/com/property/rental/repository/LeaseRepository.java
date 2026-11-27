package com.property.rental.repository;

import com.property.rental.entity.Lease;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LeaseRepository extends JpaRepository<Lease, Long> {
    boolean existsByLeaseNumberIgnoreCase(String leaseNumber);
    boolean existsByLeaseNumberIgnoreCaseAndLeaseIdNot(String leaseNumber, Long leaseId);

    boolean existsByUnitUnitId(Long unitId);
    boolean existsByTenantTenantId(Long tenantId);
    boolean existsByUnitUnitIdAndLeaseStatusIgnoreCase(Long unitId, String leaseStatus);

    @Query("""
            SELECT COUNT(l) > 0 FROM Lease l
            WHERE l.unit.unitId = :unitId
              AND LOWER(l.leaseStatus) = 'active'
              AND l.startDate <= :endDate
              AND l.endDate >= :startDate
              AND (:excludeLeaseId IS NULL OR l.leaseId <> :excludeLeaseId)
            """)
    boolean existsOverlappingActiveLease(
            @Param("unitId") Long unitId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("excludeLeaseId") Long excludeLeaseId
    );

    @Override
    @EntityGraph(attributePaths = {"unit", "unit.property", "tenant"})
    List<Lease> findAll();

    @Override
    @EntityGraph(attributePaths = {"unit", "unit.property", "tenant"})
    Optional<Lease> findById(Long id);

    @EntityGraph(attributePaths = {"unit", "unit.property", "tenant"})
    List<Lease> findByUnitUnitId(Long unitId);

    @EntityGraph(attributePaths = {"unit", "unit.property", "tenant"})
    List<Lease> findByTenantTenantId(Long tenantId);
}
