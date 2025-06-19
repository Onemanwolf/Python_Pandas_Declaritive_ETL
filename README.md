# Declarative Python ETL with Pandas

A comprehensive Python application that demonstrates declarative ETL (Extract, Transform, Load) processing using pandas. The application processes employee performance data and calculates bonuses based on a JSON specification that defines schema, validation rules, and business logic.

## Features

- **Declarative Processing**: Define data processing logic in JSON specification files
- **Schema Validation**: Comprehensive validation rules for data quality
- **Business Logic Engine**: Flexible formula-based calculations
- **Performance-Based Bonus System**: Multi-factor bonus calculations
- **Data Quality Checks**: Range validation, null checks, and uniqueness validation
- **Reporting**: Automated report generation with summary statistics
- **Logging**: Comprehensive logging for debugging and monitoring

## Project Structure

```
Python_Pandas_Declaritive_ETL/
├── app.py                          # Main application file
├── etl_specification.json          # JSON specification for ETL processing
├── requirements.txt                # Python dependencies
├── README.md                       # This file
├── sample_employee_data.csv        # Sample input data (generated)
├── processed_employee_data.csv     # Processed output data
└── processing_report.json          # Processing summary report
```

## Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Running the Application

```bash
python app.py
```

The application will:
1. Generate sample employee data (if not present)
2. Load the ETL specification from `etl_specification.json`
3. Process the data according to the specification
4. Generate reports and save processed data

### Output Files

- **`processed_employee_data.csv`**: Final processed data with all calculated columns
- **`processing_report.json`**: Summary report with statistics and bonus information

## ETL Specification Format

The JSON specification file (`etl_specification.json`) contains:

### Schema Definition
```json
{
  "schema": {
    "required_columns": ["employee_id", "employee_name", ...],
    "data_types": {
      "employee_id": "integer",
      "base_salary": "float",
      ...
    }
  }
}
```

### Validation Rules
```json
{
  "validation_rules": [
    {
      "column": "base_salary",
      "type": "range",
      "parameters": {
        "min": 30000,
        "max": 200000
      }
    }
  ]
}
```

### Business Rules
```json
{
  "business_rules": [
    {
      "name": "sales_performance_score",
      "description": "Calculate sales performance score",
      "formula": "np.where(df['sales_target'] > 0, df['actual_sales'] / df['sales_target'], 0)",
      "dependencies": ["actual_sales", "sales_target"],
      "output_column": "sales_performance_score"
    }
  ]
}
```

### Constants
```json
{
  "constants": {
    "SALES_BONUS_RATE": 0.05,
    "MAX_BONUS_PERCENTAGE": 0.25,
    "DEPARTMENT_BONUS_MULTIPLIERS": {
      "Sales": 1.2,
      "Engineering": 1.1
    }
  }
}
```

## Bonus Calculation Logic

The application calculates employee bonuses based on multiple performance factors:

### Performance Metrics
1. **Sales Performance**: Actual sales vs. target sales ratio
2. **Customer Satisfaction**: Normalized satisfaction scores
3. **Project Completion**: Number of projects completed
4. **Attendance Rate**: Employee attendance percentage
5. **Loyalty**: Years of service

### Bonus Components
- **Sales Bonus**: Based on sales performance (5% of base salary)
- **Satisfaction Bonus**: Based on customer satisfaction (2% of base salary)
- **Project Bonus**: Fixed amount per project completed ($500)
- **Attendance Bonus**: Based on attendance rate (1% of base salary)
- **Loyalty Bonus**: Based on years of service (0.5% of base salary)

### Multipliers
- **Department Multiplier**: Varies by department (Sales: 1.2x, Engineering: 1.1x, etc.)
- **Performance Multiplier**: Based on overall performance score
  - Excellent (≥90%): 1.5x
  - Good (≥60%): 1.0x
  - Needs Improvement (<60%): 0.5x

### Caps and Limits
- Maximum bonus: 25% of base salary
- Minimum performance threshold: 60%

## Validation Rules

The system validates data using various rule types:

- **`not_null`**: Ensures column has no null values
- **`unique`**: Ensures column values are unique
- **`range`**: Validates values within specified min/max ranges

## Customization

### Adding New Business Rules

1. Add a new rule to the `business_rules` array in `etl_specification.json`:
```json
{
  "name": "custom_bonus",
  "description": "Custom bonus calculation",
  "formula": "df['base_salary'] * 0.1",
  "dependencies": ["base_salary"],
  "output_column": "custom_bonus"
}
```

### Adding New Validation Rules

1. Add a new rule to the `validation_rules` array:
```json
{
  "column": "new_column",
  "type": "range",
  "parameters": {
    "min": 0,
    "max": 100
  }
}
```

### Modifying Constants

Update the `constants` section to change bonus rates, thresholds, or multipliers.

## Example Output

```
============================================================
DECLARATIVE ETL PROCESSING RESULTS
============================================================

Total Records Processed: 100

Bonus Summary:
  Total Bonus Paid: $1,234,567.89
  Average Bonus: $12,345.68
  Max Bonus: $45,678.90
  Min Bonus: $1,234.56
  Employees With Bonus: 95

Sample of processed data:
   employee_name department  base_salary  performance_score  total_bonus
0    Employee_1      Sales     85000.0              0.85     15300.0
1    Employee_2 Engineering     95000.0              0.92     17100.0
2    Employee_3  Marketing     75000.0              0.78     11700.0
...
```

## Error Handling

The application includes comprehensive error handling:
- File not found errors
- JSON parsing errors
- Data validation errors
- Business rule calculation errors
- Detailed logging for debugging

## Performance Considerations

- Uses pandas for efficient data processing
- Vectorized operations for calculations
- Memory-efficient data handling
- Configurable batch processing (for large datasets)

## Extending the System

The modular design allows easy extension:
- Add new data sources
- Implement additional validation rules
- Create custom business logic
- Add new output formats
- Integrate with external systems

## License

This project is provided as an educational example for declarative ETL processing with Python and pandas.