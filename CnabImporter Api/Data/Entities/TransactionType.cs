namespace Api.Data.Entities;

public class TransactionType : Base
{
	public int Type { get; set; }
	public string Description { get; set; }
	public string Nature { get; set; }
	public string Sign { get; set; }

	public ICollection<Transaction>? Transactions { get; set; }
}
