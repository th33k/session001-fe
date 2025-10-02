# .NET Backend Integration Guide

This document outlines how to integrate the React frontend with your .NET backend for the Return QC system.

## API Endpoints Required

### 1. Authentication Endpoints
```csharp
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request) { }
    
    [HttpPost("logout")]
    public async Task<ActionResult> Logout() { }
    
    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponse>> RefreshToken(RefreshRequest request) { }
    
    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<UserProfile>> GetProfile() { }
}
```

### 2. QC Management Endpoints
```csharp
[ApiController]
[Route("api/qc")]
[Authorize]
public class QCController : ControllerBase
{
    [HttpGet("pending")]
    public async Task<ActionResult<List<QCItem>>> GetPendingQCItems() { }
    
    [HttpGet("items/{id}")]
    public async Task<ActionResult<QCItem>> GetQCItem(string id) { }
    
    [HttpGet("checklist/{category}")]
    public async Task<ActionResult<List<QCChecklistItem>>> GetChecklist(string category) { }
    
    [HttpPost("results")]
    public async Task<ActionResult> SubmitQCResult(QCResult result) { }
    
    [HttpPost("bulk-results")]
    public async Task<ActionResult> SubmitBulkQCResults(BulkQCRequest request) { }
    
    [HttpPost("upload-photo")]
    public async Task<ActionResult<PhotoUploadResponse>> UploadPhoto(IFormFile file, string itemId, string checklistItemId) { }
    
    [HttpPost("damage-assessments")]
    public async Task<ActionResult<DamageAssessment>> CreateDamageAssessment(CreateDamageAssessmentRequest request) { }
    
    [HttpGet("history")]
    public async Task<ActionResult<PagedResult<QCItem>>> GetQCHistory(int page = 1, int limit = 20) { }
    
    [HttpGet("statistics")]
    public async Task<ActionResult<QCStatistics>> GetQCStatistics([FromQuery] DateTime? from, [FromQuery] DateTime? to) { }
}
```

## Data Models

### QC Item Model
```csharp
public class QCItem
{
    public string Id { get; set; }
    public string ToolId { get; set; }
    public string ToolName { get; set; }
    public DateTime ReturnDate { get; set; }
    public string SerialNumber { get; set; }
    public string Category { get; set; }
    public string LastUsedBy { get; set; }
    public string ReturnReason { get; set; }
    public QCStatus Status { get; set; }
    public Priority Priority { get; set; }
}

public enum QCStatus
{
    Pending,
    QCPassed,
    DamageFound,
    DamageAssessment
}

public enum Priority
{
    Low,
    Medium,
    High
}
```

### QC Checklist Item Model
```csharp
public class QCChecklistItem
{
    public string Id { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    public bool RequiresPhoto { get; set; }
    public bool IsCritical { get; set; }
}
```

### QC Result Model
```csharp
public class QCResult
{
    public string ItemId { get; set; }
    public List<QCChecklistResult> ChecklistResults { get; set; }
    public QCOverallStatus OverallStatus { get; set; }
    public string InspectorId { get; set; }
    public DateTime InspectionDate { get; set; }
    public string Notes { get; set; }
    public List<string> Photos { get; set; }
}

public class QCChecklistResult
{
    public string ChecklistItemId { get; set; }
    public bool Passed { get; set; }
    public string Notes { get; set; }
    public string PhotoUrl { get; set; }
}

public enum QCOverallStatus
{
    Pass,
    DamageFound
}
```

### Damage Assessment Model
```csharp
public class DamageAssessment
{
    public string Id { get; set; }
    public string QCResultId { get; set; }
    public string DamageType { get; set; }
    public DamageSeverity Severity { get; set; }
    public decimal? RepairEstimate { get; set; }
    public string RepairNotes { get; set; }
    public RecommendedAction RecommendedAction { get; set; }
    public string AssignedTo { get; set; }
    public DamageAssessmentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public enum DamageSeverity
{
    Minor,
    Moderate,
    Severe
}

public enum RecommendedAction
{
    Repair,
    Replace,
    Dispose
}

public enum DamageAssessmentStatus
{
    Pending,
    InProgress,
    Completed
}
```

## Database Schema (Entity Framework)

