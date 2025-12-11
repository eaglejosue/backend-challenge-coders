namespace Api.Data.Validations;

public abstract class Validation<T> : AbstractValidator<T> where T : class
{
    public Task<ValidationResult> ValidateCustomAsync(T t) => ValidateAsync(t);
}