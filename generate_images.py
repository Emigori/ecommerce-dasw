import os

img_dir = "/sessions/eloquent-clever-mayer/mnt/P1_CodigoBase/public/img"
os.makedirs(img_dir, exist_ok=True)

products = [
    ("prod001", "Mochila", "#3498db", "fas fa-backpack", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"),
    ("prod002", "Playera", "#2ecc71", "shirt", "M12 2L6 7H2v6h4l6 5V2zm10 4v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2z"),
    ("prod003", "Chamarra", "#e74c3c", "jacket", "M16 4H8C5.79 4 4 5.79 4 8v8c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4z"),
    ("prod004", "Playera", "#9b59b6", "tshirt", "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"),
    ("prod005", "Brazalete", "#f39c12", "ring", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"),
    ("prod006", "Collar", "#e67e22", "necklace", "M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"),
    ("prod007", "Anillo", "#1abc9c", "diamond", "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"),
    ("prod008", "Laptop", "#34495e", "laptop", "M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"),
    ("prod009", "Monitor", "#2c3e50", "monitor", "M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"),
    ("prod010", "Watch", "#8e44ad", "watch", "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"),
    ("prod011", "Phone", "#c0392b", "phone", "M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"),
    ("prod012", "Tablet", "#16a085", "tablet", "M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.5-4H4V3h15v16z"),
]

icons = {
    "Mochila": '<rect x="8" y="6" width="24" height="28" rx="4" fill="white" opacity="0.3"/><rect x="12" y="2" width="16" height="6" rx="2" fill="white" opacity="0.2"/><path d="M14 14h12M14 20h12M14 26h8" stroke="white" stroke-width="2" opacity="0.5"/>',
    "Playera": '<path d="M12 8 L20 4 L28 8 L28 14 L24 12 L24 34 L16 34 L16 12 L12 14 Z" fill="white" opacity="0.3"/><path d="M16 12 L24 12" stroke="white" stroke-width="1" opacity="0.2"/>',
    "Chamarra": '<path d="M10 6 L20 2 L30 6 L30 16 L26 14 L26 36 L14 36 L14 14 L10 16 Z" fill="white" opacity="0.3"/><line x1="20" y1="14" x2="20" y2="34" stroke="white" stroke-width="1.5" opacity="0.3"/>',
    "Brazalete": '<circle cx="20" cy="20" r="14" fill="none" stroke="white" stroke-width="4" opacity="0.3"/><circle cx="20" cy="20" r="8" fill="none" stroke="white" stroke-width="2" opacity="0.2"/><circle cx="20" cy="8" r="3" fill="white" opacity="0.4"/>',
    "Collar": '<ellipse cx="20" cy="22" rx="12" ry="14" fill="none" stroke="white" stroke-width="3" opacity="0.3"/><circle cx="20" cy="35" r="4" fill="white" opacity="0.4"/><path d="M16 8 L20 4 L24 8" fill="none" stroke="white" stroke-width="2" opacity="0.2"/>',
    "Anillo": '<circle cx="20" cy="20" r="12" fill="none" stroke="white" stroke-width="5" opacity="0.3"/><path d="M15 12 L20 6 L25 12" fill="white" opacity="0.4"/><circle cx="20" cy="8" r="2" fill="white" opacity="0.5"/>',
    "Laptop": '<rect x="4" y="10" width="32" height="20" rx="2" fill="white" opacity="0.3"/><rect x="6" y="12" width="28" height="14" rx="1" fill="white" opacity="0.15"/><rect x="2" y="30" width="36" height="3" rx="1.5" fill="white" opacity="0.3"/>',
    "Monitor": '<rect x="6" y="4" width="28" height="22" rx="2" fill="white" opacity="0.3"/><rect x="8" y="6" width="24" height="16" rx="1" fill="white" opacity="0.15"/><rect x="16" y="26" width="8" height="4" fill="white" opacity="0.25"/><rect x="12" y="30" width="16" height="2" rx="1" fill="white" opacity="0.3"/>',
    "Watch": '<circle cx="20" cy="20" r="14" fill="white" opacity="0.3"/><circle cx="20" cy="20" r="11" fill="white" opacity="0.15"/><line x1="20" y1="20" x2="20" y2="12" stroke="white" stroke-width="2" opacity="0.5"/><line x1="20" y1="20" x2="26" y2="20" stroke="white" stroke-width="1.5" opacity="0.4"/><rect x="18" y="2" width="4" height="4" rx="1" fill="white" opacity="0.3"/><rect x="18" y="34" width="4" height="4" rx="1" fill="white" opacity="0.3"/>',
    "Phone": '<rect x="10" y="2" width="20" height="36" rx="3" fill="white" opacity="0.3"/><rect x="12" y="6" width="16" height="24" rx="1" fill="white" opacity="0.15"/><circle cx="20" cy="34" r="2.5" fill="white" opacity="0.3"/>',
    "Tablet": '<rect x="6" y="2" width="28" height="36" rx="3" fill="white" opacity="0.3"/><rect x="8" y="5" width="24" height="27" rx="1" fill="white" opacity="0.15"/><circle cx="20" cy="36" r="2" fill="white" opacity="0.3"/>',
}

for prod_id, name, color, _, _ in products:
    icon_svg = icons.get(name, icons["Laptop"])
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 40 40">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{color}"/>
      <stop offset="100%" style="stop-color:{color}; stop-opacity:0.7"/>
    </linearGradient>
  </defs>
  <rect width="40" height="40" fill="url(#bg)"/>
  {icon_svg}
</svg>'''
    
    filepath = os.path.join(img_dir, f"{prod_id}.svg")
    with open(filepath, 'w') as f:
        f.write(svg)
    print(f"Created {prod_id}.svg")

print("Done!")
