# Synthetivolve V2

> **Your Personal Health & Wellness Engine**

Synthetivolve is a highly personalized health and wellness application that provides data-driven insights and actionable recommendations. Unlike generic fitness apps that offer static plans, Synthetivolve uses intelligent analysis of your nutrition, fitness, and biometric data to make dynamic adjustments, ensuring your plan evolves with your progress.

### Core Philosophy: Adherence vs. Effectiveness

Our central belief is that you can't judge a plan's effectiveness if it isn't being followed. The application's first job is to help you achieve consistency. It will encourage adherence to your current targets *before* making any changes, preventing the frustration that comes from constantly changing goals and promoting long-term, sustainable results.

---

## ✨ Core Features

### Core Intelligence & User Experience
*   **"Above the Fold" Dashboard:** An intelligently designed UI that immediately shows you what to do now, your daily progress, and your weekly trend, all without scrolling.
*   **Dynamic Adjustments with "The Why Button":** The system automatically adjusts your calorie targets based on your results. Every recommendation comes with an optional "Why?" button that explains the reasoning in plain English, building trust and teaching you about the process.
*   **Daily Subjective Tracking:** Log key wellness indicators like energy levels, sleep quality, and stress, which are used to find correlations with your physical progress.
*   **Motivational Feedback:** Stay engaged with gamification elements like streaks for consistent logging, progress milestones, and a clear weekly adherence score.

### Nutrition & Planning
*   **Frictionless Food Logging:** Minimize time spent logging with smart features like "Copy Yesterday's Meal," a quick-add list of your most common foods, and barcode scanning.
*   **Pantry & Meal Planning:** Track ingredients you own to get smart meal recommendations that reduce food waste and simplify your grocery trips.
*   **USDA Database Integration:** Backed by a comprehensive food database for accurate nutritional information.

### Analytics & Insights
*   **Automated Weekly Review:** Receive a generated summary every Sunday that details your progress, adherence, and any automated changes to your plan.
*   **Contextual Charts:** Our charts are interactive. Tap any data point on your weight graph to see a snapshot of your key metrics from that day (calories, sleep score, etc.), helping you connect actions to outcomes.
*   **Advanced Fitness Tracking:** Plan structured training mesocycles and log your workouts set-by-set with detailed metrics like RPE/RIR.

---

## 🛠️ Technical Stack

This project is built on a modern, decoupled stack designed for performance, simplicity, and self-hosting.

