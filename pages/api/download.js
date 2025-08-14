import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

  const { shortId, termsAccepted } = req.body;
  
  console.log('Download requested for:', shortId);

  if (!termsAccepted) {
    return res.status(403).json({ error: 'Terms must be accepted' });
  }

  try {
    // Get file info from storage
    const storage = loadStorage();
    const fileData = storage[`audio:${shortId}`];

    if (!fileData) {
      console.log('File not found:', shortId);
      return res.status(404).json({ error: 'File not found or expired' });
    }

    if (fileData.downloaded) {
      console.log('File already downloaded:', shortId);
      return res.status(410).json({ error: 'File has already been downloaded' });
    }

    console.log('File data found:', fileData.filename);
    console.log('Uploader email:', fileData.uploaderEmail);

    // Generate download URL with fl_attachment to force download
    const forceDownloadUrl = fileData.cloudinaryUrl.replace('/upload/', '/upload/fl_attachment/');

    // Mark as downloaded
    fileData.downloaded = true;
    fileData.downloadDate = new Date().toISOString();
    storage[`audio:${shortId}`] = fileData;
    saveStorage(storage);

    console.log('File marked as downloaded, scheduling deletion...');

    // Schedule deletion from Cloudinary after 30 seconds
    setTimeout(async () => {
      try {
        console.log('Attempting to delete from Cloudinary:', fileData.cloudinaryId);
        // Fix: Use 'video' for audio files instead of 'auto'
        await cloudinary.uploader.destroy(fileData.cloudinaryId, {
          resource_type: 'video',
          invalidate: true
        });
        console.log('File deleted from Cloudinary successfully');
        
        // Remove from storage
        delete storage[`audio:${shortId}`];
        saveStorage(storage);
      } catch (error) {
        console.error('Deletion error (non-critical):', error.message);
        // Try with 'raw' if 'video' fails
        try {
          await cloudinary.uploader.destroy(fileData.cloudinaryId, {
            resource_type: 'raw'
          });
        } catch (e) {
          console.error('Deletion retry failed:', e.message);
        }
      }
    }, 30000); // 30 seconds delay

    console.log('Sending download response with email:', fileData.uploaderEmail);

    res.status(200).json({ 
      url: forceDownloadUrl,
      filename: fileData.filename,
      email: fileData.uploaderEmail  // Make sure email is included!
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
}