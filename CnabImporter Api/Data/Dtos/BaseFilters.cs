namespace Api.Data.Dtos;

public class BaseFilters
{
    public long? Id { get; set; }
    public bool? IsActive { get; set; } = true;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? OrderBy { get; set; }

    public BaseFilters()
    {
        IsActive = true;
    }
}