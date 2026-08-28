# 🎫 Ticket Flow | SaaS Help Desk Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

**Ticket Flow** is a full-stack, multitenant Help Desk ticketing system built to demonstrate enterprise-level software architecture, advanced Role-Based Access Control (RBAC), and seamless state management.

---

## ✨ Key Features & Technical Highlights

This project goes beyond a simple CRUD, focusing on real-world business rules and User Experience (UX):

- 👁️ **Impersonation Mode (Demo Ready):** Built specifically for portfolio evaluation. Evaluators can log in using a Guest Account and seamlessly switch between `Admin`, `Agent`, and `Client` lenses to test the application's RBAC logic without needing multiple accounts.
- 🛡️ **Hybrid Security (RLS + Frontend Filters):** Implements Supabase Row Level Security (RLS) at the database layer to prevent unauthorized data mutations, paired with intelligent React-side array filtering for instantaneous, frictionless UI updates.
- 📊 **Dynamic Dashboards:** The UI dynamically adapts based on the active role. Clients see only their tickets, Agents see their queues, and Admins get a global overview with real-time computed metrics.
- ⚡ **Client-Side Pagination:** Zero-latency data slicing and pagination using React state, avoiding unnecessary server round-trips for small-to-medium datasets.

---

## 🏗️ Architecture & Business Rules

The system enforces strict domain isolation based on the user's role:

| Role | Capabilities | Visibility |
| :--- | :--- | :--- |
| **Client** | Create tickets, Reopen resolved tickets. | Can only view tickets they created. |
| **Agent** | Change ticket status, Assign open tickets to themselves. | Can view unassigned tickets and their own queue. |
| **Admin** | Full system control, User management. | Global visibility of all tickets and metrics. |

---

## 🚀 Getting Started

To run this project locally, you will need Node.js and a Supabase project.

### 1. Clone the repository
```bash
git clone [https://github.com/devmourao/ticket-flow.git](https://github.com/devmourao/ticket-flow.git)
cd ticket-flow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server
```bash
npm run dev
```

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── layout/       # Sidebar, Dash Layout, Modals
│   └── ui/           # Reusable UI components
├── contexts/
│   └── AuthContext   # Global Auth & Active Role state management
├── lib/
│   └── supabase      # Backend connection setup
└── pages/
    ├── auth/         # Split-screen Login with Demo access
    └── dashboard/    # TicketBoard, UserManagement, and Metrics
```

---

## 👨‍💻 Author

**Marcos Ferreira Mourão**  
Frontend Developer & IT Instructor  

- 🌐 Portfolio: [dev.mourao.info](https://dev.mourao.info)
- 💼 LinkedIn: [linkedin.com/in/devmourao](https://www.linkedin.com/in/devmourao/)
- 🐱 GitHub: [@devmourao](https://github.com/devmourao)