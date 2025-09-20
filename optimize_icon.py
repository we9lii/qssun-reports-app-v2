#!/usr/bin/env python3
"""
Script to optimize and resize app icons for Android
"""
from PIL import Image
import os

# Define icon sizes for Android
densities = {
    'mdpi': 48,    # 48x48px
    'hdpi': 72,    # 72x72px  
    'xhdpi': 96,   # 96x96px
    'xxhdpi': 144, # 144x144px
    'xxxhdpi': 192 # 192x192px
}

def optimize_icon(input_path, output_dir):
    """Optimize and resize icon for all Android densities"""
    try:
        # Open the original image
        with Image.open(input_path) as img:
            # Convert to RGBA if not already
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # Create output directory if it doesn't exist
            os.makedirs(output_dir, exist_ok=True)
            
            # Generate icons for each density
            for density, size in densities.items():
                # Resize image with high quality
                resized = img.resize((size, size), Image.Resampling.LANCZOS)
                
                # Save as PNG with optimization
                output_path = os.path.join(output_dir, f'ic_launcher_{density}.png')
                resized.save(output_path, 'PNG', optimize=True, compress_level=9)
                
                # Get file size
                file_size = os.path.getsize(output_path)
                print(f"✓ Generated {density} icon: {size}x{size}px, {file_size//1024}KB")
            
            print(f"\n✅ All icons optimized and saved to: {output_dir}")
            return True
            
    except Exception as e:
        print(f"❌ Error optimizing icon: {e}")
        return False

if __name__ == "__main__":
    input_file = "new_icon.png"
    output_directory = "optimized_icons"
    
    if os.path.exists(input_file):
        success = optimize_icon(input_file, output_directory)
        if success:
            print("\n🎉 Icon optimization completed successfully!")
        else:
            print("\n❌ Icon optimization failed!")
    else:
        print(f"❌ Input file '{input_file}' not found!")