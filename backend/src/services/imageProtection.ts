export interface TransformationOptions {
  width?: number;
  watermarkText?: string;
  quality?: string;
  opacity?: number;
}

/**
 * Injects transformation parameters into standard Cloudinary URLs.
 * Matches `/upload/` and appends transformations directly after it.
 *
 * Enforces dynamic watermarking and resolution limits so master assets are never leaked.
 */
export function getProtectedImageUrl(
  originalUrl: string,
  options: TransformationOptions = {}
): string {
  const {
    width = 800,
    watermarkText = "Hunar",
    quality = "auto",
    opacity = 45,
  } = options;

  if (!originalUrl || !originalUrl.includes("res.cloudinary.com")) {
    return originalUrl;
  }

  // Prevent duplicate transformation injection
  if (originalUrl.includes("l_text:") || originalUrl.includes("w_800") || (width && originalUrl.includes(`w_${width}`))) {
    return originalUrl;
  }

  // Build transformation string: width limit, auto-quality, bold centered/corner watermark overlay
  // Example: w_800,c_limit,q_auto,l_text:Arial_36_bold:Hunar,o_45,g_south_east,x_20,y_20
  const encodedText = encodeURIComponent(watermarkText);
  const transformations = [
    `w_${width}`,
    `c_limit`,
    `q_${quality}`,
    `l_text:Arial_36_bold:${encodedText}`,
    `o_${opacity}`,
    `g_south_east`,
    `x_20`,
    `y_20`,
  ].join(",");

  return originalUrl.replace("/upload/", `/upload/${transformations}/`);
}

/**
 * Transforms an array of image URLs, ensuring all Cloudinary URLs have watermarks and resolution caps.
 */
export function protectImageUrls(
  urls: string[] | undefined | null,
  options: TransformationOptions = {}
): string[] {
  if (!urls || !Array.isArray(urls)) return [];
  return urls.map((url) => getProtectedImageUrl(url, options));
}

/**
 * Transforms a Product object, securing all images.
 */
export function protectProduct<T extends { images?: string[]; sellerName?: string }>(
  product: T,
  options: TransformationOptions = {}
): T {
  if (!product) return product;
  const watermarkText = options.watermarkText || (product.sellerName ? `Hunar • ${product.sellerName}` : "Hunar");
  return {
    ...product,
    images: protectImageUrls(product.images, { ...options, watermarkText }),
  };
}

/**
 * Transforms a Creator object, securing all portfolio images and cover image.
 */
export function protectCreator<
  T extends {
    name?: string;
    coverImage?: string;
    portfolioImages?: Array<{ imageUrl: string; [key: string]: any }>;
  }
>(creator: T, options: TransformationOptions = {}): T {
  if (!creator) return creator;
  const watermarkText = options.watermarkText || (creator.name ? `Hunar • ${creator.name}` : "Hunar");

  return {
    ...creator,
    coverImage: creator.coverImage
      ? getProtectedImageUrl(creator.coverImage, { ...options, watermarkText })
      : creator.coverImage,
    portfolioImages: (creator.portfolioImages || []).map((item) => ({
      ...item,
      imageUrl: getProtectedImageUrl(item.imageUrl, { ...options, watermarkText }),
    })),
  };
}

/**
 * Transforms a CustomerInquiry object, securing any product image reference.
 */
export function protectInquiry<T extends { productImage?: string; sellerName?: string }>(
  inquiry: T,
  options: TransformationOptions = {}
): T {
  if (!inquiry) return inquiry;
  const watermarkText = options.watermarkText || (inquiry.sellerName ? `Hunar • ${inquiry.sellerName}` : "Hunar");
  return {
    ...inquiry,
    productImage: inquiry.productImage
      ? getProtectedImageUrl(inquiry.productImage, { ...options, watermarkText })
      : inquiry.productImage,
  };
}
