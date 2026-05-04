import { useState } from 'react';
import { uploadFile } from '../services/api';

export default function TestUpload() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setUrl('');

    try {
      const result = await uploadFile(file);
      setUrl(result.file.url);
      console.log('✅ Subido exitosamente:', result.file.url);
    } catch (error) {
      setError(error.message);
      console.error('❌ Error:', error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #ddd', borderRadius: '8px', maxWidth: '500px' }}>
      <h2>🧪 Prueba de Upload a Cloudinary</h2>
      
      <input 
        type="file" 
        onChange={handleFileChange} 
        disabled={loading}
        accept="image/*,video/*,audio/*,.pdf"
      />
      
      {loading && <p style={{ color: 'blue' }}>⏳ Subiendo...</p>}
      
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      
      {url && (
        <>
          <p style={{ color: 'green' }}>✅ URL obtenida:</p>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
            {url}
          </a>
          <br /><br />
          <img 
            src={url} 
            alt="Uploaded" 
            style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} 
          />
        </>
      )}
    </div>
  );
}
