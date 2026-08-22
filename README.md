<div align="center">
  
# 🌍 GlobeTrotter – Personalized Travel Planning Platform

> **Plan Smarter. Travel Better.**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI_Powered-FF6F00?style=for-the-badge&logo=openai&logoColor=white)

</div>

---

## 📖 Project Description

GlobeTrotter is an travel planning platform that helps travelers create personalized multi-city itineraries, manage budgets, discover destinations, organize activities, and share trips with others through public itinerary links. 

The platform combines itinerary planning, destination discovery, budgeting, trip collaboration, and analytics into a single, seamless travel experience.

---

## ✨ Key Features

- **🔐 Authentication:** Secure user registration, login, and protected routes using JWT.
- **🗺️ Trip Planning:** Create, manage, and customize complete travel plans in an intuitive interface.
- **✈️ Multi-City Itinerary Builder:** Seamlessly organize complex routes involving multiple destinations and transit points.
- **🏄 Activity Management:** Add, track, and schedule day-to-day activities for every leg of the journey.
- **💰 Budget Analytics:** Comprehensive financial tracking to visualize expenses across different categories (flights, hotels, food, etc.).
- **🔍 Destination Discovery:** Explore new places and find inspiration for your next adventure.
- **🔗 Public Trip Sharing:** Generate public links to showcase and share your curated travel itineraries with friends or social networks.
- **🍴 Trip Forking:** Allow other users to copy and modify public itineraries to serve as templates for their own trips.
- **❤️ Saved Destinations:** Bookmark and curate a wishlist of favorite places to visit in the future.
- **👤 User Profiles:** Personalized dashboards tracking past trips, saved destinations, and user preferences.
- **📈 Admin Analytics Dashboard:** Centralized management system providing deep insights into platform usage, user growth, and active trips.

---

## 📸 Screenshots / Demo Gallery

### 1. Login Page
![Login Page](./client/public/screenshots/login.png)

### 2. Dashboard
![Dashboard](./client/public/screenshots/dashboard.png)

### 3. Create Trip
![Create Trip](./client/public/screenshots/create-trip.png)

### 4. My Trips
![My Trips](./client/public/screenshots/my-trips.png)

### 5. Itinerary Builder
![Itinerary Builder](./client/public/screenshots/itinerary-builder.png)

### 6. Destination Search
![Destination Search](./client/public/screenshots/destination-search.png)

### 7. Activity Search
![Activity Search](./client/public/screenshots/activity-search.png)

### 8. Budget Dashboard
![Budget Dashboard](./client/public/screenshots/budget-dashboard.png)

### 9. Timeline View
![Timeline View](./client/public/screenshots/timeline-view.png)

### 10. User Profile
![User Profile](./client/public/screenshots/user-profile.png)

### 11. Admin Analytics Dashboard
![Admin Dashboard](./client/public/screenshots/admin-dashboard.png)

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, React Router, Recharts, Axios |
| **Backend** | Node.js, Express.js, JWT, bcryptjs |
| **Database** | MySQL |
| **Tools** | Git, GitHub, Postman / REST Client |

---

## 🏗️ System Architecture

```text
       [ React Frontend (Vite) ]
                  │
                  ▼
          [ REST APIs (JSON) ]
                  │
                  ▼
     [ Express.js Node Backend ]
                  │
                  ▼
       [ MySQL Relational DB ]
```

**Explanation:**
The GlobeTrotter architecture follows a robust client-server model. The frontend is a Single Page Application (SPA) built with React and Vite for blazing-fast performance. It communicates with the backend via RESTful JSON APIs using Axios. The backend is powered by Node.js and Express.js, providing secure routes, authentication middleware (JWT), and business logic. Data persistence is handled efficiently by a highly structured MySQL relational database, ensuring data integrity for complex itineraries and user profiles.

---

## 📂 Project Structure

