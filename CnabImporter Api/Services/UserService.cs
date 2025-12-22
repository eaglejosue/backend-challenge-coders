namespace Api.Services;

public interface IUserService
{
    Task<User?> GetByIdAsync(long id);
    Task<List<User>> GetAllAsync(UserFilters filters);
    Task<User?> CreateAsync(User model);
    Task<User?> UpdateAsync(User model, long loggedUserId, string loggedUserName);
    Task<User?> PatchAsync(User model, long loggedUserId, string loggedUserName);
    Task<bool?> DeleteAsync(long id, long loggedUserId, string loggedUserName);
    Task SetAcceptedTermsAt(long id);
    Task<UserLog?> CreateUserLogAsync(UserLog model);
}

public sealed class UserService(
	CnabDbContext db,
	//IEmailService emailService,
	INotificationService notification) : IUserService
{
    public async Task<User?> GetByIdAsync(long id) => await db.Users.FirstOrDefaultAsync(f => f.Id == id);

    public async Task<List<User>> GetAllAsync(UserFilters filters)
    {
        var predicate = PredicateBuilder.New<User>(true);

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
                EF.Functions.Like(a.FirstName, filters.Filter.LikeConcat()) ||
                EF.Functions.Like(a.LastName, filters.Filter.LikeConcat()) ||
                EF.Functions.Like(a.Email, filters.Filter.LikeConcat())
            );
        }

        if (!string.IsNullOrEmpty(filters.FirstName))
            predicate.And(a => EF.Functions.Like(a.FirstName, filters.FirstName.LikeConcat()));

        if (!string.IsNullOrEmpty(filters.LastName))
            predicate.And(a => EF.Functions.Like(a.LastName, filters.LastName.LikeConcat()));

        if (!string.IsNullOrEmpty(filters.Email))
            predicate.And(a => EF.Functions.Like(a.Email, filters.Email.LikeConcat()));

        if (!string.IsNullOrEmpty(filters.SignInWith))
            predicate.And(a => a.SignInWith != null && EF.Functions.Like(a.SignInWith, filters.SignInWith.LikeConcat()));

        if (filters.Type != null)
            predicate.And(a => a.Type == filters.Type);

        if (filters.BirthDate.HasValue && filters.BirthDate > DateTime.MinValue)
            predicate.And(a => a.BirthDate == filters.BirthDate.Value.Date);

        #endregion

        var query = db.Users.Where(predicate);

        #region OrderBy

        query = filters?.OrderBy switch
        {
            "1" => query.OrderBy(o => o.FirstName),
            "2" => query.OrderByDescending(o => o.FirstName),
            "3" => query.OrderBy(o => o.CreatedAt),
            "4" => query.OrderByDescending(o => o.CreatedAt),
            _ => query.OrderBy(o => o.Id)
        };

        #endregion

#if DEBUG
        var queryString = query.ToQueryString();
#endif

        return await query.ToListAsync();
    }

    public async Task<User?> CreateAsync(User model)
    {
        var validation = await model.ValidateCreateAsync();
        if (!validation.IsValid)
        {
            notification.AddNotifications(validation);
            return default;
        }

        var userByEmail = await db.Users.FirstOrDefaultAsync(f => f.Email == model.Email);
        if (userByEmail != null)
        {
            notification.AddNotification("User", "Usuário existente.");
            return default;
        }

        model.NewUser();
        model.EncryptPassword();

        //if (model.SignInWith.Equals(SignIn.Google.ToString(), StringComparison.CurrentCultureIgnoreCase))
        model.ActivateUser();

        var addResult = await db.Users.AddAsync(model);
        await db.SaveChangesAsync();

        var newUser = addResult.Entity;

        if (model.SignInWith.Equals(SignIn.Default.ToString(), StringComparison.CurrentCultureIgnoreCase))
        {
            //Not required
            //var newEmail = await emailService.CreateAsync(new Email(newUser.Id, EmailType.UserActivation));
            //await emailService.SendEmailActivateAccountByIdAsync(newEmail!.Id);
        }

        return newUser;
    }

    public async Task<User?> UpdateAsync(User model, long loggedUserId, string loggedUserName)
    {
        var validation = await model.ValidateUpdateAsync();
        if (!validation.IsValid)
        {
            notification.AddNotifications(validation);
            return default;
        }

        var entitie = await GetByIdAsync(model.Id);
        if (entitie == null) return null;

        if (!string.IsNullOrEmpty(model.OldPassword))
        {
            if (entitie.PasswordHash != null && model.OldPassword!.VerifyPassword(entitie.PasswordHash!) == false)
            {
                notification.AddNotification("User", "Verifique se a Antiga Senha esta correta e tente novamente!");
                return default;
            }

            model.EncryptPassword();

            if (entitie.PasswordHash!.Equals(model.PasswordHash))
            {
                notification.AddNotification("User", "Escolha uma nova senha diferente da antiga.");
                return default;
            }
        }

        if (entitie.EntityUpdated(model))
        {
            entitie.UpdatedAt = DateTimeBr.Now;
            entitie.UpdatedBy = loggedUserName;
            db.Users.Update(entitie);
            await db.SaveChangesAsync();

            await CreateUserLogAsync(new UserLog(loggedUserId, string.Format("User Id {0} Updated", model.Id)));
        }

        return entitie;
    }

    public async Task<User?> PatchAsync(User model, long loggedUserId, string loggedUserName)
    {
        var validation = await model.ValidatePatchAsync();
        if (!validation.IsValid)
        {
            notification.AddNotifications(validation);
            return default;
        }

        var entitie = await GetByIdAsync(model.Id);
        if (entitie == null) return null;

        if (!string.IsNullOrEmpty(model.OldPassword))
        {
            if (entitie.PasswordHash != null && model.OldPassword!.VerifyPassword(entitie.PasswordHash!) == false)
            {
                notification.AddNotification("User", "Verifique se a Antiga Senha esta correta e tente novamente!");
                return default;
            }

            model.EncryptPassword();

            if (entitie.PasswordHash!.Equals(model.PasswordHash))
            {
                notification.AddNotification("User", "Escolha uma nova senha diferente da antiga.");
                return default;
            }
        }

        if (entitie.EntityUpdated(model))
        {
            entitie.UpdatedAt = DateTimeBr.Now;
            entitie.UpdatedBy = loggedUserName;
            db.Users.Update(entitie);
            await db.SaveChangesAsync();

            await CreateUserLogAsync(new UserLog(loggedUserId, string.Format("User Id {0} Patched", model.Id)));
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

        db.Users.Update(entitie);
        await db.SaveChangesAsync();

        await CreateUserLogAsync(new UserLog(loggedUserId, string.Format("User Id {0} Deleted", id)));

        return true;
    }

    public async Task SetAcceptedTermsAt(long id)
    {
        var entitie = await GetByIdAsync(id);
        if (entitie == null) return;

        entitie.AcceptedTermsAt = DateTimeBr.Now;
        db.Users.Update(entitie);
        await db.SaveChangesAsync();
    }

    public async Task<UserLog?> CreateUserLogAsync(UserLog model)
    {
        var validation = await model.ValidateCreateUserLogAsync();
        if (!validation.IsValid)
        {
            notification.AddNotifications(validation);
            return default;
        }

        var addResult = await db.UserLogs.AddAsync(model);
        await db.SaveChangesAsync();

        return addResult.Entity;
    }
}
