package com.property.rental.dto;

import java.math.BigDecimal;

public record RentalUnitResponse(
        Long unitId,
        Long propertyId,
        String propertyCode,
        String propertyName,
        String city,
        String unitNumber,
        Integer floor,
        Integer bedrooms,
        BigDecimal monthlyRent,
        String unitStatus
) {
}
