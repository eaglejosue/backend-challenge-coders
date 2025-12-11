namespace Api.Data.Dtos;

public sealed class Security
{
    public string Token { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public int ExpirationTimeInMinutes { get; set; }
}

public sealed class GoogleClientKeys
{
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
}
