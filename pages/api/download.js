import { v2 as cloudinary } from 'cloudinary';
import { list, del } from '@vercel/blob';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    // Get file from Blob storage
    const { blobs } = await list();
    const fileBlob = blobs.find(blob => blob.pathname === `audio-${shortId}.json`);
    
    if (!fileBlob) {
      console.log('File not found:', shortId);
      return res.status(404).json({ error: 'File not found or expired' });
    }

    // Fetch metadata
    const response = await fetch(fileBlob.url);
    const fileData = await response.json();

    if (fileData.downloaded) {
      console.log('File already downloaded:', shortId);
      return res.status(410).json({ error: 'File has already been downloaded' });
    }

    console.log('File found:', fileData.filename);

    // Mark as downloaded and delete after download
    setTimeout(async () => {
      try {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(fileData.cloudinaryId, {
          resource_type: 'video'
        });
        
        // Delete from Blob
        await del(`audio-${shortId}.json`);
        
        console.log('File deleted successfully');
      } catch (error) {
        console.error('Deletion error:', error);
      }
    }, 30000); // Delete after 30 seconds

    res.status(200).json({ 
      url: fileData.cloudinaryUrl,
      filename: fileData.filename,
      email: fileData.uploaderEmail
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
}