namespace Api.Data.Validations;

public sealed class TransactionCreateValidator : Validation<Transaction>
{
    public TransactionCreateValidator()
    {
        RuleFor(p => p.Date).NotEmpty().NotNull();
        RuleFor(p => p.Value).NotEmpty().NotNull();
		RuleFor(p => p.Cpf).NotEmpty().NotNull();
		RuleFor(p => p.Card).NotEmpty().NotNull();
		RuleFor(p => p.Time).NotEmpty().NotNull();
		RuleFor(p => p.Owner).NotEmpty().NotNull();
		RuleFor(p => p.Store).NotEmpty().NotNull();
		RuleFor(p => p.TransactionTypeId).NotEmpty().NotNull();
	}
}

public sealed class TransactionUpdateValidator : Validation<Transaction>
{
    public TransactionUpdateValidator()
    {
        RuleFor(r => r.Id).NotNull().NotEmpty();
		RuleFor(p => p.Value).NotEmpty().NotNull();
		RuleFor(p => p.Card).NotEmpty().NotNull();
		RuleFor(p => p.Owner).NotEmpty().NotNull();
		RuleFor(p => p.Store).NotEmpty().NotNull();
	}
}

public sealed class TransactionPatchValidator : Validation<Transaction>
{
    public TransactionPatchValidator()
    {
        RuleFor(r => r.Id).NotNull().NotEmpty();
    }
}

public static class TransactionValidationExtension
{
    public static Task<ValidationResult> ValidateCreateAsync(this Transaction u) => new TransactionCreateValidator().ValidateCustomAsync(u);
    public static Task<ValidationResult> ValidateUpdateAsync(this Transaction u) => new TransactionUpdateValidator().ValidateCustomAsync(u);
    public static Task<ValidationResult> ValidatePatchAsync(this Transaction u) => new TransactionPatchValidator().ValidateCustomAsync(u);
}