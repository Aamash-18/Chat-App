# K3s deployment

Create the Kubernetes secret on the cluster before applying `backend.yaml`:

```bash
sudo k3s kubectl create secret generic chat-app-secrets \
  -n chat-app \
  --from-literal=NODE_ENV=production \
  --from-literal=PORT=8080 \
  --from-literal=CLIENT_URL=http://92.4.86.60 \
  --from-literal=MONGO_URI='your-mongodb-uri' \
  --from-literal=JWT_SECURITY_KEY='your-jwt-secret' \
  --from-literal=REDIS_URL='your-redis-url' \
  --from-literal=CLOUDINARY_CLOUD_NAME='your-cloud-name' \
  --from-literal=CLOUDINARY_API_KEY='your-cloudinary-key' \
  --from-literal=CLOUDINARY_API_SECRET='your-cloudinary-secret'
```

Apply the resources:

```bash
sudo k3s kubectl apply -f namespace.yaml
sudo k3s kubectl apply -f backend.yaml -f frontend.yaml -f ingress.yaml
```
