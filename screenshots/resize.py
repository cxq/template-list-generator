from PIL import Image
import glob, os, sys

if len(sys.argv) > 1:
	width = int(sys.argv[1])
else:
	width = 300

for infile in glob.glob("*.png"):
    file, ext = os.path.splitext(infile)
    print("Resizing " + file)
    im = Image.open(infile)
    height = int( (float(im.size[1])*float( width/float(im.size[0]) ) ) )
    size = width, height
    im.thumbnail(size, Image.ANTIALIAS)
    im.save(file + ".png", "PNG")