# Universe Event Processing Stack

This project is a distributed event processing system composed of several microservices running in Docker. It provides data ingestion, processing, reporting, and monitoring capabilities.

---

## Stack Overview

The system consists of the following services, orchestrated via `docker-compose`:

- **publisher**  
  Source container from Docker Hub
  Architecture: `arm64` (requires emulator on x86 systems)

- **gateway**  
  HTTP entry point to the system (API Gateway)

- **fb-collector**  
  Event collector for Facebook events

- **ttk-collector**  
  Event collector for TTK events

- **reporter**  
  Aggregates data and provides analytics

- **prometheus**  
  Metrics collection and time-series database

- **grafana**  
  Visualization dashboard for system metrics

---

## Preparing
### Copy data from env.prod / env.dev to .env

```
cp .env.dev .env
```

## Installation

### Option 1: One-command setup

From the project root, run:

```bash
./project-init.sh
```
This script installs dependencies and generates Prisma clients for each service.

### Option 2: Manual setup

Run the following commands step-by-step:

```
npm install

cd libs/db
npm install
npx prisma generate

cd ../../apps/gateway
npm install

cd ../collector-fb
npm install
npx prisma generate

cd ../collector-ttk
npm install
npx prisma generate

cd ../reporter
npm install
npx prisma generate

docker compose up --build
```

Then start the application with:

```
docker compose up --build
```

## Grafana Dashboards

All Grafana dashboards are located in the folder:
```
grafana/dashboards
```
```
.
├── collectors-dashboard.json
├── gateway-dashboard.json
└── reporter-dashboard.json
```
These dashboards provide system-wide metrics, traffic insights, and service health

## ⚠️ ARM64 Note (Publisher)
The **publisher** container is built for the **arm64** architecture.
To run it on **x86_64** systems (Linux or Windows), you must enable ARM64 emulation using [QEMU](https://github.com/multiarch/qemu-user-static):

```
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
```
⚠️ Note: Running ARM64 containers via QEMU may significantly affect performance in development environments.



## Docker Versions
All Docker-related production and development configuration files are located in:
```
/docker
```


## Postman Collection
All available API routes and requests are documented and stored in the postman folder for easy import into Postman.
```
/postman
```

## ✅ Summary
- Simple setup via script or manually
- Full monitoring with Grafana + Prometheus
- Prisma-based services
- Modular architecture with collectors, reporters, and a gateway
