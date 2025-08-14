import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

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

// File-based storage for development
const STORAGE_FILE = path.join(process.cwd(), 'storage.json');

function loadStorage() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading storage:', error);
  }
  return {};
}

function saveStorage(data) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving storage:', error);
  }
}

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
    
    // Upload to Cloudinary with signed preset
    const result = await cloudinary.uploader.upload(file.filepath, {
      resource_type: 'auto',
      folder: 'audio-shares',
      upload_preset: 'audio-shares'
    });

    // Generate short ID
    const shortId = nanoid(6);
    
    // Store mapping
    const data = {
      cloudinaryId: result.public_id,
      cloudinaryUrl: result.secure_url,
      uploaderEmail: email,
      filename: filename,
      uploadDate: new Date().toISOString(),
      downloaded: false
    };

    // Save to file storage
    const storage = loadStorage();
    storage[`audio:${shortId}`] = data;
    saveStorage(storage);

    res.status(200).json({ 
      shortId: shortId,
      message: 'Upload successful'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
}