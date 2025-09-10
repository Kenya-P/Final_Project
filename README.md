# Final_Project (Perfect Pet Finder 🐶🐱)

## 🧠 Project Overview
A responsive full-stack React application that allows users to browse adoptable pets from a third-party API, create accounts, and save their favorite animals for later viewing. The app will help match users with pets based on preferences like type, size, location, and temperament.

--

## 🧱 Core Features
1. User Authentication

- Register/Login using email & password
- JWT-based authentication
- Persist login across sessions

2. Pet Search

- Use a third-party API (e.g., Petfinder API) to fetch pet data (JSON)
- Filter pets by type, location, age, etc.
- Display data in reusable card components

3. Saved Pets

- Logged-in users can favorite/save pets
- Save to MongoDB and fetch upon profile visit

4. User Profile Page

- Show saved pets
- Option to remove saved pets

5. Responsive Design

- Mobile-first layout
- Styled using BEM + reusable components

### 🌍 Pages
- / (Home page): Pet search and list

- /profile: Saved pets for the logged-in user

### 🖥️ Tech Stack
- Frontend: React (with hooks, context), React Router, CSS Modules (BEM naming)

- Backend: Node.js + Express

- Database: MongoDB (for storing user data + saved pets)

- Auth: JWT for login persistence

### 🔗 Links

https://kenya-p.github.io/Final_Project/