package com.property.rental.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rental_unit", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"property_id", "unit_number"})
})
public class RentalUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "unit_id")
    private Long unitId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "unit_number", nullable = false, length = 30)
    private String unitNumber;

    @Column(name = "floor", nullable = false)
    private Integer floor;

    @Column(name = "bedrooms", nullable = false)
    private Integer bedrooms;

    @Column(name = "monthly_rent", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "unit_status", nullable = false, length = 20)
    private String unitStatus = "Vacant";

    public Long getUnitId() { return unitId; }
    public void setUnitId(Long unitId) { this.unitId = unitId; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getUnitNumber() { return unitNumber; }
    public void setUnitNumber(String unitNumber) { this.unitNumber = unitNumber; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public BigDecimal getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(BigDecimal monthlyRent) { this.monthlyRent = monthlyRent; }

    public String getUnitStatus() { return unitStatus; }
    public void setUnitStatus(String unitStatus) { this.unitStatus = unitStatus; }
}
