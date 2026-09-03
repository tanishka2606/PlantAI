-- PlantAI Useful Queries
-- Database: plant_ai

USE plant_ai;

-- 1. Fetch all available plant care records
SELECT id, plant_name, common_name FROM plant_care ORDER BY plant_name;

-- 2. Lookup plant care by exact scientific or common name
SELECT * FROM plant_care WHERE plant_name = 'Epipremnum aureum' OR common_name LIKE '%Money Plant%';

-- 3. Case-insensitive search
SELECT * FROM plant_care WHERE LOWER(plant_name) = LOWER('hibiscus rosa-sinensis') OR LOWER(common_name) LIKE '%hibiscus%';

-- 4. Count total registered plants
SELECT COUNT(*) AS total_plants FROM plant_care;

-- 5. Count total registered users
SELECT COUNT(*) AS total_users FROM users;
