-- Create and select the project database
CREATE DATABASE IF NOT EXISTS property_rental_db;
USE property_rental_db;

-- Master table for properties
CREATE TABLE property (
    property_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_code VARCHAR(30) NOT NULL UNIQUE,
    property_name VARCHAR(150) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    manager_name VARCHAR(120) NOT NULL,
    active BOOLEAN NOT NULL
) ENGINE=InnoDB;

-- Rental units belonging to a property
CREATE TABLE rental_unit (
    unit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    unit_number VARCHAR(30) NOT NULL,
    floor INT NOT NULL,
    bedrooms INT NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    unit_status VARCHAR(20) NOT NULL,
    UNIQUE (property_id, unit_number),
    FOREIGN KEY (property_id) REFERENCES property(property_id)
) ENGINE=InnoDB;

-- Master table for tenants
CREATE TABLE tenant (
    tenant_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_code VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    current_address VARCHAR(255)
) ENGINE=InnoDB;

-- Lease agreements linking one tenant to one rental unit
CREATE TABLE lease (
    lease_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lease_number VARCHAR(30) NOT NULL UNIQUE,
    unit_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) NOT NULL,
    lease_status VARCHAR(20) NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES rental_unit(unit_id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id)
) ENGINE=InnoDB;

-- Maintenance requests reported for a unit by a tenant
CREATE TABLE maintenance_request (
    request_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    unit_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    request_date DATE NOT NULL,
    issue_category VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    resolution_notes VARCHAR(255),
    FOREIGN KEY (unit_id) REFERENCES rental_unit(unit_id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id)
) ENGINE=InnoDB;
