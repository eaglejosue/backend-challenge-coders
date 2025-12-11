namespace Api.Data.Dtos;

public sealed class EmailFilters : BaseFilters
{
    public long? UserId { get; set; }
    public bool? IncludeUser { get; set; }
    public EmailType? EmailType { get; set; }
    public DateTime? ScheduleDate { get; set; }
    public DateTime? DateSent { get; set; }
    public int? SendAttempts { get; set; }
}
