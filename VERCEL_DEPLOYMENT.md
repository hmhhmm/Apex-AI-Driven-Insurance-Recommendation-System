# 🚀 Deploy to Vercel

This guide will help you deploy your APEX AI-Driven Insurance Recommendation System to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Gemini API Key from Google AI Studio (https://makersuite.google.com/app/apikey)
- Git repository pushed to GitHub, GitLab, or Bitbucket

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Import your repository
   - Vercel will auto-detect the framework (Vite)

3. **Configure Environment Variables**:
   In the Vercel dashboard, add these environment variables:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `NODE_ENV`: `production`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your app automatically

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Enter your Gemini API key when prompted.

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Project Structure for Vercel

Your app is now configured with:

- ✅ `vercel.json` - Vercel configuration
- ✅ `api/` - Serverless functions directory
  - `api/health.js` - Health check endpoint
  - `api/gemini/chat.js` - Gemini AI chat endpoint
- ✅ `.env.example` - Environment variables template
- ✅ Build configuration in `package.json`

## API Endpoints

Once deployed, your API will be available at:

- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/api/gemini/chat` - Gemini AI chat

## Post-Deployment Steps

1. **Test your deployment**:
   - Visit your Vercel URL
   - Test the AI chat functionality
   - Check browser console for any errors

2. **Update API URL** (if needed):
   - Set `VITE_API_URL` environment variable to your Vercel domain
   - Redeploy for changes to take effect

3. **Set up custom domain** (optional):
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain

## Troubleshooting

### API Key Issues
- Ensure `GEMINI_API_KEY` is set in Vercel environment variables
- Check API key is valid at https://makersuite.google.com/app/apikey

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

### CORS Issues
- API functions include CORS headers automatically
- Check browser console for specific CORS errors

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `NODE_ENV` | Set to `production` | Auto-set by Vercel |
| `VITE_API_URL` | Override API URL if needed | No |

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## Support

For issues:
- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check deployment logs in Vercel dashboard

---

**Ready to deploy?** Run `vercel` or import your repo at https://vercel.com/new
