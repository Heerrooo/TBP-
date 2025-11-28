# Running Travel Booking Platform on Kubernetes

## Quick Start

### Prerequisites
- Docker Desktop with Kubernetes enabled (or any Kubernetes cluster)
- `kubectl` command-line tool installed and configured
- Docker Hub account (username: ram1215)

### Deploy Everything
```bash
# Apply all manifests
kubectl apply -k kubernetes/

# Verify deployment
kubectl get all -n tbp
```

---

## Accessing the Application

### Option 1: Using LoadBalancer Services (Direct)
```bash
# Get service endpoints
kubectl get svc -n tbp

# Access frontend (port 3000)
http://localhost:3000

# Access backend API (port 8081)
http://localhost:8081/api
```

### Option 2: Port Forwarding (Port Mapping)
```bash
# Forward frontend
kubectl port-forward svc/frontend 3000:3000 -n tbp

# Forward backend (in another terminal)
kubectl port-forward svc/backend 8081:8081 -n tbp

# Forward MySQL (if needed)
kubectl port-forward svc/mysql 3306:3306 -n tbp
```

### Option 3: Using NodePort (Docker Desktop)
```bash
# Get node port
kubectl get svc frontend -n tbp
# Example output: 3000:32491/TCP

# Access via
http://localhost:32491
```

---

## Common Commands

### Check Deployment Status
```bash
# All resources in tbp namespace
kubectl get all -n tbp

# Watch pods in real-time
kubectl get pods -n tbp --watch

# Detailed pod information
kubectl describe pod <pod-name> -n tbp

# Check resource usage
kubectl top pods -n tbp
```

### View Logs
```bash
# Frontend logs (all pods)
kubectl logs -l app=frontend -n tbp

# Backend logs (all pods)
kubectl logs -l app=backend -n tbp

# MySQL logs
kubectl logs -l app=mysql -n tbp

# Stream logs in real-time
kubectl logs -f -l app=frontend -n tbp

# View last 50 lines
kubectl logs -l app=backend --tail=50 -n tbp
```

### Check Services
```bash
# List all services
kubectl get svc -n tbp

# Get detailed service info
kubectl describe svc frontend -n tbp

# Get service endpoints
kubectl get endpoints -n tbp
```

### Check ConfigMaps
```bash
# List all config maps
kubectl get cm -n tbp

# View config map content
kubectl describe cm backend-config -n tbp
```

---

## Scaling

### Scale Deployments
```bash
# Scale frontend to 3 replicas
kubectl scale deployment frontend --replicas=3 -n tbp

# Scale backend to 4 replicas
kubectl scale deployment backend --replicas=4 -n tbp

# Scale down to 1 (maintenance)
kubectl scale deployment frontend --replicas=1 -n tbp
```

### Auto-Scaling (if metrics-server installed)
```bash
# Create HPA for backend
kubectl autoscale deployment backend --min=2 --max=5 --cpu-percent=80 -n tbp

# Check HPA status
kubectl get hpa -n tbp
```

---

## Updating Deployments

### Update Image (when you rebuild Docker image)
```bash
# Step 1: Rebuild and push new image
docker build -t ram1215/tbp-backend:latest ./TBP\ Back/demo
docker push ram1215/tbp-backend:latest

# Step 2: Restart pods to pull new image
kubectl rollout restart deployment/backend -n tbp

# Step 3: Check rollout status
kubectl rollout status deployment/backend -n tbp

# Step 4: View rollout history
kubectl rollout history deployment/backend -n tbp
```

### Rollback to Previous Version
```bash
# View rollout history
kubectl rollout history deployment/backend -n tbp

# Rollback to previous version
kubectl rollout undo deployment/backend -n tbp

# Rollback to specific revision
kubectl rollout undo deployment/backend --to-revision=2 -n tbp
```

### Update Configuration
```bash
# Edit ConfigMap
kubectl edit cm backend-config -n tbp

# Restart pods to pick up changes
kubectl rollout restart deployment/backend -n tbp
```

---

## Testing & Validation

### Test API Endpoints
```bash
# Test backend health
kubectl exec -it backend-pod-name -n tbp -- curl http://localhost:8081/actuator/health

# Test from frontend pod to backend
kubectl exec -it frontend-pod-name -n tbp -- curl http://backend:8081/api/travel/search

# Port forward and test locally
kubectl port-forward svc/backend 8081:8081 -n tbp
curl http://localhost:8081/actuator/health
```

### Test Database Connection
```bash
# Connect to MySQL pod
kubectl exec -it mysql-pod-name -n tbp -- mysql -u root -p2300032364 -D demo_db

# List tables
SHOW TABLES;
SELECT * FROM users LIMIT 5;
```

### Login Test
```bash
# Port forward frontend
kubectl port-forward svc/frontend 3000:3000 -n tbp

# Open browser: http://localhost:3000
# Test credentials:
# Email: user@tbp.com (or register new)
# Password: password123 (or set during registration)
```

---

## Troubleshooting

### Pod Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n tbp

# View logs
kubectl logs <pod-name> -n tbp

# Check events
kubectl get events -n tbp --sort-by='.lastTimestamp'
```

### Service Not Accessible
```bash
# Check service endpoints
kubectl get endpoints frontend -n tbp

# Check service configuration
kubectl describe svc frontend -n tbp

# Test DNS resolution from pod
kubectl exec -it backend-pod-name -n tbp -- nslookup frontend
```

### Database Connection Issues
```bash
# Check if MySQL pod is running
kubectl get pod -l app=mysql -n tbp

# Check MySQL logs
kubectl logs -l app=mysql -n tbp

# Verify persistent volume
kubectl get pvc -n tbp
kubectl describe pvc mysql-pvc -n tbp
```

### Resource Limits Exceeded
```bash
# Check resource usage
kubectl top pods -n tbp

