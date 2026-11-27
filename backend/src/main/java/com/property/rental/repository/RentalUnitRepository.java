package com.property.rental.repository;

import com.property.rental.entity.RentalUnit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RentalUnitRepository extends JpaRepository<RentalUnit, Long> {
    boolean existsByPropertyPropertyId(Long propertyId);
    boolean existsByPropertyPropertyIdAndUnitNumberIgnoreCase(Long propertyId, String unitNumber);
    boolean existsByPropertyPropertyIdAndUnitNumberIgnoreCaseAndUnitIdNot(Long propertyId, String unitNumber, Long unitId);

    @Override
    @EntityGraph(attributePaths = {"property"})
    List<RentalUnit> findAll();

    @Override
    @EntityGraph(attributePaths = {"property"})
    Optional<RentalUnit> findById(Long id);

    @EntityGraph(attributePaths = {"property"})
    List<RentalUnit> findByPropertyPropertyId(Long propertyId);
}
