# 🌱 PlantAI — AI-Based Plant Identification and Smart Plant Care Assistant

PlantAI is a full-stack, accuracy-first botanical intelligence web application built with **React (Vite)**, **FastAPI (Python 3.12+)**, and **MySQL**, integrated with Pl@ntNet & Kindwise Computer Vision APIs.

---

## 🌟 Key Features

1. **🌿 Accurate Plant Identification (`/scanner`)**:
   - Multi-stage image validation and preprocessing (EXIF correction, blur/darkness detection).
   - High-precision botanical API integration with Pl@ntNet & Kindwise.
   - Configurable confidence thresholds (`IDENTIFICATION_CONFIDENCE_THRESHOLD`) preventing false positives.
   - Top candidate breakdown with probability percentages.
   - Direct connection to MySQL care guides.

2. **🌱 Dedicated Seed Recognition (`/seed-identification`)**:
   - Specialized organ-specific seed & grain classification pipeline.
   - Strict seed confidence validation (`SEED_CONFIDENCE_THRESHOLD`).
   - Macro/close-up photo guidance.

3. **🩺 Plant Health & Disease Diagnosis (`/health`)**:
   - Automated disease and deficiency identification.
   - Clear breakdown of observable symptoms, probable causes, and biological/chemical treatments.
   - Mandatory botanical/agricultural disclaimer.

4. **📖 Smart Plant Care Guides (`/details`)**:
   - Comprehensive care database powered by MySQL.
   - Exact scientific and common name matching.
   - Covers Sunlight, Watering, Soil composition, Container sizing, Location, and Pruning.

5. **🤖 Conversational AI Botanical Assistant (`/assistant`)**:
   - Interactive plant care advice engine contextualized with database care parameters.
   - Answers questions regarding watering frequencies, leaf yellowing, pest management, and fertilizers.

6. **🔒 Secure Authentication (`/login`)**:
   - User registration and login with bcrypt password hashing.

---

## 🏗️ Project Architecture

```
PlantAIproject/
├── backend/
│   ├── main.py                    # FastAPI route definitions and CORS setup
│   ├── database.py                # SQLAlchemy engine & MySQL session manager
│   ├── models.py                  # User and PlantCare database models
│   ├── schemas.py                 # Pydantic schemas for requests and responses
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Secrets, credentials & thresholds
│   ├── .env.example
│   └── services/
│       ├── image_validator.py     # Image validation, lighting/blur checks, preprocessing
│       ├── plant_identifier.py    # Multi-stage plant identification pipeline
│       ├── seed_identifier.py     # Dedicated seed recognition pipeline
│       ├── health_checker.py      # Disease detection and treatment generator
│       └── plant_assistant.py     # Context-aware AI plant assistant
├── frontend/
│   ├── package.json
│   ├── .env                       # VITE_API_URL=http://127.0.0.1:8000
│   ├── .env.example
│   └── src/
│       ├── services/
│       │   └── api.js             # Centralized API service
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── Navbar.css
│       ├── pages/
│       │   ├── Home.jsx & Home.css
│       │   ├── PlantScanner.jsx & PlantScanner.css
│       │   ├── SeedIdentification.jsx & SeedIdentification.css
│       │   ├── PlantHealth.jsx & PlantHealth.css
│       │   ├── PlantDetails.jsx & PlantDetails.css
│       │   ├── Assistant.jsx & Assistant.css
│       │   └── Login.jsx & Login.css
│       ├── App.jsx & App.css
│       ├── index.css
│       └── main.jsx
├── database/
│   ├── schema.sql                 # MySQL schema definitions
│   ├── seed_data.sql              # 30 verified botanical plant care profiles
│   └── queries.sql                # Common database queries
└── README.md
```

---

## 🚀 Getting Started & Setup

### 1. Prerequisites
- Python 3.12 or newer
- Node.js 18+ (LTS) & npm
- MySQL Server 8.0+

---

### 2. Database Setup
1. Create and populate the MySQL database using the SQL scripts in `database/`:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed_data.sql
   ```

---

### 3. Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Activate your virtual environment and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure `backend/.env` with your MySQL credentials and API keys:
   ```env
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_NAME=plant_ai
   PLANTNET_API_KEY=your_plantnet_api_key
   KINDWISE_API_KEY=your_kindwise_api_key
   IDENTIFICATION_CONFIDENCE_THRESHOLD=0.50
   SEED_CONFIDENCE_THRESHOLD=0.35
   ```
4. Start the FastAPI backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   Backend API runs at: `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`)

---

### 4. Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend runs at: `http://localhost:5173`

---

## 🧪 Testing and Verification

Run the automated test suite to verify image validation, identification pipeline, seed recognition, health diagnosis, and MySQL queries:
```bash
python test_pipeline.py
```
