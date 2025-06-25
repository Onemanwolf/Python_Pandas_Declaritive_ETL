// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the ETLSpecifications database
db = db.getSiblingDB('ETLSpecifications');

// Create the Specifications collection
db.createCollection('Specifications');

// Create indexes for better performance
db.Specifications.createIndex({ clientId: 1 }, { unique: true });
db.Specifications.createIndex({ businessDomain: 1 });
db.Specifications.createIndex({ clientId: 1, businessDomain: 1 });
db.Specifications.createIndex({ isActive: 1 });

// Create a sample ETL specification for testing
db.Specifications.insertOne({
  _id: 'sample-spec-001',
  clientId: 'sample-client',
  businessDomain: 'Finance',
  pythonNotebookIds: ['notebook-001', 'notebook-002'],
  metadata: {
    name: 'Sample Employee Bonus ETL',
    version: '1.0',
    description: 'Sample ETL specification for employee bonus calculations',
    createdDate: new Date(),
    author: 'System',
  },
  schema: {
    requiredColumns: [
      'employee_id',
      'employee_name',
      'base_salary',
      'performance_score',
    ],
    dataTypes: {
      employee_id: 'integer',
      employee_name: 'string',
      base_salary: 'float',
      performance_score: 'float',
    },
  },
  validationRules: [
    {
      column: 'employee_id',
      type: 'not_null',
      description: 'Employee ID must not be null',
    },
    {
      column: 'base_salary',
      type: 'range',
      description: 'Base salary must be positive',
      parameters: {
        min: 0,
      },
    },
  ],
  constants: {
    BONUS_RATE: 0.1,
    MAX_BONUS_PERCENTAGE: 0.25,
  },
  businessRules: [
    {
      name: 'calculate_bonus',
      description: 'Calculate bonus based on performance and base salary',
      formula: "df['base_salary'] * df['performance_score'] * BONUS_RATE",
      dependencies: ['base_salary', 'performance_score'],
      outputColumn: 'bonus_amount',
    },
  ],
  outputSchema: {
    requiredColumns: ['employee_id', 'employee_name', 'bonus_amount'],
    optionalColumns: ['base_salary', 'performance_score'],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'system',
  updatedBy: 'system',
  isActive: true,
  version: 1,
});

print('MongoDB initialization completed successfully!');
print('Sample ETL specification created with ID: sample-spec-001');
