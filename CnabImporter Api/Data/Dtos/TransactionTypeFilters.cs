namespace Api.Data.Dtos;

public sealed class TransactionTypeFilters : BaseFilters
{
    public string? Filter { get; set; }
	public int? Type { get; set; }
	public string? Description { get; set; }
	public string? Nature { get; set; }
	public string? Sign { get; set; }
}