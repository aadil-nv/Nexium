import React, { useEffect, useState } from "react";
import { Button } from "antd";

interface DocumentType {
  id: string;
  title: string;
  size: string;
  date: string;
  imageUrl: string;
  type: string;
}

const Documents = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents");
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const handleDelete = (id: string) => console.log(`Deleting document with ID: ${id}`);
  const handleView = (id: string) => console.log(`Viewing document with ID: ${id}`);
  const handleUpload = (type: string) => console.log(`Upload document of type: ${type}`);

  return (
    <div>
      <h1>Documents</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Left card for uploading company certificate */}
        <div className="flex border border-gray-300 p-4 rounded-lg shadow-md bg-white">
          <div className="w-full flex flex-col items-center p-4">
            <h2 className="text-lg font-semibold">Upload Company Certificate</h2>
            <div className="w-full h-32 bg-gray-200 rounded-md mb-4"></div>
            <Button onClick={() => handleUpload("companyCertificate")} type="primary">Upload</Button>
          </div>
        </div>

        {/* Right card for uploading business ID proof */}
        <div className="flex border border-gray-300 p-4 rounded-lg shadow-md bg-white">
          <div className="w-full flex flex-col items-center p-4">
            <h2 className="text-lg font-semibold">Upload Business ID Proof</h2>
            <div className="w-full h-32 bg-gray-200 rounded-md mb-4"></div>
            <Button onClick={() => handleUpload("businessIdProof")} type="primary">Upload</Button>
          </div>
        </div>
      </div>

      {/* Display existing documents */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {documents.length === 0 ? (
          <div className="flex border border-gray-300 p-4 rounded-lg shadow-md bg-white">
            <div className="w-full flex flex-col items-center p-2">
              <div className="w-full h-32 bg-gray-200 rounded-md mb-2"></div>
              <div className="text-center">
                <p className="font-semibold">No Document</p>
                <p className="text-sm text-gray-600">Size: --</p>
                <p className="text-sm text-gray-600">Uploaded: --</p>
              </div>
            </div>
          </div>
        ) : (
          documents.map((document) => (
            <div key={document.id} className="flex border border-gray-300 p-4 rounded-lg shadow-md bg-white">
              <div className="w-full flex flex-col items-center p-4">
                <img src={document.imageUrl} alt={document.title} className="w-32 h-32 object-cover rounded-md mb-4" />
                <h2 className="text-lg font-semibold">{document.title}</h2>
                <p className="text-sm text-gray-600">Size: {document.size}</p>
                <p className="text-sm text-gray-600">Uploaded: {document.date}</p>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button onClick={() => handleView(document.id)} type="primary">View</Button>
                  <Button onClick={() => handleDelete(document.id)} type="default">Delete</Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Documents;
