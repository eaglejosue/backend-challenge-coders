namespace Api.Data.Entities;

public sealed class Email : Base
{
    public long UserId { get; set; }
    public long? BookId { get; set; }
    public EmailType? EmailType { get; set; }
    public DateTime? ScheduleDate { get; set; }
    public DateTime? DateSent { get; set; }
    public int? SendAttempts { get; set; }

    [JsonIgnore] public User? User { get; set; }

    public Email() { }

    public Email(
        long userId,
        EmailType emailType,
        DateTime? scheduleDate = null,
        long? bookId = null)
    {
        UserId = userId;
        EmailType = emailType;
        ScheduleDate = scheduleDate;
        BookId = bookId;
    }

    public void SendSuccess()
    {
        DateSent = DateTimeBr.Now;
        UpdatedAt = DateTimeBr.Now;
        SendAttempts ??= 0;
        SendAttempts++;
    }

    public void SendError()
    {
        UpdatedAt = DateTimeBr.Now;
        SendAttempts ??= 0;
        SendAttempts++;
    }
}