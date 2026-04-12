# PG Management System 🏢

A comprehensive, full-stack Hostel & PG Management System designed to streamline room allocation, payment tracking, and complaint resolution for both administrators and students.

## 🌟 Key Features

- **Role-Based Access Control (RBAC):** Secure access separated into Admin and Student roles.
- **Room Management:** Monitor room capacities, current occupancies, and seamlessly assign or change rooms for students.
- **Automated Occupancy Tracking:** Vacancies are automatically opened when a student is reassigned or removed.
- **Payment & Due Tracking:** Transparent tracking of student payments, statuses (paid/pending), and monthly logs.
- **Complaint Ticketing:** Students can easily report issues, which admins can efficiently review and mark as resolved.
- **Secure Authentication:** JSON Web Token (JWT) based login system along with secure Bcrypt password hashing.
- **Robust Data Management:** Built-in safeguards and database cascades ensure that data remains consistent during user or student deletions.

## 🛠️ Technology Stack

**Frontend**
- React (bootstrapped with Vite)
- CSS (Custom Glassmorphism UI)
- Lucide React (Icons)
- Axios (API Integration)

**Backend**
- FastAPI
- Python 3
- SQLAlchemy ORM
- Bcrypt & PyJWT (Security and Tokenization)
- Uvicorn (ASGI web server)

**Database**
- PostgreSQL (Accessed via `psycopg2`)

## 📂 Project Structure

```text
PG_management_system/
├── backend/
│   ├── database/         # SQLAlchemy models and setup
│   ├── services/         # Core business logic (allocation, payments, etc.)
│   ├── auth.py           # Authentication and JWT logic
│   ├── main.py           # FastAPI entry point
│   ├── routes.py         # API endpoints
│   ├── schemas.py        # Pydantic validation models
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios configurations and API wrappers
│   │   ├── components/   # Reusable UI components (GlassCard, Button, Input)
│   │   ├── pages/        # Main route pages (AdminDashboard, Students, etc.)
│   │   ├── App.jsx       # React Router layout
│   │   └── main.jsx      # React DOM entry point
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite builder configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.10+
- A running instance of PostgreSQL Server

### Environment Setup
You need to set up environment variables for the backend to connect to your database securely.

1. Navigate to the `backend` directory.
2. Create a file named `.env` in the root of the `backend` folder.
3. Add your PostgreSQL configuration string to the `.env` file:
   ```env
   DATABASE_URL=postgresql+psycopg2://<username>:<password>@localhost:5432/<dbname>
   ```

*(Optionally, if your frontend runs on a specific environment or expects a custom API URL, you would create a `.env` in the `frontend` directory housing `VITE_API_URL=http://localhost:8000`).*

### 🏃‍♂️ Running the Application

#### 1. Start the Backend
Open a terminal, navigate to the `backend` directory, and follow these commands:
```bash
cd backend

# Create and activate virtual environment
python -m venv myenv
# Windows: .\myenv\Scripts\activate
# Mac/Linux: source myenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn main:app --reload
```
*The backend will be accessible at `http://localhost:8000`.*

#### 2. Start the Frontend
Open a **new** terminal, navigate to the `frontend` directory, and run the following:
```bash
cd frontend

# Install Node modules
npm install

# Run the development server
npm run dev
```
*The frontend will launch and typically be hosted at `http://localhost:5173`. Open this URL in your browser.*

---
*Built tightly with FastAPI and React to ensure a lightning-fast and reliable accommodation management experience.*
