package com.property.rental.dto;

import jakarta.validation.constraints.*;

public record TenantRequest(
        @NotBlank(message = "Tenant code is required")
        @Size(max = 30, message = "Tenant code cannot exceed 30 characters")
        String tenantCode,

        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 120, message = "Full name must be between 2 and 120 characters")
        String fullName,

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^[0-9+\\-\\s]{7,20}$", message = "Phone must be 7 to 20 characters")
        String phone,

        @NotBlank(message = "Email is required")
        @Email(message = "Please enter a valid email address")
        @Size(max = 150, message = "Email cannot exceed 150 characters")
        String email,

        @Size(max = 255, message = "Address cannot exceed 255 characters")
        String currentAddress
) {
}
