namespace Api.Data.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserType
{
    [EnumMember(Value = "Default")] Default,
    [EnumMember(Value = "Admin")] Admin,
    [EnumMember(Value = "Operator")] Operator
}
