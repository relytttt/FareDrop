# ✈️ FareDrop - Flight Deals Aggregator

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E" alt="Supabase" />
</div>

<br />

**FareDrop** is a modern, full-stack flight deals aggregator that automatically finds and displays the best flight deals from around the world. Built with Next.js 14, TypeScript, and Tailwind CSS, it features real-time deal alerts, advanced filtering, and a beautiful, responsive interface.

## 🌟 Features

### Core Functionality
- **🔍 Smart Deal Discovery**: Automated scraping from multiple flight APIs (Kiwi.com Tequila, Travelpayouts)
- **📧 Email Alerts**: Real-time notifications for deals matching user preferences
- **🎯 Advanced Filtering**: Filter by departure city, destination region, price, and discount percentage
- **📊 Deal Scoring**: Algorithm-based scoring system to highlight the best deals
- **🗺️ Global Coverage**: Deals from 150+ destinations worldwide

### User Experience
- **📱 Responsive Design**: Fully mobile-optimized interface
- **⚡ Fast Performance**: Optimized for Core Web Vitals
- **🎨 Modern UI**: Clean design with smooth animations and transitions
- **♿ Accessibility**: WCAG compliant with semantic HTML

### Technical Features
- **🔐 Secure**: Row-level security with Supabase
- **🤖 Automated**: GitHub Actions cron jobs for deal fetching
- **📈 SEO Optimized**: Meta tags, Open Graph, sitemap, robots.txt
- **🔄 Real-time Updates**: Live deal expiry tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Resend account for email sending
- (Optional) API keys for Kiwi.com and Travelpayouts

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/faredrop.git
   cd faredrop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Run the migration in `supabase/migrations/001_initial_schema.sql`
   - Get your project URL and anon key from Settings → API
   - Update `.env.local` with your Supabase credentials

