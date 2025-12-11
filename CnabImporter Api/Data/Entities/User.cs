namespace Api.Data.Entities;

public sealed class User : Base
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string? Cpf { get; set; }
    public string SignInWith { get; set; }
    public UserType Type { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? ProfileImgUrl { get; set; }
    [JsonIgnore] public byte[]? PasswordHash { get; private set; }
    public Guid? ActivationCode { get; set; }
    public DateTime? ActivationAt { get; set; }
    public bool? ResetPassword { get; private set; }
    public Guid? ResetPasswordCode { get; private set; }
    public DateTime? ResetPasswordAt { get; private set; }
    public DateTime? AcceptedTermsAt { get; set; }

    public ICollection<Transaction>? Transactions { get; set; }
    public ICollection<UserLog>? UserLogs { get; set; }

    [NotMapped] public string? OldPassword { get; set; }
    [NotMapped] public string? Password { get; set; }
    [NotMapped] public string Fullname => string.Concat(FirstName ?? string.Empty, " ", LastName ?? string.Empty);

    #region Methods

    public User() { }

    public User(Login l)
    {
        Email = l.Email!;
        Password = l.Password!;
        SignInWith = l.SignInWith!;
        FirstName = l.FirstName;
        LastName = l.LastName;
        ProfileImgUrl = l.ProfileImgUrl;

        if (!string.IsNullOrEmpty(l.Cpf))
            Cpf = l.Cpf;

        if (!string.IsNullOrEmpty(l.BirthDate))
            BirthDate = DateTime.Parse(l.BirthDate);

        Type = UserType.Default!;
    }

    internal void NewUser()
    {
        IsActive = false;
        ActivationCode = Guid.NewGuid();
    }

    internal void ActivateUser()
    {
        IsActive = true;
        ActivationAt = DateTime.Now;
    }

    internal void EncryptPassword()
    {
        if (string.IsNullOrEmpty(Password))
            return;

        PasswordHash = Password.Hash();
    }

    internal void RequestResetPassword()
    {
        ResetPassword = true;
        ResetPasswordCode = Guid.NewGuid();
        ResetPasswordAt = null;
    }

    internal void PasswordResetExecuted()
    {
        ResetPassword = false;
        ResetPasswordAt = DateTime.Now;
    }

    /// <summary>Returns the user's full name.</summary>
    public override string ToString() => Fullname;

    #endregion
}