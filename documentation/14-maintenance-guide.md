# 14 — Maintenance Guide

## 1. Routine Maintenance Schedule

| Task | Frequency | Command / Action |
|------|-----------|-----------------|
| Check error logs | Daily | Review `backend/storage/logs/laravel.log` |
| Review unread inquiries | Daily | Admin panel → Inquiries |
| Database backup | Daily | `mysqldump consol_db > backup_$(date +%Y%m%d).sql` |
| Clear old logs | Weekly | `php artisan log:clear` or manual rotation |
| Run dependency audit | Weekly | `composer audit` and `npm audit` |
| Update dependencies | Monthly | `composer update` and `npm update` (test first) |
| SSL certificate renewal | Before expiry | Auto-renew with Let's Encrypt or manual renewal |
| Full site backup | Weekly | Files + database |
| Performance review | Monthly | Check page load times, server resources |

## 2. Log Management

### Application Logs
```bash
# View recent logs
tail -100 backend/storage/logs/laravel.log

# Search for errors
grep "ERROR" backend/storage/logs/laravel.log

# Clear logs
truncate -s 0 backend/storage/logs/laravel.log
```

### Log Rotation
Configure `logrotate` for production:
```
/var/www/consol/backend/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
}
```

## 3. Database Maintenance

### Backups
```bash
# Full backup
mysqldump -u consol_user -p consol_db > backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u consol_user -p consol_db < backup_20261124.sql
```

### Migrations
When deploying new code with database changes:
```bash
php artisan migrate --force
```

To check migration status:
```bash
php artisan migrate:status
```

## 4. Cache Management
```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild caches for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 5. Updating the Application

### Minor Updates (patches, content changes)
```bash
cd /var/www/consol
git pull origin main
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend Updates
```bash
cd frontend
npm install --production
npm run build
# Deploy dist/ to static hosting
```

### Major Updates (Laravel version, PHP version)
1. Test thoroughly in staging environment first.
2. Review Laravel upgrade guide.
3. Update `composer.json` version constraints.
4. Run `composer update`.
5. Run test suite.
6. Deploy during low-traffic window.

## 6. Monitoring

### Health Check
Set up an external monitor to periodically hit:
```
GET https://your-domain.com/api/health
```
Alert if response is not `200 OK`.

### Disk Space
Monitor storage usage, especially:
- `storage/logs/`
- `storage/framework/sessions/`
- Database size

### Performance
- Monitor PHP-FPM worker count and memory usage.
- Monitor MySQL connection count and slow query log.
- Monitor web server access logs for 5xx errors.

## 7. Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| 500 error | Config cache stale or `.env` issue | `php artisan config:clear` |
| 419 CSRF error | Session expired or token mismatch | Clear browser cookies; check Sanctum config |
| Slow page loads | Unoptimised queries or missing cache | Enable query logging; rebuild caches |
| Forms not submitting | CORS misconfiguration | Check `SANCTUM_STATEFUL_DOMAINS` and CORS config |
| Images not loading | Storage link missing | `php artisan storage:link` |
| Login not working | Session driver misconfigured | Verify `SESSION_DRIVER=database` and sessions table exists |