```text
GlobeTrotter/
├── client/
│   ├── src/
│   │   ├── api/             # API client and service endpoints
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth and state providers
│   │   ├── pages/           # Application views and pages
│   │   ├── routes/          # React Router route configuration
│   │   └── utils/           # Helper functions and styling constants
│   └── package.json
└── server/
    ├── prisma/              # Prisma ORM schema and seeders
    ├── src/
    │   ├── constants/       # Role and status constants
    │   ├── controllers/     # API request handlers
    │   ├── middleware/      # Authentication and error middleware
    │   ├── routes/          # Express route definitions
    │   ├── services/        # Business logic & database queries
    │   ├── utils/           # JWT, response & Prisma client utilities
    │   └── validators/      # Payload validation schemas
    └── package.json
```

---

## 🚀 Installation & Local Setup

Follow these steps to run GlobeTrotter locally on your machine.

### 1. Database Setup
Ensure you have MySQL installed and running. Create the database (e.g., `globetrotter`) and apply migrations or seed data:

```bash
cd server
npm run prisma:generate
npm run seed
```

### 2. Backend Setup
Navigate to the `server` directory, install dependencies, and start the development server:

```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup
In a new terminal window, navigate to the `client` directory, install dependencies, and start the Vite development server:

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in both the `server` and `client` directories using the examples below.

### Backend (`server/.env`)
```env
# Database Configuration
DATABASE_URL="mysql://root:password@localhost:3306/globetrotter"

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
```

### Frontend (`client/.env`)
```env
# API Endpoint
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📡 API Documentation

Below is a high-level overview of the primary REST API endpoints available in the system.

| Category | Method | Endpoint | Description | Access |
| :--- | :---: | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register a new user account | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate and receive JWT | Public |
| **User** | `GET` | `/api/users/profile` | Retrieve current user profile | Private |
| **Trip** | `GET` | `/api/trips` | Get all trips for the authenticated user | Private |
| **Trip** | `POST` | `/api/trips` | Create a new trip | Private |
| **Itinerary** | `GET` | `/api/trips/:id/itinerary` | Fetch detailed itinerary for a specific trip | Private |
| **Itinerary** | `POST` | `/api/trips/:id/activities`| Add a new activity to an itinerary | Private |
| **Budget** | `GET` | `/api/trips/:id/budget` | Get budget analytics for a trip | Private |
| **Sharing** | `GET` | `/api/public/trips/:shareId` | View a publicly shared trip | Public |
| **Admin** | `GET` | `/api/admin/analytics` | Retrieve platform-wide analytics | Admin |

---

## 🛡️ Admin Access

For evaluation and demonstration purposes, you can access the Admin Analytics Dashboard using the following credentials:

- **Email:** `admin@gmail.com`
- **Password:** `admin@password`

---

## 🤖 AI Usage Disclosure

This project was developed with assistance from advanced AI tools. 

AI was utilized during the development lifecycle for:
- Architecture discussions and best practices
- Code reviews and optimization suggestions
- Documentation generation and formatting
- UI component ideation
- Development acceleration and boilerplate scaffolding

**All final implementation decisions, third-party integrations, debugging, testing, and feature development were directly performed by the development team.** We believe in leveraging modern tools to build higher-quality software more efficiently while maintaining complete architectural ownership.

---

## 🔮 Future Improvements

We are constantly looking to expand GlobeTrotter's capabilities. Planned future updates include:
- **Real-time flight integration** (Live pricing and status updates)
- **Hotel booking integration** (Direct reservations via third-party APIs)
- **AI itinerary generation** (One-click complete trip planning based on preferences)
- **Maps integration** (Interactive route visualization and distance calculation)
- **Expense prediction** (Machine learning-driven budget forecasting)
- **Collaborative trip planning** (Real-time multi-user editing)
- **Mobile application** (Native iOS and Android apps for on-the-go access)

---

## 👥 Team Information

| Name | Role | Responsibility |
| :--- | :--- | :--- |
| **[Vedant Patel]** | Team Lead | API Design, Authentication, System Architecture |
| **[Vraj Patel]** | Lead Frontend Developer | UI/UX Implementation, State Management |
| **[Aryan Prajapati]** | Lead Backend Developer | Schema Design, API Design |

---

## 🙏 Thank You

Thank you to the judges, mentors, and all early users for your support and feedback during this hackathon! We poured our hearts into building a platform we genuinely want to use for our own travels.