package com.property.rental.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record MaintenanceRequestDto(
        @NotNull(message = "Unit ID is required")
        @Positive(message = "Unit ID must be valid")
        Long unitId,

        @NotNull(message = "Tenant ID is required")
        @Positive(message = "Tenant ID must be valid")
        Long tenantId,

        @NotNull(message = "Request date is required")
        LocalDate requestDate,

        @NotBlank(message = "Issue category is required")
        @Size(max = 80, message = "Issue category cannot exceed 80 characters")
        String issueCategory,

        @NotBlank(message = "Description is required")
        @Size(min = 5, max = 1000, message = "Description must be between 5 and 1000 characters")
        String description,

        @NotBlank(message = "Priority is required")
        String priority,

        @NotBlank(message = "Status is required")
        String status,

        @Size(max = 255, message = "Resolution notes cannot exceed 255 characters")
        String resolutionNotes
) {
}