#### **Frontend**
*   **Framework:** React (with Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Components:** shadcn/ui
*   **Charts:** Recharts

#### **Backend**
*   **Framework:** FastAPI
*   **Language:** Python 3.11+
*   **Database:** SQLite (with async support via `aiosqlite`)
*   **ORM:** SQLAlchemy (Async)
*   **Data Validation:** Pydantic
*   **Migrations:** Alembic
*   **Authentication:** FastAPI-Users

---

## 🏗️ Architecture

Synthetivolve uses a decoupled, two-tier architecture perfect for self-hosting on a single VPS.

1.  **React SPA Frontend:** A fast, client-side application built with Vite that handles all user interaction and presentation.
2.  **FastAPI Backend API:** A high-performance Python server that exposes a RESTful API. It is responsible for all business logic, data calculations, analysis, and database interactions.

### Key Architectural Patterns
*   **Asynchronous Everywhere:** The backend is built to be non-blocking from the ground up, using `async` functions and an async database driver (`aiosqlite`) to ensure the API remains exceptionally fast and responsive.
*   **Services Layer:** All core business logic (e.g., calorie adjustment calculations, trend analysis) is abstracted into a dedicated `services` layer. This keeps API route functions lean and focused on handling HTTP requests and greatly improves testability.
*   **Background Tasks:** Time-consuming operations, like generating a weekly report or syncing data from Garmin, are delegated to background tasks. This allows the API to return an immediate response to the user, improving perceived performance.

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development or personal use.

### Prerequisites

*   **Git:** To clone the repository.
*   **Python:** Version 3.11 or newer.
*   **Node.js:** Version 20.0 or newer (with `npm`, `pnpm`, or `yarn`).

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/bejimenez/synthetivolve-stronger.git
    cd synthetivolve-stronger
    ```

2.  **Backend Setup**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Create and activate a Python virtual environment
    python -m venv venv
    source venv/bin/activate  # On Windows, use: venv\Scripts\activate

    # Install dependencies
    pip install -r requirements.txt

    # Create and configure your environment file
    cp .env.example .env
    ```
    Now, open the `.env` file and **set a strong, unique secret** for `AUTH_SECRET_KEY`. This is critical for securing user sessions.

3.  **Database Setup**
    With your backend virtual environment still active, run the database migrations. This will create the `synthetivolve.db` SQLite file and all necessary tables.
    ```bash
    alembic upgrade head
    ```

4.  **Frontend Setup**
    ```bash
    # Navigate to the frontend directory from the root
    cd ../frontend

    # Install dependencies
    npm install # or pnpm install / yarn install

    # Create your local environment file
    cp .env.example .env.local
    ```
    The default `VITE_API_BASE_URL=http://127.0.0.1:8000` in `.env.local` is already configured to work with the local backend server.

5.  **Run the Application**
    You will need to run the frontend and backend in two separate terminal windows.

    *   **Terminal 1: Start the Backend Server** (from the `/backend` directory)
        ```bash
        # Ensure your virtual environment is active
        uvicorn app.main:app --reload
        ```
        The backend API will now be running at `http://127.0.0.1:8000`.

    *   **Terminal 2: Start the Frontend App** (from the `/frontend` directory)
        ```bash
        npm run dev
        ```
        The React application will now be available in your browser, typically at `http://localhost:5173`.

---

## 🛡️ Security & Privacy

Handling sensitive health data requires a robust security posture.

*   **Authentication:** User management is handled by the battle-tested `FastAPI-Users` library, which implements secure password hashing and JWT-based session management.
*   **Authorization:** The API enforces strict ownership rules. Users can only ever access their own data.
*   **Data Encryption:** All data is encrypted at rest on the server's filesystem.
*   **Privacy First:** This is a personal application. Your data is your own and will never be shared or sold.


## 🔒 Optional: Enterprise-Grade Authentication with Keycloak

The default authentication setup using `FastAPI-Users` is robust, secure, and perfect for self-hosting a personal application. However, the decoupled architecture of Synthetivolve allows for a seamless upgrade to a full-fledged, enterprise-grade Identity and Access Management (IAM) solution like **Keycloak** if your needs evolve.

This section provides a roadmap for developers wishing to make this transition.

### Why Upgrade to Keycloak?

Upgrading from the integrated `FastAPI-Users` library to a dedicated IAM server like Keycloak is a strategic decision you might consider if the project requirements grow to include:

*   **Single Sign-On (SSO):** Allowing users to log in once and access multiple different services.
*   **Social Logins:** Easily adding "Login with Google, GitHub, etc." functionality through a centralized configuration UI.
*   **Multi-Factor Authentication (MFA):** Enforcing stronger security with methods like TOTP (Google Authenticator) or FIDO2/WebAuthn, all configured and managed within Keycloak.
*   **Centralized User Management:** Using Keycloak's powerful Admin UI to manage all users, roles, and permissions across applications, completely separate from your application's database.
*   **Advanced Authorization Policies:** Implementing complex, rule-based authorization that is decoupled from the application's code.

### This upgrade fundamentally changes how your application thinks about authentication.

*   **Before (FastAPI-Users):** Your FastAPI backend is responsible for everything: storing user credentials, hashing passwords, verifying users, and issuing JWTs. The application is the identity provider.

*   **After (Keycloak):** Your FastAPI backend **delegates** all authentication tasks to Keycloak.
    *   The backend's only job is to **validate JWTs** that are presented to it. It trusts that if Keycloak issued a valid token, the user is authenticated.
    *   The React frontend is responsible for redirecting the user to Keycloak's login page and handling the token it receives back after a successful login.

### High-Level Migration Roadmap

A developer looking to implement this would follow these general steps:

**1. Deploy a Keycloak Instance**
   - The easiest method is using Docker:
     ```bash
     docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
     ```
   - This provides a running Keycloak server with an admin console for configuration.

**2. Configure Keycloak**
   - **Create a Realm:** A dedicated space for your application (e.g., `synthetivolve`).
   - **Create a Client:** Define a client for your React frontend (e.g., `synthetivolve-app`). Configure its valid redirect URIs (e.g., `http://localhost:5173/*`).
   - **Define Roles (Optional):** Create roles if needed (e.g., `user`, `beta-tester`, `admin`).

**3. Update the FastAPI Backend**
   - **Remove `FastAPI-Users`:** The routes and dependencies for this library would be removed.
   - **Add a JWT Validator:** You would modify the authentication dependency to validate tokens against Keycloak's public key. The dependency would:
     1.  Extract the JWT from the `Authorization: Bearer <token>` header.
     2.  Fetch Keycloak's public key from its OIDC endpoint.
     3.  Verify the token's signature, issuer (`iss`), and audience (`aud`).
     4.  If valid, extract the user information (like `sub`, `email`, `preferred_username`) from the token's payload to identify the user making the request.

**4. Update the React Frontend**
   - **Remove Local Login/Register Forms:** The UI components for login and registration would be removed. The "Login" button's function would change.
   - **Add an OIDC Client Library:** Integrate a library like `oidc-client-ts` or `react-oidc-context`.
   - **Implement the OIDC Flow:**
     1.  When a user clicks "Login," the OIDC library redirects them to the Keycloak login page.
     2.  The user authenticates with Keycloak (using their password, MFA, or social login).
     3.  Keycloak redirects the user back to your React application with an authorization code.
     4.  The OIDC library exchanges this code for a JWT in the background and securely stores it.
     5.  Your application attaches this JWT to all subsequent API requests to the FastAPI backend.

**5. User Data Migration**
   - For existing users in the SQLite database, you would need to run a one-time script to export them and import them into Keycloak via its Admin API. This is the most complex step of the migration and requires careful planning.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Please ensure you follow the development standards, write modular and type-hinted code, and include tests for new functionality where applicable.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
```
