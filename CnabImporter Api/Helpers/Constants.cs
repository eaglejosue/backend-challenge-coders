namespace Api.Helpers;

public sealed class Constants
{
    public static class Params
    {
        public const string Terms = "terms";
        public const string MainAccountPercent = "main_account_percent";
        public const string Banks = "banks";
    }

    public static class PersonType
    {
        public const string PF = "Pessoa Física";
        public const string PJ = "Pessoa Jurídica";
    }

    public static class Templates
    {
        private static readonly string _activateAccount = GetTemplate(name: "ActivateAccount");
        public static string ActivateAccount => _activateAccount;

        private static readonly string _forgotPassword = GetTemplate(name: "ForgotPassword");
        public static string ForgotPassword => _forgotPassword;

        private static string GetTemplate(string name) =>
            File.ReadAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot", "Templates", $"{name}.html"));
    }

    public static class Folders
    {
        public const string Photos = "photos";
        public const string Pdfs = "pdfs";
        public const string Public = "public";
    }
}
