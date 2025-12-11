namespace Api.Helpers.Extensions;

public static class DataExtensions
{
    public static bool EntityUpdated<T>(
        this Base entityToUpdate,
        T updatedEntity,
        List<string>? propertiesNameToDeconsider = null,
        List<string>? propertiesNameAllowedToSetNull = null) where T : class
    {
        if (entityToUpdate == null || updatedEntity == null)
            return false;

        propertiesNameToDeconsider ??= [];
        propertiesNameToDeconsider.Add("Id");
        propertiesNameToDeconsider.Add("CreatedAt");
        propertiesNameToDeconsider.Add("UpdatedAt");
        propertiesNameToDeconsider.Add("DeletedAt");

        propertiesNameAllowedToSetNull ??= [];
        propertiesNameAllowedToSetNull.Add("SaleExpirationDate");
        propertiesNameAllowedToSetNull.Add("WatchExpirationDate");

        var hasChanges = false;
        var entityProperties = typeof(T).GetProperties();

        foreach (var property in entityProperties)
        {
            if (propertiesNameToDeconsider.Contains(property.Name, StringComparer.InvariantCultureIgnoreCase))
                continue;

            if (property.GetGetMethod(true) == null) continue;
            if (property.GetSetMethod(true) == null) continue;

            var originalValue = property.GetValue(entityToUpdate);
            var updatedValue = property.GetValue(updatedEntity);

            if (updatedValue == null && !propertiesNameAllowedToSetNull.Contains(property.Name, StringComparer.InvariantCultureIgnoreCase))
                continue;

            switch (Type.GetTypeCode(property.PropertyType))
            {
                case TypeCode.String:
                    updatedValue = string.IsNullOrEmpty(updatedValue?.ToString()) ? originalValue : updatedValue;
                    break;
                case TypeCode.Int32 when property.PropertyType.IsEnum:
                case TypeCode.Object when property.PropertyType.IsEnum:
                    var valueNoneEnum = "None";
                    if (updatedValue.ToString() == valueNoneEnum)
                        updatedValue = originalValue;
                    break;
                default:
                    break;
            }

            if (!Equals(originalValue, updatedValue))
            {
                property.SetValue(entityToUpdate, updatedValue);
                hasChanges = true;
            }
        }

        return hasChanges;
    }

    public static string LikeConcat(this string str) => string.Concat("%", str, "%");

    public static string ToBase64(this string content)
    {
        if (string.IsNullOrEmpty(content))
            return string.Empty;

        var bytes = Encoding.UTF8.GetBytes(content);

        return Convert.ToBase64String(bytes);
    }

    public static string Serialize<T>(this T @object) where T : class
    {
        if (@object is null)
            return string.Empty;

        return JsonSerializer.Serialize(@object);
    }

    public static string NormalizeCustom(this string str)
    {
        var normalized = str.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder();

        foreach (char c in normalized)
            if (char.IsLetter(c) || char.IsWhiteSpace(c))
                builder.Append(c);

        return builder.ToString();
    }

    public static DateTime DayLastHourMinuteAndSecond(this DateTime d) => d.Date.AddDays(1).AddMilliseconds(-1);
}

public struct DateTimeBr
{
    public static DateTime Now => DateTime.SpecifyKind(DateTime.UtcNow.AddHours(-3), DateTimeKind.Unspecified);
    public static DateTime Date => Now.Date;
}