const Sharp = require('sharp/lib/constructor');

const decreaseSize = async (buffer) =>
  await Sharp(buffer)
    .metadata()
    .then(({ width, height }) => {
      const maxSize = 600;

      const isWidthGreater = width > maxSize && width >= height;
      const isHeightGreater = height > maxSize && height >= width;

      buffer = Sharp(buffer);

      if (isWidthGreater) {
        buffer = buffer.resize(maxSize);
      } else if (isHeightGreater) {
        buffer = buffer.resize(null, maxSize);
      }

      return buffer.webp({ quality: 86 }).toBuffer();
    });

Sharp.decreaseSize = decreaseSize;
