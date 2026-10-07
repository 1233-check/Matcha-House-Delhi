from PIL import Image

def autocrop_image(image_path):
    # Open image
    img = Image.open(image_path)
    
    # Get bounding box of non-zero alpha
    bbox = img.getbbox()
    
    if bbox:
        # Crop the image to the bounding box
        cropped_img = img.crop(bbox)
        # Save it
        cropped_img.save(image_path)
        print(f"Cropped to bounding box: {bbox}")
    else:
        print("Image is entirely empty/transparent.")

autocrop_image('assets/logo.png')
