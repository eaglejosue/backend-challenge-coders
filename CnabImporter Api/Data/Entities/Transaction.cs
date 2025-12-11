namespace Api.Data.Entities;

public class Transaction : Base
{
	public int Type { get; set; }
	public DateTime Date { get; set; }
	public decimal Value { get; set; }
	public string Cpf { get; set; }
	public string Card { get; set; }
	public TimeSpan Time { get; set; }
	public string Owner { get; set; }
	public string Store { get; set; }
}
