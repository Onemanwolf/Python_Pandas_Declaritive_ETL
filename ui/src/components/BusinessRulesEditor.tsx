import React from 'react';
import FormulaBuilder from './FormulaBuilder';

interface BusinessRule {
  name: string;
  description: string;
  formula: string;
  dependencies: string[];
  output_column: string;
}

interface BusinessRulesEditorProps {
  rules: BusinessRule[];
  onChange: (newRules: BusinessRule[]) => void;
  availableColumns?: string[];
  availableConstants?: string[];
}

const BusinessRuleEditor: React.FC<{
    rule: BusinessRule;
    onChange: (newRule: BusinessRule) => void;
    onRemove: () => void;
    availableColumns: string[];
    availableConstants: string[];
}> = ({ rule, onChange, onRemove, availableColumns, availableConstants }) => {

    const handleDependencyChange = (index: number, value: string) => {
        const newDependencies = [...rule.dependencies];
        newDependencies[index] = value;
        onChange({ ...rule, dependencies: newDependencies });
    };

    const addDependency = () => {
        onChange({ ...rule, dependencies: [...rule.dependencies, ''] });
    };

    const removeDependency = (index: number) => {
        const newDependencies = rule.dependencies.filter((_, i) => i !== index);
        onChange({ ...rule, dependencies: newDependencies });
    };

    return (
        <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h4>{rule.name || 'New Rule'}</h4>
                <button onClick={onRemove}>Remove Rule</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.5rem' }}>
                <label>Name</label>
                <input type="text" value={rule.name} onChange={e => onChange({...rule, name: e.target.value})} />

                <label>Description</label>
                <textarea value={rule.description} onChange={e => onChange({...rule, description: e.target.value})} />

                <label>Formula</label>
                <div>
                    <FormulaBuilder
                        value={rule.formula}
                        onChange={(formula) => onChange({...rule, formula})}
                        availableColumns={availableColumns}
                        availableConstants={availableConstants}
                    />
                </div>

                <label>Output Column</label>
                <input type="text" value={rule.output_column} onChange={e => onChange({...rule, output_column: e.target.value})} />

                <label>Dependencies</label>
                <div>
                    {rule.dependencies.map((dep, index) => (
                        <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                type="text"
                                value={dep}
                                onChange={(e) => handleDependencyChange(index, e.target.value)}
                                style={{ flexGrow: 1 }}
                            />
                            <button onClick={() => removeDependency(index)}>Remove</button>
                        </div>
                    ))}
                    <button onClick={addDependency}>Add Dependency</button>
                </div>
            </div>
        </div>
    )
}


const BusinessRulesEditor: React.FC<BusinessRulesEditorProps> = ({ rules, onChange, availableColumns = [], availableConstants = [] }) => {

  const handleRuleChange = (index: number, newRule: BusinessRule) => {
    const newRules = [...rules];
    newRules[index] = newRule;
    onChange(newRules);
  };

  const addRule = () => {
    onChange([...rules, { name: '', description: '', formula: '', dependencies: [], output_column: '' }]);
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
        <h2>Business Rules</h2>
        <button onClick={addRule}>Add Rule</button>
      </div>
      {rules.map((rule, index) => (
        <BusinessRuleEditor
          key={index}
          rule={rule}
          onChange={(newRule) => handleRuleChange(index, newRule)}
          onRemove={() => removeRule(index)}
          availableColumns={availableColumns}
          availableConstants={availableConstants}
        />
      ))}
    </div>
  );
};

export default BusinessRulesEditor;