### QC Items Table
```sql
CREATE TABLE QCItems (
    Id NVARCHAR(50) PRIMARY KEY,
    ToolId NVARCHAR(50) NOT NULL,
    ToolName NVARCHAR(200) NOT NULL,
    ReturnDate DATETIME2 NOT NULL,
    SerialNumber NVARCHAR(100) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    LastUsedBy NVARCHAR(200) NOT NULL,
    ReturnReason NVARCHAR(500),
    Status INT NOT NULL,
    Priority INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

### QC Checklist Items Table
```sql
CREATE TABLE QCChecklistItems (
    Id NVARCHAR(50) PRIMARY KEY,
    Category NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NOT NULL,
    RequiresPhoto BIT NOT NULL DEFAULT 0,
    IsCritical BIT NOT NULL DEFAULT 0,
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1
);
```

### QC Results Table
```sql
CREATE TABLE QCResults (
    Id NVARCHAR(50) PRIMARY KEY,
    ItemId NVARCHAR(50) NOT NULL,
    OverallStatus INT NOT NULL,
    InspectorId NVARCHAR(50) NOT NULL,
    InspectionDate DATETIME2 NOT NULL,
    Notes NVARCHAR(1000),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (ItemId) REFERENCES QCItems(Id)
);
```

### QC Checklist Results Table
```sql
CREATE TABLE QCChecklistResults (
    Id NVARCHAR(50) PRIMARY KEY,
    QCResultId NVARCHAR(50) NOT NULL,
    ChecklistItemId NVARCHAR(50) NOT NULL,
    Passed BIT NOT NULL,
    Notes NVARCHAR(500),
    PhotoUrl NVARCHAR(500),
    FOREIGN KEY (QCResultId) REFERENCES QCResults(Id),
    FOREIGN KEY (ChecklistItemId) REFERENCES QCChecklistItems(Id)
);
```

## Business Logic Implementation

### 1. QC Result Processing
When a QC result is submitted:
1. Update the QC item status based on overall result
2. If damage is found, create a damage assessment task
3. Send notifications to relevant stakeholders
4. Log the inspection for audit purposes

```csharp
public async Task<bool> ProcessQCResult(QCResult result)
{
    // Update QC item status
    var qcItem = await _context.QCItems.FindAsync(result.ItemId);
    qcItem.Status = result.OverallStatus == QCOverallStatus.Pass 
        ? QCStatus.QCPassed 
        : QCStatus.DamageFound;
    
    // Save QC result
    await _context.QCResults.AddAsync(result);
    
    // If damage found, create assessment task
    if (result.OverallStatus == QCOverallStatus.DamageFound)
    {
        await CreateDamageAssessmentTask(result);
    }
    
    await _context.SaveChangesAsync();
    
    // Send notifications
    await _notificationService.NotifyQCComplete(result);
    
    return true;
}
```

### 2. Photo Upload Handling
```csharp
[HttpPost("upload-photo")]
public async Task<ActionResult<PhotoUploadResponse>> UploadPhoto(
    IFormFile file, 
    string itemId, 
    string checklistItemId)
{
    // Validate file
    if (file == null || file.Length == 0)
        return BadRequest("No file uploaded");
    
    if (file.Length > 10 * 1024 * 1024) // 10MB
        return BadRequest("File too large");
    
    var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
    if (!allowedTypes.Contains(file.ContentType))
        return BadRequest("Invalid file type");
    
    // Generate unique filename
    var fileName = $"{itemId}_{checklistItemId}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    var filePath = Path.Combine("uploads", "qc-photos", fileName);
    
    // Save file
    Directory.CreateDirectory(Path.GetDirectoryName(filePath));
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }
    
    // Return URL
    var photoUrl = $"/api/files/qc-photos/{fileName}";
    return Ok(new PhotoUploadResponse { PhotoUrl = photoUrl });
}
```

## Environment Configuration

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=QCSystemDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "QCSystem",
    "Audience": "QCSystem",
    "ExpiryMinutes": 60
  },
  "FileUpload": {
    "MaxFileSizeBytes": 10485760,
    "AllowedExtensions": [".jpg", ".jpeg", ".png", ".webp"],
    "UploadPath": "uploads"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000", "https://localhost:3000"]
  }
}
```

### Program.cs Configuration
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDbContext<QCDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        // JWT configuration
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure pipeline
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
```

## Testing

Create unit tests for your controllers and services:

```csharp
[TestClass]
public class QCControllerTests
{
    [TestMethod]
    public async Task GetPendingQCItems_ShouldReturnPendingItems()
    {
        // Arrange
        var mockService = new Mock<IQCService>();
        var controller = new QCController(mockService.Object);
        
        // Act
        var result = await controller.GetPendingQCItems();
        
        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
    }
}
```

This implementation provides a complete backend structure that the React frontend can integrate with seamlessly.