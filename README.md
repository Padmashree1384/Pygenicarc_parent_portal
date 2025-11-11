# Setup Instructions

## Backend (Django)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```
3. Activate the virtual environment:
   ```bash
   .venv\Scripts\activate
   ```
4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
5. Set the necessary environment variables for `POSTGRES_*`, `DJANGO_SECRET_KEY`, etc.
6. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
7. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

## Frontend (Vite)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Notes:
- The frontend is configured to communicate with the backend at `http://127.0.0.1:8000` by default. If your API is hosted elsewhere, update the `VITE_API_BASE` variable accordingly.
- To test the application, create some student entries in the admin panel linked to parent (user) accounts, or modify the signup process to automatically create a child entry as required.