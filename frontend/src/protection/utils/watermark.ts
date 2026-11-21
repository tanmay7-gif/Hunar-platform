import { getProtectedImageUrl } from "@/lib/imageProtection";

export function formatWatermarkText(creatorName: string): string {
  const cleanName = creatorName.trim() || "Artisan Creator";
  return `${cleanName} | Original Artwork | Hunar`;
}

export function getCloudinaryWatermarkedUrl(originalUrl: string, creatorName: string): string {
  const watermarkText = formatWatermarkText(creatorName);
  return getProtectedImageUrl(originalUrl, {
    width: 800,
    watermarkText,
    opacity: 40,
    quality: "auto"
  });
}

export async function generateWatermarkedPreview(
  source: File | Blob | string,
  creatorName: string
): Promise<string> {
  if (typeof source === "string" && source.includes("res.cloudinary.com")) {
    return getCloudinaryWatermarkedUrl(source, creatorName);
  }

  if (typeof window === "undefined") {
    return typeof source === "string" ? source : "";
  }

  return new Promise((resolve) => {
    const watermarkText = formatWatermarkText(creatorName);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      if (typeof source === "string") {
        resolve(source);
      } else {
        const objectUrl = URL.createObjectURL(source);
        resolve(objectUrl);
      }
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const maxWidth = 800;
        const maxHeight = 800;
        let targetWidth = img.naturalWidth || img.width;
        let targetHeight = img.naturalHeight || img.height;

        if (targetWidth > maxWidth || targetHeight > maxHeight) {
          const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
          targetWidth = Math.round(targetWidth * ratio);
          targetHeight = Math.round(targetHeight * ratio);
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        ctx.save();
        ctx.translate(targetWidth / 2, targetHeight / 2);
        ctx.rotate(-Math.PI / 6);

        const bannerHeight = Math.max(34, Math.round(targetHeight * 0.08));
        ctx.fillStyle = "rgba(18, 20, 23, 0.45)";
        ctx.fillRect(-targetWidth, -bannerHeight / 2, targetWidth * 2, bannerHeight);

        const fontSize = Math.max(12, Math.min(22, Math.round(targetWidth * 0.035)));
        ctx.font = `600 ${fontSize}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(watermarkText, 0, 0);

        ctx.restore();

        const badgeHeight = 22;
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
        ctx.fillRect(0, targetHeight - badgeHeight, targetWidth, badgeHeight);

        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#FAF7F2";
        ctx.textAlign = "right";
        ctx.fillText("HUNAR PROTECTED PREVIEW • RAW ASSET RESTRICTED", targetWidth - 10, targetHeight - 7);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        resolve(dataUrl);
      } catch {
        if (typeof source === "string") {
          resolve(source);
        } else {
          const fallbackUrl = URL.createObjectURL(source);
          resolve(fallbackUrl);
        }
      }
    };

    img.onerror = () => {
      if (typeof source === "string") {
        resolve(source);
      } else {
        const fallbackUrl = URL.createObjectURL(source);
        resolve(fallbackUrl);
      }
    };

    if (typeof source === "string") {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
}
