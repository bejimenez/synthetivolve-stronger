# Synthetivolve: Executive Project Summary (v2)

> **Your Personal Health & Wellness Engine**

A highly personalized health and wellness application that provides data-driven insights and actionable recommendations through intelligent analysis of nutrition, fitness, and biometric data. Unlike generic fitness apps, Synthetivolve focuses on dynamic adjustments based on actual user results rather than one-size-fits-all recommendations.

## 🎯 Core Philosophy

**Track adherence vs effectiveness** - The application's primary goal is to determine if a plan is being followed before judging its effectiveness. If recommendations aren't being followed, the system encourages adherence before adjusting targets. This approach ensures sustainable progress and prevents user frustration.

## 🚀 Features & Enhancements

### Phase 1: Foundation & Core Intelligence
-   **Secure User Authentication:** Managed via the `FastAPI-Users` library for a robust and secure implementation.
-   **"Above the Fold" Dashboard:** The main UI is designed for immediate action, showing what to log now, daily progress at a glance, and the weekly weight trend without scrolling.
-   **Daily Weight & Subjective Tracking:** Smart weight logging with 7-day rolling averages is paired with a first-class system for tracking daily subjective metrics like energy, sleep quality, and stress levels.
-   **Intelligent Calorie Calculator:** TDEE calculations using the Mifflin-St Jeor equation form the baseline for all recommendations.

### Phase 2: Dynamic Management & User Trust
-   **Dynamic Adjustments & "The Why Button":** The core logic automatically adjusts calorie targets based on adherence and results. Crucially, every recommendation is paired with an optional "Why?" button that explains the logic in plain English to build user trust and educate.
-   **Safety-First Guardrails:** Built-in safety rules prevent unsafe recommendations (e.g., minimum 1100 calories, max 2 lbs/week loss).
-   **Advanced Macro Calculations:** Personalized protein (1g/lb), fat (50g minimum), and carbohydrate targets.
-   **Motivational Feedback & Gamification:** The system encourages consistency through streaks (e.g., logging weight 7 days in a row), milestones, and a clear adherence score.

### Phase 3: Frictionless Nutrition System
-   **Frictionless Food Logging:** To maximize long-term adherence, the system includes quick-add features like "Copy Yesterday's Meal," a list of "Commonly Eaten Foods," and barcode scanning.
-   **USDA Food Database Integration:** Comprehensive nutrition data for accurate logging.
-   **Pantry & Meal Planning:** Users can manage pantry ingredients to receive smart meal recommendations, reducing food waste and simplifying planning.

### Phase 4: Advanced Fitness & Analytics
-   **Structured Workout Planning:** Design mesocycles and track workouts set-by-set with RPE/RIR.
-   **Automated Weekly Review:** Every week, the user receives a generated summary of their progress, adherence, and any changes made by the system, contextualizing the week's efforts.
-   **Contextual Analytics:** Charts are interactive. Tapping a data point on a graph reveals key contextual data from that day (e.g., calories, sleep score, workout notes), helping users discover personal correlations.

### Phase 5: Biometric Integration & Insights
-   **Garmin/Health Platform Integration:** Sync heart rate, HRV, sleep, and stress data.
-   **Correlation Analysis:** The system will analyze connections between subjective feelings, biometric data, and progress toward goals to deliver unique, personalized insights.

## 🛠️ Technical Stack

### Frontend
-   **React (Vite)** - Modern JavaScript library for building a fast Single-Page Application (SPA).
-   **TypeScript** - For type-safe development and improved maintainability.
-   **Tailwind CSS** - A utility-first CSS framework for rapid UI development.
-   **shadcn/ui** - Accessible and composable UI components.
-   **Recharts** - Data visualization library for creating contextual charts.

### Backend
-   **Python 3.11+** - Core programming language.
-   **FastAPI** - A high-performance web framework for building the API.
-   **SQLite** - A simple, file-based SQL database, accessed asynchronously.
-   **SQLAlchemy** - The Python SQL toolkit and ORM, using the `aiosqlite` driver for non-blocking database operations.
-   **Pydantic (BaseSettings)** - For robust, type-safe configuration management from environment variables.
-   **Alembic** - For lightweight, version-controlled database migrations.
-   **Uvicorn** - An ASGI server for running the FastAPI application.

## 🏗️ Architecture & Design Principles

The application is built on a decoupled, two-tier architecture designed for simplicity and self-hosting on a single VPS.

1.  **React SPA Frontend:** A client-side application that handles all user interaction and presentation. It communicates with the backend via a RESTful API.
2.  **FastAPI Backend API:** A Python-based server responsible for all business logic, data calculations, analysis, and database interactions.

### Key Architectural Patterns:
-   **Asynchronous Everywhere:** The backend is built to be non-blocking, using `async` functions and an async database driver (`aiosqlite`) to ensure the API remains fast and responsive.
-   **Separation of Concerns:** A dedicated **services layer** contains all core business logic, keeping API route functions lean and focused on handling HTTP requests and responses. This makes the system easier to test and maintain.
-   **Background Task Processing:** Time-consuming operations, like generating weekly reports or syncing large amounts of data from external APIs, are handled by FastAPI's `BackgroundTasks` to avoid blocking user requests and improve perceived performance.

## 🔐 Authorization Strategy

Authorization will be handled using the **FastAPI-Users** library. This choice represents a strategic balance:
-   It provides a complete, secure, and customizable user management system out-of-the-box, including registration, login, password resets, and JWT-based session management.
-   It significantly reduces development time and security risks compared to a DIY implementation.
-   It avoids the operational complexity and potential overhead of a full, self-hosted IAM solution like Keycloak, making it perfectly suited for a personal application that still requires robust security for sensitive health data.

## 🎨 UI/UX Philosophy

-   **Insight Over Information:** The goal is not to drown the user in data, but to provide actionable insights. Charts are contextual, and recommendations are explained.
-   **Frictionless by Design:** The interface is optimized to make daily tracking as effortless as possible, using smart defaults, quick-adds, and a clear hierarchy.
-   **Motivational & Empowering:** Through positive reinforcement, gamification, and clear explanations of the "why" behind its logic, the app is designed to be an encouraging partner in the user's health journey.

## 🛡️ Security & Privacy

-   **API-Level Security:** Endpoints are protected using FastAPI's dependency injection system, ensuring authenticated users can only access their own data.
-   **Secure Authentication:** User credentials and sessions are managed by `FastAPI-Users`, which implements industry best practices for password hashing and secure JWT handling.
-   **Data Encryption:** All sensitive data is encrypted at rest on the server's filesystem.
-   **Privacy First:** User data is considered private and will not be shared without explicit consent.
