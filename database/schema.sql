-- PlantAI Database Schema
-- Database: plant_ai

CREATE DATABASE IF NOT EXISTS plant_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plant_ai;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Plant Care Table
CREATE TABLE IF NOT EXISTS plant_care (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plant_name VARCHAR(255) NOT NULL UNIQUE,
    common_name VARCHAR(255) DEFAULT NULL,
    sunlight TEXT DEFAULT NULL,
    water TEXT DEFAULT NULL,
    soil TEXT DEFAULT NULL,
    container TEXT DEFAULT NULL,
    location TEXT DEFAULT NULL,
    care TEXT DEFAULT NULL
);
