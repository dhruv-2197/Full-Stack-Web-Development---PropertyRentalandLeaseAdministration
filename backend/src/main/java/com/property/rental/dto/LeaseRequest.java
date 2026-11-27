package com.property.rental.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record LeaseRequest(
        @NotBlank(message = "Lease number is required")
        @Size(max = 30, message = "Lease number cannot exceed 30 characters")
        String leaseNumber,

        @NotNull(message = "Unit ID is required")
        @Positive(message = "Unit ID must be valid")
        Long unitId,

        @NotNull(message = "Tenant ID is required")
        @Positive(message = "Tenant ID must be valid")
        Long tenantId,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        LocalDate endDate,

        @NotNull(message = "Monthly rent is required")
        @DecimalMin(value = "0.01", message = "Monthly rent must be greater than 0")
        BigDecimal monthlyRent,

        @NotNull(message = "Deposit amount is required")
        @DecimalMin(value = "0.00", message = "Deposit amount cannot be negative")
        BigDecimal depositAmount,

        @NotBlank(message = "Lease status is required")
        String leaseStatus
) {
}
