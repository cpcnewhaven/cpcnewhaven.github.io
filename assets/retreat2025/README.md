# GitHub Images Upload Helper

## Quick Setup for Retreat 2025 Gallery

### Option 1: GitHub Web Interface (Easiest)

1. **Go to your repository**: https://github.com/cpcnewhaven/cpcnewhaven.github.io
2. **Navigate to**: `assets/retreat2025/` folder
3. **Click**: "Add file" → "Upload files"
4. **Drag and drop** your retreat photos
5. **Commit** with message: "Add retreat 2025 photos"
6. **Done!** Photos will appear on your website automatically

### Option 2: GitHub Desktop (Recommended for bulk uploads)

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Clone your repository**
3. **Add photos** to `assets/retreat2025/` folder
4. **Commit and push** changes
5. **Photos appear** on website within minutes

### Option 3: Command Line (For developers)

```bash
# Clone repository
git clone https://github.com/cpcnewhaven/cpcnewhaven.github.io.git
cd cpcnewhaven.github.io

# Add photos to folder
cp /path/to/your/photos/* assets/retreat2025/

# Commit and push
git add assets/retreat2025/
git commit -m "Add retreat 2025 photos"
git push origin main
```

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended max 2MB per image
- **Dimensions**: Any size (will be resized automatically)
- **Naming**: Use descriptive names like `retreat-group-photo.jpg`

## Benefits of GitHub Hosting

✅ **Free** - No additional costs
✅ **Fast** - Served from GitHub's CDN
✅ **Reliable** - 99.9% uptime
✅ **Version Control** - Track changes to photos
✅ **Easy Updates** - Just upload new photos
✅ **No Authentication** - Works for all visitors

## Gallery URL Structure

Your images will be accessible at:
```
https://cpcnewhaven.github.io/assets/retreat2025/photo-name.jpg
```

And displayed in the gallery at:
```
https://cpcnewhaven.github.io/retreat2025-github.html
```
