namespace Api.Helpers.Extensions;

public static class PasswordHasherExtension
{
    public static byte[] Hash(this string password) =>
        Encoding.UTF8.GetBytes(HashPassword(password, GenerateSalt(12)));

    public static bool VerifyPassword(this string password, byte[] hashedPassword) =>
        Verify(password, Encoding.UTF8.GetString(hashedPassword));
}
