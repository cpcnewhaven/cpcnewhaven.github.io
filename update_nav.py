import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # 1. Main navigation
    # Find any <a href="...sundays.html"...>Sundays</a> that is inside <nav class="main-navigation">
    # We do a two-step approach to make it more robust:
    # First find main-navigation block
    nav_match = re.search(r'<nav class="main-navigation">([\s\S]*?)</nav>', content)
    if nav_match:
        nav_content = nav_match.group(1)
        if "sunday-sermons.html" not in nav_content:
            # find sundays link in nav_content
            sundays_link_match = re.search(r'(<a[^>]*href="([^"]*?)sundays\.html"[^>]*>Sundays</a>)', nav_content)
            if sundays_link_match:
                prefix = sundays_link_match.group(2)
                insertion = f'\n      <a href="{prefix}sunday-sermons.html">Sermons</a>\n      <a href="{prefix}past-services.html">Past Services</a>'
                new_nav_content = nav_content.replace(sundays_link_match.group(1), sundays_link_match.group(1) + insertion)
                content = content.replace(nav_content, new_nav_content)
                changed = True

    # 2. Mobile navigation
    # Find <ul class="mobile-nav-links"> block
    mobile_nav_match = re.search(r'<ul class="mobile-nav-links">([\s\S]*?)</ul>', content)
    if mobile_nav_match:
        mobile_nav_content = mobile_nav_match.group(1)
        if "sunday-sermons.html" not in mobile_nav_content:
            # find sundays link (which is inside an <li>)
            # Match <li>...<a href="...sundays.html"...>Sundays</a>...</li>
            sundays_li_match = re.search(r'(<li>\s*<a[^>]*href="([^"]*?)sundays\.html"[^>]*>Sundays</a>\s*</li>)', mobile_nav_content)
            if sundays_li_match:
                prefix = sundays_li_match.group(2)
                has_class = 'class="mobile-menu-link"' in sundays_li_match.group(0)
                class_str = ' class="mobile-menu-link"' if has_class else ''
                
                insertion = f'\n      <li><a{class_str} href="{prefix}sunday-sermons.html">Sermons</a></li>\n      <li><a{class_str} href="{prefix}past-services.html">Past Services</a></li>'
                
                new_mobile_nav_content = mobile_nav_content.replace(sundays_li_match.group(1), sundays_li_match.group(1) + insertion)
                content = content.replace(mobile_nav_content, new_mobile_nav_content)
                changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

def main():
    directory = '.'
    for root, dirs, files in os.walk(directory):
        if '.git' in root or 'node_modules' in root or '.claude' in root:
            continue
        for file in files:
            if file.endswith('.html') and file != "update_nav.py":
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
