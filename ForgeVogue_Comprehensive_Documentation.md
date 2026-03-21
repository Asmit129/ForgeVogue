# ForgeVogue: Comprehensive Technical & Feature Documentation

## 1. Project Overview
ForgeVogue is an ultra-premium, full-stack e-commerce marketplace engineered exclusively for high-end authenticated collectibles. The platform facilitates the secure buying, selling, and tracking of "grail" artifacts—spanning Rare Sneakers, Classic Horology, Vintage Literature, Limited Edition Art, Signed Memorabilia, Vinyl Records, and Antique Collectibles. 

The application is built to mirror the aesthetic and functionality of elite auction houses, employing dark-mode glassmorphism, advanced interactive animations, and robust backend security to ensure a luxurious and trustworthy user experience.

---

## 2. Technology Stack

### Frontend Architecture
*   **Core Framework**: React (scaffolded with Vite for exceptional development and build speeds).
*   **Routing**: React Router DOM (v6), enabling client-side navigation and protected routes.
*   **Styling**: Tailwind CSS combined with custom CSS variables to construct the complex glass-panel UI, gradients, and typography.
*   **State Management**: React Context API. Multiple distinct providers manage the application's global state (`AuthContext`, `CartContext`, `NotificationContext`, `ThemeContext`, `ToastContext`).
*   **Animation & Motion**: 
    *   **Framer Motion**: Powers the complex orchestrations including page transitions, magnetic buttons, custom cursors, and layout entrance animations.
    *   **React-Parallax-Tilt**: Drives the 3D gyroscope/mouse-based tilt effects on product cards.
*   **Icons**: Lucide React.
*   **HTTP Client**: Axios, configured with base URLs and interceptors for JWT token management.

### Backend Architecture
*   **Core Framework**: Node.js & Express.js.
*   **Database**: MongoDB hosted via MongoDB Atlas.
*   **ORM**: Mongoose, utilizing strictly defined Schemas with relationship population.
*   **Authentication**: JSON Web Tokens (JWT) signed and verified via HTTP headers, paired with Bcrypt.js for secure password hashing.
*   **Payment Gateway**: Razorpay REST API integration, allowing transactions natively in INR via UPI, Paytm, NetBanking, and Cards.
*   **Mailing System**: Nodemailer, functioning over SMTP to dispatch transactional and automated emails.
*   **File Uploads**: Multer middleware handling `multipart/form-data` for local image hosting.

---

## 3. Core Features & Functionality

