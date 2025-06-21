import React, { useState } from 'react';

type ConstantValue = string | number | boolean | { [key: string]: number | string | boolean };

interface Constants {
  [key: string]: ConstantValue;
}

interface ConstantsEditorProps {
  constants: Constants;
  onChange: (newConstants: Constants) => void;
}

// Common input styles that work in both light and dark modes
const inputStyles = {
  padding: '0.5rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  background: '#ffffff',
  color: '#000000',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box' as const,
};

const objectInputStyles = {
  ...inputStyles,
  background: '#f9f9f9',
};

const ConstantValueEditor: React.FC<{
  constKey: string;
  value: ConstantValue;
  onChange: (key: string, value: ConstantValue) => void;
  onRemove: (key: string) => void;
}> = ({ constKey, value, onChange, onRemove }) => {

  const handleObjectPropertyChange = (key: string, newValue: any) => {
    if (typeof value === 'object' && value !== null) {
      const newObj = { ...value };
      newObj[key] = newValue;
      onChange(constKey, newObj);
    }
  };

  const addProperty = () => {
    if (typeof value === 'object' && value !== null) {
      const newKey = `new_property_${Object.keys(value).length + 1}`;
      onChange(constKey, { ...value, [newKey]: '' });
    }
  };

  const removeProperty = (key: string) => {
    if (typeof value === 'object' && value !== null) {
      const newValue = { ...value };
      delete newValue[key];
      onChange(constKey, newValue);
    }
  };

  const handlePropertyKeyChange = (oldKey: string, newKey: string) => {
    if (typeof value === 'object' && value !== null) {
      const newValue = { ...value };
      newValue[newKey] = newValue[oldKey];
      delete newValue[oldKey];
      onChange(constKey, newValue);
    }
  };

  if (typeof value === 'object' && value !== null) {
    return (
      <div style={{ marginLeft: '1rem', borderLeft: '2px solid #eee', paddingLeft: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <button onClick={addProperty} style={{ marginRight: '0.5rem' }}>Add Property</button>
          <span style={{ fontSize: '0.9em', color: '#666' }}>Object with {Object.keys(value).length} properties</span>
        </div>
        {Object.entries(value).map(([key, subValue]) => (
          <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={key}
              onChange={(e) => handlePropertyKeyChange(key, e.target.value)}
              style={objectInputStyles}
              placeholder="Property name"
            />
            <input
              type="text"
              value={subValue}
              onChange={(e) => handleObjectPropertyChange(key, e.target.value)}
              style={inputStyles}
              placeholder="Property value"
            />
            <button onClick={() => removeProperty(key)}>Remove</button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <input
      type={typeof value === 'number' ? 'number' : 'text'}
      value={value}
      onChange={(e) => {
        let newValue: ConstantValue;
        if (typeof value === 'number') {
          newValue = parseFloat(e.target.value) || 0;
        } else if (typeof value === 'boolean') {
          newValue = e.target.value === 'true';
        } else {
          newValue = e.target.value;
        }
        onChange(constKey, newValue);
      }}
      style={inputStyles}
      placeholder={typeof value === 'number' ? 'Enter number' : 'Enter value'}
    />
  );
}

const ConstantsEditor: React.FC<ConstantsEditorProps> = ({ constants, onChange }) => {
  // Local state for editing constant names
  const [editingKeys, setEditingKeys] = useState<{ [key: string]: string }>({});

  const handleConstantChange = (key: string, value: ConstantValue) => {
    onChange({ ...constants, [key]: value });
  };

  const handleConstantKeyEdit = (oldKey: string, newKey: string) => {
    setEditingKeys(prev => ({ ...prev, [oldKey]: newKey }));
  };

  const handleConstantKeyBlur = (oldKey: string) => {
    const newKey = editingKeys[oldKey];
    if (newKey && newKey !== oldKey && newKey.trim() !== '') {
      const newConstants = { ...constants };
      newConstants[newKey] = newConstants[oldKey];
      delete newConstants[oldKey];
      onChange(newConstants);
    }
    setEditingKeys(prev => {
      const newState = { ...prev };
      delete newState[oldKey];
      return newState;
    });
  };

  const handleConstantKeyKeyDown = (oldKey: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConstantKeyBlur(oldKey);
    }
  };

  const addConstant = () => {
    const newKey = `new_constant_${Object.keys(constants).length + 1}`;
    onChange({ ...constants, [newKey]: '' });
  };

  const addObjectConstant = () => {
    const newKey = `new_object_${Object.keys(constants).length + 1}`;
    onChange({ ...constants, [newKey]: { property1: '' } });
  };

  const removeConstant = (key: string) => {
    const newConstants = { ...constants };
    delete newConstants[key];
    onChange(newConstants);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Constants</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={addConstant}>Add Simple Constant</button>
          <button onClick={addObjectConstant}>Add Object Constant</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(constants).map(([key, value]) => (
          <div key={key} style={{
            display: 'grid',
            gridTemplateColumns: '250px 1fr auto',
            gap: '1rem',
            alignItems: 'start',
            padding: '0.5rem',
            border: '1px solid #f0f0f0',
            borderRadius: '4px'
          }}>
            <input
              type="text"
              value={editingKeys[key] !== undefined ? editingKeys[key] : key}
              onChange={(e) => handleConstantKeyEdit(key, e.target.value)}
              onBlur={() => handleConstantKeyBlur(key)}
              onKeyDown={(e) => handleConstantKeyKeyDown(key, e)}
              style={{
                ...inputStyles,
                fontWeight: 'bold',
                background: '#f9f9f9',
              }}
              placeholder="Constant name"
            />
            <ConstantValueEditor constKey={key} value={value} onChange={handleConstantChange} onRemove={removeConstant} />
            <button onClick={() => removeConstant(key)} style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConstantsEditor;