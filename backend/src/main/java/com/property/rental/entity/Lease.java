package com.property.rental.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "lease")
public class Lease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lease_id")
    private Long leaseId;

    @Column(name = "lease_number", nullable = false, unique = true, length = 30)
    private String leaseNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "unit_id", nullable = false)
    private RentalUnit unit;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "monthly_rent", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "deposit_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal depositAmount;

    @Column(name = "lease_status", nullable = false, length = 20)
    private String leaseStatus = "Active";

    public Long getLeaseId() { return leaseId; }
    public void setLeaseId(Long leaseId) { this.leaseId = leaseId; }

    public String getLeaseNumber() { return leaseNumber; }
    public void setLeaseNumber(String leaseNumber) { this.leaseNumber = leaseNumber; }

    public RentalUnit getUnit() { return unit; }
    public void setUnit(RentalUnit unit) { this.unit = unit; }

    public Tenant getTenant() { return tenant; }
    public void setTenant(Tenant tenant) { this.tenant = tenant; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BigDecimal getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(BigDecimal monthlyRent) { this.monthlyRent = monthlyRent; }

    public BigDecimal getDepositAmount() { return depositAmount; }
    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }

    public String getLeaseStatus() { return leaseStatus; }
    public void setLeaseStatus(String leaseStatus) { this.leaseStatus = leaseStatus; }
}