5. **Configure Email Service**

   - Sign up at [resend.com](https://resend.com)
   - Create an API key
   - Add it to `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Kiwi.com Tequila API (Optional)
KIWI_API_KEY=your_kiwi_api_key

# Travelpayouts API (Optional)
TRAVELPAYOUTS_API_KEY=your_travelpayouts_api_key

# Resend (Email)
RESEND_API_KEY=your_resend_api_key

# Cron Secret (for securing cron endpoints)
CRON_SECRET=your_random_secret_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Getting API Keys

#### Supabase
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings → API to find your keys
4. Run the SQL migration from `supabase/migrations/001_initial_schema.sql` in the SQL Editor

#### Resend (Email Service)
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use test mode)
3. Create an API key in the dashboard
4. Add the key to your `.env.local`

#### Kiwi.com Tequila API (Optional)
1. Register at [tequila.kiwi.com](https://tequila.kiwi.com/)
2. Apply for API access
3. Once approved, get your API key
4. Add it to `.env.local`

#### Travelpayouts (Optional)
1. Sign up at [travelpayouts.com](https://www.travelpayouts.com/)
2. Create a project
3. Get your API token
4. Add it to `.env.local`

## 🏗️ Project Structure

```
faredrop/
├── app/                      # Next.js 14 app directory
│   ├── layout.tsx           # Root layout with Navbar/Footer
│   ├── page.tsx             # Homepage
│   ├── deals/               # Deals pages
│   │   ├── page.tsx         # All deals listing
│   │   └── [id]/
│   │       └── page.tsx     # Individual deal page
│   ├── alerts/
│   │   └── page.tsx         # Alert setup page
│   ├── about/
│   │   └── page.tsx         # About page
│   ├── api/                 # API routes
│   │   ├── deals/
│   │   │   └── route.ts     # Deals CRUD API
│   │   ├── subscribe/
│   │   │   └── route.ts     # Subscription API
│   │   └── cron/
│   │       └── fetch-deals/
│   │           └── route.ts # Cron job for fetching deals
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── DealCard.tsx         # Individual deal card
│   ├── DealGrid.tsx         # Grid of deals
│   ├── SearchFilters.tsx    # Search/filter component
│   ├── EmailCapture.tsx     # Newsletter signup
│   ├── AlertModal.tsx       # Deal alert modal
│   ├── Navbar.tsx           # Navigation bar
│   ├── Footer.tsx           # Footer component
│   └── PriceDisplay.tsx     # Price formatting component
├── lib/                     # Utility libraries
│   ├── supabase.ts          # Supabase client
│   ├── kiwi-api.ts          # Kiwi.com API integration
│   ├── travelpayouts-api.ts # Travelpayouts API integration
│   └── email.ts             # Email service (Resend)
├── types/
│   └── index.ts             # TypeScript type definitions
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
├── .github/
│   └── workflows/
│       └── fetch-deals.yml  # GitHub Actions cron job
├── public/                  # Static assets
│   └── robots.txt           # SEO robots file
├── .env.example             # Example environment variables
├── tailwind.config.ts       # Tailwind CSS configuration
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🔄 Database Schema

The application uses three main tables:

### `deals`
Stores flight deal information
- `id` (UUID) - Primary key
- `origin`, `destination` - Airport codes
- `origin_city`, `destination_city` - City names
- `destination_region` - Geographic region
- `price`, `original_price` - Pricing information
- `airline` - Airline name
- `departure_date`, `return_date` - Travel dates
- `deal_score` - Quality score (0-100)
- `affiliate_link` - Booking link
- `expires_at` - Deal expiration
- `trip_type` - One-way or round-trip

### `subscribers`
Manages email alert subscriptions
- `id` (UUID) - Primary key
- `email` - Subscriber email
- `departure_city` - Preferred departure city
- `destinations` - Array of interested regions
- `verified` - Email verification status

### `alerts`
Tracks sent email alerts
- `id` (UUID) - Primary key
- `subscriber_id` - Reference to subscriber
- `deal_id` - Reference to deal
- `sent_at` - Timestamp

## 🤖 Automated Deal Fetching

The application includes a GitHub Actions workflow that runs every 6 hours to fetch new deals:

1. Calls the `/api/cron/fetch-deals` endpoint
2. Fetches deals from configured APIs
3. Inserts new deals into the database
4. Matches deals with subscriber preferences
5. Sends email alerts to matching subscribers

To set up the cron job:

1. Add `SITE_URL` and `CRON_SECRET` to your GitHub repository secrets
2. The workflow is defined in `.github/workflows/fetch-deals.yml`
3. You can also trigger it manually from the Actions tab

## 📧 Email System

The application uses Resend for transactional emails:

- **Welcome emails** when users subscribe
- **Deal alerts** when matching deals are found
- HTML templates with responsive design
- Personalized content based on user preferences

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: {
    // Teal shades
    500: '#00a0a0',
    600: '#008080',
  },
  accent: {
    // Blue shades
    500: '#0077e6',
    600: '#005cb3',
  },
}
```

### Regions and Cities

Edit `types/index.ts` to add or modify available regions and departure cities:

```typescript
export const REGIONS = [
  'Europe',
  'Asia',
  // Add more regions...
];

export const DEPARTURE_CITIES = [
  'New York (JFK)',
  // Add more cities...
];
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables
4. Deploy!

Vercel will automatically:
- Build your Next.js application
- Set up edge functions for API routes
- Configure optimal caching
- Provide SSL certificates

### Environment Variables on Vercel

Add all variables from `.env.example` in the Vercel dashboard under Settings → Environment Variables.

### GitHub Actions Setup

1. Go to your repository Settings → Secrets and variables → Actions
2. Add these secrets:
   - `SITE_URL`: Your deployed site URL (e.g., https://faredrop.vercel.app)
   - `CRON_SECRET`: The same secret from your environment variables

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting (implicit via Next.js)
- TypeScript for type safety

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows the existing style
- TypeScript types are properly defined
- Components are responsive
- No console errors or warnings

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Resend](https://resend.com/) - Email service
- [Lucide](https://lucide.dev/) - Icon library
- [Kiwi.com](https://tequila.kiwi.com/) - Flight search API
- [Travelpayouts](https://www.travelpayouts.com/) - Travel affiliate network

## 📞 Support

For support, email support@faredrop.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] User authentication and saved preferences
- [ ] Price history graphs
- [ ] Mobile app (React Native)
- [ ] Browser extension for price alerts
- [ ] Integration with more flight APIs
- [ ] Hotel and car rental deals
- [ ] Social sharing features
- [ ] Advanced analytics dashboard

---

<div align="center">
  Made with ❤️ by the FareDrop Team
</div>
