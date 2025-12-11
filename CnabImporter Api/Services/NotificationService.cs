namespace Api.Services;

public record Notification(
    string? Key,
    string? Message
);

public interface INotificationService
{
    bool HasNotifications { get; }
    IReadOnlyCollection<Notification> Notifications { get; }

    void AddNotification(Notification notification);
    void AddNotification(string key, string message);
    void AddNotifications(IList<Notification> notifications);
    void AddNotifications(ValidationResult validationResult);
    void ClearNotifications();
}

public sealed class NotificationService : INotificationService
{
    private readonly List<Notification> _notifications;
    public IReadOnlyCollection<Notification> Notifications => _notifications;
    public bool HasNotifications => _notifications.Count > 0;

    public NotificationService()
    {
        _notifications = [];
    }

    public void AddNotification(string key, string message) => _notifications.Add(new Notification(key, message));

    public void AddNotification(Notification notification) => _notifications.Add(notification);

    public void AddNotifications(IList<Notification> notifications) => _notifications.AddRange(notifications);

    public void AddNotifications(ValidationResult validationResult)
    {
        foreach (var error in validationResult.Errors)
            AddNotification(error.PropertyName, error.ErrorMessage);
    }

    public void ClearNotifications() => _notifications.Clear();
}
