package com.property.rental.repository;

import com.property.rental.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    boolean existsByTenantCodeIgnoreCase(String tenantCode);
    boolean existsByTenantCodeIgnoreCaseAndTenantIdNot(String tenantCode, Long tenantId);

    List<Tenant> findByTenantCodeContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String tenantCode, String fullName, String email, String phone
    );
}
