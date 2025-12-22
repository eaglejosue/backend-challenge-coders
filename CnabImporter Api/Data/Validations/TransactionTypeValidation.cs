namespace Api.Data.Validations;

public sealed class TransactionTypeCreateValidator : Validation<TransactionType>
{
    public TransactionTypeCreateValidator()
    {
        RuleFor(p => p.Type).NotEmpty().NotNull();
        RuleFor(p => p.Description).NotEmpty().NotNull();
		RuleFor(p => p.Nature).NotEmpty().NotNull();
		RuleFor(p => p.Sign).NotEmpty().NotNull();
	}
}

public sealed class TransactionTypeUpdateValidator : Validation<TransactionType>
{
    public TransactionTypeUpdateValidator()
    {
        RuleFor(r => r.Id).NotNull().NotEmpty();
		RuleFor(p => p.Type).NotEmpty().NotNull();
		RuleFor(p => p.Description).NotEmpty().NotNull();
		RuleFor(p => p.Nature).NotEmpty().NotNull();
		RuleFor(p => p.Sign).NotEmpty().NotNull();
	}
}

public sealed class TransactionTypePatchValidator : Validation<TransactionType>
{
    public TransactionTypePatchValidator()
    {
        RuleFor(r => r.Id).NotNull().NotEmpty();
    }
}

public static class TransactionTypeValidationExtension
{
    public static Task<ValidationResult> ValidateCreateAsync(this TransactionType u) => new TransactionTypeCreateValidator().ValidateCustomAsync(u);
    public static Task<ValidationResult> ValidateUpdateAsync(this TransactionType u) => new TransactionTypeUpdateValidator().ValidateCustomAsync(u);
    public static Task<ValidationResult> ValidatePatchAsync(this TransactionType u) => new TransactionTypePatchValidator().ValidateCustomAsync(u);
}