package com.property.rental.dto;

import java.time.LocalDate;

public record MaintenanceResponse(
        Long requestId,
        Long unitId,
        String unitNumber,
        String propertyName,
        Long tenantId,
        String tenantCode,
        String tenantName,
        LocalDate requestDate,
        String issueCategory,
        String description,
        String priority,
        String status,
        String resolutionNotes
) {
}
