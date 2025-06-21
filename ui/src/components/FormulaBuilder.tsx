import React, { useState, useEffect } from 'react';

interface FormulaBuilderProps {
  value: string;
  onChange: (formula: string) => void;
  availableColumns: string[];
  availableConstants: string[];
}

interface FormulaPart {
  type: 'column' | 'constant' | 'operator' | 'function' | 'value' | 'condition' | 'parenthesis';
  value: string;
}

const FormulaBuilder: React.FC<FormulaBuilderProps> = ({ value, onChange, availableColumns, availableConstants }) => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [formulaParts, setFormulaParts] = useState<FormulaPart[]>([]);
  const [manualFormula, setManualFormula] = useState(value);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => mediaQuery.removeEventListener('change', checkDarkMode);
  }, []);

  // Dark mode styles
  const darkModeStyles = {
    container: {
      border: '1px solid #444',
      padding: '1rem',
      borderRadius: '4px',
      backgroundColor: '#2d2d2d',
      color: '#ffffff'
    },
    textarea: {
      width: '100%',
      minHeight: '60px',
      padding: '0.5rem',
      fontFamily: 'monospace',
      fontSize: '0.9em',
      border: '1px solid #555',
      borderRadius: '4px',
      resize: 'vertical' as const,
      backgroundColor: '#1e1e1e',
      color: '#ffffff'
    },
    formulaDisplay: {
      backgroundColor: '#1e1e1e',
      padding: '0.5rem',
      borderRadius: '4px',
      marginBottom: '1rem',
      fontFamily: 'monospace',
      minHeight: '2rem',
      fontSize: '0.9em',
      color: '#ffffff',
      border: '1px solid #555'
    },
    button: {
      padding: '0.25rem 0.5rem',
      fontSize: '0.8em',
      backgroundColor: '#444',
      color: '#ffffff',
      border: '1px solid #666',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    columnButton: {
      padding: '0.25rem 0.5rem',
      textAlign: 'left' as const,
      backgroundColor: '#1a3a5f',
      border: '1px solid #2196f3',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#ffffff'
    },
    constantButton: {
      padding: '0.25rem 0.5rem',
      textAlign: 'left' as const,
      backgroundColor: '#4a1a5f',
      border: '1px solid #9c27b0',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#ffffff'
    },
    functionButton: {
      padding: '0.25rem 0.5rem',
      textAlign: 'left' as const,
      backgroundColor: '#1a5f1a',
      border: '1px solid #4caf50',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.8em',
      color: '#ffffff'
    },
    operatorButton: {
      padding: '0.25rem 0.5rem',
      textAlign: 'left' as const,
      backgroundColor: '#5f3a1a',
      border: '1px solid #ff9800',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#ffffff'
    },
    input: {
      flex: 1,
      padding: '0.25rem',
      backgroundColor: '#1e1e1e',
      color: '#ffffff',
      border: '1px solid #555',
      borderRadius: '4px'
    }
  };

  // Light mode styles
  const lightModeStyles = {
    container: {
      border: '1px solid #ddd',
      padding: '1rem',
      borderRadius: '4px',
      backgroundColor: '#ffffff',
      color: '#000000'
    },
    textarea: {
      width: '100%',
      minHeight: '60px',
      padding: '0.5rem',
      fontFamily: 'monospace',
      fontSize: '0.9em',
      border: '1px solid #ccc',
      borderRadius: '4px',
      resize: 'vertical' as const,
      backgroundColor: '#ffffff',
      color: '#000000'
    },
    formulaDisplay: {
      backgroundColor: '#f5f5f5',
      padding: '0.5rem',
      borderRadius: '4px',
      marginBottom: '1rem',
      fontFamily: 'monospace',
      minHeight: '2rem',
      fontSize: '0.9em',
      color: '#000000',
      border: '1px solid #ccc'
    },
    button: {
      padding: '0.25rem 0.5rem',
      fontSize: '0.8em',
      backgroundColor: '#f0f0f0',
      color: '#000000',
      border: '1px solid #ccc',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    columnButton: {
      padding: '0.25rem 0.5rem',
      textAlign: 'left' as const,
      backgroundColor: '#e3f2fd',
      border: '1px solid #2196f3',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#000000'
    },
    constantButton: {
      padding: '0.25rem 0.5rem',
      textAlign: 'left' as const,
      backgroundColor: '#f3e5f5',
      border: '1px solid #9c27b0',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#000000'
    },
    functionButton: {
      padding: '0.25rem 0.5rem',
      textAlign: 'left' as const,
      backgroundColor: '#e8f5e8',
      border: '1px solid #4caf50',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.8em',
      color: '#000000'
    },
    operatorButton: {
      padding: '0.25rem 0.5rem',
      textAlign: 'left' as const,
      backgroundColor: '#fff3e0',
      border: '1px solid #ff9800',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#000000'
    },
    input: {
      flex: 1,
      padding: '0.25rem',
      backgroundColor: '#ffffff',
      color: '#000000',
      border: '1px solid #ccc',
      borderRadius: '4px'
    }
  };

  const styles = isDarkMode ? darkModeStyles : lightModeStyles;

  const operators = [
    { label: 'Add (+)', value: ' + ' },
    { label: 'Subtract (-)', value: ' - ' },
    { label: 'Multiply (*)', value: ' * ' },
    { label: 'Divide (/)', value: ' / ' },
    { label: 'Greater than (>)', value: ' > ' },
    { label: 'Less than (<)', value: ' < ' },
    { label: 'Greater than or equal (>=)', value: ' >= ' },
    { label: 'Less than or equal (<=)', value: ' <= ' },
    { label: 'Equal (==)', value: ' == ' },
    { label: 'Not equal (!=)', value: ' != ' },
    { label: 'And (and)', value: ' and ' },
    { label: 'Or (or)', value: ' or ' }
  ];

  const functions = [
    { label: 'np.where(condition, true_value, false_value)', value: 'np.where' },
    { label: 'np.minimum(value1, value2)', value: 'np.minimum' },
    { label: 'np.maximum(value1, value2)', value: 'np.maximum' },
    { label: 'df[column].map(dictionary)', value: 'df[].map()' },
    { label: 'df[column].fillna(value)', value: 'df[].fillna()' },
    { label: 'df[column].sum()', value: 'df[].sum()' },
    { label: 'df[column].mean()', value: 'df[].mean()' },
    { label: 'df[column].count()', value: 'df[].count()' }
  ];

  const addPart = (type: FormulaPart['type'], partValue: string) => {
    const newPart: FormulaPart = { type, value: partValue };
    setFormulaParts([...formulaParts, newPart]);
    updateFormula([...formulaParts, newPart]);
  };

  const removePart = (index: number) => {
    const newParts = formulaParts.filter((_, i) => i !== index);
    setFormulaParts(newParts);
    updateFormula(newParts);
  };

  const updateFormula = (parts: FormulaPart[]) => {
    let formula = '';
    let inFunction = false;
    let functionName = '';

    parts.forEach((part, index) => {
      switch (part.type) {
        case 'function':
          if (part.value === 'np.where') {
            formula += 'np.where(';
            inFunction = true;
            functionName = 'np.where';
          } else if (part.value === 'np.minimum') {
            formula += 'np.minimum(';
            inFunction = true;
            functionName = 'np.minimum';
          } else if (part.value === 'np.maximum') {
            formula += 'np.maximum(';
            inFunction = true;
            functionName = 'np.maximum';
          } else if (part.value.startsWith('df[')) {
            formula += part.value;
          }
          break;
        case 'column':
          formula += `df['${part.value}']`;
          break;
        case 'constant':
          formula += part.value;
          break;
        case 'operator':
          formula += part.value;
          break;
        case 'value':
          if (typeof part.value === 'string' && isNaN(Number(part.value))) {
            formula += `'${part.value}'`;
          } else {
            formula += part.value;
          }
          break;
        case 'condition':
          formula += part.value;
          break;
        case 'parenthesis':
          formula += part.value;
          break;
      }

      // Only add closing parenthesis for functions at the very end
      if (inFunction && index === parts.length - 1) {
        if (functionName === 'np.where' || functionName === 'np.minimum' || functionName === 'np.maximum') {
          formula += ')';
        }
      }
    });

    onChange(formula);
    setManualFormula(formula);
  };

  const handleManualFormulaChange = (newFormula: string) => {
    setManualFormula(newFormula);
    onChange(newFormula);
  };

  const clearFormula = () => {
    setFormulaParts([]);
    setManualFormula('');
    onChange('');
  };

  const loadExistingFormula = () => {
    // Simple parser for existing formulas - can be enhanced
    const parts: FormulaPart[] = [];
    let currentFormula = value;

    // Extract np.where functions
    if (currentFormula.includes('np.where(')) {
      parts.push({ type: 'function', value: 'np.where' });
      currentFormula = currentFormula.replace('np.where(', '');
      if (currentFormula.endsWith(')')) {
        currentFormula = currentFormula.slice(0, -1);
      }
    }

    // Extract columns
    const columnMatches = currentFormula.match(/df\['([^']+)'\]/g);
    if (columnMatches) {
      columnMatches.forEach(match => {
        const columnName = match.match(/df\['([^']+)'\]/)?.[1];
        if (columnName) {
          parts.push({ type: 'column', value: columnName });
        }
      });
    }

    setFormulaParts(parts);
  };

  const getPartColor = (type: FormulaPart['type']): string => {
    if (isDarkMode) {
      switch (type) {
        case 'column': return '#1a3a5f';
        case 'constant': return '#4a1a5f';
        case 'function': return '#1a5f1a';
        case 'operator': return '#5f3a1a';
        case 'value': return '#5f1a3a';
        case 'condition': return '#3a5f1a';
        case 'parenthesis': return '#5f3a1a';
        default: return '#2d2d2d';
      }
    } else {
      switch (type) {
        case 'column': return '#e3f2fd';
        case 'constant': return '#f3e5f5';
        case 'function': return '#e8f5e8';
        case 'operator': return '#fff3e0';
        case 'value': return '#fce4ec';
        case 'condition': return '#f1f8e9';
        case 'parenthesis': return '#fff3e0';
        default: return '#f5f5f5';
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={{ fontWeight: 'bold' }}>Formula Builder</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowBuilder(!showBuilder)}
            style={styles.button}
          >
            {showBuilder ? 'Hide Builder' : 'Show Builder'}
          </button>
          <button
            onClick={loadExistingFormula}
            style={styles.button}
          >
            Parse Existing
          </button>
          <button
            onClick={clearFormula}
            style={styles.button}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Manual Formula Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Formula:</label>
        <textarea
          value={manualFormula}
          onChange={(e) => handleManualFormulaChange(e.target.value)}
          style={styles.textarea}
          placeholder="Type your formula here or use the builder below..."
        />
      </div>

      {/* Formula Display */}
      <div style={styles.formulaDisplay}>
        {value || 'No formula built yet'}
      </div>

      {/* Formula Parts Display */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {formulaParts.map((part, index) => (
            <span
              key={index}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: getPartColor(part.type),
                borderRadius: '4px',
                fontSize: '0.8em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: isDarkMode ? '#ffffff' : '#000000'
              }}
            >
              {part.value}
              <button
                onClick={() => removePart(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.7em',
                  color: isDarkMode ? '#cccccc' : '#666666'
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {showBuilder && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Columns */}
          <div>
            <h4>Columns</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {availableColumns.map(column => (
                <button
                  key={column}
                  onClick={() => addPart('column', column)}
                  style={styles.columnButton}
                >
                  {column}
                </button>
              ))}
            </div>
          </div>

          {/* Constants */}
          <div>
            <h4>Constants</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {availableConstants.map(constant => (
                <button
                  key={constant}
                  onClick={() => addPart('constant', constant)}
                  style={styles.constantButton}
                >
                  {constant}
                </button>
              ))}
            </div>
          </div>

          {/* Functions */}
          <div>
            <h4>Functions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {functions.map(func => (
                <button
                  key={func.value}
                  onClick={() => addPart('function', func.value)}
                  style={styles.functionButton}
                >
                  {func.label}
                </button>
              ))}
            </div>
          </div>

          {/* Operators and Parentheses */}
          <div>
            <h4>Operators & Parentheses</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {operators.map(op => (
                <button
                  key={op.value}
                  onClick={() => addPart('operator', op.value)}
                  style={styles.operatorButton}
                >
                  {op.label}
                </button>
              ))}
              <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => addPart('parenthesis', '(')}
                  style={{
                    ...styles.operatorButton,
                    flex: 1
                  }}
                >
                  Open Parenthesis (
                </button>
                <button
                  onClick={() => addPart('parenthesis', ')')}
                  style={{
                    ...styles.operatorButton,
                    flex: 1
                  }}
                >
                  Close Parenthesis )
                </button>
              </div>
            </div>
          </div>

          {/* Custom Value Input */}
          <div>
            <h4>Custom Value</h4>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <input
                type="text"
                placeholder="Enter custom value"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    addPart('value', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                style={styles.input}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input.value) {
                    addPart('value', input.value);
                    input.value = '';
                  }
                }}
                style={styles.button}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaBuilder;