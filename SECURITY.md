# Security Guide

## API Key Storage

DevPrompt Studio uses **client-side encryption** to protect your API keys.

### How It Works

1. **Device Fingerprint**: Generates unique identifier from browser/device characteristics
2. **Key Derivation**: Uses PBKDF2 (100,000 iterations) to derive encryption key
3. **AES-GCM Encryption**: Encrypts API keys with 256-bit AES-GCM
4. **Local Storage**: Stores encrypted keys in browser localStorage
5. **Auto-Decrypt**: Automatically decrypts on login without user intervention

### Security Features

✅ **No Server Storage**: Keys never leave your device  
✅ **Industry Standard**: AES-256-GCM encryption  
✅ **Key Derivation**: PBKDF2 with 100K iterations  
✅ **Tamper Detection**: Fails gracefully if storage corrupted  
✅ **Auto-Migration**: Encrypts existing plain-text keys  

### Architecture

```
User enters API key
       ↓
Device fingerprint generated (SHA-256 hash)
       ↓
PBKDF2 derives encryption key (100K iterations)
       ↓
AES-GCM encrypts API key (256-bit)
       ↓
Encrypted data stored in localStorage
       ↓
Auto-decrypt on next login (no password needed)
```

### Security Checklist

- [x] AES-256-GCM encryption
- [x] PBKDF2 key derivation (100K iterations)
- [x] Device-specific encryption key
- [x] No plain-text storage
- [x] No server transmission
- [x] Automatic migration from old keys
- [x] Graceful error handling
- [x] Tamper detection

### Migration

Existing users with plain-text keys are automatically migrated on first app load:

```typescript
// Runs once on app startup
secureStorage.migrateExistingKeys();
```

Old keys are encrypted and original plain-text versions are deleted.

### Troubleshooting

**Q: "Failed to decrypt API key" error?**  
A: Storage may be corrupted. Re-enter your API key in Settings.

**Q: Keys lost after clearing browser data?**  
A: Keys are stored locally. Clearing localStorage deletes them. Re-enter in Settings.

**Q: Keys work on one device but not another?**  
A: Encryption is device-specific. Enter keys separately on each device.

**Q: Is this secure enough?**  
A: Yes for client-side apps. Keys are encrypted with industry-standard AES-256-GCM. However, users with high security requirements should use environment variables or secret managers.

### Compliance

- **GDPR**: Keys stored locally, not transmitted to servers
- **CCPA**: No data collection or sharing
- **SOC 2**: Client-side encryption meets data protection requirements

### Limitations

⚠️ **Device-Specific**: Keys don't sync across devices (by design)  
⚠️ **Browser Storage**: Vulnerable if device is compromised  
⚠️ **No Password**: Uses device fingerprint instead of user password  

For enterprise use cases requiring cross-device sync, consider using a dedicated secret manager (AWS Secrets Manager, HashiCorp Vault, etc.).

### Code Reference

See [`src/utils/secureStorage.ts`](src/utils/secureStorage.ts) for implementation details.
