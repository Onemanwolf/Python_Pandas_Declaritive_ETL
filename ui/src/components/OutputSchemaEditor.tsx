import React from 'react';

interface OutputSchema {
  required_columns: string[];
  optional_columns: string[];
}

interface OutputSchemaEditorProps {
  schema: OutputSchema;
  onChange: (newSchema: OutputSchema) => void;
}

const ColumnListEditor: React.FC<{
    title: string;
    columns: string[];
    onChange: (newColumns: string[]) => void;
}> = ({ title, columns, onChange }) => {

    const handleColumnChange = (index: number, value: string) => {
        const newColumns = [...columns];
        newColumns[index] = value;
        onChange(newColumns);
    };

    const addColumn = () => {
        onChange([...columns, '']);
    };

    const removeColumn = (index: number) => {
        onChange(columns.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h3>{title}</h3>
            {columns.map((col, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                        type="text"
                        value={col}
                        onChange={(e) => handleColumnChange(index, e.target.value)}
                        style={{ flexGrow: 1 }}
                    />
                    <button onClick={() => removeColumn(index)}>Remove</button>
                </div>
            ))}
            <button onClick={addColumn}>Add Column</button>
        </div>
    )
}


const OutputSchemaEditor: React.FC<OutputSchemaEditorProps> = ({ schema, onChange }) => {

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
      <h2>Output Schema</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <ColumnListEditor
            title="Required Columns"
            columns={schema.required_columns}
            onChange={(newColumns) => onChange({...schema, required_columns: newColumns})}
        />
        <ColumnListEditor
            title="Optional Columns"
            columns={schema.optional_columns}
            onChange={(newColumns) => onChange({...schema, optional_columns: newColumns})}
        />
      </div>
    </div>
  );
};

export default OutputSchemaEditor;