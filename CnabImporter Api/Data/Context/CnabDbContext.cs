namespace Api.Data.Context;

public class CnabDbContext(DbContextOptions<CnabDbContext> o, IConfiguration config) : DbContext(o)
{
	public DbSet<Transaction> Transactions => Set<Transaction>();
	public DbSet<User> Users => Set<User>();
	public DbSet<UserLog> UserLogs => Set<UserLog>();
	public DbSet<Email> Emails => Set<Email>();

	protected override void OnConfiguring(DbContextOptionsBuilder o)
	{
		o.UseSqlite("Data Source=CnabImporter.db;Cache=Shared");
	}
}