### 🔐 Security & User Management
*   **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin` and `User`. Admins possess God-mode capabilities to manage the entire marketplace, while users can buy, sell, and track personal acquisitions.
*   **Collector Badges (Gamification)**: The system tracks cumulative user spend (`totalSpent`). Triggering specific revenue thresholds automatically upgrades a user's prestige badge tier: Bronze → Silver → Gold → Platinum.

### 💳 Commerce & Payments
*   **Razorpay Integration**: A robust, lazy-loaded custom controller that generates secure Order IDs server-side, opens the Razorpay script modal on the client, and uses webhook/verification callbacks to safely mark orders as paid.
*   **Dynamic Coupon System**: Admins can generate custom promo codes (e.g., `VIP10`) specifying exact discount percentages and expiration dates. The checkout UI calculates the mathematical deductions instantly.
*   **4-Step Order Timeline**: Orders transition through `Processing` → `Authenticated` → `Vault Transition` → `Delivered`, with historical timestamp tracking visible to the user via animated progress bars.

### 🔔 Real-Time & Communication
*   **In-App Notifications**: The frontend polls the backend aggressively (30s intervals) pulling down new system alerts. This displays as an unread-badge bell icon tracking new orders, validated products, and buyer/seller offer updates.
*   **Private Offers Mechanism**: Rather than purchasing at listed price, users can bypass checkout to propose a binding "Private Offer" with dynamic pricing and messaging directly to the seller/admin.
*   **VIP Concierge Service**: A direct, tracked internal messaging system between high-net-worth clients and administrators.

### 🔎 Discovery & Curation
*   **Advanced Autocomplete Search**: Searching triggers instant database queries returning top matching results for both Categories and Product Titles simultaneously.
*   **Verified Purchase Reviews**: A sophisticated algorithm ensures that reviews and star ratings appended to a product accurately reflect only users who have successfully *purchased* the item, rewarding them with a "Verified Purchase" green badge.
*   **Related Products Engine**: An automated query system pulling 4 items that match the current artifact's Category or Rarity level to keep the user exploring.
*   **"The Journal"**: A fully functioning integrated editorial blog hosting high-end articles regarding collection curation, history, and horology.

---

## 4. UI / UX Masterclass: The Interactive Visual Overhaul
To distinguish ForgeVogue from standard marketplaces, 6 specific "ultra-premium" visual interactions were rigorously engineered:

1.  **Custom Trailing Glass Cursor**: The native mouse pointer is hidden, replaced by a mathematically calculated `CustomCursor.jsx`. It features a solid gold dot leading a fluid, trailing glass ring that intelligently expands when hovering over clickable elements.
2.  **Gold Spotlight Aura**: Integrated with the cursor is an ambient, large-radius soft gold radial-gradient lighting effect that organically highlights the dark components behind the user's mouse.
3.  **3D Parallax Tilt Cards**: Product cards on the grid layouts employ `react-parallax-tilt`. As the pointer moves across the item, the card physically skews across its X/Y axes while shifting its internal glare reflection, establishing a feeling of physical depth.
4.  **Magnetic CTA Buttons**: A bespoke `MagneticWrapper.jsx` utilizes Framer Motion's spring dampening physics. Primary buttons read the pointer's local coordinates and physically 'pull' toward the mouse, encouraging conversion.
5.  **Seamless Page Transitions**: Standard routing flashes are eradicated via `<AnimatePresence>`. Moving across `/home` to `/store` triggers an elegant animation sequence where the outgoing route slides up and fades, while the incoming route materializes smoothly.
6.  **Animated Shimmer Loaders**: Empty white screens and spinning loading rings are replaced with CSS `animate-pulse` skeletons that mirror the exact geometric layout of the cards being loaded from MongoDB, minimizing Layout Shifts.
7.  **Interactive Image Magnifier**: Changing static images on the Item Details page, the `ImageMagnifier.jsx` component converts the main photo into an intense zoom-lens tracking the user's specific mouse coordinate percentages for immense detail inspection.

---

## 5. Page Directory & Route Mapping

### 🌐 Public Viewports
*   `/home` — Cinematic, auto-advancing Hero Video Slider, Vault navigational portals, Animated Statistics Tracker, and the Authentic Verification manifesto.
*   `/store` — The master listing database. Includes a sticky side-panel for dynamically intersecting Category, Rarity, and Keyword filters alongside State-based Pagination.
*   `/product/:id` — The focus view. Hosts the Magnifier Lens, Add To Cart logic, Related Items carousel, Detailed Meta-data, Social Media sharing engine, and the Verified Review form.
*   `/journal` & `/journal/:slug` — The Editorial Wing. Grid layout of long-form articles discussing artifact provenance.
*   `/about` — Information detailing the internal 3-step authentication logic executed by the company.

### 👤 Collector (User) Viewports
*   `/profile` — Displays the Collector's Badge (gamification icon), historical spend metrics, and internal navigational links.
*   `/my-orders` — A visual history of acquisitions displaying expanding/collapsing order cards with the real-time shipping progress bar.
*   `/sell` — The intake form where users can construct a product model, submit images via Multer, and assign properties for Admin verification.
*   `/checkout` — The final stage processor handling Cart context state, Address validation, Coupon mathematical application, and deploying the Razorpay script overlay.

### 👑 Sovereign (Admin) Viewports
*   `/admin` — A master control nexus split using a dynamic tab-navigation system:
    *   **Products Tab**: Approve/Reject user submissions, Delete inventory.
    *   **Orders Tab**: Manage overarching sales pipeline shipping status updates.
    *   **Users Tab**: Broad database of registered collectors.
    *   **Concierge Tab**: Central response hub for reading specific VIP inquiries.
    *   **Coupons Tab**: Generation engine for new Promo Codes.

---

## 6. Project Database Seeder Architecture
The application possesses a robust data intake script (`seeder.js`) designed to instantly hydrate or reset the MongoDB database. The script currently loads:
*   **2 Distinct Accounts**: An Admin superuser (`admin@forgevogue.com`) and a standard Collector (`john@example.com`).
*   **31 Hyper-Detailed Products**: Distributed seamlessly across all categories. They feature exact historical pricing, rarity strings, detailed HTML descriptions, and are mapped accurately to active, high-resolution Unsplash image assets.
*   **8 Editorial Articles**: Pre-loaded blog posts for The Journal to establish immediate UX immersion. 

## End of Documentation
