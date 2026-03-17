import os
import re

CSS_TO_ADD = """
/* Dropdown for Main Navigation */
.nav-dropdown {
    position: relative;
    display: inline-block;
}
.nav-dropdown .nav-dropbtn {
    cursor: pointer;
}
.nav-dropdown-content {
    display: none;
    position: absolute;
    background: rgba(0, 15, 50, 0.95);
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1001;
    border-radius: 8px;
    padding: 8px 0;
    margin-top: 5px;
}
.nav-dropdown-content a {
    color: white !important;
    padding: 12px 16px !important;
    text-decoration: none !important;
    display: block !important;
    margin: 0 !important;
    border-bottom: none !important;
    font-size: 16px !important;
}
.nav-dropdown-content a:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    transform: none !important;
}
.nav-dropdown:hover .nav-dropdown-content {
    display: block;
}
"""

def update_css():
    css_path = "src/css/global-body.css"
    with open(css_path, "r") as f:
        content = f.read()
    if ".nav-dropdown" not in content:
        with open(css_path, "a") as f:
            f.write(CSS_TO_ADD)
        print("Updated global-body.css")

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # 1. Main navigation
    nav_match = re.search(r'<nav class="main-navigation">([\s\S]*?)</nav>', content)
    if nav_match:
        nav_content = nav_match.group(1)
        # Find index.html prefix
        index_match = re.search(r'<a[^>]*href="([^"]*?)index\.html"', nav_content)
        prefix = index_match.group(1) if index_match else ""
        
        replacement_main = f'''
        <a href="{prefix}index.html">Home</a>
        <a href="{prefix}sundays.html">Sundays</a>
        <a href="{prefix}sunday-sermons.html">Sermons</a>
        <a href="{prefix}past-services.html">Past Services</a>
        <a href="{prefix}about.html">About</a>
        <a href="{prefix}podcasts.html">Podcasts</a>
        <div class="nav-dropdown">
            <a href="{prefix}community.html" class="nav-dropbtn">Community <i class="fas fa-caret-down" style="font-size: 0.8em;"></i></a>
            <div class="nav-dropdown-content">
                <a href="{prefix}events.html">Events</a>
            </div>
        </div>
        <a href="{prefix}live.html">Live</a>
        <div class="nav-dropdown">
            <a href="#" class="nav-dropbtn" onclick="event.preventDefault();">More <i class="fas fa-caret-down" style="font-size: 0.8em;"></i></a>
            <div class="nav-dropdown-content">
                <a href="{prefix}resources.html">Resources</a>
            </div>
        </div>
        <a href="{prefix}give.html">Give</a>
    '''
        
        new_nav = f'<nav class="main-navigation">{replacement_main}</nav>'
        
        if nav_match.group(0) != new_nav:
            content = content[:nav_match.start()] + new_nav + content[nav_match.end():]
            changed = True

    # 2. Mobile navigation
    mobile_nav_match = re.search(r'<ul class="mobile-nav-links">([\s\S]*?)</ul>', content)
    if mobile_nav_match:
        mobile_content = mobile_nav_match.group(1)
        index_match = re.search(r'href="([^"]*?)index\.html"', mobile_content)
        prefix = index_match.group(1) if index_match else ""
        
        has_class = 'class="mobile-menu-link"' in mobile_content
        class_str = ' class="mobile-menu-link"' if has_class else ''
        
        replacement_mobile = f'''
        <li><a{class_str} href="{prefix}index.html">Home</a></li>
        <li><a{class_str} href="{prefix}sundays.html">Sundays</a></li>
        <li><a{class_str} href="{prefix}sunday-sermons.html">Sermons</a></li>
        <li><a{class_str} href="{prefix}past-services.html">Past Services</a></li>
        <li><a{class_str} href="{prefix}about.html">About</a></li>
        <li><a{class_str} href="{prefix}podcasts.html">Podcasts</a></li>
        <li><a{class_str} href="{prefix}community.html">Community</a></li>
        <li><a{class_str} href="{prefix}events.html" style="padding-left: 40px; border-left: 2px solid rgba(255,255,255,0.2);">- Events</a></li>
        <li><a{class_str} href="{prefix}live.html">Live</a></li>
        <li><div {class_str} style="color: rgba(255, 255, 255, 0.5); pointer-events: none;">More</div></li>
        <li><a{class_str} href="{prefix}resources.html" style="padding-left: 40px; border-left: 2px solid rgba(255,255,255,0.2);">- Resources</a></li>
        <li><a{class_str} href="{prefix}give.html">Give</a></li>
    '''
        new_mobile_nav = f'<ul class="mobile-nav-links">{replacement_mobile}</ul>'

        # Check again since string length might have changed
        mobile_nav_match = re.search(r'<ul class="mobile-nav-links">([\s\S]*?)</ul>', content)
        if mobile_nav_match and mobile_nav_match.group(0) != new_mobile_nav:
            content = content[:mobile_nav_match.start()] + new_mobile_nav + content[mobile_nav_match.end():]
            changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

def main():
    update_css()
    directory = '.'
    for root, dirs, files in os.walk(directory):
        if '.git' in root or 'node_modules' in root or '.claude' in root:
            continue
        for file in files:
            if file.endswith('.html') and file != "update_nav.py":
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
