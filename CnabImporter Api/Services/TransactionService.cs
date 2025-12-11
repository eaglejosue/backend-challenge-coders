namespace Api.Services;

public interface ITransactionService
{
    Task<Transaction?> GetByIdAsync(long id);
}

public sealed class TransactionService(
	CnabDbContext db,
    INotificationService notification) : ITransactionService
{
    public async Task<Transaction?> GetByIdAsync(long id) => await db.Transactions.FirstOrDefaultAsync(f => f.Id == id);
}
