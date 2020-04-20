import * as ImageManipulator from "expo-image-manipulator";

function loadImageAsync(uri) {
  console.log(uri);
  return new Promise((resolve, reject) => {
    const imageSource = new Image();
    imageSource.crossOrigin = "anonymous";
    imageSource.onload = () => resolve(imageSource);
    imageSource.onerror = () => reject(imageSource);
    imageSource.src = uri;
  });
}

export async function createAppIcon({
  color,
  imageUrl,
  emojiId,
  size,
  emojiPadding,
}) {
  let canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  // draw color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (imageUrl) {
    const imageSource = await loadImageAsync(uri);
    // ctx.drawImage(imageSource, 0, 0, imageSource.naturalWidth, imageSource.naturalHeight);

    // draw image
    ctx.drawImage(imageSource, 0, 0, size, size);
  } else if (emojiId) {
    const emojiUrl = twitterEmoji(emojiId);
    // const emojiPadding = size * 0.125;
    const emojiSize = size - emojiPadding * 2;
    const emojiOffset = (size - emojiSize) / 2;
    const imageSource = await loadImageAsync(emojiUrl);

    console.log(imageSource);
    // draw image
    ctx.drawImage(imageSource, emojiOffset, emojiOffset, emojiSize, emojiSize);
  }

  // defaults to PNG with no loss
  return canvas.toDataURL();
}

// twemoji.maxcdn.com

export function twitterEmoji(id) {
  return `https://twemoji.maxcdn.com/v/latest/svg/${id}.svg`;
}
