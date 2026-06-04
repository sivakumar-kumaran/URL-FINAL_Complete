# LinkShrink | Production-Ready URL Shortener & Analytics

LinkShrink is a premium full-stack MERN URL shortener application. It offers quick link shortening, custom aliases, routing status controls, expiration safeguards, dynamic SVG QR codes, and a detailed real-time visitor analytics dashboard built using React 19, Node.js, Express, Tailwind CSS, and Recharts.

---

## Features

* **JWT Authentication** — User login/registration, token persistence, and secure password hashing using `bcryptjs`.
* **Advanced Shortening** — Custom back-half aliases and calendar-based expiration thresholds.
* **Analytics Tracking** — Automatically captures Browser, OS, Device, Timestamp, and Client IP.
* **Charts & Statistics** — Daily and weekly traffic trends with device and browser breakdowns.
* **Interactive QR Codes** — Generates unique QR codes for every shortened URL and exports high-definition PNG files.
* **SaaS Dark/Light Theme** — Fully synchronized UI styling system using Tailwind's class-based theme toggler.
* **Security & Integrity** — Integrated rate limiting, CORS configuration, Helmet headers, and input validation.

---

## Tech Stack

### Frontend

* React 19 & Vite
* Tailwind CSS v3
* React Router DOM
* Axios
* TanStack React Query
* Recharts
* React Hot Toast
* Lucide Icons
* qrcode.react

### Backend

* Node.js & Express
* MongoDB Atlas (Mongoose)
* JWT & bcryptjs
* nanoid
* express-validator
* ua-parser-js
* helmet
* cors
* express-rate-limit

---

## Project Structure

```text
URLShort/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── package.json
└── README.md
```

---

## Architecture Diagram

```mermaid
graph LR
    User([User]) -->|Visit App| React[React 19 Frontend]

    React -->|REST API (Axios)| Node[Node.js / Express Backend]

    Node -->|Read/Write Data| Mongo[(MongoDB Atlas)]

    User -->|Visit Short Link| Node

    Node -->|Redirect| Original([Original Destination])

    Node -.->|Store Analytics| Mongo
```

### Request Flow

1. Users access the application through the React frontend.
2. Axios sends API requests to the Express backend.
3. The backend manages authentication, URL generation, analytics, and business logic.
4. MongoDB Atlas stores users, URLs, and visit records.
5. When a shortened URL is visited:

   * The backend validates the short code.
   * Visitor analytics are recorded.
   * The original URL is retrieved.
   * The user is redirected to the destination.
6. Analytics data powers the dashboard charts and statistics.

---

## REST API Specification

### Authentication (`/api/auth`)

| Method | Endpoint    | Description                     |
| ------ | ----------- | ------------------------------- |
| POST   | `/register` | Register a new user             |
| POST   | `/login`    | Authenticate a user             |
| GET    | `/profile`  | Retrieve logged-in user profile |
| PUT    | `/profile`  | Update user profile             |

---

### URL Management (`/api/urls`) *(JWT Required)*

| Method | Endpoint | Description              |
| ------ | -------- | ------------------------ |
| POST   | `/`      | Create a shortened URL   |
| GET    | `/`      | Retrieve user URLs       |
| GET    | `/:id`   | Get URL details          |
| PUT    | `/:id`   | Update URL settings      |
| DELETE | `/:id`   | Delete URL and analytics |

#### Request Body Example

```json
{
  "originalUrl": "https://example.com",
  "customAlias": "portfolio",
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

---

### Analytics (`/api/analytics`) *(JWT Required)*

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| GET    | `/dashboard/summary` | Dashboard overview metrics |
| GET    | `/:id`               | Detailed URL analytics     |

Analytics include:

* Total Clicks
* Daily Click Trends
* Weekly Click Trends
* Browser Distribution
* Device Distribution
* Operating System Statistics
* Recent Visitors
* Last Activity Timestamp

---

### Redirects (Public)

| Method | Endpoint      | Description                         |
| ------ | ------------- | ----------------------------------- |
| GET    | `/:shortCode` | Redirect and track visitor metadata |

Visitor information collected:

* Browser
* Operating System
* Device Type
* IP Address
* Timestamp

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/urlshortener
JWT_SECRET=super_secret_key_for_encrypting_jwt_tokens
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/linkshrink.git
cd linkshrink
```

### 2. Install Dependencies

```bash
npm install
npm run install-all
```

### 3. Configure Environment Variables

Create:

```text
backend/.env
frontend/.env
```

and populate them using the examples above.

### 4. Start Development Servers

```bash
npm run dev
```

Application URLs:

* Frontend: `http://localhost:5173`
* Backend: `http://localhost:5000`

---

## Production Deployment

### Backend Deployment

Suitable providers:

* Render
* Railway
* Heroku
* DigitalOcean
* AWS

Set:

```env
MONGODB_URI=
JWT_SECRET=
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

Start production server:

```bash
npm start
```

---

### Frontend Deployment

Suitable providers:

* Vercel
* Netlify
* Cloudflare Pages

Build:

```bash
cd frontend
npm run build
```

Deploy the generated:

```text
frontend/dist
```

directory and configure SPA rewrites so all routes resolve to `index.html`.

---

## Security Features

### Authentication Security

* JWT Token Authentication
* Password Hashing via bcryptjs
* Protected Routes Middleware
* Persistent Login Sessions

### API Protection

* Rate Limiting
* Request Validation
* Input Sanitization
* Secure HTTP Headers via Helmet
* CORS Restrictions

### URL Safety

* URL Validation
* Expiration Controls
* Active/Inactive Toggle States
* Ownership-Based Access Control

---

## Analytics Dashboard

The dashboard provides real-time insights including:

### Traffic Metrics

* Total Clicks
* Active Links
* Expired Links
* Last Activity

### Trend Analysis

* Daily Click Charts
* Weekly Traffic Reports
* Historical Activity Monitoring

### Visitor Insights

* Browser Distribution
* Device Distribution
* Operating System Breakdown
* Recent Visitors Log

### Visualization Components

Built using Recharts:

* Area Charts
* Bar Charts
* Pie Charts
* Summary Cards

---

## QR Code Generation

Every shortened URL automatically receives:

* Dynamic SVG QR Code
* Downloadable PNG Export
* High Resolution Output
* Share-Friendly Format

---

## Theme System

Features:

* Light Mode
* Dark Mode
* Tailwind CSS Class Strategy
* Persistent User Preference
* Consistent Dashboard Styling

---

## Future Enhancements

* Custom Domains
* Team Workspaces
* Link Password Protection
* Geo-location Analytics
* UTM Campaign Builder
* Bulk URL Import/Export
* Public API Access
* Email Notifications

---

## License

This project is licensed under the MIT License.

---

## Author

Built with ❤️ using the MERN Stack, Tailwind CSS, and modern SaaS design principles.
