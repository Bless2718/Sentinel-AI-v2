from dataclasses import dataclass, field


@dataclass(slots=True)
class ValidationResult:
    """
    Stores dataset validation results.
    """

    is_valid: bool

    errors: list[str] = field(default_factory=list)

    warnings: list[str] = field(default_factory=list)