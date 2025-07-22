export const getPublicId = (url) => {
  try {
    if (!url) return undefined;
    // Example URL:
    // https://res.cloudinary.com/dhlpbgofo/image/upload/v1753083744/lms_uploads/1753083741736-WIN_20250124_10_33_01_Pro.jpg

    const parts = url.split("/upload/");
    if (parts.length < 2) return undefined;

    const pathAfterUpload = parts[1]; // v1753083744/lms_uploads/1753083741736-WIN_20250124_10_33_01_Pro.jpg
    const segments = pathAfterUpload.split("/");

    // Remove version (e.g., "v1753083744")
    segments.shift();

    // Join remaining and remove extension
    const joined = segments.join("/"); // lms_uploads/1753083741736-WIN_20250124_10_33_01_Pro.jpg
    const publicId = joined.substring(0, joined.lastIndexOf(".")); // remove .jpg or .png
    return publicId;
  } catch {
    return undefined;
  }
};
