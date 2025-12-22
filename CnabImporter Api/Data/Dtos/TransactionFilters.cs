namespace Api.Data.Dtos;

public sealed class TransactionFilters : BaseFilters
{
    public string? Filter { get; set; }
	public DateTime? Date { get; set; }
	public string? Cpf { get; set; }
	public string? Card { get; set; }
	public TimeSpan? Time { get; set; }
	public long? TransactionTypeId { get; set; }
}