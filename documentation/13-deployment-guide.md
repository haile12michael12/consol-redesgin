# 13 — Deployment Guide

## 1. Prerequisites
| Requirement | Minimum Version |
|-------------|----------------|
| PHP | 8.2+ |
| Composer | 2.x |
| Node.js | 18+ (for building frontend) |
| MySQL | 8.0+ |
| Web Server | Apache 2.4+ or Nginx 1.18+ |
| SSL Certificate | Required for HTTPS |

## 2. Server Setup

### 2.1 PHP Extensions
Ensure these PHP extensions are enabled:
```
php-mbstring
php-xml
php-curl
php-mysql
php-sqlite3 (dev only)
php-json
php-tokenizer
php-bcmath
php-fileinfo
php-openssl
```

### 2.2 Directory Permissions
```bash
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
chown -R www-data:www-data storage/ bootstrap/cache/
```

## 3. Frontend Deployment

### 3.1 Build
```bash
cd frontend
npm install --production
npm run build
```

### 3.2 Deploy
Copy the contents of `frontend/dist/` to the static hosting location or CDN.

The frontend is a fully static SPA — it can be served from:
- A CDN (CloudFront, Cloudflare Pages, Netlify)
- A subdirectory on the same server
- A separate static hosting service

### 3.3 Environment Variables
Create `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-domain.com/api
VITE_APP_NAME=CONSOL
```

## 4. Backend Deployment

### 4.1 Clone and Install
```bash
cd /var/www/consol
git clone <repository> .
cd backend
composer install --no-dev --optimize-autoloader
```

### 4.2 Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` for production:
```env
APP_NAME=CONSOL
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=consol_db
DB_USERNAME=consol_user
DB_PASSWORD=<strong-password>

SESSION_DRIVER=database
CACHE_STORE=database

MAIL_MAILER=smtp
MAIL_HOST=<smtp-host>
MAIL_PORT=587
MAIL_USERNAME=<smtp-user>
MAIL_PASSWORD=<smtp-password>
MAIL_FROM_ADDRESS=info@constructionsolutionsplc.com
MAIL_FROM_NAME=CONSOL

SANCTUM_STATEFUL_DOMAINS=your-domain.com
```

### 4.3 Database Setup
```bash
php artisan migrate --force
php artisan db:seed --force   # Only for initial data
```

### 4.4 Optimise for Production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 4.5 Web Server Configuration

#### Apache (`.htaccess` already included)
Ensure `mod_rewrite` is enabled. The `public/` directory should be the document root.

#### Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    root /var/www/consol/backend/public;

    ssl_certificate /etc/ssl/certs/your-domain.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.key;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## 5. Post-Deployment Checklist
- [ ] `APP_DEBUG=false` confirmed
- [ ] HTTPS working and redirecting from HTTP
- [ ] API health check returns 200 (`GET /api/health`)
- [ ] Frontend loads and connects to API
- [ ] CORS allows frontend origin only
- [ ] Form submissions work and send email notifications
- [ ] Admin login works
- [ ] Error pages display correctly (no stack traces)
- [ ] Logs are being written to `storage/logs/`
- [ ] Cron job set up for Laravel scheduler (if needed)
- [ ] Backups configured (see Maintenance Guide)

## 6. Rollback Procedure
1. Revert the codebase to the previous release tag/commit.
2. Run `composer install --no-dev --optimize-autoloader`.
3. Run `php artisan migrate:rollback` if migrations need reverting.
4. Clear and rebuild caches.
5. Verify the site is functioning.
