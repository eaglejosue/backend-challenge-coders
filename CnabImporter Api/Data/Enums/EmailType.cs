namespace Api.Data.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum EmailType
{
    [EnumMember(Value = "UserActivation")] UserActivation,
    [EnumMember(Value = "ForgotPassword")] ForgotPassword,
}
