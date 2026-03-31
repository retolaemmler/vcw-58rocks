

The user wants to use the uploaded screenshot as the video thumbnail (poster image). This is a frame from the welcome video showing the two hosts.

**Plan:**
1. Copy the uploaded image to `public/videos/welcome-poster.png`
2. Add the `poster` attribute to the `<video>` element in `src/pages/Survey.tsx` pointing to `/videos/welcome-poster.png`

