#!/bin/bash
set -e

echo "=========================================="
echo " TaevasClinic Server Setup - Lightsail"
echo "=========================================="

# ─── 1. System packages ─────────────────────────────────────────────────────
echo "[1/8] Installing system packages..."
sudo apt-get update -qq
sudo apt-get install -y -qq openjdk-17-jdk postgresql postgresql-contrib nginx git maven nodejs npm curl unzip

echo "  Java: $(java -version 2>&1 | head -1)"
echo "  Node: $(node -v)"
echo "  Nginx: $(nginx -v 2>&1)"
echo "  PostgreSQL: $(psql --version)"

# ─── 2. PostgreSQL setup ────────────────────────────────────────────────────
echo "[2/8] Setting up PostgreSQL..."
DB_PASS=$(openssl rand -base64 24)
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='taevas'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER taevas WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='taevas_clinic'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE taevas_clinic OWNER taevas;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE taevas_clinic TO taevas;"
echo "  DB ready: taevas_clinic"

# ─── 3. Clone repo ──────────────────────────────────────────────────────────
echo "[3/8] Cloning repository..."
cd /home/ashraf42
if [ -d "taevas-clinic" ]; then
  cd taevas-clinic && git pull origin main
else
  git clone https://github.com/Five5Whys/taevas-clinic.git
  cd taevas-clinic
fi

# ─── 4. Create .env with secure secrets ──────────────────────────────────────
echo "[4/8] Creating secure .env..."
JWT_SECRET=$(openssl rand -base64 48)
cat > /home/ashraf42/taevas-clinic/.env << ENVEOF
DB_PASS=${DB_PASS}
JWT_SECRET=${JWT_SECRET}
ENVEOF
chmod 600 /home/ashraf42/taevas-clinic/.env
echo "  .env created (600 perms)"

# ─── 5. Build backend ───────────────────────────────────────────────────────
echo "[5/8] Building backend (Maven)..."
cd /home/ashraf42/taevas-clinic/backend
mvn package -DskipTests -B -q
echo "  JAR built: $(ls target/*.jar 2>/dev/null)"

# ─── 6. Build frontend ──────────────────────────────────────────────────────
echo "[6/8] Building frontend..."
cd /home/ashraf42/taevas-clinic/frontend
npm install --silent
npm run build
echo "  FE built: $(ls dist/index.html 2>/dev/null && echo OK)"

# ─── 7. Nginx config ────────────────────────────────────────────────────────
echo "[7/8] Configuring Nginx..."
sudo tee /etc/nginx/sites-available/taevas-clinic > /dev/null << 'NGINXEOF'
server {
    listen 80 default_server;
    server_name _;
    server_tokens off;
    root /home/ashraf42/taevas-clinic/frontend/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Block dotfiles
    location ~ /\. { deny all; }

    # API proxy to Spring Boot
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90s;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINXEOF

sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/taevas-clinic /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
echo "  Nginx configured and running"

# Fix permissions for www-data
sudo chmod 755 /home/ashraf42 /home/ashraf42/taevas-clinic /home/ashraf42/taevas-clinic/frontend /home/ashraf42/taevas-clinic/frontend/dist
sudo find /home/ashraf42/taevas-clinic/frontend/dist -type d -exec chmod 755 {} \;
sudo find /home/ashraf42/taevas-clinic/frontend/dist -type f -exec chmod 644 {} \;

# ─── 8. Start backend ───────────────────────────────────────────────────────
echo "[8/8] Starting Spring Boot..."
# Kill existing if running
pkill -f "clinic-0.0.1-SNAPSHOT" 2>/dev/null || true
sleep 2

# Create application-prod.yml
cat > /home/ashraf42/taevas-clinic/application-prod.yml << PRODEOF
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration
      - org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration
  datasource:
    url: jdbc:postgresql://localhost:5432/taevas_clinic
    username: taevas
    password: ${DB_PASS}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: none
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
app:
  jwt:
    secret: ${JWT_SECRET}
  cors:
    allowed-origins: http://54.204.220.170
    allowed-origin-patterns: https://*.onrender.com,https://*.loca.lt
logging:
  level:
    root: INFO
    com.taevas.clinic: INFO
PRODEOF

# Create start script
cat > /home/ashraf42/taevas-clinic/start.sh << 'STARTEOF'
#!/bin/bash
cd /home/ashraf42/taevas-clinic
source .env
nohup java -jar backend/target/clinic-0.0.1-SNAPSHOT.jar \
  --spring.config.additional-location=file:///home/ashraf42/taevas-clinic/application-prod.yml \
  --spring.profiles.active=local \
  > backend.log 2>&1 &
echo "Backend started: PID $!"
STARTEOF
chmod +x /home/ashraf42/taevas-clinic/start.sh

# Run it
cd /home/ashraf42/taevas-clinic
bash start.sh
sleep 8

# ─── Verify ─────────────────────────────────────────────────────────────────
echo ""
echo "=========================================="
echo " Verifying deployment..."
echo "=========================================="
echo "Nginx:   $(curl -s -o /dev/null -w '%{http_code}' http://localhost/)"
echo "API:     $(curl -s -o /dev/null -w '%{http_code}' http://localhost/api/auth/login -X POST -H 'Content-Type: application/json' -d '{"identifier":"test","password":"test"}')"
echo ""
echo "=========================================="
echo " DEPLOYMENT COMPLETE"
echo " App URL: http://54.204.220.170"
echo "=========================================="
