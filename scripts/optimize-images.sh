#!/bin/bash

# Image Optimization Script for CPC New Haven Website
# Converts images to WebP format and creates optimized versions

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if cwebp is available
if ! command -v cwebp &> /dev/null; then
    echo -e "${RED}Error: cwebp is not installed.${NC}"
    echo "Install with: brew install webp"
    exit 1
fi

# Directories to optimize
DIRS=(
    "assets/websiteBG"
    "assets/websiteBG_connect"
    "assets/websiteBG-events"
    "assets/websiteBG-podcasts"
)

# Logo files
LOGOS=(
    "assets/web-assets/cpcLOGO.png"
    "assets/CPC_LOGO_24.svg"
)

# Quality settings (0-100, higher = better quality but larger file)
WEBP_QUALITY=85

echo -e "${GREEN}🖼️  Starting image optimization...${NC}\n"

# Function to convert image to WebP
convert_to_webp() {
    local input_file="$1"
    local output_file="${input_file%.*}.webp"
    
    # Skip if WebP already exists and is newer
    if [ -f "$output_file" ] && [ "$output_file" -nt "$input_file" ]; then
        echo -e "${YELLOW}⏭️  Skipping $input_file (WebP already exists)${NC}"
        return
    fi
    
    # Get file extension
    local ext="${input_file##*.}"
    
    if [ "$ext" = "png" ] || [ "$ext" = "jpg" ] || [ "$ext" = "jpeg" ]; then
        echo -e "${GREEN}🔄 Converting $input_file to WebP...${NC}"
        cwebp -q "$WEBP_QUALITY" "$input_file" -o "$output_file" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            local original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
            local webp_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
            local savings=$(echo "scale=1; (($original_size - $webp_size) * 100) / $original_size" | bc)
            echo -e "   ✅ Created $output_file (${savings}% smaller)"
        else
            echo -e "${RED}   ❌ Failed to convert $input_file${NC}"
        fi
    fi
}

# Optimize logo files
echo -e "${GREEN}📸 Optimizing logo files...${NC}"
for logo in "${LOGOS[@]}"; do
    if [ -f "$logo" ]; then
        if [[ "$logo" == *.png ]]; then
            convert_to_webp "$logo"
        elif [[ "$logo" == *.svg ]]; then
            echo -e "${YELLOW}⚠️  SVG optimization requires manual review: $logo${NC}"
            echo "   (SVG files should be optimized with SVGO or similar tools)"
        fi
    else
        echo -e "${YELLOW}⚠️  Logo file not found: $logo${NC}"
    fi
done

echo ""

# Optimize images in directories
for dir in "${DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        echo -e "${YELLOW}⚠️  Directory not found: $dir${NC}"
        continue
    fi
    
    echo -e "${GREEN}📁 Processing $dir...${NC}"
    
    # Find and convert all images
    find "$dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r img; do
        convert_to_webp "$img"
    done
    
    echo ""
done

echo -e "${GREEN}✅ Image optimization complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Review the generated WebP files"
echo "2. Update HTML to use WebP with fallbacks:"
echo "   <picture>"
echo "     <source srcset='image.webp' type='image/webp'>"
echo "     <img src='image.jpg' alt='Description'>"
echo "   </picture>"
echo "3. Test the website to ensure images load correctly"
