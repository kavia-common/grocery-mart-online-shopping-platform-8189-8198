# Grocery Mart Frontend (Angular)

A modern, minimalistic Angular (v19.2.1) frontend for the Grocery Mart online shopping platform.

Features:
- Browse products by category (sidebar navigation)
- Global search for products
- Add/remove items to/from cart with floating cart summary
- User authentication and registration
- Order summary and checkout
- Order history (user-specific)
- Responsive layout (mobile & desktop)
- Light theme using colors: primary #388e3c, accent #ff7043, secondary #ffeb3b

Getting started:
- Install dependencies: npm install
- Start dev server: npm start
  - The app runs at http://localhost:3000/

Environment:
- REST API base URL is read from window.__env.API_BASE_URL if present; otherwise defaults to /api.
- In deployment, map your .env to set API base (e.g., API_BASE_URL=https://api.example.com).

Project structure (key parts):
- src/app/layout: Global layout (header, sidebar, main outlet, floating cart, footer)
- src/app/pages/products: Product grid
- src/app/pages/cart: Cart details
- src/app/pages/checkout: Checkout form
- src/app/pages/auth: Login/Register
- src/app/pages/orders: Order history and confirmation
- src/app/services: api, cart, auth services
- src/app/guards: auth route guard

Notes:
- This app expects a backend exposing REST endpoints:
  - GET /api/categories
  - GET /api/products?q=&categoryId=
  - POST /api/auth/login
  - POST /api/auth/register
  - GET /api/auth/me
  - POST /api/orders
  - GET /api/orders/my

Security:
- Auth token is stored in localStorage for simplicity. For production, consider more robust session handling.

License:
- Internal project.
