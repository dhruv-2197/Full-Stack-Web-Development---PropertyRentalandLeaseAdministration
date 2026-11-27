package com.property.rental.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record RentalUnitRequest(
        @NotNull(message = "Property ID is required")
        @Positive(message = "Property ID must be valid")
        Long propertyId,

        @NotBlank(message = "Unit number is required")
        @Size(max = 30, message = "Unit number cannot exceed 30 characters")
        String unitNumber,

        @NotNull(message = "Floor is required")
        @Min(value = 0, message = "Floor cannot be negative")
        Integer floor,

        @NotNull(message = "Bedrooms is required")
        @Min(value = 0, message = "Bedrooms cannot be negative")
        Integer bedrooms,

        @NotNull(message = "Monthly rent is required")
        @DecimalMin(value = "0.01", message = "Monthly rent must be greater than 0")
        BigDecimal monthlyRent,

        @NotBlank(message = "Unit status is required")
        String unitStatus
) {
}
