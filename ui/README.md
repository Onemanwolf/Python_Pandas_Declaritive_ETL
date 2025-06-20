# ETL Specification Builder UI

A React-based user interface for building and managing declarative ETL (Extract, Transform, Load) specifications. This tool allows you to create, edit, and export JSON specifications that define how data should be processed in your ETL pipeline.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **yarn** package manager
  - Verify npm: `npm --version`

### Local Development Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd Python_Pandas_Declaritive_ETL/ui
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This will install all required packages including:
   - React 18
   - TypeScript
   - Vite (build tool)
   - Development dependencies

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - Navigate to: `http://localhost:5173/`
   - The app will automatically reload when you make changes

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Development Server Features
- **Hot Module Replacement (HMR)**: Changes appear instantly in the browser
- **Auto-reload**: Browser refreshes when files change
- **Error overlay**: Clear error messages in the browser
- **Fast refresh**: React components update without losing state

## 📋 Overview

The ETL Specification Builder provides a user-friendly interface for creating comprehensive ETL specifications with the following sections:

### 1. Metadata
- **Name**: The name of your ETL specification
- **Version**: Version number for tracking changes
- **Description**: Detailed description of what the ETL process does
- **Created Date**: When the specification was created
- **Author**: Who created the specification

### 2. Schema
- **Required Columns**: List of columns that must be present in the input data
- **Data Types**: Mapping of column names to their expected data types (string, integer, float, etc.)

### 3. Validation Rules
Define data quality rules for your input data:
- **Not Null**: Ensures columns contain no null values
- **Unique**: Ensures column values are unique across all records
- **Range**: Validates numeric values fall within specified min/max ranges

### 4. Constants
Define business constants used in calculations:
- **Simple Constants**: Single values (numbers, strings)
- **Object Constants**: Key-value pairs (e.g., department multipliers)

### 5. Business Rules
Define transformation logic and calculations:
- **Name**: Descriptive name for the rule
- **Description**: What the rule does
- **Formula**: The calculation or transformation logic
- **Dependencies**: Input columns required for the calculation
- **Output Column**: The column name for the result

### 6. Output Schema
Define the structure of the processed data:
- **Required Columns**: Columns that will always be present in output
- **Optional Columns**: Additional columns that may be present

## 🎯 How to Build an ETL Specification

### Step 1: Define Metadata
1. Enter a descriptive name for your ETL process
2. Set the version number (start with 1.0)
3. Write a clear description of what the ETL does
4. Set the creation date and author information

### Step 2: Configure Input Schema
1. **Required Columns**: List all columns that must be present in your input data
   - Example: `employee_id`, `employee_name`, `department`, `base_salary`
2. **Data Types**: Specify the expected data type for each column
   - Use: `string`, `integer`, `float`, `boolean`, `date`

### Step 3: Set Validation Rules
1. **Not Null Rules**: Add rules for columns that cannot be empty
2. **Unique Rules**: Ensure primary keys or unique identifiers are unique
3. **Range Rules**: Set acceptable ranges for numeric values
   - Example: Base salary between $30,000 and $200,000

### Step 4: Define Business Constants
1. **Simple Constants**: Add single values used in calculations
   - Example: `SALES_BONUS_RATE: 0.05`
2. **Object Constants**: Add key-value mappings
   - Example: Department multipliers for different departments

### Step 5: Create Business Rules
1. **Performance Calculations**: Define how to calculate performance scores
2. **Bonus Calculations**: Create formulas for bonus calculations
3. **Categorization Rules**: Define how to categorize records
4. **Dependencies**: Specify which input columns each rule needs

### Step 6: Define Output Schema
1. **Required Columns**: List columns that will always be in the output
2. **Optional Columns**: List additional calculated columns

## 🏢 Customer Onboarding Process

### Phase 1: Requirements Gathering
1. **Data Source Analysis**
   - Identify input data sources and formats
   - Document data quality issues
   - Understand business requirements

2. **Business Logic Documentation**
   - Document all business rules and calculations
   - Identify required constants and parameters
   - Define validation requirements

### Phase 2: Specification Creation
1. **Use the UI to Build Specification**
   - Create metadata section with customer information
   - Define input schema based on data source
   - Configure validation rules for data quality
   - Add business constants and parameters
   - Create business rules for transformations
   - Define output schema requirements

2. **Review and Validate**
   - Test the specification with sample data
   - Validate all formulas and calculations
   - Ensure all dependencies are correctly defined

