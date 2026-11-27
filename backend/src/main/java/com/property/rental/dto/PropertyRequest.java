package com.property.rental.dto;

import jakarta.validation.constraints.*;

public record PropertyRequest(
        @NotBlank(message = "Property code is required")
        @Size(max = 30, message = "Property code cannot exceed 30 characters")
        String propertyCode,

        @NotBlank(message = "Property name is required")
        @Size(min = 2, max = 150, message = "Property name must be between 2 and 150 characters")
        String propertyName,

        @NotBlank(message = "Property type is required")
        @Size(max = 50, message = "Property type cannot exceed 50 characters")
        String propertyType,

        @NotBlank(message = "Address is required")
        @Size(max = 255, message = "Address cannot exceed 255 characters")
        String address,

        @NotBlank(message = "City is required")
        @Size(max = 100, message = "City cannot exceed 100 characters")
        String city,

        @NotBlank(message = "Manager name is required")
        @Size(max = 120, message = "Manager name cannot exceed 120 characters")
        String managerName,

        @NotNull(message = "Active flag is required")
        Boolean active
) {
}
