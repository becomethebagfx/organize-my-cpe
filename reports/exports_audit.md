# Exports Functionality Audit Report

**Date:** 2026-01-05
**Auditor:** Claude Code

---

## Summary

| Export Type | Backend | Frontend | Empty Data | Error Feedback |
|-------------|---------|----------|------------|----------------|
| CANONICAL_CSV | Implemented | Implemented | Returns empty file | **NONE** |
| CANONICAL_XLSX | Implemented | Implemented | Returns empty file | **NONE** |
| CERTIFICATE_ZIP | NOT_IMPLEMENTED | Implemented | Returns 501 | **NONE** |
| SUMMARY_PDF | Implemented* | Implemented | Returns empty file | **NONE** |
| STATE_CSV | Implemented | **MISSING** | Returns empty file | N/A |
| STATE_XLSX | Implemented | **MISSING** | Returns empty file | N/A |

*SUMMARY_PDF generates XLSX, not PDF

---

## Critical Issues

### Issue 1: Silent Empty Downloads
**Location:** `/src/lib/export-generator.ts:209-216`

```typescript
if (rows.length === 0) {
  // BUG: Returns 200 OK with empty buffer
  return {
    filename: `${filename}.${format}`,
    mimeType: format === 'csv' ? 'text/csv' : '...',
    data: Buffer.from(''),  // Empty file downloads silently
  }
}
```

**Impact:** Users click download, get empty file, no feedback.

### Issue 2: No Error Toast on Frontend
**Location:** `/src/app/(dashboard)/exports/page.tsx:50-73`

```typescript
const handleExport = async (type: string) => {
  // ...
  if (response.ok) {
    // Downloads file
  }
  // BUG: No 'else' branch - errors silently ignored
  // BUG: No check for empty file or error response
}
```

### Issue 3: Certificate ZIP Not Implemented
**Location:** `/src/app/api/exports/[type]/route.ts:104-108`

```typescript
case 'CERTIFICATE_ZIP':
  return NextResponse.json(
    { success: false, error: 'Certificate ZIP export not yet implemented' },
    { status: 501 }
  )
```

**Impact:** Button exists but returns 501, no user feedback.

### Issue 4: State Exports Not in UI
State-specific exports (STATE_CSV, STATE_XLSX) are implemented in backend but not wired in the exports page UI.

### Issue 5: Export History Static
Export history section always shows "No exports yet" without fetching from database.

---

## Required Fixes

### Backend Fix: Return 400 for Empty Data
```typescript
// In export-generator.ts, before generateFile call:
if (rows.length === 0) {
  throw new Error('NO_DATA')
}

// In exports/[type]/route.ts catch block:
if (error.message === 'NO_DATA') {
  return NextResponse.json(
    { success: false, error: 'No courses found to export' },
    { status: 400 }
  )
}
```

### Frontend Fix: Show Error Feedback
```typescript
const handleExport = async (type: string) => {
  setExporting(type)
  try {
    const response = await fetch(`/api/exports/${type.toLowerCase()}`, {
      method: "POST",
    })

    if (!response.ok) {
      // Parse error from JSON response
      const error = await response.json()
      throw new Error(error.error || 'Export failed')
    }

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      // API returned JSON error, not file
      const error = await response.json()
      throw new Error(error.error || 'Export failed')
    }

    const blob = await response.blob()
    if (blob.size === 0) {
      throw new Error('No courses to export. Upload some certificates first!')
    }
    // ... download logic
  } catch (error) {
    toast.error(error.message)
  } finally {
    setExporting(null)
  }
}
```

---

## Correct Response Headers

| Header | Expected Value |
|--------|----------------|
| Content-Type | `text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, or `application/zip` |
| Content-Disposition | `attachment; filename="cpe-courses-2026-01-05.csv"` |
| Cache-Control | `no-store` (exports should not be cached) |

---

## Production Checklist

- [ ] Add proper empty-data error handling
- [ ] Add toast notifications on frontend
- [ ] Implement CERTIFICATE_ZIP export
- [ ] Wire state-specific exports to UI
- [ ] Load export history from database
- [ ] Add progress indicator for large exports