### Phase 3: Implementation
1. **Export Specification**
   - Click "Save and Download Specification" in the UI
   - The JSON file will be downloaded to your computer

2. **Integration**
   - Use the exported JSON with your ETL processing engine
   - The specification will guide the data transformation process

### Phase 4: Testing and Deployment
1. **Test with Real Data**
   - Run the ETL process with actual customer data
   - Validate output against expected results
   - Monitor for any data quality issues

2. **Production Deployment**
   - Deploy the ETL process to production
   - Set up monitoring and alerting
   - Document operational procedures

## 📊 Example: Employee Performance ETL

Here's an example of how to build an ETL specification for processing employee performance data:

### Metadata
- **Name**: Employee Performance and Bonus ETL
- **Version**: 1.0
- **Description**: Process employee data to calculate performance scores and bonuses

### Schema
**Required Columns**:
- `employee_id` (integer)
- `employee_name` (string)
- `department` (string)
- `base_salary` (float)
- `sales_target` (float)
- `actual_sales` (float)

### Validation Rules
- Employee ID must be unique and not null
- Base salary must be between $30,000 and $200,000
- Sales targets must be positive numbers

### Constants
- `SALES_BONUS_RATE`: 0.05
- `DEPARTMENT_BONUS_MULTIPLIERS`:
  - Sales: 1.2
  - Engineering: 1.1
  - Marketing: 1.15

### Business Rules
1. **Sales Performance Score**: `actual_sales / sales_target`
2. **Total Bonus**: `base_salary * sales_performance_score * SALES_BONUS_RATE * department_multiplier`
3. **Performance Category**: Categorize based on performance score

### Output Schema
**Required Columns**:
- `employee_id`
- `employee_name`
- `department`
- `performance_score`
- `total_bonus`
- `performance_category`

## 🔧 Technical Details

### File Structure
```
ui/
├── src/
│   ├── components/
│   │   ├── MetadataEditor.tsx
│   │   ├── SchemaEditor.tsx
│   │   ├── ValidationRulesEditor.tsx
│   │   ├── ConstantsEditor.tsx
│   │   ├── BusinessRulesEditor.tsx
│   │   └── OutputSchemaEditor.tsx
│   ├── App.tsx
│   ├── etl_specification.json
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

### Dependencies (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  }
}
```

### JSON Specification Format
The exported JSON follows this structure:
```json
{
  "metadata": { ... },
  "schema": { ... },
  "validation_rules": [ ... ],
  "constants": { ... },
  "business_rules": [ ... ],
  "output_schema": { ... }
}
```

### Supported Data Types
- `string`: Text data
- `integer`: Whole numbers
- `float`: Decimal numbers
- `boolean`: True/false values
- `date`: Date values

### Validation Rule Types
- `not_null`: Ensures column is not empty
- `unique`: Ensures column values are unique
- `range`: Validates numeric range with min/max values

## 🚨 Best Practices

### 1. Naming Conventions
- Use descriptive names for constants and business rules
- Follow consistent naming patterns (e.g., UPPER_CASE for constants)
- Use clear, descriptive column names

### 2. Validation Rules
- Always validate primary keys and unique identifiers
- Set appropriate ranges for numeric values
- Include not-null rules for required fields

### 3. Business Rules
- Keep formulas simple and readable
- Document complex calculations in descriptions
- Ensure all dependencies are correctly listed

### 4. Testing
- Test with sample data before production
- Validate edge cases and error conditions
- Monitor data quality metrics

## 🆘 Troubleshooting

### Common Issues
1. **Formula Errors**: Check that all column names in formulas match the schema
2. **Dependency Issues**: Ensure all dependencies are listed in the business rule
3. **Validation Failures**: Review validation rules and data quality
4. **Performance Issues**: Optimize complex calculations and reduce dependencies

### Development Issues
1. **Port already in use**: If port 5173 is busy, Vite will automatically use the next available port
2. **Node version issues**: Ensure you're using Node.js 16+ for compatibility
3. **Dependency conflicts**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Getting Help
- Check the browser console for JavaScript errors
- Validate JSON syntax in the exported file
- Review the specification structure against the expected format
- Check the terminal for build errors or warnings

## 📈 Future Enhancements

Planned features for future versions:
- Template library for common ETL patterns
- Data preview and validation tools
- Version control and change tracking
- Integration with data quality monitoring
- Advanced formula builder with syntax highlighting
- Import/export functionality for existing specifications

---

For more information or support, please refer to the main project documentation or contact the development team.
