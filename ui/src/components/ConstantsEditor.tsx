import React from 'react';

type ConstantValue = string | number | { [key: string]: number };

interface Constants {
  [key: string]: ConstantValue;
}

interface ConstantsEditorProps {
  constants: Constants;
  onChange: (newConstants: Constants) => void;
}

const ConstantValueEditor: React.FC<{
    constKey: string;
    value: ConstantValue;
    onChange: (key: string, value: ConstantValue) => void;
    onRemove: (key: string) => void;
}> = ({ constKey, value, onChange, onRemove }) => {

    const handleParamChange = (key: string, value: any) => {
        onChange(constKey, {
            ...value,
            [key]: parseFloat(value) || 0,
        });
    };

    const addProperty = () => {
        const newKey = `new_property_${Object.keys(value as object).length}`;
        onChange(constKey, { ...value, [newKey]: 0 });
    };

    const removeProperty = (key: string) => {
        const newValue = { ...value };
        delete newValue[key];
        onChange(constKey, newValue);
    };

    if (typeof value === 'object') {
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
                            onChange={(e) => {
                                const newValue = { ...value };
                                delete newValue[key];
                                newValue[e.target.value] = subValue;
                                onChange(constKey, newValue);
                            }}
                            style={{ background: '#f9f9f9' }}
                        />
                        <input
                            type="number"
                            value={subValue}
                            onChange={(e) => handleParamChange(key, e.target.value)}
                        />
                        <button onClick={() => removeProperty(key)}>Remove</button>
                    </div>
                ))}
            </div>
        )
    }

    return <input
        type={typeof value === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => {
            const newValue = typeof value === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
            onChange(constKey, newValue);
        }}
    />
}

const ConstantsEditor: React.FC<ConstantsEditorProps> = ({ constants, onChange }) => {

  const handleConstantChange = (key: string, value: ConstantValue) => {
    onChange({ ...constants, [key]: value });
  };

  const addConstant = () => {
    const newKey = `NEW_CONSTANT_${Object.keys(constants).length}`;
    onChange({ ...constants, [newKey]: 0 });
  };

  const addObjectConstant = () => {
    const newKey = `NEW_OBJECT_${Object.keys(constants).length}`;
    onChange({ ...constants, [newKey]: { property1: 0 } });
  };

  const removeConstant = (key: string) => {
    const newConstants = { ...constants };
    delete newConstants[key];
    onChange(newConstants);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
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
            <label style={{
              fontWeight: 'bold',
              padding: '0.5rem 0',
              wordBreak: 'break-word'
            }}>
              {key}
            </label>
            <ConstantValueEditor constKey={key} value={value} onChange={handleConstantChange} onRemove={removeConstant}/>
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