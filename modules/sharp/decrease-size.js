const Sharp = require("sharp/lib/constructor");

const decreaseSize = async (buffer) => {
  return await Sharp(buffer)
    .metadata()
    .then(({ width, height }) => {
      const maxSize = 600;

      const isWidthGreater = width > maxSize && width >= height;
      const isHeightGreater = height > maxSize && height >= width;

      if (isWidthGreater) {
        return Sharp(buffer).resize(maxSize).toBuffer();
      }

      if (isHeightGreater) {
        return Sharp(buffer).resize(null, maxSize).toBuffer();
      }

      return buffer;
    });
};

Sharp.decreaseSize = decreaseSize;
