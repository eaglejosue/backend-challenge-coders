namespace Api.Services;

public interface ILoginService
{
    Task<AuthenticatedUser?> LoginAsync(Login login, User? user = null, bool fromActivationCode = false);
    Task<AuthenticatedUser?> SiginAsync(Login login);
    Task<AuthenticatedUser?> ActivateUserAsync(Guid activationCode);
    Task ForgotPasswordAsync(string email);
    Task<bool> CheckResetPasswordCodeAsync(Guid resetPasswordCode);
    Task ResetPasswordAsync(ResetPassword model);
}

public sealed class LoginService(
    CnabDbContext db,
    IUserService userService,
    ITokenService tokenService,
    //IEmailService emailService,
    INotificationService notification) : ILoginService
{
    public async Task<AuthenticatedUser?> LoginAsync(Login login, User? user = null, bool fromActivationCode = false)
    {
        var validation = await login.ValidateLoginAsync();
        if (!fromActivationCode && !validation.IsValid)
        {
            notification.AddNotifications(validation);
            return default;
        }

        user ??= await db.Users.FirstOrDefaultAsync(f => f.Email == login.Email).ConfigureAwait(false);

        if (user == null)
        {
            notification.AddNotification("Login", "Verifique se o E-mail e Senha estão corretos e tente novamente!");
            return default;
        }

        if ((user?.IsActive ?? false) == false)
        {
            notification.AddNotification("Login", "Verifique seu E-mail para ativar a conta e tente novamente!");
            return default;
        }

        if (!fromActivationCode &&
            login.SignInWith!.Equals(SignIn.Default.ToString(), StringComparison.CurrentCultureIgnoreCase) &&
            login.Password!.VerifyPassword(user.PasswordHash!) == false)
        {
            var msg = "Verifique se o E-mail e Senha estão corretos e tente novamente!";

            if (user.SignInWith.Equals(SignIn.Google.ToString(), StringComparison.CurrentCultureIgnoreCase))
                msg = "Clique no botão 'Entrar com o Google'!";

            notification.AddNotification("Login", msg);
            return default;
        }

        return new(
            user.Id,
            user.Type.GetHashCode(),
            user.Fullname,
            user.FirstName,
            user.LastName,
            user.Email,
            user.ProfileImgUrl,
            user.AcceptedTermsAt.HasValue,
            tokenService.GenerateToken(user));
    }

    public async Task<AuthenticatedUser?> SiginAsync(Login login)
    {
        var validation = await login.ValidateLoginAsync();
        if (!validation.IsValid)
        {
            notification.AddNotifications(validation);
            return default;
        }

        var user = await db.Users.FirstOrDefaultAsync(f => f.Email == login.Email).ConfigureAwait(false);
        if (user == null)
            user = await userService.CreateAsync(new User(login));

        if (login.SignInWith!.Equals(SignIn.Default.ToString(), StringComparison.CurrentCultureIgnoreCase))
            return default;//Usuário precisará ativar cadastro pelo e-mail recebido

        return await LoginAsync(login, user);
    }

    public async Task<AuthenticatedUser?> ActivateUserAsync(Guid activationCode)
    {
        var user = await db.Users.FirstOrDefaultAsync(p => p.ActivationCode == activationCode);
        if (user is null)
        {
            notification.AddNotification("Login", "Código de Ativação inválido.");
            return default;
        }

        if (user.IsActive && user.ActivationAt.HasValue)
        {
            notification.AddNotification("Login", "Conta ativada! Preencha o E-mail e Senha para entrar.");
            return default;
        }

        user.ActivateUser();

        db.Users.Update(user);
        await db.SaveChangesAsync().ConfigureAwait(false);

        return await LoginAsync(new Login(), user, true);
    }

    public async Task ForgotPasswordAsync(string email)
    {
        var validation = await email.ValidateEmailAsync();
        if (!validation.IsValid)
        {
            notification.AddNotifications(validation);
            return;
        }

        var user = await db.Users.FirstOrDefaultAsync(a => a.Email == email).ConfigureAwait(false);
        if (user is null)
        {
            notification.AddNotification("Login", "E-mail não cadastrado. Crie sua conta!");
            return;
        }

        //Changed just for tests, it is not required
		//user.RequestResetPassword();
		user.PasswordResetExecuted();

		db.Users.Update(user);
        await db.SaveChangesAsync().ConfigureAwait(false);

        //Not required
        //var newEmail = await emailService.CreateAsync(new Email(user.Id, EmailType.ForgotPassword));
        //await emailService.SendEmailForgotPasswordByIdAsync(newEmail!.Id);
    }

    public async Task<bool> CheckResetPasswordCodeAsync(Guid resetPasswordCode) =>
        await db.Users.AnyAsync(p => p.ResetPasswordCode == resetPasswordCode).ConfigureAwait(false);

    public async Task ResetPasswordAsync(ResetPassword model)
    {
        var validation = await model.ValidateAsync();
        if (!validation.IsValid)
        {
            notification.AddNotifications(validation);
            return;
        }

        var user = await db.Users.FirstOrDefaultAsync(p => p.ResetPasswordCode == model.ResetPasswordCode).ConfigureAwait(false);
        if (user is null)
        {
            notification.AddNotification("Login", "Código inválido.");
            return;
        }

        if (user.ResetPassword == false && user.ResetPasswordAt.HasValue)
        {
            notification.AddNotification("Login", "Código já utilizado.");
            return;
        }

        user.PasswordResetExecuted();
        user.Password = model.NewPassword;
        user.EncryptPassword();

        db.Users.Update(user);
        await db.SaveChangesAsync().ConfigureAwait(false);
    }
}
