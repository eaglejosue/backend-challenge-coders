var builder = WebApplication.CreateBuilder(args);
builder.AddArchitectures();

var app = builder.Build();
app.UseArchitectures();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<CnabDbContext>();
    dbContext.Database.Migrate();
}

app.Run();