# Increase resource limits in deployment
kubectl edit deployment backend -n tbp
# Find resources section and increase limits

# Or delete and reapply with new manifests
kubectl delete -k kubernetes/
# Edit kubernetes/backend-deployment.yaml
kubectl apply -k kubernetes/
```

---

## Maintenance

### Backup Database
```bash
# Create backup
kubectl exec mysql-pod-name -n tbp -- mysqldump -u root -p2300032364 demo_db > backup.sql

# Restore from backup
kubectl exec -i mysql-pod-name -n tbp -- mysql -u root -p2300032364 demo_db < backup.sql
```

### Clean Up Resources
```bash
# Delete specific deployment
kubectl delete deployment frontend -n tbp

# Delete entire namespace (removes all resources)
kubectl delete namespace tbp

# Remove all Kubernetes resources
kubectl delete -k kubernetes/
```

### View Resource Usage
```bash
# CPU and memory usage
kubectl top nodes
kubectl top pods -n tbp

# Persistent volume usage
kubectl get pvc -n tbp
kubectl describe pvc mysql-pvc -n tbp
```

---

## Advanced Operations

### Execute Commands in Pods
```bash
# Interactive shell
kubectl exec -it backend-pod-name -n tbp -- bash

# Run single command
kubectl exec backend-pod-name -n tbp -- curl http://localhost:8081/actuator/health

# Copy files to/from pod
kubectl cp /local/path backend-pod-name:/pod/path -n tbp
kubectl cp backend-pod-name:/pod/path /local/path -n tbp
```

### Port Forwarding for Development
```bash
# Forward multiple services
kubectl port-forward svc/frontend 3000:3000 -n tbp &
kubectl port-forward svc/backend 8081:8081 -n tbp &
kubectl port-forward svc/mysql 3306:3306 -n tbp &

# Kill all port forwards
pkill -f "kubectl port-forward"
```

### Monitor Deployments
```bash
# Watch deployment rollout
kubectl rollout status deployment/backend -n tbp --watch

# Check deployment events
kubectl describe deployment backend -n tbp

# View pod events
kubectl get events -n tbp --field-selector involvedObject.name=backend-pod-name
```

---

## Configuration Reference

### Service Endpoints (Internal Kubernetes DNS)
- **Frontend**: `frontend.tbp.svc.cluster.local:3000`
- **Backend**: `backend.tbp.svc.cluster.local:8081`
- **MySQL**: `mysql.tbp.svc.cluster.local:3306`

### Database Credentials
- **User**: `tbpuser` / `root`
- **Password**: `tbppass` / `2300032364`
- **Database**: `demo_db`

### Environment Variables (ConfigMaps)
```bash
# Backend environment
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/demo_db
SPRING_PROFILES_ACTIVE=kubernetes

# Frontend Nginx
BACKEND_HOST=backend
BACKEND_PORT=8081
```

### Resource Limits
- **Backend**: CPU: 500m, Memory: 512Mi (request), Limit: 1000m, 1Gi
- **Frontend**: CPU: 100m, Memory: 128Mi (request), Limit: 500m, 512Mi
- **MySQL**: CPU: 250m, Memory: 256Mi (request), Limit: 1000m, 1Gi

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              Kubernetes Cluster (tbp)               │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐      ┌──────────────┐             │
│  │   Frontend   │      │   Backend    │             │
│  │ (nginx:3000) │      │  (API:8081)  │             │
│  │  2 Replicas  │      │  2 Replicas  │             │
│  └──────────────┘      └──────────────┘             │
│       │                       │                      │
│       │ LoadBalancer          │ LoadBalancer        │
│       ├─────────────────────────┘                    │
│       │                                              │
│       └─────────────────────────┐                   │
│                                 │                   │
│                          ┌──────────────┐           │
│                          │    MySQL     │           │
│                          │  (3306)      │           │
│                          │  1 Replica   │           │
│                          └──────────────┘           │
│                                 │                   │
│                          ┌──────────────┐           │
│                          │ Persistent   │           │
│                          │ Volume (5Gi) │           │
│                          └──────────────┘           │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Quick Reference Commands

```bash
# Deploy
kubectl apply -k kubernetes/

# Verify
kubectl get all -n tbp

# View logs
kubectl logs -l app=frontend -n tbp
kubectl logs -l app=backend -n tbp

# Access via port-forward
kubectl port-forward svc/frontend 3000:3000 -n tbp
kubectl port-forward svc/backend 8081:8081 -n tbp

# Scale
kubectl scale deployment frontend --replicas=3 -n tbp

# Update image
docker push ram1215/tbp-frontend:latest
kubectl rollout restart deployment/frontend -n tbp

# Status
kubectl rollout status deployment/frontend -n tbp

# Cleanup
kubectl delete -k kubernetes/
```

---

## Production Checklist

- [ ] Store credentials in Kubernetes Secrets (not ConfigMaps)
- [ ] Enable RBAC for pod access control
- [ ] Configure network policies for pod-to-pod communication
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure logging (ELK Stack/Loki)
- [ ] Enable pod disruption budgets for high availability
- [ ] Use private Docker registry instead of Docker Hub
- [ ] Configure SSL/TLS certificates for HTTPS
- [ ] Set up ingress controller for advanced routing
- [ ] Enable persistent volume backups
- [ ] Configure horizontal pod autoscaling
- [ ] Set resource quotas per namespace
- [ ] Enable pod security policies

---

## Documentation Links

- Kubernetes Official: https://kubernetes.io/docs/
- kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- Spring Boot on Kubernetes: https://spring.io/guides/gs/spring-boot-kubernetes/
- Docker Desktop Kubernetes: https://docs.docker.com/desktop/kubernetes/
