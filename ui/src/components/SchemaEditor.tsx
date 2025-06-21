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

    // Update data types to include the new column name
    const newDataTypes = { ...schema.data_types };
    const oldColumnName = schema.required_columns[index];
    if (oldColumnName && oldColumnName !== value) {
      // If the column name changed, update the data type mapping
      if (newDataTypes[oldColumnName]) {
        newDataTypes[value] = newDataTypes[oldColumnName];
        delete newDataTypes[oldColumnName];
      } else if (!newDataTypes[value]) {
        // If it's a new column, set default data type
        newDataTypes[value] = 'string';
      }
    } else if (!newDataTypes[value]) {
      // If it's a completely new column, set default data type
      newDataTypes[value] = 'string';
    }

    onChange({
      required_columns: newRequiredColumns,
      data_types: newDataTypes
    });
  };

  const addRequiredColumn = () => {
    const newColumnName = `new_column_${schema.required_columns.length + 1}`;
    const newRequiredColumns = [...schema.required_columns, newColumnName];
    const newDataTypes = { ...schema.data_types, [newColumnName]: 'string' };
    onChange({ required_columns: newRequiredColumns, data_types: newDataTypes });
  };

  const removeRequiredColumn = (index: number) => {
    const columnToRemove = schema.required_columns[index];
    const newRequiredColumns = schema.required_columns.filter((_, i) => i !== index);
    const newDataTypes = { ...schema.data_types };

    // Remove the corresponding data type entry
    if (columnToRemove && newDataTypes[columnToRemove]) {
      delete newDataTypes[columnToRemove];
    }

    onChange({ required_columns: newRequiredColumns, data_types: newDataTypes });
  };

  const handleDataTypeKeyChange = (oldKey: string, newKey: string) => {
    const newDataTypes = { ...schema.data_types };
    if (oldKey !== newKey) {
      newDataTypes[newKey] = newDataTypes[oldKey] || 'string';
      delete newDataTypes[oldKey];
      onChange({ ...schema, data_types: newDataTypes });
    }
  };

  const handleDataTypeValueChange = (key: string, value: string) => {
    const newDataTypes = { ...schema.data_types };
    newDataTypes[key] = value;
    onChange({ ...schema, data_types: newDataTypes });
  };

  const addDataType = () => {
    const newKey = `new_column_${Object.keys(schema.data_types).length + 1}`;
    onChange({ ...schema, data_types: { ...schema.data_types, [newKey]: 'string' } });
  };

  const removeDataType = (key: string) => {
    const newDataTypes = { ...schema.data_types };
    delete newDataTypes[key];
    onChange({ ...schema, data_types: newDataTypes });
  };

  // Sync data types with required columns
  const syncDataTypesWithColumns = () => {
    const newDataTypes: { [key: string]: string } = {};
    schema.required_columns.forEach(column => {
      newDataTypes[column] = schema.data_types[column] || 'string';
    });
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
                placeholder="Column name"
              />
              <button onClick={() => removeRequiredColumn(index)}>Remove</button>
            </div>
          ))}
          <button onClick={addRequiredColumn}>Add Column</button>
        </div>
        <div>
          <h3>Data Types</h3>
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={syncDataTypesWithColumns} style={{ marginBottom: '0.5rem' }}>
              Sync with Required Columns
            </button>
          </div>
          {Object.entries(schema.data_types).map(([key, value]) => (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={key}
                onChange={(e) => handleDataTypeKeyChange(key, e.target.value)}
                placeholder="Column name"
              />
              <select
                value={value}
                onChange={(e) => handleDataTypeValueChange(key, e.target.value)}
                style={{ padding: '0.25rem' }}
              >
                <option value="string">string</option>
                <option value="integer">integer</option>
                <option value="float">float</option>
                <option value="boolean">boolean</option>
                <option value="date">date</option>
              </select>
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