import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from 'nanoid';
import { put } from '@vercel/blob';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable();
  
  try {
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const filename = Array.isArray(fields.filename) ? fields.filename[0] : fields.filename;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      resource_type: 'auto',
      folder: 'audio-shares',
      upload_preset: 'audio-shares'
    });

    // Generate short ID
    const shortId = nanoid(6);
    
    // Store metadata in Blob
    const data = {
      cloudinaryId: result.public_id,
      cloudinaryUrl: result.secure_url,
      uploaderEmail: email,
      filename: filename,
      uploadDate: new Date().toISOString(),
      downloaded: false
    };

    // Store in Vercel Blob
    try {
      await put(`audio-${shortId}.json`, JSON.stringify(data), {
        access: 'public',
        contentType: 'application/json'
      });
    } catch (blobError) {
      console.log('Blob storage not available, using fallback');
      // Fallback for local development
    }

    res.status(200).json({ 
      shortId: shortId,
      message: 'Upload successful'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
}