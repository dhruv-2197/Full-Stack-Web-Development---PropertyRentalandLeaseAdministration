package com.property.rental.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record LeaseResponse(
        Long leaseId,
        String leaseNumber,
        Long unitId,
        String unitNumber,
        Long propertyId,
        String propertyName,
        Long tenantId,
        String tenantCode,
        String tenantName,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal monthlyRent,
        BigDecimal depositAmount,
        String leaseStatus
) {
}
