namespace Api.Services;

public interface ITransactionService
{
    Task<Transaction?> GetByIdAsync(long id);
	Task<List<Transaction>> GetAllAsync(TransactionFilters filters);
	Task<Transaction?> CreateAsync(Transaction model);
	Task<Transaction?> UpdateAsync(Transaction model, long loggedUserId, string loggedUserName);
	Task<Transaction?> PatchAsync(Transaction model, long loggedUserId, string loggedUserName);
	Task<bool?> DeleteAsync(long id, long loggedUserId, string loggedUserName);
}

public sealed class TransactionService(
	CnabDbContext db,
    INotificationService notification) : ITransactionService
{
    public async Task<Transaction?> GetByIdAsync(long id) => await db.Transactions.FirstOrDefaultAsync(f => f.Id == id);

	public async Task<List<Transaction>> GetAllAsync(TransactionFilters filters)
	{
		var predicate = PredicateBuilder.New<Transaction>(true);

		#region Filters

		if (filters.Id.HasValue)
			predicate.And(a => a.Id == filters.Id);

		if (filters.IsActive.HasValue)
			predicate.And(a => a.IsActive == filters.IsActive);

		if (filters.CreatedAt.HasValue && filters.CreatedAt > DateTime.MinValue)
			predicate.And(a => a.CreatedAt == filters.CreatedAt.Value.Date);

		if (filters.UpdatedAt.HasValue && filters.UpdatedAt > DateTime.MinValue)
			predicate.And(a => a.UpdatedAt == filters.UpdatedAt.Value.Date);

		if (filters.DeletedAt.HasValue && filters.DeletedAt > DateTime.MinValue)
			predicate.And(a => a.DeletedAt == filters.DeletedAt.Value.Date);

		if (!string.IsNullOrEmpty(filters.Filter))
		{
			predicate.And(a =>
				EF.Functions.Like(a.Cpf, filters.Filter.LikeConcat()) ||
				EF.Functions.Like(a.Card, filters.Filter.LikeConcat())
			);
		}

		if (!string.IsNullOrEmpty(filters.Cpf))
			predicate.And(a => EF.Functions.Like(a.Cpf, filters.Cpf.LikeConcat()));

		if (!string.IsNullOrEmpty(filters.Card))
			predicate.And(a => EF.Functions.Like(a.Card, filters.Card.LikeConcat()));

		if (filters.Date.HasValue && filters.Date > DateTime.MinValue)
			predicate.And(a => a.Date == filters.Date.Value.Date);

		if (filters.Time.HasValue && filters.Time > TimeSpan.MinValue)
			predicate.And(a => a.Time == filters.Time.Value);

		if (filters.TransactionTypeId.HasValue)
			predicate.And(a => a.TransactionTypeId == filters.TransactionTypeId);

		#endregion

		var query = db.Transactions.Where(predicate);

		#region OrderBy

		query = filters?.OrderBy switch
		{
			"1" => query.OrderBy(o => o.Cpf),
			"2" => query.OrderBy(o => o.Card),
			_ => query.OrderBy(o => o.Id)
		};

		#endregion

#if DEBUG
		var queryString = query.ToQueryString();
#endif

		return await query.ToListAsync();
	}

	public async Task<Transaction?> CreateAsync(Transaction model)
	{
		var validation = await model.ValidateCreateAsync();
		if (!validation.IsValid)
		{
			notification.AddNotifications(validation);
			return default;
		}

		var transactionTypeExists = await db.TransactionTypes.AnyAsync(a => a.Id == model.TransactionTypeId && a.IsActive);
		if (!transactionTypeExists)
		{
			notification.AddNotification("TransactionType", "Transaction Type invalid.");
			return default;
		}

		var addResult = await db.Transactions.AddAsync(model);
		await db.SaveChangesAsync();

		return addResult.Entity;
	}

	public async Task<Transaction?> UpdateAsync(Transaction model, long loggedUserId, string loggedUserName)
	{
		var validation = await model.ValidateUpdateAsync();
		if (!validation.IsValid)
		{
			notification.AddNotifications(validation);
			return default;
		}

		var entitie = await GetByIdAsync(model.Id);
		if (entitie == null) return null;

		if (entitie.EntityUpdated(model))
		{
			entitie.UpdatedAt = DateTimeBr.Now;
			entitie.UpdatedBy = loggedUserName;
			db.Transactions.Update(entitie);
			await db.SaveChangesAsync();
		}

		return entitie;
	}

	public async Task<Transaction?> PatchAsync(Transaction model, long loggedUserId, string loggedUserName)
	{
		var validation = await model.ValidatePatchAsync();
		if (!validation.IsValid)
		{
			notification.AddNotifications(validation);
			return default;
		}

		var entitie = await GetByIdAsync(model.Id);
		if (entitie == null) return null;

		if (entitie.EntityUpdated(model))
		{
			entitie.UpdatedAt = DateTimeBr.Now;
			entitie.UpdatedBy = loggedUserName;
			db.Transactions.Update(entitie);
			await db.SaveChangesAsync();
		}

		return entitie;
	}

	public async Task<bool?> DeleteAsync(long id, long loggedUserId, string loggedUserName)
	{
		var entitie = await GetByIdAsync(id);
		if (entitie == null) return null;

		entitie.IsActive = false;
		entitie.DeletedAt = DateTimeBr.Now;
		entitie.UpdatedBy = loggedUserName;

		db.Transactions.Update(entitie);
		await db.SaveChangesAsync();

		return true;
	}
}
