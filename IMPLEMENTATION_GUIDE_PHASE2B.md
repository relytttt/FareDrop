# Phase 2B Implementation Guide

## Overview
This guide provides instructions for deploying and testing the Phase 2B features: User Accounts, Saved Searches & Price Alerts.

## Prerequisites

### Required Services
1. **Supabase Project**: Create a free account at https://supabase.com
2. **Resend Account**: Sign up at https://resend.com for email services
3. **Vercel Account**: For hosting and cron jobs (or any hosting platform)

## Setup Instructions

### 1. Database Migration

Run the migration in your Supabase SQL Editor:

```bash
# Navigate to Supabase Dashboard > SQL Editor
# Run: supabase/migrations/002_user_accounts_and_features.sql
```

This creates:
- `users` table
- `saved_searches` table
- `favorite_deals` table
- `price_alerts` and `price_alert_history` tables
- `bookings` table
- All RLS policies and indexes
- Auto-creation trigger for user profiles

### 2. Environment Variables

Create `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Service
RESEND_API_KEY=your_resend_api_key

# Duffel API (for flight search)
DUFFEL_API_TOKEN=your_duffel_token

# Cron Security
CRON_SECRET=generate_a_random_secure_string

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change for production
```

### 3. Supabase Auth Configuration

#### Enable Email/Password Authentication
1. Go to Supabase Dashboard > Authentication > Providers
2. Enable Email provider
3. Disable "Confirm email" for testing (enable for production)

#### Enable Google OAuth (Optional)
1. Create OAuth credentials at https://console.cloud.google.com
2. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback`
   - Production: `https://yourdomain.com/api/auth/callback`
3. Add Client ID and Secret to Supabase Auth > Providers > Google

### 4. Email Configuration

#### Resend Setup
1. Verify your sending domain at https://resend.com/domains
2. Copy API key to environment variables
3. Update email templates in `lib/email.ts` if needed

#### Email Domains
Update sender addresses in `lib/email.ts`:
```typescript
from: 'FareDrop <alerts@yourdomain.com>'  // Update domain
from: 'FareDrop <bookings@yourdomain.com>'  // Update domain
from: 'FareDrop <welcome@yourdomain.com>'  // Update domain
```

### 5. Cron Job Setup (Vercel)

Create `vercel.json` in root (if not exists):
```json
{
  "crons": [
    {
      "path": "/api/cron/check-price-alerts",
      "schedule": "0 * * * *"
    }
  ]
}
```

Add cron secret to Vercel environment variables:
```bash
vercel env add CRON_SECRET
# Paste your generated secret
```

## Testing Guide

### Manual Testing Checklist

#### Authentication Flow
- [ ] **Sign Up**
  1. Click "Sign In" button in navbar
  2. Switch to "Sign Up" tab
  3. Fill in name, email, and password
  4. Submit form
  5. Verify success message
  6. Check email for verification (if enabled)

- [ ] **Sign In**
  1. Click "Sign In" button
  2. Enter email and password
  3. Verify redirect to account page
  4. Check user avatar in navbar

- [ ] **Google OAuth**
  1. Click "Sign in with Google"
  2. Complete Google authentication
  3. Verify auto-creation of user profile
  4. Check account page

- [ ] **Sign Out**
  1. Click user avatar
  2. Select "Logout"
  3. Verify redirect to home page

#### Protected Routes
- [ ] Visit `/account` without authentication → should redirect
- [ ] Visit `/account/bookings` without auth → should redirect
- [ ] Login and access all `/account/*` pages → should work

#### Profile Management
- [ ] Update full name in account settings
- [ ] Verify name updates in navbar
- [ ] Check subscription tier display

#### Saved Searches
- [ ] **Create Search**
  1. Go to search page
  2. Fill in flight search form
  3. Click bookmark icon (requires login)
  4. Verify success message
  5. Check `/account/saved`

- [ ] **Delete Search**
  1. Go to `/account/saved`
  2. Click trash icon on a search
  3. Confirm deletion
  4. Verify search removed

