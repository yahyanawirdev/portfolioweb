import os
import glob
from PIL import Image

def optimize_images():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    images_dir = os.path.join(base_dir, 'public', 'images')
    thumbs_dir = os.path.join(images_dir, 'thumbs')
    optimized_dir = os.path.join(images_dir, 'optimized')

    os.makedirs(thumbs_dir, exist_ok=True)
    os.makedirs(optimized_dir, exist_ok=True)

    extensions = ('*.png', '*.jpg', '*.jpeg', '*.JPG', '*.JPEG', '*.webp')
    files = []
    for ext in extensions:
        files.extend(glob.glob(os.path.join(images_dir, ext)))

    # Filter out any in subdirectories
    files = [f for f in files if os.path.dirname(f) == images_dir]

    print(f"Found {len(files)} source images to optimize...")

    for i, file_path in enumerate(files, 1):
        filename = os.path.basename(file_path)
        name, _ = os.path.splitext(filename)
        
        thumb_output = os.path.join(thumbs_dir, f"{name}.webp")
        opt_output = os.path.join(optimized_dir, f"{name}.webp")

        try:
            with Image.open(file_path) as img:
                # Convert to RGB if necessary (e.g. RGBA or P mode)
                if img.mode in ('RGBA', 'LA'):
                    bg = Image.new('RGB', img.size, (255, 255, 255))
                    bg.paste(img, mask=img.split()[-1])
                    rgb_img = bg
                elif img.mode != 'RGB':
                    rgb_img = img.convert('RGB')
                else:
                    rgb_img = img

                # 1. Generate thumbnail (max width 800px, 82% quality)
                thumb_w = 800
                if rgb_img.width > thumb_w:
                    thumb_h = int(rgb_img.height * (thumb_w / rgb_img.width))
                    thumb_img = rgb_img.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
                else:
                    thumb_img = rgb_img

                thumb_img.save(thumb_output, 'WEBP', quality=82, method=6)

                # 2. Generate web-optimized showcase (max width 2048px, 85% quality)
                opt_w = 2048
                if rgb_img.width > opt_w:
                    opt_h = int(rgb_img.height * (opt_w / rgb_img.width))
                    opt_img = rgb_img.resize((opt_w, opt_h), Image.Resampling.LANCZOS)
                else:
                    opt_img = rgb_img

                opt_img.save(opt_output, 'WEBP', quality=85, method=6)

                thumb_size = os.path.getsize(thumb_output) / 1024
                opt_size = os.path.getsize(opt_output) / 1024
                orig_size = os.path.getsize(file_path) / (1024 * 1024)

                print(f"[{i}/{len(files)}] {filename}: Orig={orig_size:.2f}MB -> Thumb={thumb_size:.1f}KB, Opt={opt_size:.1f}KB")

        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print("\nOptimization complete!")

if __name__ == '__main__':
    optimize_images()
