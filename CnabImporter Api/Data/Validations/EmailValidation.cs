namespace Api.Data.Validations;

public sealed class EmailCreateValidator : Validation<Email>
{
    public EmailCreateValidator()
    {
        RuleFor(p => p.UserId).NotEmpty().NotNull();
        RuleFor(p => p.EmailType).NotNull();
    }
}

public sealed class EmailUpdateValidator : Validation<Email>
{
    public EmailUpdateValidator()
    {
        RuleFor(r => r.Id).NotNull().NotEmpty();
        RuleFor(p => p.UserId).NotEmpty().NotNull();
    }
}

public sealed class EmailPatchValidator : Validation<Email>
{
    public EmailPatchValidator()
    {
        RuleFor(r => r.Id).NotNull().NotEmpty();
        RuleFor(p => p.UserId).NotEmpty().NotNull();
    }
}

public static class EmailValidationExtension
{
    public static Task<ValidationResult> ValidateCreateAsync(this Email e) => new EmailCreateValidator().ValidateCustomAsync(e);
    public static Task<ValidationResult> ValidateUpdateAsync(this Email e) => new EmailUpdateValidator().ValidateCustomAsync(e);
    public static Task<ValidationResult> ValidatePatchAsync(this Email e) => new EmailPatchValidator().ValidateCustomAsync(e);
}