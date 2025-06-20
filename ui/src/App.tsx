import { useState, useRef } from 'react'
import etlSpec from './etl_specification.json'
import MetadataEditor from './components/MetadataEditor'
import SchemaEditor from './components/SchemaEditor'
import ValidationRulesEditor from './components/ValidationRulesEditor'
import ConstantsEditor from './components/ConstantsEditor'
import BusinessRulesEditor from './components/BusinessRulesEditor'
import OutputSchemaEditor from './components/OutputSchemaEditor'

// Template for new specifications
const newSpecTemplate = {
  metadata: {
    name: "New ETL Specification",
    version: "1.0",
    description: "Enter description here",
    created_date: new Date().toISOString().split('T')[0],
    author: "Enter author name"
  },
  schema: {
    required_columns: [],
    data_types: {}
  },
  validation_rules: [],
  constants: {},
  business_rules: [],
  output_schema: {
    required_columns: [],
    optional_columns: []
  }
};

function App() {
  const [spec, setSpec] = useState(etlSpec)
  const [specName, setSpecName] = useState("etl_specification.json");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewSpec = () => {
    setSpec(newSpecTemplate);
    setSpecName("new_etl_specification.json");
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedSpec = JSON.parse(content);

          // Validate that it's a proper ETL specification
          if (parsedSpec.metadata && parsedSpec.schema && parsedSpec.validation_rules &&
              parsedSpec.constants && parsedSpec.business_rules && parsedSpec.output_schema) {
            setSpec(parsedSpec);
            setSpecName(file.name);
          } else {
            alert('Invalid ETL specification file. Please ensure the file contains all required sections: metadata, schema, validation_rules, constants, business_rules, and output_schema.');
          }
        } catch (error) {
          alert('Error reading file. Please ensure it is a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleSave = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(spec, null, 4))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", specName)
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleSaveAs = () => {
    const customName = prompt("Enter filename (include .json extension):", specName);
    if (customName) {
      setSpecName(customName);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(spec, null, 4));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", customName);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header with title and description */}
      <div>
        <h1>ETL Specification Builder</h1>
        <p>Create and modify your ETL specification below.</p>
      </div>

      {/* File management controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleNewSpec} style={{ padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            New Specification
          </button>
          <button onClick={handleOpenFile} style={{ padding: '0.5rem 1rem', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Open File
          </button>
          <button onClick={handleSave} style={{ padding: '0.5rem 1rem', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Save
          </button>
          <button onClick={handleSaveAs} style={{ padding: '0.5rem 1rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Save As...
          </button>
        </div>
        <div style={{ fontSize: '0.9em', color: '#666', fontWeight: 'bold' }}>
          Current file: {specName}
        </div>
      </div>

      {/* Hidden file input for opening files */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json"
        style={{ display: 'none' }}
      />

      <MetadataEditor
        metadata={spec.metadata}
        onChange={(newMetadata) => {
          setSpec((prevSpec) => ({
            ...prevSpec,
            metadata: newMetadata,
          }))
        }}
      />

      <SchemaEditor
        schema={spec.schema}
        onChange={(newSchema) => {
          setSpec((prevSpec) => ({
            ...prevSpec,
            schema: newSchema,
          }))
        }}
      />

      <ValidationRulesEditor
        rules={spec.validation_rules}
        onChange={(newRules) => {
          setSpec((prevSpec) => ({
            ...prevSpec,
            validation_rules: newRules,
          }))
        }}
      />

      <ConstantsEditor
        constants={spec.constants}
        onChange={(newConstants) => {
          setSpec((prevSpec) => ({
            ...prevSpec,
            constants: newConstants,
          }))
        }}
      />

      <BusinessRulesEditor
        rules={spec.business_rules}
        onChange={(newRules) => {
          setSpec((prevSpec) => ({
            ...prevSpec,
            business_rules: newRules,
          }))
        }}
      />

      <OutputSchemaEditor
        schema={spec.output_schema}
        onChange={(newSchema) => {
          setSpec((prevSpec) => ({
            ...prevSpec,
            output_schema: newSchema,
          }))
        }}
      />
    </div>
  )
}

export default App
