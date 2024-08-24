public class UploadedFile
{
    public int Id { get; set; }
    public string FileName { get; set; }
    public string ContentType { get; set; }
    public byte[] Data { get; set; }
    public long FileSize { get; set; }
    public DateTime UploadedAt { get; set; }
}