# Perfect Pet Finder 🐶🐱

## Overview
**Perfect Pet Finder** is a modern React application designed to help users discover adoptable pets through a clean, accessible interface. The project began as a fully custom integration with the Petfinder public API and was later **refactored in response to real‑world API deprecation**, demonstrating adaptability, architectural decision‑making, and third‑party integration skills.

When Petfinder sunset their public API and transitioned to a Web Component–based widget, the application was re‑engineered to integrate the new data source while preserving application structure, routing, and user experience.

This project reflects how production applications evolve when external dependencies change.

---

## Key Features
- Responsive, multi‑page React application built with **Vite**
- Integration of a third‑party **Web Component (`<pet-scroller>`)** within a React environment
- Environment‑based configuration for external services
- Modular component architecture following best practices
- Graceful refactor from deprecated REST API to widget‑based solution
- Clean UI optimized for accessibility and usability

---

## Technical Highlights

### Real‑World API Migration
- Initially implemented custom data fetching, filtering, pagination, and card rendering using the Petfinder API
- Refactored application after API deprecation without breaking the overall app
- Replaced API‑dependent logic with a Web Component while maintaining layout, routing, and state boundaries

### Web Components + React
- Safely loads third‑party scripts at the application entry point
- Renders custom HTML elements within React components
- Passes serialized configuration via environment variables
- Maintains separation between third‑party UI and internal application logic

### Frontend Architecture
- Component‑driven design
- Route‑based page structure
- Centralized environment configuration
- Removal of dead code and legacy logic after refactor

---

## Tech Stack
- **React**
- **Vite**
- **JavaScript (ES6+)**
- **HTML5 / CSS3**
- **Web Components**
- **Environment Variables (.env)**

---

## Project Structure (Simplified)
```
Frontend/
├── src/
│   ├── components/
│   │   ├── PetScrollerWidget/
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Main/
│   ├── pages/
│   ├── utils/
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Configuration
The Petfinder widget is configured using environment variables:

```env
VITE_PETFINDER_ORG_JSON=["YOUR_ORG_ID_HERE"]
VITE_PETFINDER_LIMIT=12
```

This approach keeps configuration flexible across development and production environments.

---

## Lessons Learned
- Designing applications that can adapt to external API changes
- Integrating Web Components into a React ecosystem
- Making architectural tradeoffs when full customization is no longer available
- Refactoring legacy features safely and incrementally
- Treating third‑party services as replaceable data sources

---

## Saved Pets Feature (User-Owned Enhancement)

To extend functionality beyond a third-party data source, the application includes a **Saved Pets** feature fully owned by the client application.

### What It Does
- Allows users to save pets they are interested in by storing Petfinder URLs
- Persists saved pets using `localStorage`
- Displays a Saved Pets counter badge in the navigation
- Shows a preview of recently saved pets on the home page
- Provides a dedicated Saved Pets page to view, remove, or clear saved items

### Why It Matters
This feature demonstrates how to add meaningful user-owned functionality alongside a third-party widget without modifying or relying on its internal implementation.

---

## Future Improvements
- Optional tagging or notes for saved pets
- Backend persistence for authenticated users
- Enhanced accessibility and performance audits

---

## Why This Project Matters
This project demonstrates more than UI development — it shows:
- Real‑world problem solving
- Adaptability to breaking third‑party changes
- Frontend architectural thinking
- Production‑minded refactoring

**Perfect Pet Finder** reflects the type of challenges engineers face in real applications, where requirements evolve and external systems change.

---

## Author
**Kenya Peterson**

Frontend Developer | React | JavaScript


### 🔗 Links

https://kenya-p.github.io/Final_Project/