# Performance Optimization Guide

This document outlines the performance optimizations implemented and additional recommendations for the CPC New Haven website.

## ✅ Implemented Optimizations

### 1. Service Worker Caching
- **Status**: ✅ Implemented
- **Location**: `sw.js` and `index.html`
- **Benefits**: 
  - Caches CSS, JS, images, and HTML files
  - Reduces network requests on repeat visits
  - Enables offline functionality for cached resources

### 2. Resource Hints
- **Status**: ✅ Implemented
- **Location**: `index.html` `<head>` section
- **Features**:
  - DNS prefetch for external domains
  - Preconnect for critical third-party resources
  - Preload for critical hero images
- **Benefits**: Reduces DNS lookup and connection time

### 3. JavaScript Deferral
- **Status**: ✅ Implemented
- **Location**: `index.html`
- **Features**:
  - All non-critical scripts use `defer` attribute
  - Lazy loading for highlights and Instagram feed scripts
- **Benefits**: Non-blocking script execution improves initial page load

### 4. Image Lazy Loading
- **Status**: ✅ Already implemented
- **Location**: 
  - `src/js/highlights.js` (line 269)
  - `src/js/instagram-feed.js` (line 37)
  - Footer logo in `index.html` (line 248)
- **Benefits**: Images load only when needed, reducing initial page weight

## 📋 Additional Recommendations

### High Priority

#### 1. Image Optimization
**Current Issue**: Large image files in assets directories
- `assets/websiteBG`: 5.3MB
- `assets/websiteBG_connect`: 5.1MB
- `assets/websiteBG-events`: 5.0MB
- `assets/web-assets`: 4.4MB
- Individual PNG files: 500KB-1.2MB

**Recommendations**:
1. **Convert to WebP format**: WebP provides 25-35% better compression than PNG/JPEG
   ```bash
   # Example using cwebp (WebP encoder)
   cwebp -q 80 input.png -o output.webp
   ```

2. **Optimize existing PNG/JPEG files**:
   ```bash
   # Using ImageMagick
   magick convert input.png -strip -quality 85 output.png
   
   # Using pngquant for PNGs
   pngquant --quality=65-80 input.png
   ```

3. **Use responsive images** with `srcset`:
   ```html
   <img src="image-small.webp" 
        srcset="image-small.webp 400w, image-medium.webp 800w, image-large.webp 1200w"
        sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
        loading="lazy" 
        alt="Description">
   ```

4. **Optimize logo files**:
   - `assets/CPC_LOGO_24.svg` (1.2MB) - SVG should be much smaller, consider optimizing
   - `assets/web-assets/cpcLOGO.png` (621KB) - Convert to WebP or optimize PNG

#### 2. CSS Optimization
**Current Issue**: Multiple CSS files loaded separately

**Recommendations**:
1. **Combine critical CSS**: Merge `global-body.css` and `index-page.css` for above-the-fold content
2. **Minify CSS files**: Use tools like `cssnano` or `clean-css`
3. **Remove unused CSS**: Use tools like PurgeCSS
4. **Inline critical CSS**: For above-the-fold styles

#### 3. Font Optimization
**Current Issue**: Font Awesome loaded from CDN (full library)

**Recommendations**:
1. **Use subset of Font Awesome icons**: Only load icons you actually use
2. **Self-host fonts**: Reduces external dependencies
3. **Use `font-display: swap`**: Prevents invisible text during font load

### Medium Priority

#### 4. Google Tag Manager Optimization
**Recommendations**:
1. **Defer GTM loading**: Load after page interactive
2. **Use GTM container snippet optimization**: Consider async loading strategy

#### 5. Alpine.js Optimization
**Recommendations**:
1. **Consider loading conditionally**: Only load on pages that use Alpine.js
2. **Use module version**: If using build tools, import only needed features

#### 6. Background Image Optimization
**Current Issue**: Multiple large background images loaded for hero rotation

**Recommendations**:
1. **Preload only first image**: Current implementation preloads all 3 images
2. **Use lower quality for backgrounds**: Backgrounds can be more compressed
3. **Consider using CSS gradients**: For some backgrounds, gradients may be lighter

### Low Priority

#### 7. HTTP/2 Server Push
- If using a server that supports it, push critical CSS/JS files

#### 8. CDN for Static Assets
- Consider using a CDN for static assets (images, CSS, JS)

#### 9. Compression
- Ensure server has gzip/brotli compression enabled

## 🛠️ Tools for Optimization

### Image Optimization
- **WebP Converter**: `cwebp` (Google)
- **PNG Optimization**: `pngquant`, `optipng`
- **JPEG Optimization**: `jpegoptim`, `mozjpeg`
- **Online Tools**: TinyPNG, Squoosh

### CSS/JS Optimization
- **CSS Minifier**: `cssnano`, `clean-css`
- **JS Minifier**: `terser`, `uglify-js`
- **Bundler**: Webpack, Rollup, Vite

### Performance Testing
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: https://www.webpagetest.org/
- **GTmetrix**: https://gtmetrix.com/

## 📊 Expected Performance Improvements

With the implemented optimizations:
- **First Contentful Paint (FCP)**: ~20-30% improvement
- **Largest Contentful Paint (LCP)**: ~15-25% improvement
- **Time to Interactive (TTI)**: ~30-40% improvement
- **Repeat visits**: ~50-70% faster due to service worker caching

With additional image optimizations:
- **Page weight**: ~40-60% reduction
- **LCP**: Additional ~30-50% improvement
- **Bandwidth savings**: Significant for mobile users

## 🔄 Maintenance

1. **Regular audits**: Run Lighthouse monthly
2. **Monitor Core Web Vitals**: Track LCP, FID, CLS
3. **Image optimization**: Optimize new images before upload
4. **Cache invalidation**: Update service worker cache name when needed

## 📝 Notes

- Service worker cache name: `cpc-newhaven-v3` (update version when making breaking changes)
- Current lazy loading root margin: 800px-1200px (loads content before user scrolls to it)
- All external resources use `preconnect` for faster DNS resolution
