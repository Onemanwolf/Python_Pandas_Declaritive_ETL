import React from 'react';

interface Schema {
  required_columns: string[];
  data_types: { [key: string]: string };
}

interface SchemaEditorProps {
  schema: Schema;
  onChange: (newSchema: Schema) => void;
}

const SchemaEditor: React.FC<SchemaEditorProps> = ({ schema, onChange }) => {
  const handleRequiredColumnChange = (index: number, value: string) => {
    const newRequiredColumns = [...schema.required_columns];
    newRequiredColumns[index] = value;
    onChange({ ...schema, required_columns: newRequiredColumns });
  };

  const addRequiredColumn = () => {
    onChange({ ...schema, required_columns: [...schema.required_columns, ''] });
  };

  const removeRequiredColumn = (index: number) => {
    const newRequiredColumns = schema.required_columns.filter((_, i) => i !== index);
    onChange({ ...schema, required_columns: newRequiredColumns });
  };

  const handleDataTypeChange = (oldKey: string, newKey: string, value: string) => {
    const newDataTypes = { ...schema.data_types };
    if (oldKey !== newKey) {
        delete newDataTypes[oldKey];
    }
    newDataTypes[newKey] = value;
    onChange({ ...schema, data_types: newDataTypes });
  };

  const addDataType = () => {
    const newKey = `new_column_${Object.keys(schema.data_types).length}`;
    onChange({ ...schema, data_types: { ...schema.data_types, [newKey]: 'string' } });
  };

  const removeDataType = (key: string) => {
    const newDataTypes = { ...schema.data_types };
    delete newDataTypes[key];
    onChange({ ...schema, data_types: newDataTypes });
  };


  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
      <h2>Schema</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3>Required Columns</h3>
          {schema.required_columns.map((col, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={col}
                onChange={(e) => handleRequiredColumnChange(index, e.target.value)}
                style={{ flexGrow: 1 }}
              />
              <button onClick={() => removeRequiredColumn(index)}>Remove</button>
            </div>
          ))}
          <button onClick={addRequiredColumn}>Add Column</button>
        </div>
        <div>
          <h3>Data Types</h3>
          {Object.entries(schema.data_types).map(([key, value]) => (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={key}
                onChange={(e) => handleDataTypeChange(key, e.target.value, value)}
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleDataTypeChange(key, key, e.target.value)}
              />
              <button onClick={() => removeDataType(key)}>Remove</button>
            </div>
          ))}
          <button onClick={addDataType}>Add Data Type</button>
        </div>
      </div>
    </div>
  );
};

export default SchemaEditor;