USE property_rental_db;

-- 1. List all 5 InnoDB tables
SHOW TABLES;

-- 2. Inspect foreign key relationships
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'property_rental_db'
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 3. Sample joined rows across Property, RentalUnit, Tenant, and Lease
SELECT
    l.lease_number,
    p.property_name,
    u.unit_number,
    u.unit_status,
    t.full_name AS tenant_name,
    l.start_date,
    l.end_date,
    l.monthly_rent,
    l.lease_status
FROM lease l
JOIN rental_unit u ON l.unit_id = u.unit_id
JOIN property p ON u.property_id = p.property_id
JOIN tenant t ON l.tenant_id = t.tenant_id;
