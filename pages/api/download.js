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
    // Try to get file from Blob storage
    let fileData = null;
    
    try {
      const { blobs } = await list();
      const fileBlob = blobs.find(blob => blob.pathname === `audio-${shortId}.json`);
      
      if (fileBlob) {
        const response = await fetch(fileBlob.url);
        fileData = await response.json();
      }
    } catch (blobError) {
      console.log('Blob fetch error, trying fallback');
    }

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

    // Generate download URL
    const forceDownloadUrl = fileData.cloudinaryUrl.replace('/upload/', '/upload/fl_attachment/');

    // Mark as downloaded (update Blob)
    fileData.downloaded = true;
    fileData.downloadDate = new Date().toISOString();
    
    // Schedule deletion
    setTimeout(async () => {
      try {
        console.log('Attempting to delete from Cloudinary:', fileData.cloudinaryId);
        await cloudinary.uploader.destroy(fileData.cloudinaryId, {
          resource_type: 'video',
          invalidate: true
        });
        
        // Delete from Blob
        try {
          await del(`audio-${shortId}.json`);
        } catch (e) {
          console.log('Blob deletion failed');
        }
        
        console.log('File deleted successfully');
      } catch (error) {
        console.error('Deletion error:', error.message);
      }
    }, 30000);

    console.log('Sending download response with email:', fileData.uploaderEmail);

    res.status(200).json({ 
      url: forceDownloadUrl,
      filename: fileData.filename,
      email: fileData.uploaderEmail
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
}