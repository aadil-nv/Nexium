import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

const Documents = () => {
  const [document, setDocument] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // API call to upload document
    alert('Document uploaded!');
  };

  return (
    <Box>
      <h2 className="text-2xl font-bold mb-4 text-red-800">Documents</h2>
      <p>Upload or manage your documents here.</p>
      <input type="file" onChange={handleFileChange} />
      {document && <p>Selected file: {document.name}</p>}
      <Button variant="contained" color="primary" onClick={handleUpload}>Upload Document</Button>
    </Box>
  );
};

export default Documents;
