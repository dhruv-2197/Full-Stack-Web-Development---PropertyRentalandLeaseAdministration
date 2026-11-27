package com.property.rental.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "property")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_id")
    private Long propertyId;

    @Column(name = "property_code", nullable = false, unique = true, length = 30)
    private String propertyCode;

    @Column(name = "property_name", nullable = false, length = 150)
    private String propertyName;

    @Column(name = "property_type", nullable = false, length = 50)
    private String propertyType;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "manager_name", nullable = false, length = 120)
    private String managerName;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getPropertyCode() { return propertyCode; }
    public void setPropertyCode(String propertyCode) { this.propertyCode = propertyCode; }

    public String getPropertyName() { return propertyName; }
    public void setPropertyName(String propertyName) { this.propertyName = propertyName; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
