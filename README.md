# Vibe Todos

Monorepo for a Next.js frontend and Hono API, deployed to GKE behind Cloudflare Zero Trust.

## Architecture

```mermaid
flowchart LR
  user[User Browser] --> cf[Cloudflare DNS + Zero Trust Access]
  cf --> tunnel[Cloudflared Tunnel]
  tunnel --> gke[GKE Cluster]

  subgraph gke[GKE Cluster]
    web[Todo Web (Next.js)]
    api[Todo API (Hono)]
    n8n[n8n App]
    cnpg[CNPG Operator]
    todoDb[(Postgres: todo-db)]
    n8nDb[(Postgres: n8n-db)]

    web --> api
    api --> todoDb
    n8n --> n8nDb
    cnpg --> todoDb
    cnpg --> n8nDb
  end

  subgraph gcp[GCP]
    ar[Artifact Registry]
    gcs[GCS Backup Bucket]
  end

  ci[GitHub Actions] --> ar
  cnpg --> gcs
```

## Local development

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm --filter @vibe-todos/api db:migrate
pnpm --filter @vibe-todos/api dev
```

```bash
pnpm --filter @vibe-todos/web dev
```

Open `http://localhost:3000`.

## Production deploy notes

- API image: `us-west1-docker.pkg.dev/bhanufyi/todo-app/api:latest`
- Web image: `us-west1-docker.pkg.dev/bhanufyi/todo-app/web:latest`
- Web server proxy uses `API_INTERNAL_URL` to reach the API inside the cluster.

### Database migrations (k8s)

Apply the k8s manifests to run the migration job:

```bash
kubectl apply -k infrastructure/k8s/apps/todo-app
```

To rerun migrations:

```bash
kubectl delete job/todo-app-migrate
kubectl apply -k infrastructure/k8s/apps/todo-app
```
