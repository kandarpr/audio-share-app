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
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    
    if (!file || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'File and email are required' 
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      resource_type: 'auto',
      folder: 'audio-shares',
    });

    // Generate short code
    const code = nanoid(8);
    
    // Store metadata in Blob
    const metadata = {
      cloudinaryId: result.public_id,
      cloudinaryUrl: result.secure_url,
      uploaderEmail: email,
      filename: file.originalFilename || 'audio-file',
      uploadDate: new Date().toISOString(),
      downloaded: false
    };

    // Store in Vercel Blob
    await put(`audio-${code}.json`, JSON.stringify(metadata), {
      access: 'public',
      contentType: 'application/json'
    });

    res.status(200).json({ 
      success: true,
      code: code,
      message: 'Upload successful'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Upload failed: ' + error.message 
    });
  }
}