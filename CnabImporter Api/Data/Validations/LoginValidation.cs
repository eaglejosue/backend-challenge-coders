namespace Api.Data.Validations;

public sealed class LoginValidation : Validation<Login>
{
    public LoginValidation()
    {
        RuleFor(p => p.Email).NotEmpty().NotNull().EmailAddress().WithMessage("E-mail inválido.");
        RuleFor(p => p.SignInWith).NotEmpty().NotNull();
        When(p => !string.IsNullOrEmpty(p.SignInWith) && p.SignInWith.Equals(SignIn.Default.ToString(), StringComparison.InvariantCultureIgnoreCase),
            () => RuleFor(p => p.Password).NotEmpty().NotNull());
    }
}

public sealed class ForgotPasswordEmailValidation : Validation<string>
{
    public ForgotPasswordEmailValidation()
    {
        RuleFor(p => p).NotEmpty().NotNull().EmailAddress();
    }
}

public static class EmailAddressValidationExtension
{
    public static Task<ValidationResult> ValidateLoginAsync(this Login l) => new LoginValidation().ValidateCustomAsync(l);
    public static Task<ValidationResult> ValidateEmailAsync(this string e) => new ForgotPasswordEmailValidation().ValidateCustomAsync(e);
}