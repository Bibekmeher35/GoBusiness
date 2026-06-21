# Go Business - Referral Dashboard

A secure, responsive, and intuitive referral management system built for **Go Business** using React. It allows users to track referrals, earnings, and partner activity through a structured dashboard with exact color-scheme matching and page layout alignments.

---

## 1. Application Flow

```
[ User Authentication ] ──> [ Protected Dashboard ] ──> [ Referral Management ]
                                                                │
                                   [ Logout ] <─────────────────┘
```

* **User Authentication**: Users must sign in via the secure login interface using their email and password credentials.
* **Dashboard Access**: Upon successful authentication, users are redirected to the protected referral dashboard at `/`.
* **Referrals Overview**: View key metrics (Total Balance, Discount Percentage, etc.), service summary tables, and referral code/link sharing panels.
* **Referrals Table**: Search, sort, and navigate paginated list of partners.
* **Referral Details**: Click on individual partners to load details in a dedicated, deep-linked panel.
* **Logout**: Instantly clear the `jwt_token` cookie and redirect back to the login screen.

---

## 2. Key Features

### 🔐 Authentication & Security
* **Protected Routes**: Restricts access to `/` and `/referral/:id` routes. Unauthenticated sessions are automatically redirected to `/login`.
* **Authenticated Redirection**: Authenticated sessions attempting to access `/login` are automatically routed to `/`.
* **API Validation**: Communicates directly with the signin POST endpoint. Empty fields, partial inputs, or wrong credentials capture backend response messages and display them inside a semantic alert container.
* **Cookie Storage**: JWT tokens are safely stored and managed via the `jwt_token` cookie.

### 📊 Dashboard & Referrals Management
* **Overview Section**: Renders 8 metrics cards mapping out balance, commission, and earning data. Each card is structured with a custom icon, bold value, and title-cased labels.
* **Service Summary Section**: Capitalized horizontal section showcasing summary statistics for current services.
* **Referral Link & Code Sharing**: Text boxes displaying referral codes and links with a single-click "Copy" action (equipped with temporary visual clipboard confirmations).
* **All Referrals Table**:
  * **Search**: Real-time filtering matching referral names or services.
  * **Sort**: Dropdown supporting both "Newest first" and "Oldest first" date filters.
  * **Pagination**: Client-side pagination set to 10 rows per page with circular page selectors and pill-shaped navigation triggers.
  * **Profit Formatting**: Displays numbers as en-US style USD currency with no decimal digits (e.g. `$1,234`) in a bright active blue color.

### 📋 Referral Details Page
* Deep-linked dynamic fetching using `?id=<id>` query parameter with the Bearer token.
* Displays "Back to dashboard" navigation controls at the top.
* Renders the partner's name alongside a custom purple service name pill-badge.
* Displays capitalized detailed properties (`REFERRAL ID`, `NAME`, `SERVICE NAME`, `DATE`, `PROFIT`) inside horizontally divided detail rows.
* Falls back to a clean "Referral not found" layout if no ID matches.

---

## 3. Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Navigation bar (Try for free, outlined Logout)
│   └── Footer.jsx        # Footer (Links for About, Contact, Privacy, Terms)
├── pages/
│   ├── Login.jsx         # Authentication view
│   ├── Dashboard.jsx     # Main metrics and referral lists
│   ├── ReferralDetail.jsx# Partner details view
│   └── NotFound.jsx      # Public 404 page
├── App.jsx               # Router & Route configurations
├── ProtectedRoute.jsx    # Authentication route guard
├── index.js              # Application entry point
├── main.jsx              # Alternative entry point (Vite/Test portals)
└── index.css             # Main stylesheet (color schemes, layouts, scrollbars)
```

---

## 4. Technical Specifications

### API Integrations
* **Login Endpoint**:
  * **Method**: POST
  * **URL**: `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin`
  * **Payload**: `{"email": "<email>", "password": "<password>"}`
* **Referrals Fetch**:
  * **Method**: GET
  * **URL**: `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals`
  * **Headers**: `Authorization: Bearer <jwt_token>`
  * **Parameters**: `?search=<term>`, `?sort=<asc|desc>`, `?id=<id>`

---

## 5. Development & Setup

### Install Dependencies
```bash
npm install
```

### Start Local Development Server
```bash
npm start
```
*Runs the app locally at [http://localhost:3000](http://localhost:3000).*

### Build Production Bundle
```bash
npm run build
```
*Builds optimized, minified assets into the `build` directory.*

### Test Credentials
* **Email**: `admin@example.com`
* **Password**: `admin123`
