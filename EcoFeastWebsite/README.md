# EcoFeast Nutrients — Portfolio Website

Full-stack portfolio website for EcoFeast Nutrients Pvt. Ltd.

**Tech Stack:** React 18 + Tailwind CSS | .NET 8 Web API | PostgreSQL | Railway

---

## 📁 Folder Structure

```
EcoFeastWebsite/
├── EcoFeastWebsite.sln              # Visual Studio solution
├── Dockerfile                       # Multi-stage build for Railway
├── railway.toml                     # Railway deployment config
├── .gitignore
│
├── EcoFeast.API/                    # .NET 8 Backend
│   ├── EcoFeast.API.csproj
│   ├── Program.cs                   # Entry point (DI, middleware, CORS, JWT)
│   ├── appsettings.json             # Local DB connection & JWT config
│   ├── Controllers/
│   │   ├── PublicController.cs      # GET /api/public/sitedata (no auth)
│   │   ├── AuthController.cs        # POST /api/auth/login
│   │   └── AdminController.cs       # CRUD endpoints (JWT protected)
│   ├── Models/
│   │   └── Entities.cs              # EF Core entity classes
│   ├── DTOs/
│   │   └── Dtos.cs                  # Request/Response DTOs
│   ├── Data/
│   │   ├── AppDbContext.cs          # EF Core DbContext
│   │   └── DbSeeder.cs             # Seeds initial data on first run
│   └── Services/
│       └── TokenService.cs          # JWT token generation
│
└── EcoFeast.Client/                 # React Frontend
    ├── package.json
    ├── vite.config.js               # Dev proxy → localhost:5000
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                  # Main app — fetches API data
        ├── styles/index.css         # Tailwind + animations
        ├── services/api.js          # Axios client for all API calls
        ├── hooks/useAnimations.js   # useInView, useCounter hooks
        └── components/
            ├── Navbar.jsx
            ├── HeroSection.jsx      # Animated stat counters
            ├── StatCounter.jsx
            ├── AboutSection.jsx
            ├── ProductsSection.jsx  # Product grid with HS codes
            ├── ProductCard.jsx
            ├── StrengthsSection.jsx
            ├── CertificationsSection.jsx
            ├── GlobalReachSection.jsx
            ├── WorldMap.jsx         # Interactive SVG world map
            ├── ContactSection.jsx   # Form → POST /api/public/contact
            ├── Footer.jsx
            ├── LeafDecoration.jsx
            └── LoadingScreen.jsx
```

---

## 🛠️ Prerequisites

Before you start, install these:

| Tool                | Version  | Download Link                                      |
|---------------------|----------|----------------------------------------------------|
| **.NET 8 SDK**      | 8.0+     | https://dotnet.microsoft.com/download/dotnet/8.0   |
| **Node.js**         | 18+      | https://nodejs.org                                  |
| **PostgreSQL**      | 15+      | https://www.postgresql.org/download/                |
| **Visual Studio**   | 2022     | https://visualstudio.microsoft.com                  |
| **Git**             | any      | https://git-scm.com                                 |

---

## 🚀 Local Setup (Step by Step)

### Step 1: Set Up PostgreSQL

1. **Install PostgreSQL** (if not already installed)
   - Windows: Use the installer from https://www.postgresql.org/download/windows/
   - During install, set password to `postgres` (or change it in appsettings.json)

2. **Create the database:**
   Open **pgAdmin** or **psql** terminal and run:
   ```sql
   CREATE DATABASE ecofeast_db;
   ```

   That's it — EF Core will create all tables automatically on first run.

### Step 2: Clone / Copy the Project

```bash
# If using Git
git init
git add .
git commit -m "Initial commit"
```

### Step 3: Run the .NET API

Open the solution in **Visual Studio 2022**:

1. Double-click `EcoFeastWebsite.sln`
2. VS will auto-restore NuGet packages
3. Open **Package Manager Console** (Tools → NuGet → Package Manager Console)
4. Run the initial migration:
   ```
   Add-Migration InitialCreate -Project EcoFeast.API
   Update-Database -Project EcoFeast.API
   ```
5. Press **F5** or click the green play button

The API starts at `http://localhost:5000` with Swagger at `http://localhost:5000/swagger`

> **What happens on first run:**
> - EF Core creates all tables in PostgreSQL
> - DbSeeder inserts all products, stats, strengths, settings
> - A default admin user is created: `admin` / `EcoFeast@2025`

### Step 4: Run the React Frontend

Open a **separate terminal** in the `EcoFeast.Client` folder:

```bash
cd EcoFeast.Client
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

Vite auto-proxies `/api` calls to `http://localhost:5000` (configured in vite.config.js).

