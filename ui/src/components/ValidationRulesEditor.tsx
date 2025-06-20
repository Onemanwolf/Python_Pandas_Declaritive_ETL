import React from 'react';

interface ValidationRule {
  column: string;
  type: string;
  parameters?: { [key: string]: any };
  description: string;
}

interface ValidationRulesEditorProps {
  rules: ValidationRule[];
  onChange: (newRules: ValidationRule[]) => void;
}

const ValidationRuleEditor: React.FC<{
  rule: ValidationRule,
  onChange: (newRule: ValidationRule) => void,
  onRemove: () => void
}> = ({ rule, onChange, onRemove }) => {

  const handleParamChange = (key: string, value: any) => {
    onChange({
      ...rule,
      parameters: {
        ...rule.parameters,
        [key]: value,
      },
    });
  };

  return (
    <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h4>Rule</h4>
        <button onClick={onRemove}>Remove Rule</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.5rem' }}>
        <label>Column</label>
        <input type="text" value={rule.column} onChange={e => onChange({...rule, column: e.target.value})} />

        <label>Type</label>
        <select value={rule.type} onChange={e => onChange({...rule, type: e.target.value, parameters: {}})}>
            <option value="not_null">Not Null</option>
            <option value="unique">Unique</option>
            <option value="range">Range</option>
        </select>

        <label>Description</label>
        <input type="text" value={rule.description} onChange={e => onChange({...rule, description: e.target.value})} />

        {rule.type === 'range' && (
            <>
                <label>Min</label>
                <input type="number" value={rule.parameters?.min || ''} onChange={e => handleParamChange('min', parseFloat(e.target.value))} />
                <label>Max</label>
                <input type="number" value={rule.parameters?.max || ''} onChange={e => handleParamChange('max', parseFloat(e.target.value))} />
            </>
        )}
      </div>
    </div>
  );
}


const ValidationRulesEditor: React.FC<ValidationRulesEditorProps> = ({ rules, onChange }) => {

  const handleRuleChange = (index: number, newRule: ValidationRule) => {
    const newRules = [...rules];
    newRules[index] = newRule;
    onChange(newRules);
  };

  const addRule = () => {
    onChange([...rules, { column: '', type: 'not_null', description: '' }]);
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
        <h2>Validation Rules</h2>
        <button onClick={addRule}>Add Rule</button>
      </div>
      {rules.map((rule, index) => (
        <ValidationRuleEditor
          key={index}
          rule={rule}
          onChange={(newRule) => handleRuleChange(index, newRule)}
          onRemove={() => removeRule(index)}
        />
      ))}
    </div>
  );
};

export default ValidationRulesEditor;