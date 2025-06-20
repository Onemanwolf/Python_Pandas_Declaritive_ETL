import React from 'react';

interface Metadata {
  name: string;
  version: string;
  description: string;
  created_date: string;
  author: string;
}

interface MetadataEditorProps {
  metadata: Metadata;
  onChange: (newMetadata: Metadata) => void;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({ metadata, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({
      ...metadata,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
      <h2>Metadata</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.5rem' }}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" value={metadata.name} onChange={handleChange} />

        <label htmlFor="version">Version</label>
        <input type="text" id="version" name="version" value={metadata.version} onChange={handleChange} />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={metadata.description} onChange={handleChange} rows={3} />

        <label htmlFor="created_date">Created Date</label>
        <input type="date" id="created_date" name="created_date" value={metadata.created_date} onChange={handleChange} />

        <label htmlFor="author">Author</label>
        <input type="text" id="author" name="author" value={metadata.author} onChange={handleChange} />
      </div>
    </div>
  );
};

export default MetadataEditor;