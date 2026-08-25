# Ticket Flow 🎫

A modern, secure, and role-based helpdesk and ticket management system.

## Overview
Ticket Flow is a streamlined ticketing system built to manage customer support requests efficiently. It features a robust authentication flow and strict database-level security to ensure users only interact with their authorized data. 

## Features
- **Role-Based Access Control (RBAC):** Distinct permissions for `client`, `agent`, and `admin` profiles.
- **Secure Authentication:** Powered by Supabase Auth with protected internal routes.
- **Ticket Management:** Create, view, and update tickets through an intuitive interface.
- **Data Privacy:** Strict Supabase Row Level Security (RLS) policies preventing unauthorized data access.

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** CSS Modules
- **Backend / BaaS:** Supabase (PostgreSQL, Auth, RLS)
- **Routing:** React Router DOM

## Running Locally

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/ticket-flow.git
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   cd ticket-flow
   npm install
   \`\`\`

3. **Set up environment variables:**
   Create a \`.env.local\` file in the root directory and add your Supabase credentials:
   \`\`\`env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## Author
**Marcos Ferreira Mourão**
- Portfolio: [dev.mourao.info](http://dev.mourao.info/)