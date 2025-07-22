import AWS from "aws-sdk";

export type CustomFile = {
  fileName: string;
  mimetype: string;
  file: NodeJS.ReadableStream;
};

const s3 = new AWS.S3({
  endpoint: process.env.R2_PUBLIC_URL, // Cloudflare R2 Endpoint
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
});

const s3Upload = async (
  filename: string,
  fileContent: any,
  meta?: { mimeType?: string }
): Promise<string> => {
  const filePath = `uploads/${Date.now()}_${filename}`; // Change file path
  const params: any = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: filePath,
    Body: fileContent,
  };

  // Determine file content type
  const { mimeType } = meta || {};
  params.ContentType =
    mimeType && !mimeType.includes("stream")
      ? mimeType
      : "application/octet-stream";
  params.ContentDisposition = `inline; filename="${filename}"`;

  return new Promise((resolve, reject) => {
    try {
      s3.upload(params, (err: any, data: any) => {
        if (err) {
          reject(err);
        }
        // Construct public URL using R2.dev or S3 API URL
        const fileUrl = `${process.env.R2_PUBLIC_URL}/${process.env.R2_BUCKET_NAME}/${filePath}`;
        resolve(fileUrl);
      });
    } catch (err) {
      console.error("S3 upload error:", err);
      reject(err);
    }
  });
};

const s3BulkUpload = async (files: CustomFile[]): Promise<string[]> => {
  const uploadPromises = files.map((file) =>
    s3Upload(file.fileName, file.file, { mimeType: file.mimetype })
  );

  return Promise.all(uploadPromises)
    .then((urls) => {
      console.log("All files uploaded successfully:", urls);
      return urls;
    })
    .catch((err) => {
      console.error("Error in bulk upload:", err);
      throw err;
    });
};

export { s3Upload, s3BulkUpload };
