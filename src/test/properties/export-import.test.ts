import { describe, it, expect } from 'vitest';
import { ExportEngine, EXPORT_FORMATS, ExportData } from '../../services/exportEngine';
import { ImportEngine } from '../../services/importEngine';

// Property 27: Export Format Availability
describe('Property 27: Export Format Availability', () => {
  it('should provide all required export formats', () => {
    const requiredFormats = ['pdf', 'markdown', 'json', 'txt'];
    const availableFormats = EXPORT_FORMATS.map(f => f.id);
    
    requiredFormats.forEach(format => {
      expect(availableFormats).toContain(format);
    });
  });

  it('should have valid format configurations', () => {
    EXPORT_FORMATS.forEach(format => {
      expect(format.id).toBeTruthy();
      expect(format.name).toBeTruthy();
      expect(format.extension).toBeTruthy();
      expect(format.mimeType).toBeTruthy();
    });
  });
});

// Property 28: PDF Export Completeness
describe('Property 28: PDF Export Completeness', () => {
  const sampleData: ExportData = {
    id: 'test-1',
    title: 'Test Prompt',
    content: 'This is test content for PDF export.',
    tags: ['test', 'export'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    metadata: { version: 1 }
  };

  it('should export complete PDF with all data', () => {
    const blob = ExportEngine.exportToPDF(sampleData);
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/pdf');
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle empty content gracefully', () => {
    const emptyData = { ...sampleData, content: '' };
    const blob = ExportEngine.exportToPDF(emptyData);
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});

// Property 29: Markdown Export Format
describe('Property 29: Markdown Export Format', () => {
  const sampleData: ExportData = {
    id: 'test-1',
    title: 'Test Prompt',
    content: 'This is test content.',
    tags: ['test', 'markdown'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02')
  };

  it('should export valid Markdown with frontmatter', async () => {
    const blob = ExportEngine.exportToMarkdown(sampleData);
    const text = await blob.text();
    
    expect(text).toContain('# Test Prompt');
    expect(text).toContain('---');
    expect(text).toContain('title: "Test Prompt"');
    expect(text).toContain('tags: ["test", "markdown"]');
    expect(text).toContain('This is test content.');
  });

  it('should handle special characters in title', async () => {
    const specialData = { ...sampleData, title: 'Test: "Special" & <Characters>' };
    const blob = ExportEngine.exportToMarkdown(specialData);
    const text = await blob.text();
    
    expect(text).toContain('# Test: "Special" & <Characters>');
  });
});

// Property 30: JSON Export Round-Trip
describe('Property 30: JSON Export Round-Trip', () => {
  const sampleData: ExportData = {
    id: 'test-1',
    title: 'Test Prompt',
    content: 'This is test content.',
    tags: ['test', 'json'],
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-02T15:30:00Z'),
    metadata: { version: 1, author: 'test' }
  };

  it('should maintain data integrity in round-trip', async () => {
    // Export
    const exportBlob = ExportEngine.exportToJSON(sampleData);
    const exportedText = await exportBlob.text();
    
    // Import
    const importResult = ImportEngine.parseJSON(exportedText);
    
    expect(importResult.success).toBe(true);
    expect(importResult.data).toHaveLength(1);
    
    const imported = importResult.data![0];
    expect(imported.title).toBe(sampleData.title);
    expect(imported.content).toBe(sampleData.content);
    expect(imported.tags).toEqual(sampleData.tags);
    expect(new Date(imported.createdAt)).toEqual(sampleData.createdAt);
    expect(new Date(imported.updatedAt)).toEqual(sampleData.updatedAt);
  });

  it('should preserve metadata in round-trip', async () => {
    const exportBlob = ExportEngine.exportToJSON(sampleData);
    const exportedText = await exportBlob.text();
    const importResult = ImportEngine.parseJSON(exportedText);
    
    const imported = importResult.data![0];
    expect(imported.metadata).toEqual(sampleData.metadata);
  });
});

// Property 31: Bulk Export ZIP Creation
describe('Property 31: Bulk Export ZIP Creation', () => {
  const sampleItems: ExportData[] = [
    {
      id: 'test-1',
      title: 'First Prompt',
      content: 'First content',
      tags: ['test'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-2',
      title: 'Second Prompt',
      content: 'Second content',
      tags: ['test'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  it('should create ZIP archive for multiple items', async () => {
    const zipBlob = await ExportEngine.exportBulk(sampleItems, 'json');
    
    expect(zipBlob).toBeInstanceOf(Blob);
    expect(zipBlob.type).toContain('zip');
    expect(zipBlob.size).toBeGreaterThan(0);
  });

  it('should handle single item bulk export', async () => {
    const singleItem = [sampleItems[0]];
    const zipBlob = await ExportEngine.exportBulk(singleItem, 'markdown');
    
    expect(zipBlob).toBeInstanceOf(Blob);
    expect(zipBlob.size).toBeGreaterThan(0);
  });
});

// Property 32: Import Validation
describe('Property 32: Import Validation', () => {
  it('should validate required fields', () => {
    const invalidData = [
      { content: 'Missing title' },
      { title: '', content: 'Empty title' },
      { title: 'Valid', content: '' } // Empty content should be valid
    ];

    const result = ImportEngine.validateJSON(invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2); // First two should fail
  });

  it('should accept valid data', () => {
    const validData = [
      { title: 'Valid Prompt', content: 'Valid content' }
    ];

    const result = ImportEngine.validateJSON(validData);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// Property 33: Import Schema Validation
describe('Property 33: Import Schema Validation', () => {
  it('should validate data types', () => {
    const invalidTypes = [
      { title: 123, content: 'Invalid title type' },
      { title: 'Valid', content: null },
      { title: 'Valid', content: 'Valid', tags: 'should be array' }
    ];

    const result = ImportEngine.validateJSON(invalidTypes);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should accept optional fields', () => {
    const validWithOptional = {
      title: 'Test',
      content: 'Content',
      tags: ['tag1', 'tag2'],
      createdAt: '2024-01-01T00:00:00Z',
      metadata: { key: 'value' }
    };

    const result = ImportEngine.validateJSON([validWithOptional]);
    expect(result.valid).toBe(true);
  });
});

// Property 34: Import Conflict Resolution
describe('Property 34: Import Conflict Resolution', () => {
  const existingData = [
    { id: 'existing-1', title: 'Existing Prompt', content: 'Existing content' }
  ];

  const importData = [
    { id: 'import-1', title: 'Existing Prompt', content: 'New content' },
    { id: 'import-2', title: 'New Prompt', content: 'New content' }
  ];

  it('should detect title conflicts', () => {
    const conflicts = ImportEngine.detectConflicts(importData, existingData);
    expect(conflicts).toContain('import-1');
    expect(conflicts).not.toContain('import-2');
  });

  it('should resolve conflicts according to strategy', () => {
    const resolutions = new Map([
      ['import-1', { action: 'rename' as const, newTitle: 'Renamed Prompt' }]
    ]);

    const resolved = ImportEngine.resolveConflicts(importData, resolutions);
    expect(resolved).toHaveLength(2);
    expect(resolved[0].title).toBe('Renamed Prompt');
    expect(resolved[1].title).toBe('New Prompt');
  });

  it('should skip items when requested', () => {
    const resolutions = new Map([
      ['import-1', { action: 'skip' as const }]
    ]);

    const resolved = ImportEngine.resolveConflicts(importData, resolutions);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].title).toBe('New Prompt');
  });
});

// Property 35: Import Summary
describe('Property 35: Import Summary', () => {
  it('should generate accurate import summary', () => {
    const original = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
      { id: '3', title: 'Item 3' }
    ];

    const imported = [
      { id: '1', title: 'Item 1' },
      { id: '3', title: 'Item 3 Renamed' }
    ];

    const conflicts = ['2'];

    const summary = ImportEngine.generateSummary(original, imported, conflicts);

    expect(summary.total).toBe(3);
    expect(summary.imported).toBe(2);
    expect(summary.skipped).toBe(1);
    expect(summary.conflicts).toBe(1);
  });

  it('should handle empty imports', () => {
    const summary = ImportEngine.generateSummary([], [], []);

    expect(summary.total).toBe(0);
    expect(summary.imported).toBe(0);
    expect(summary.skipped).toBe(0);
    expect(summary.conflicts).toBe(0);
  });
});