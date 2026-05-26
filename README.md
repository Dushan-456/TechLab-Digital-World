# TechLab Digital World

A full-stack Digital Wedding Invitation SaaS Platform.

## Tech Stack

| Layer    | Technology                     |
|----------|--------------------------------|
| Frontend | React 19, Vite 7, TailwindCSS 4 |
| Backend  | Express 5, Mongoose 8         |
| Database | MongoDB 7                      |
| Infra    | Docker, Nginx                  |

---

## 🐳 Running with Docker

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or Docker Engine + Docker Compose v2 (Linux)

### Quick Start

```bash
# 1. Clone the repo
git clone <repo-url> && cd TechLab-Digital-World

# 2. Set up environment variables
#    Copy the Docker env template and edit with your values
cp .env.docker Backend/.env

# 3. Build and start all services
docker compose up --build -d
```

Once running:

| Service  | URL                           |
|----------|-------------------------------|
| Frontend | http://localhost:3000          |
| Backend  | http://localhost:5000          |
| MongoDB  | mongodb://localhost:27017      |

### Useful Commands

```bash
# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f backend

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes database data)
docker compose down -v

# Rebuild a specific service
docker compose build backend
docker compose up -d backend

# Open a shell inside the backend container
docker compose exec backend sh

# Run the database seed script
docker compose exec backend node seed.mjs
```

### Environment Configuration

The backend reads its environment from `Backend/.env`. When running inside Docker, the key difference is:

| Variable       | Local Value                                  | Docker Value                                  |
|----------------|----------------------------------------------|-----------------------------------------------|
| `MONGODB_URI`  | `mongodb://localhost:27017/digital-wedding`   | `mongodb://mongodb:27017/digital-wedding` (auto-set by compose) |
| `FRONTEND_URL` | `http://localhost:5173`                       | `http://localhost:3000`                        |

> **Note**: `MONGODB_URI` is overridden in `docker-compose.yml` so you don't need to change it in your `.env` file.

The frontend's `VITE_API_BASE_URL` is injected as a **build argument** in `docker-compose.yml` (default: `http://localhost:5000/api/v1/`). To change it, edit the `args` section under the `frontend` service.

### Volumes

| Volume            | Purpose                              |
|-------------------|--------------------------------------|
| `mongo-data`      | Persists MongoDB data across restarts |
| `backend-uploads` | Persists uploaded files (invitations, profile pics, audio) |

---

## 🖥️ Running Locally (without Docker)

### Prerequisites

- Node.js 22+
- MongoDB 7+ running locally

### Setup

```bash
# Backend
cd Backend
cp sample.env .env   # Edit .env with your values
npm install
npm run seed         # Seed the admin user
npm run dev

# Frontend (in a separate terminal)
cd Frontend
cp sample.env .env   # Edit .env with your values
npm install
npm run dev
```

| Service  | URL                           |
|----------|-------------------------------|
| Frontend | http://localhost:5173          |
| Backend  | http://localhost:5000          |


ccccccccccccccccccccccccccccccccccccc