# Legacy AI Deployment Guide

This guide provides comprehensive instructions for deploying Legacy AI as a new project across different platforms.

## Prerequisites

### System Requirements
- Node.js 18+ (recommended: 18.17.0 or later)
- npm or yarn package manager
- Git for version control
- OpenAI API key (required for AI functionality)

### Development Environment Setup
```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

## 1. Project Setup

### Clone and Install Dependencies
```bash
# Clone the repository
git clone <your-legacy-ai-repo-url>
cd legacy-ai

# Install dependencies
npm install

# Or using yarn
yarn install
```

### Environment Configuration
1. Copy the environment template:
```bash
cp .env.local .env.local.example
```

2. Edit `.env.local` with your configuration:
```env
# OpenAI API Configuration
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-openai-api-key

# Application Configuration
NEXT_PUBLIC_APP_NAME=Legacy AI
NEXT_PUBLIC_APP_VERSION=1.0.0

# Development Settings
NEXT_PUBLIC_DEV_MODE=false
```

3. Get your OpenAI API key:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Replace `sk-your-actual-openai-api-key` with your key

### Local Development
```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## 2. Deployment Options

### Option A: Vercel (Recommended)

Vercel is the easiest deployment option for Next.js applications.

#### Prerequisites
- Vercel account (free tier available)
- GitHub/GitLab/Bitbucket repository

#### Steps
1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy from CLI:**
```bash
# Login to Vercel
vercel login

# Deploy the project
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: legacy-ai (or your preferred name)
# - Directory: ./ (current directory)
# - Override settings? No
```

3. **Configure Environment Variables:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key
     - `NEXT_PUBLIC_APP_NAME`: Legacy AI
     - `NEXT_PUBLIC_APP_VERSION`: 1.0.0
     - `NEXT_PUBLIC_DEV_MODE`: false

4. **Deploy from GitHub (Alternative):**
   - Push your code to GitHub
   - Visit [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

#### Vercel Configuration
The project includes a `vercel.json` file for routing configuration. Update if needed:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option B: Netlify

#### Prerequisites
- Netlify account
- GitHub repository

#### Steps
1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18

2. **Deploy:**
   - Connect your GitHub repository to Netlify
   - Configure build settings
   - Add environment variables in Netlify dashboard
   - Deploy

3. **Netlify Configuration:**
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option C: GitHub Pages

The project includes GitHub Actions workflow for automatic deployment.

#### Prerequisites
- GitHub repository
- GitHub Pages enabled

#### Steps
1. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to Pages section
   - Source: Deploy from a branch
   - Branch: gh-pages

2. **Configure Secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Add repository secrets:
     - `NEXT_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key

3. **Update Next.js Config:**
Modify `next.config.js` for static export:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [
      'localhost',
      'trae-api-us.mchost.guru',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
  },
  // ... rest of config
}

module.exports = nextConfig
```

4. **Deploy:**
   - Push to main branch
   - GitHub Actions will automatically build and deploy

### Option D: Self-Hosting (VPS/Cloud Server)

#### Prerequisites
- VPS or cloud server (Ubuntu/CentOS)
- Domain name (optional)
- SSL certificate (recommended)

#### Steps
1. **Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx (optional, for reverse proxy)
sudo apt install nginx -y
```

2. **Deploy Application:**
```bash
# Clone repository
git clone <your-repo-url>
cd legacy-ai

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "legacy-ai" -- start
pm2 save
pm2 startup
```

3. **Nginx Configuration (Optional):**
Create `/etc/nginx/sites-available/legacy-ai`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/legacy-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 3. Post-Deployment Configuration

### Domain Setup
1. **Custom Domain (Vercel/Netlify):**
   - Add domain in platform dashboard
   - Update DNS records
   - SSL is automatically configured

2. **Self-Hosted:**
   - Point domain A record to server IP
   - Configure SSL with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Monitoring and Maintenance

1. **Health Checks:**
   - Set up uptime monitoring (UptimeRobot, Pingdom)
   - Monitor API usage and costs

2. **Updates:**
```bash
# Update dependencies
npm update

# Rebuild and redeploy
npm run build
```

3. **Backup:**
   - Regular code backups via Git
   - Environment variables backup
   - Database backups (if applicable)

### Security Considerations

1. **Environment Variables:**
   - Never commit `.env.local` to version control
   - Use platform-specific environment variable management
   - Rotate API keys regularly

2. **HTTPS:**
   - Always use HTTPS in production
   - Configure proper security headers

3. **API Security:**
   - Monitor OpenAI API usage
   - Set usage limits and alerts
   - Implement rate limiting if needed

## 4. Troubleshooting

### Common Issues

1. **Build Failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

2. **Environment Variables Not Working:**
   - Ensure variables start with `NEXT_PUBLIC_` for client-side access
   - Restart development server after changes
   - Check platform-specific environment variable settings

3. **OpenAI API Issues:**
   - Verify API key is correct
   - Check API usage limits
   - Ensure billing is set up on OpenAI account

4. **Static Export Issues:**
   - Remove dynamic routes or make them static
   - Use `next/image` with `unoptimized: true`
   - Check for server-side only code in client components

### Performance Optimization

1. **Image Optimization:**
   - Use WebP format when possible
   - Implement lazy loading
   - Optimize image sizes

2. **Bundle Size:**
```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

3. **Caching:**
   - Configure CDN caching
   - Use service workers for offline functionality
   - Implement proper cache headers

## 5. Support and Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

For additional support, refer to the project's GitHub repository or contact the development team.