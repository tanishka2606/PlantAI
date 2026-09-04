# 🌱 PlantAI — Production AI Plant Intelligence Platform

PlantAI is a modern, production-grade botanical intelligence web application engineered with **React 18 + Vite**, **FastAPI (Python 3.12+)**, and **MySQL**, integrated with Pl@ntNet and Kindwise Computer Vision APIs with an algorithmic pathology fallback.

Designed with a high-end botanical SaaS aesthetic (deep forest obsidian, sage/emerald glassmorphism, telemetry indicators, and scanning animations), PlantAI delivers fast, accurate, and context-rich plant insights.

---

## 🌟 Core System Capabilities

### 1. 🌿 High-Precision Plant Identification (`/scanner`)
- **Multi-Stage Processing**: Automated EXIF orientation correction, blur detection (Laplacian variance), and brightness validation before inference.
- **Multi-Tier Inference**: Primary classification via **Pl@ntNet API**, falling back to **Kindwise Plant Identification** and **Gemini Vision**.
- **Threshold Calibration**: Configurable `IDENTIFICATION_CONFIDENCE_THRESHOLD=0.50` preventing false classifications.
- **Interactive Telemetry**: Real-time confidence breakdown, taxonomy metadata (family, genus), and instant routing to species-specific care guides.

### 2. 🌱 Dedicated Seed Recognition (`/seed-identification`)
- **Rule 21 Compliance**: Pure botanical identification of seeds and grains without fabricating nursery care instructions.
- **Organ-Specific Querying**: Pl@ntNet `organ='fruit'` parameterization for macro grain/seed classification.
- **Specimen Guidance**: In-app macro photography tips (lighting, contrast backgrounds, scale indicators).

### 3. 🩺 Plant Pathology & Health Diagnostics (`/health`)
- **Multi-Level Diagnosis**: Kindwise Disease Assessment & Gemini Vision diagnostics.
- **Pixel-Pathology Fallback**: Pure PIL-based color distribution and chlorophyll degradation analysis that detects chlorosis, necrosis, and powdery mildew even when third-party API quotas are exhausted.
- **Clinical Breakdown**: Structured presentation of detected conditions, observable symptoms, biological & chemical treatments, and agricultural disclaimers.

### 4. 📖 Smart Plant Care Database (`/plant-care/:plantName`)
- **30 Verified Botanical Profiles**: Stored in MySQL with full care parameters.
- **Comprehensive Profiles**: Sunlight exposure, watering frequency, soil composition, container sizing, indoor/outdoor placement, pruning recommendations, and **tailored fertilizer schedules**.
- **Fuzzy & Scientific Search**: Instant lookup by common name, genus, or botanical binomial.

### 5. 🤖 Context-Aware AI Botanical Assistant (`/assistant`)
- **Context Injection**: Automatically synchronizes with the active plant profile in your database.
- **Smart Recommendations**: Tailored answers for pest management, yellowing foliage, propagation, and repotting.
- **Interactive UI**: Plant focus selector, quick-prompt pills, auto-scrolling conversation, and live typing indicators.

### 6. 📊 User Dashboard & History (`/dashboard`)
- **Telemetry Overview**: Quick action cards, recent diagnostic scans, and rotating daily botanical tips.
- **Secure Authentication**: User registration and login powered by bcrypt password hashing.

---

## 🏗️ System Architecture

```
PlantAIproject/
├── backend/
│   ├── main.py                     # FastAPI application endpoints and CORS setup
│   ├── database.py                 # SQLAlchemy engine & MySQL session lifecycle
│   ├── models.py                   # ORM models (User, PlantCare with fertilizer column)
│   ├── schemas.py                  # Pydantic validation schemas for requests & responses
│   ├── requirements.txt            # Python dependencies (FastAPI, SQLAlchemy, Pillow, etc.)
│   ├── .env                        # API keys, database credentials, and thresholds
│   ├── .env.example
│   └── services/
│       ├── image_validator.py      # EXIF correction, blur, and lighting validation
│       ├── plant_identifier.py     # Multi-tier plant identification pipeline
│       ├── seed_identifier.py      # Dedicated seed/grain recognition pipeline
│       ├── health_checker.py       # Disease diagnosis & pure PIL pixel pathology fallback
│       └── plant_assistant.py      # Context-aware AI plant assistant
├── frontend/
│   ├── package.json                # React 18, Vite, Lucide React, React Router
│   ├── vite.config.js
│   ├── .env                        # VITE_API_URL=http://127.0.0.1:8000
│   └── src/
│       ├── services/
│       │   └── api.js              # Centralized API service with timeout & error handling
│       ├── components/
│       │   ├── Navbar.jsx          # Glassmorphic navbar with mobile drawer & Lucide icons
│       │   └── Navbar.css
│       ├── pages/
│       │   ├── Home.jsx            # Hero scanner visual, capability strip, timeline
│       │   ├── PlantScanner.jsx    # Dual-pane identification workspace with laser scanner
│       │   ├── SeedIdentification.jsx # Dedicated seed recognition workspace (Rule 21)
│       │   ├── PlantHealth.jsx     # Plant pathology workspace with treatments & disclaimers
│       │   ├── PlantDetails.jsx    # Complete care guide (/plant-care/:plantName)
│       │   ├── Assistant.jsx       # Split-pane botanical chat with plant focus
│       │   ├── Dashboard.jsx       # User overview, quick actions, and recent activity
│       │   ├── Login.jsx           # Secure auth screen
│       │   └── NotFound.jsx        # Custom botanical 404 screen
│       ├── App.jsx                 # Route registrations
│       ├── App.css
│       └── index.css               # Botanical design system & CSS variables
├── database/
│   ├── schema.sql                  # MySQL schema definition (plant_care, users)
│   ├── seed_data.sql               # 30 pre-populated botanical profiles with fertilizer
│   └── queries.sql                 # Common queries & maintenance scripts
└── README.md
```

---

## 🗄️ Database Setup & Migration

1. **Create MySQL Database**:
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS plant_ai;"
   ```

2. **Run Schema and Seed Data**:
   ```bash
   mysql -u root -p plant_ai < database/schema.sql
   mysql -u root -p plant_ai < database/seed_data.sql
   ```

> [!NOTE]
> The `plant_care` table includes the `fertilizer TEXT` column populated across all 30 botanical profiles to support comprehensive nutritional guidance.

---

## 🚀 Quickstart Guide

### 1. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate      # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- API Endpoint: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Launch Vite development server
npm run dev
```
- Web Application: `http://127.0.0.1:5173`

---

## 🧪 Verification & Testing

To execute the automated pipeline verification suite:
```bash
python test_pipeline.py
python test_seed_and_health_fixes.py
```
This suite tests:
- Image validation (validating clean images, catching invalid formats)
- Seed identification pipeline with live Pl@ntNet API and fallback checks
- Plant health diagnostics with both external APIs and internal pixel pathology fallback
- MySQL database queries across plant care profiles with fertilizer validation

---

## 🛡️ Security & Privacy
- **API Keys**: All credentials (`PLANTNET_API_KEY`, `KINDWISE_API_KEY`, `GEMINI_API_KEY`, MySQL credentials) are loaded strictly via environment variables.
- **Credential Storage**: Passwords are saved as one-way bcrypt hashes.
- **Graceful Error Handling**: API rate limits and quota exhausts (e.g., HTTP 429) trigger internal algorithmic fallbacks without exposing stack traces or API keys to the client.
