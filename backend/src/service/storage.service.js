const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file, fileName) {
  const response = await imagekit.upload({
    file: file,
    fileName: fileName,
    folder: "cohort-ai-social",
  });

  return response;
}

async function deleteFile(fileId) {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    // Don't block post deletion if the storage file is already gone or fails to delete
    console.error("ImageKit deleteFile error:", error?.message || error);
  }
}

module.exports = { uploadFile, deleteFile };
