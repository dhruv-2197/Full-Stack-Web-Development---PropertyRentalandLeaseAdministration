USE property_rental_db;

-- Sample properties
INSERT INTO property (property_code, property_name, property_type, address, city, manager_name, active) VALUES
('PRP-101', 'Oakwood Apartments', 'Residential', '420 Oakwood Ave', 'Austin', 'John Miller', TRUE),
('PRP-102', 'Maple Plaza', 'Commercial', '85 Maple Street', 'Seattle', 'Sarah Jenkins', TRUE);

-- Sample rental units (Units 1 & 2 Occupied, Units 3 & 4 Vacant)
INSERT INTO rental_unit (property_id, unit_number, floor, bedrooms, monthly_rent, unit_status) VALUES
(1, 'A-101', 1, 2, 1650.00, 'Occupied'),
(1, 'A-102', 1, 1, 1300.00, 'Occupied'),
(1, 'A-201', 2, 2, 1750.00, 'Vacant'),
(2, 'B-101', 1, 0, 2400.00, 'Vacant');

-- Sample tenants
INSERT INTO tenant (tenant_code, full_name, phone, email, current_address) VALUES
('TNT-001', 'Emily Carter', '5551234567', 'emily.carter@mail.local', '420 Oakwood Ave, Unit A-101, Austin'),
('TNT-002', 'Michael Brooks', '5552345678', 'michael.brooks@mail.local', '420 Oakwood Ave, Unit A-102, Austin'),
('TNT-003', 'David Wilson', '5553456789', 'david.wilson@mail.local', '112 Pine Road, Austin');

-- Sample leases (LSE-2026-001 expires soon for dashboard testing; LSE-2026-002 active long-term)
INSERT INTO lease (lease_number, unit_id, tenant_id, start_date, end_date, monthly_rent, deposit_amount, lease_status) VALUES
('LSE-2026-001', 1, 1, '2026-01-01', '2026-12-15', 1650.00, 3300.00, 'Active'),
('LSE-2026-002', 2, 2, '2026-07-01', '2027-06-30', 1300.00, 2600.00, 'Active');

-- Sample maintenance requests
INSERT INTO maintenance_request (unit_id, tenant_id, request_date, issue_category, description, priority, status, resolution_notes) VALUES
(1, 1, '2026-11-18', 'Plumbing', 'Kitchen sink faucet is dripping continuously.', 'Medium', 'Open', NULL),
(2, 2, '2026-11-20', 'HVAC', 'Heater thermostat does not hold set temperature.', 'High', 'In Progress', 'Technician ordered replacement thermostat');
