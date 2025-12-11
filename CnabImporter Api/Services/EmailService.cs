using static Api.Helpers.Constants;

namespace Api.Services;

public interface IEmailService
{
    Task<Email?> GetByIdAsync(long id);
    Task<List<Email>> GetAllAsync(EmailFilters filters);
    Task<Email?> CreateAsync(Email model);
    Task<Email?> UpdateAsync(Email model);
    Task<Email?> PatchAsync(Email model);
    Task<bool?> DeleteAsync(long id);

    Task SendEmailActivateAccountByIdAsync(long id);
    Task SendEmailForgotPasswordByIdAsync(long id);
}

public sealed class EmailService(
    CnabDbContext db,
    INotificationService notification,
    IOptions<Config> config,
    IEmailSender emailSender,
    ILogger<EmailService> logger) : IEmailService
{
    public async Task<Email?> GetByIdAsync(long id) => await db.Emails.FirstOrDefaultAsync(f => f.Id == id).ConfigureAwait(false);

    public async Task<List<Email>> GetAllAsync(EmailFilters filters)
    {
        var predicate = PredicateBuilder.New<Email>(true);

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

        if (filters.EmailType.HasValue)
            predicate.And(a => a.EmailType == filters.EmailType);

        if (filters.ScheduleDate.HasValue && filters.ScheduleDate > DateTime.MinValue)
            predicate.And(a => a.ScheduleDate == filters.ScheduleDate.Value.Date);

        if (filters.DateSent.HasValue && filters.DateSent > DateTime.MinValue)
            predicate.And(a => a.DateSent == filters.DateSent.Value.Date);

        if (filters.SendAttempts.HasValue)
            predicate.And(a => a.SendAttempts == filters.SendAttempts);

        var query = db.Emails.Where(predicate);

        if (filters.IncludeUser.HasValue && filters.IncludeUser.Value)
            query = query.Include(i => i.User);

        return await query.ToListAsync().ConfigureAwait(false);
    }

    public async Task<Email?> CreateAsync(Email model)
    {
        var validation = await model.ValidateCreateAsync();
        if (!validation.IsValid)
        {
            notification.AddNotifications(validation);
            return default;
        }

        var addResult = await db.Emails.AddAsync(model).ConfigureAwait(false);
        await db.SaveChangesAsync().ConfigureAwait(false);

        return addResult.Entity;
    }

    public async Task<Email?> UpdateAsync(Email model)
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
            db.Emails.Update(entitie);
            await db.SaveChangesAsync().ConfigureAwait(false);
        }

        return entitie;
    }

    public async Task<Email?> PatchAsync(Email model)
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
            db.Emails.Update(entitie);
            await db.SaveChangesAsync().ConfigureAwait(false);
        }

        return entitie;
    }

    public async Task<bool?> DeleteAsync(long id)
    {
        var entitie = await GetByIdAsync(id);
        if (entitie == null) return null;

        entitie.IsActive = false;
        entitie.DeletedAt = DateTimeBr.Now;

        db.Emails.Update(entitie);
        await db.SaveChangesAsync().ConfigureAwait(false);

        return true;
    }


    public async Task SendEmailActivateAccountByIdAsync(long id)
    {
        logger.LogInformation("{DT} | SendEmailActivateAccountByIdAsync | E-mail Id: {I}", DateTimeBr.Now.ToString("dd/MM/yyyy HH:mm:ss"), id);

        await SendAsync(PredicateBuilder.New<Email>(p => p.Id == id && p.DateSent == null), config.Value.Subject.ActivateAccount, email =>
        {
            return Templates.ActivateAccount
                .Replace("{UrlLogo}", config.Value.UrlLogo)
                .Replace("{UrlButton}", string.Concat(config.Value.UrlApi, "/login?code=", email.User!.ActivationCode.ToString()))
                .Replace("{Name}", email.User.ToString());
        });
    }

    public async Task SendEmailForgotPasswordByIdAsync(long id)
    {
        logger.LogInformation("{DT} | SendEmailForgotPasswordByIdAsync | E-mail Id: {I}", DateTimeBr.Now.ToString("dd/MM/yyyy HH:mm:ss"), id);

        await SendAsync(PredicateBuilder.New<Email>(p => p.Id == id && p.DateSent == null), config.Value.Subject.ForgotPassword, email =>
        {
            return Templates.ForgotPassword
                .Replace("{UrlLogo}", config.Value.UrlLogo)
                .Replace("{UrlButton}", string.Concat(config.Value.UrlApi, "/reset-password?code=", email.User!.ResetPasswordCode.ToString()))
                .Replace("{Name}", email.User.ToString());
        });
    }

    private async Task SendAsync(ExpressionStarter<Email> predicate, string subject, Func<Email, string> getTemplate)
    {
        logger.LogInformation("{DT} | Send e-mail | Predicate: {P} | Subject: {S}", DateTimeBr.Now.ToString("dd/MM/yyyy HH:mm:ss"), predicate.ToString(), subject);

        var query = db.Emails.AsQueryable();
        query = query.Include(i => i.User);

        var emails = await query
        .Where(predicate)
            .Take(10)
            .ToListAsync()
            .ConfigureAwait(false);

        logger.LogInformation("{DT} | Send e-mail | E-mails found: {C}", DateTimeBr.Now.ToString("dd/MM/yyyy HH:mm:ss"), emails.Count);

        if (emails.Count == 0)
            return;

        await Parallel.ForEachAsync(emails, async (email, _) =>
        {
            await emailSender.SendAsync(
                recipient: email.User!.Email,
                subject: subject,
                message: getTemplate.Invoke(email),
                onSuccess: email.SendSuccess,
                onError: email.SendError);
        });

        db.Emails.UpdateRange(emails);
        await db.SaveChangesAsync().ConfigureAwait(false);
    }
}
