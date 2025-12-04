# Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable: `OPENAI_API_KEY` (if you have one)
   - Click "Deploy"

3. **Your app will be live at**: `https://your-project.vercel.app`

## Alternative Deployment Options

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variable: `OPENAI_API_KEY`

### Railway

1. Connect your GitHub repository
2. Railway will auto-detect Next.js
3. Add environment variable: `OPENAI_API_KEY`
4. Deploy!

### Docker

1. Build the image:
   ```bash
   docker build -t personality-ai .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 -e OPENAI_API_KEY=your_key personality-ai
   ```

## Environment Variables

Make sure to set these in your hosting platform:

- `OPENAI_API_KEY` (optional - app works with mock responses)
- `USE_MOCK_RESPONSES` (set to `true` if you don't have an API key)

## Testing Before Deployment

1. Test locally:
   ```bash
   npm run build
   npm start
   ```

2. Verify all features work:
   - Chat interface
   - Memory extraction
   - Personality transformation
   - Response comparison

## Post-Deployment Checklist

- [ ] App loads successfully
- [ ] Chat interface works
- [ ] Memory extraction triggers at 5, 10, 15, 20, 25, 30 messages
- [ ] Personality selection works
- [ ] Before/after comparison displays correctly
- [ ] Environment variables are set correctly

