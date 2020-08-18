import FileSaver from "file-saver";
import JSZip from "jszip";

function loadImageAsync(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imageSource = new Image();
    imageSource.crossOrigin = "anonymous";
    imageSource.onload = () => resolve(imageSource);
    imageSource.onerror = () => reject(imageSource);
    imageSource.src = uri;
  });
}

function drawImageScaled(img: HTMLImageElement, ctx: CanvasRenderingContext2D) {
  var canvas = ctx.canvas;
  var hRatio = canvas.width / img.width;
  var vRatio = canvas.height / img.height;
  var ratio = Math.max(hRatio, vRatio);
  var centerShift_x = (canvas.width - img.width * ratio) / 2;
  var centerShift_y = (canvas.height - img.height * ratio) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio
  );
}

export async function createAppIcon({
  color,
  imageUrl,
  emojiId,
  size,
  emojiPadding,
}: {
  color: string;
  imageUrl?: string;
  emojiId?: string;
  size: number;
  emojiPadding: number;
}): Promise<string> {
  let canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d")!;

  // draw color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (imageUrl) {
    const imageSource = await loadImageAsync(imageUrl);
    drawImageScaled(imageSource, ctx);
  } else if (emojiId) {
    const emojiUrl = twitterEmoji(emojiId);
    // const emojiPadding = size * 0.125;
    const emojiSize = size - emojiPadding * 2;
    const emojiOffset = (size - emojiSize) / 2;
    const imageSource = await loadImageAsync(emojiUrl);
    // draw image
    ctx.drawImage(imageSource, emojiOffset, emojiOffset, emojiSize, emojiSize);
  }

  // defaults to PNG with no loss
  return canvas.toDataURL();
}

// twemoji.maxcdn.com
export function twitterEmoji(id: string): string {
  return `https://twemoji.maxcdn.com/v/latest/svg/${id}.svg`;
}

function imageUriToBase64(imageUri: string): string {
  return imageUri.substring(imageUri.indexOf("base64,") + "base64,".length);
}

export async function generateImagesAsync({
  emojiId,
  image,
  color,
}: {
  emojiId?: string;
  image?: string;
  color: string;
}): Promise<void> {
  const splash = await createAppIcon({
    color,
    emojiId: emojiId,
    imageUrl: image,
    size: 2048,
    emojiPadding: 832,
  });

  const icon = await createAppIcon({
    color,
    emojiId: emojiId,
    imageUrl: image,
    size: 1024,
    emojiPadding: 128,
  });
  const faviconPng = await createAppIcon({
    color: "transparent",
    emojiId: emojiId,
    imageUrl: image,
    size: 48,
    emojiPadding: 0,
  });

  const iconB64 = imageUriToBase64(icon);
  const splashB64 = imageUriToBase64(splash);
  const faviconB64 = imageUriToBase64(faviconPng);

  const content = await zipImagesAsync({
    icon: iconB64,
    splash: splashB64,
    favicon: faviconB64,
  });

  const folderName = image
    ? `app-icons-${image.slice(0, 10)}.zip`
    : `app-icons-${emojiId}-${color}.zip`;

  FileSaver.saveAs(content, folderName);
}

async function zipImagesAsync({
  icon,
  splash,
  favicon,
}: {
  icon: string;
  splash: string;
  favicon: string;
}) {
  const zip = new JSZip();
  // icon 1024x1024 - emoji padding - 128
  // splash 2048x2048 - emoji padding - 1000 (524 icon)
  zip.file("icon.png", icon, { base64: true });
  zip.file("splash.png", splash, { base64: true });
  zip.file("favicon.png", favicon, { base64: true });
  const content = await zip.generateAsync({ type: "blob" });
  return content;
}
