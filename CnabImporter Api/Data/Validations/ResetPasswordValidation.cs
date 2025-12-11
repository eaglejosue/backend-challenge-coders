namespace Api.Data.Validations;

public sealed class ResetPasswordValidation : Validation<ResetPassword>
{
    public ResetPasswordValidation()
    {
        RuleFor(p => p.ResetPasswordCode).NotEmpty().NotNull();
        RuleFor(p => p.NewPassword).NotEmpty().NotNull();
    }
}

public static class ResetPasswordValidationExtension
{
    public static Task<ValidationResult> ValidateAsync(this ResetPassword r) => new ResetPasswordValidation().ValidateCustomAsync(r);
}