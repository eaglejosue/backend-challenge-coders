namespace Api.Data.Dtos;

public sealed class Config
{
    public required string UrlApi { get; set; }
    public required string UrlLogo { get; set; }
    public required SubjectEmail Subject { get; set; }

    public sealed class SubjectEmail
    {
        public required string ActivateAccount { get; set; }
        public required string ForgotPassword { get; set; }
    }
}

public sealed class Smtp
{
    public required string Host { get; set; }
    public int Port { get; set; }
    public bool Ssl { get; set; }
    public required string User { get; set; }
    public required string Pass { get; set; }
    public required string From { get; set; }
    public required string Display { get; set; }
}
