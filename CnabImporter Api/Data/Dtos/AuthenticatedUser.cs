namespace Api.Data.Dtos;

public record AuthenticatedUser(
    long Id,
    int Type,
    string Name,
    string Firstname,
    string Lastname,
    string Email,
    string? ProfileImgUrl,
    bool TermsAccepted,
    string Token
);

public record ResetPassword(
	Guid? ResetPasswordCode,
	string? NewPassword
);