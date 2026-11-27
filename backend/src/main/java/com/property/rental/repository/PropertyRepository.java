package com.property.rental.repository;

import com.property.rental.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    boolean existsByPropertyCodeIgnoreCase(String propertyCode);
    boolean existsByPropertyCodeIgnoreCaseAndPropertyIdNot(String propertyCode, Long propertyId);

    List<Property> findByPropertyCodeContainingIgnoreCaseOrPropertyNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrManagerNameContainingIgnoreCase(
            String propertyCode, String propertyName, String city, String managerName
    );
}
