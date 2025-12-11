namespace Api.Data.Dtos;

public record Login(
    string? Email = null,
    string? Password = null,
    string? SignInWith = null,
    string? TokenSignIn = null,
    string? FirstName = null,
    string? LastName = null,
    string? Cpf = null,
    string? BirthDate = null,
    string? ProfileImgUrl = null
);
