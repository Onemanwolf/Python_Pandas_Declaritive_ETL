import pandas as pd
import json
import numpy as np
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@dataclass
class ValidationRule:
    """Represents a validation rule for a column"""

    column: str
    rule_type: str  # 'range', 'not_null', 'unique', 'custom'
    parameters: Dict[str, Any]


@dataclass
class BusinessRule:
    """Represents a business rule for calculations"""

    name: str
    description: str
    formula: str
    dependencies: List[str]
    output_column: str


class DeclarativeETLEngine:
    """Engine for processing data according to JSON specifications"""

    def __init__(self, specification_path: str):
        """Initialize the ETL engine with a specification file"""
        self.specification = self._load_specification(specification_path)
        self.validation_rules = self._parse_validation_rules()
        self.business_rules = self._parse_business_rules()

    def _load_specification(self, specification_path: str) -> Dict[str, Any]:
        """Load the JSON specification file"""
        try:
            with open(specification_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            logger.error(f"Specification file not found: {specification_path}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in specification file: {e}")
            raise

    def _parse_validation_rules(self) -> List[ValidationRule]:
        """Parse validation rules from specification"""
        rules = []
        for rule in self.specification.get("validation_rules", []):
            rules.append(
                ValidationRule(
                    column=rule["column"],
                    rule_type=rule["type"],
                    parameters=rule.get("parameters", {}),
                )
            )
        return rules

    def _parse_business_rules(self) -> List[BusinessRule]:
        """Parse business rules from specification"""
        rules = []
        for rule in self.specification.get("business_rules", []):
            rules.append(
                BusinessRule(
                    name=rule["name"],
                    description=rule["description"],
                    formula=rule["formula"],
                    dependencies=rule.get("dependencies", []),
                    output_column=rule["output_column"],
                )
            )
        return rules

    def validate_data(self, df: pd.DataFrame) -> Dict[str, List[str]]:
        """Validate data according to the specification rules"""
        validation_errors = {}

        for rule in self.validation_rules:
            errors = []

            if rule.rule_type == "not_null":
                null_count = df[rule.column].isnull().sum()
                if null_count > 0:
                    errors.append(
                        f"Column '{rule.column}' has {null_count} null values"
                    )

            elif rule.rule_type == "range":
                min_val = rule.parameters.get("min")
                max_val = rule.parameters.get("max")

                if min_val is not None:
                    below_min = (df[rule.column] < min_val).sum()
                    if below_min > 0:
                        errors.append(
                            f"Column '{rule.column}' has {below_min} values below minimum {min_val}"
                        )

                if max_val is not None:
                    above_max = (df[rule.column] > max_val).sum()
                    if above_max > 0:
                        errors.append(
                            f"Column '{rule.column}' has {above_max} values above maximum {max_val}"
                        )

            elif rule.rule_type == "unique":
                duplicates = df[rule.column].duplicated().sum()
                if duplicates > 0:
                    errors.append(
                        f"Column '{rule.column}' has {duplicates} duplicate values"
                    )

            if errors:
                validation_errors[rule.column] = errors

        return validation_errors

    def apply_business_rules(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply business rules to calculate derived columns"""
        df_processed = df.copy()

        for rule in self.business_rules:
            logger.info(f"Applying business rule: {rule.name}")

            try:
                # Create a safe evaluation environment
                safe_dict = {
                    "df": df_processed,
                    "np": np,
                    "pd": pd,
                    "sum": sum,
                    "len": len,
                    "min": min,
                    "max": max,
                    "round": round,
                    "abs": abs,
                }

                # Add constants from specification
                constants = self.specification.get("constants", {})
                safe_dict.update(constants)

                # Evaluate the formula
                result = eval(rule.formula, {"__builtins__": {}}, safe_dict)

                # Handle different result types
                if isinstance(result, pd.Series):
                    df_processed[rule.output_column] = result
                elif isinstance(result, np.ndarray):
                    # Convert numpy array to pandas Series with the same index
                    df_processed[rule.output_column] = pd.Series(
                        result, index=df_processed.index
                    )
                elif isinstance(result, (int, float)):
                    df_processed[rule.output_column] = result
                else:
                    logger.warning(
                        f"Unexpected result type for rule {rule.name}: {type(result)}"
                    )
                    # Try to convert to pandas Series anyway
                    try:
                        df_processed[rule.output_column] = pd.Series(
                            result, index=df_processed.index
                        )
                    except:
                        df_processed[rule.output_column] = np.nan

            except Exception as e:
                logger.error(f"Error applying business rule '{rule.name}': {e}")
                df_processed[rule.output_column] = np.nan

        return df_processed

    def process_data(self, data_path: str) -> pd.DataFrame:
        """Main method to process data according to specification"""
        logger.info("Starting data processing...")

        # Load data
        df = pd.read_csv(data_path)
        logger.info(f"Loaded data with shape: {df.shape}")

        # Validate data
        validation_errors = self.validate_data(df)
        if validation_errors:
            logger.warning("Validation errors found:")
            for column, errors in validation_errors.items():
                for error in errors:
                    logger.warning(f"  {error}")
        else:
            logger.info("Data validation passed")

        # Apply business rules
        df_processed = self.apply_business_rules(df)
        logger.info(f"Processing complete. Final shape: {df_processed.shape}")

        return df_processed

    def generate_report(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate a summary report of the processed data"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "total_records": len(df),
            "summary_statistics": {},
            "bonus_summary": {},
        }

        # Summary statistics for numeric columns
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        for col in numeric_columns:
            report["summary_statistics"][col] = {
                "mean": float(df[col].mean()),
                "median": float(df[col].median()),
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "std": float(df[col].std()),
            }

        # Bonus summary
        if "total_bonus" in df.columns:
            report["bonus_summary"] = {
                "total_bonus_paid": float(df["total_bonus"].sum()),
                "average_bonus": float(df["total_bonus"].mean()),
                "max_bonus": float(df["total_bonus"].max()),
                "min_bonus": float(df["total_bonus"].min()),
                "employees_with_bonus": int((df["total_bonus"] > 0).sum()),
            }

        return report


def create_sample_data():
    """Create sample employee performance data"""
    np.random.seed(42)

    data = {
        "employee_id": range(1, 101),
        "employee_name": [f"Employee_{i}" for i in range(1, 101)],
        "department": np.random.choice(
            ["Sales", "Engineering", "Marketing", "HR", "Finance"], 100
        ),
        "base_salary": np.random.uniform(50000, 120000, 100),
        "sales_target": np.random.uniform(100000, 500000, 100),
        "actual_sales": np.random.uniform(80000, 600000, 100),
        "customer_satisfaction": np.random.uniform(3.0, 5.0, 100),
        "projects_completed": np.random.randint(1, 15, 100),
        "attendance_rate": np.random.uniform(0.85, 1.0, 100),
        "years_of_service": np.random.uniform(1, 10, 100),
    }

    df = pd.DataFrame(data)
    df.to_csv("sample_employee_data.csv", index=False)
    logger.info("Sample data created: sample_employee_data.csv")
    return df


def main():
    """Main function to demonstrate the declarative ETL system"""
    logger.info("Starting Declarative ETL Demo")

    # Create sample data if it doesn't exist
    try:
        df_sample = pd.read_csv("sample_employee_data.csv")
        logger.info("Using existing sample data")
    except FileNotFoundError:
        logger.info("Creating sample data...")
        df_sample = create_sample_data()

    # Initialize ETL engine
    etl_engine = DeclarativeETLEngine("etl_specification.json")

    # Process data
    df_processed = etl_engine.process_data("sample_employee_data.csv")

    # Generate report
    report = etl_engine.generate_report(df_processed)

    # Display results
    print("\n" + "=" * 60)
    print("DECLARATIVE ETL PROCESSING RESULTS")
    print("=" * 60)

    print(f"\nTotal Records Processed: {report['total_records']}")

    print("\nBonus Summary:")
    for key, value in report["bonus_summary"].items():
        if isinstance(value, float):
            print(f"  {key.replace('_', ' ').title()}: ${value:,.2f}")
        else:
            print(f"  {key.replace('_', ' ').title()}: {value}")

    print("\nSample of processed data:")
    print(
        df_processed[
            [
                "employee_name",
                "department",
                "base_salary",
                "performance_score",
                "total_bonus",
            ]
        ].head(10)
    )

    # Save processed data
    df_processed.to_csv("processed_employee_data.csv", index=False)
    logger.info("Processed data saved to: processed_employee_data.csv")

    # Save report
    with open("processing_report.json", "w") as f:
        json.dump(report, f, indent=2)
    logger.info("Processing report saved to: processing_report.json")


if __name__ == "__main__":
    main()
