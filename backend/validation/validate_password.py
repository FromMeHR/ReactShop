from django.core.exceptions import ValidationError


def validate_password_long(password_value):
    if len(password_value) < 8:
        raise ValidationError("Password must be at least 8 characters long.")
    if len(password_value) > 128:
        raise ValidationError("The password must not exceed 128 characters.")


def validate_password_include_symbols(password_value):
    if (
        not any(char.isupper() for char in password_value)
        or not any(char.islower() for char in password_value)
        or not any(char.isdigit() for char in password_value)
    ):
        raise ValidationError(
            "Password must contain at least one uppercase letter, one lowercase letter, and one digit."
        )