- [ ] **Re-run Search**
  1. Go to `/account/saved`
  2. Click "Search Again" button
  3. Verify redirect with correct parameters

#### Favorite Deals
- [ ] **Add Favorite**
  1. Go to `/deals` page
  2. Click heart icon on a deal card
  3. Verify heart fills with red
  4. Check `/account/favorites`

- [ ] **Remove Favorite**
  1. Go to `/account/favorites`
  2. Click filled heart icon
  3. Verify removal from list

- [ ] **Expired Deals**
  1. Check favorites page for expired deals
  2. Verify "Deal Expired" badge shows

#### Price Alerts
- [ ] **Create Alert**
  1. Go to `/account/alerts`
  2. Click "Create Alert" button
  3. Fill in form:
     - Select origin and destination
     - Set target price (e.g., $500)
     - Optionally add date range
  4. Submit form
  5. Verify alert appears in list

- [ ] **Toggle Alert**
  1. Click power button on alert card
  2. Verify status changes to "Paused"
  3. Click again to reactivate

- [ ] **Delete Alert**
  1. Click trash icon on alert
  2. Confirm deletion
  3. Verify removal from list

- [ ] **Alert Progress**
  1. Create alert with realistic price
  2. Wait for cron job to run (or trigger manually)
  3. Check for current price update
  4. Verify progress bar shows correctly

#### Email Notifications
- [ ] **Welcome Email**
  1. Create new account
  2. Check inbox for welcome email
  3. Verify all links work

- [ ] **Price Alert Email**
  1. Create price alert
  2. Trigger cron job: `curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/check-price-alerts`
  3. If price drops below target, check email
  4. Verify email contains correct information

### API Testing

Use curl or Postman to test API endpoints:

```bash
# Get saved searches (requires auth)
curl http://localhost:3000/api/saved-searches \
  -H "Cookie: your-session-cookie"

# Create price alert
curl -X POST http://localhost:3000/api/price-alerts \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "origin": "SYD",
    "destination": "DPS",
    "target_price": 500
  }'

# Trigger cron job manually
curl -X POST http://localhost:3000/api/cron/check-price-alerts \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import repository at https://vercel.com
   - Configure environment variables
   - Deploy

3. **Configure Cron Jobs**
   - Vercel automatically sets up cron from `vercel.json`
   - Monitor execution in Vercel dashboard

4. **Post-Deployment**
   - Run database migration in production Supabase
   - Update OAuth redirect URLs
   - Test all flows in production

### Environment-Specific Configuration

#### Development
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- Confirm email: disabled
- Shorter session expiry for testing

#### Production
- `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
- Confirm email: enabled
- Secure cookie settings
- Rate limiting enabled

## Troubleshooting

### Common Issues

#### "Unauthorized" errors
- Check Supabase session in browser DevTools
- Verify cookies are being sent
- Confirm RLS policies are correct

#### OAuth not working
- Verify redirect URLs match exactly
- Check OAuth credentials in Supabase
- Ensure domains are authorized

#### Cron job not running
- Verify `vercel.json` configuration
- Check cron secret matches
- Monitor Vercel logs

#### Emails not sending
- Verify Resend API key
- Check sender domain is verified
- Look for errors in API logs

### Debug Mode

Enable debug logging:
```typescript
// In lib/supabase.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true  // Enable in development only
  }
});
```

## Monitoring

### Recommended Monitoring

1. **Supabase Dashboard**
   - Monitor database queries
   - Check auth logs
   - Review RLS policy usage

2. **Vercel Logs**
   - Track API route performance
   - Monitor cron job execution
   - Check for errors

3. **Resend Dashboard**
   - Email delivery rates
   - Bounce/spam reports
   - API usage

### Metrics to Track
- User signups per day
- Active price alerts
- Email open rates
- API response times
- Error rates

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Check Supabase/Vercel/Resend status pages
4. Contact development team

---
*Last Updated*: 2025-12-10  
*Version*: Phase 2B - v1.0  
*Author*: GitHub Copilot Agent