### Step 5: Open in Browser

Go to **http://localhost:5173** — you should see the full website with data loaded from the API.

---

## 🔑 API Endpoints

### Public (No Auth)

| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| GET    | `/api/public/sitedata`    | All site data in one call      |
| POST   | `/api/public/contact`     | Submit contact inquiry         |

### Auth

| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| POST   | `/api/auth/login`         | Login → returns JWT token      |

### Admin (JWT Required)

| Method | Endpoint                       | Description                 |
|--------|--------------------------------|-----------------------------|
| GET    | `/api/admin/stats`             | List all stat counters      |
| PUT    | `/api/admin/stats/{id}`        | Update a stat value         |
| GET    | `/api/admin/products`          | List all products           |
| POST   | `/api/admin/products`          | Add new product             |
| PUT    | `/api/admin/products/{id}`     | Update product              |
| DELETE | `/api/admin/products/{id}`     | Delete product              |
| GET    | `/api/admin/strengths`         | List strengths              |
| POST   | `/api/admin/strengths`         | Add new strength            |
| GET    | `/api/admin/inquiries`         | List contact inquiries      |
| PUT    | `/api/admin/inquiries/{id}/read` | Mark inquiry as read      |
| GET    | `/api/admin/settings`          | List site settings          |
| PUT    | `/api/admin/settings`          | Update a setting            |

### Testing Admin API via Swagger:

1. Go to `http://localhost:5000/swagger`
2. Call `POST /api/auth/login` with `{"username": "admin", "password": "EcoFeast@2025"}`
3. Copy the token from the response
4. Click "Authorize" button (top right), paste: `Bearer <your-token>`
5. Now all admin endpoints work

---

## 🚂 Deploy to Railway

### Step 1: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/ecofeast-website.git
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository

### Step 3: Add PostgreSQL

1. In your Railway project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway auto-creates the database and sets `DATABASE_URL`

### Step 4: Set Environment Variables

In your Railway service settings, add:

```
JWT_KEY=Your-Super-Secret-Production-Key-Here-Make-It-Long!
ASPNETCORE_ENVIRONMENT=Production
```

Railway automatically provides `DATABASE_URL` and `PORT`.

### Step 5: Deploy

Railway auto-detects the `Dockerfile` and builds. The multi-stage build:
1. Builds React → static files
2. Builds .NET API → published DLL
3. Copies React build into `wwwroot` → served by .NET

Your site will be live at `https://your-project.up.railway.app`

---

## 🔄 How the Data Flow Works

```
Browser → React (Vite/Static) → GET /api/public/sitedata → .NET Controller → EF Core → PostgreSQL
                                                                                    ↓
                                                                              Returns JSON
                                                                                    ↓
                                                          React renders stats, products, etc.

Contact Form → POST /api/public/contact → Saved to ContactInquiries table

Admin Panel (future) → JWT Login → PUT /api/admin/stats/1 → Updates stat value → Frontend reflects change
```

---

## ✏️ How to Update Stats (Without Admin Panel)

Until the admin panel is built, you can update stats via:

**Option A: Swagger UI**
1. Login at `/swagger` → get token → authorize
2. Call `PUT /api/admin/stats/1` with `{"label": "Trades Completed", "value": 200, "suffix": "+", "displayOrder": 1}`

**Option B: Direct SQL**
```sql
UPDATE "StatCounters" SET "Value" = 200, "UpdatedAt" = NOW() WHERE "Id" = 1;
```

**Option C: cURL**
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"EcoFeast@2025"}' | jq -r '.token')

# Update stat
curl -X PUT http://localhost:5000/api/admin/stats/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"label":"Trades Completed","value":200,"suffix":"+","displayOrder":1}'
```

---

## 📝 Changing the Default Admin Password

Update in `DbSeeder.cs` before first run, or via SQL after:
```sql
-- Generate a new hash in C#: BCrypt.Net.BCrypt.HashPassword("NewPassword123")
UPDATE "AdminUsers" SET "PasswordHash" = '<new-bcrypt-hash>' WHERE "Username" = 'admin';
```

---

## 🧑‍💻 Development Tips

- **Hot reload**: Both Vite (frontend) and .NET (backend with `dotnet watch`) support hot reload
- **To run backend with watch**: `dotnet watch run --project EcoFeast.API`
- **Fallback data**: If the API is down, the React app falls back to hardcoded data (see `App.jsx`)
- **CORS**: Configured for `localhost:5173` (Vite) and `*.up.railway.app` (production)

---

Built with ♥ for EcoFeast Nutrients Pvt. Ltd.
