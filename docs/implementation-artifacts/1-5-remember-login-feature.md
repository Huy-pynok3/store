# Story 1.5: Remember Login Feature

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to enable "Remember Login" when logging in,
So that I can stay logged in for an extended period without re-authenticating frequently.

## Acceptance Criteria

**Given** I am on the login page
**When** I check the "Remember Login" checkbox
**And** I submit valid credentials
**Then** system generates JWT token with 7-day expiration (instead of 24 hours)
**And** JWT payload includes: user_id, email, role
**And** system returns access_token with extended expiration
**And** frontend stores token
**And** user remains authenticated for 7 days

**Given** I do NOT check "Remember Login"
**When** I log in successfully
**Then** JWT expiration is 24 hours (default)

## Tasks / Subtasks

- [x] Task 1: Add rememberMe field to LoginDto (AC: Optional boolean field for remember login checkbox)
  - [x] Add @IsBoolean() @IsOptional() rememberMe field to LoginDto
  - [x] Update LoginDto tests to validate rememberMe field
  - [x] Ensure backward compatibility (defaults to false if not provided)

- [x] Task 2: Update AuthService.login() to handle rememberMe logic (AC: JWT expiration based on rememberMe flag)
  - [x] Modify login() method to accept rememberMe parameter
  - [x] Implement conditional JWT expiration: '7d' if rememberMe=true, '24h' if false
  - [x] Ensure JWT payload remains consistent: { email, sub: user_id, role }
  - [x] Update existing tests to cover both 24h and 7d expiration scenarios
  - [x] Add new tests for rememberMe=true and rememberMe=false cases

- [x] Task 3: Update AuthController.login() to pass rememberMe flag (AC: Controller passes rememberMe to service)
  - [x] Extract rememberMe from LoginDto in controller
  - [x] Pass rememberMe parameter to AuthService.login()
  - [x] Update controller tests to verify rememberMe handling
  - [x] Ensure response format remains unchanged

- [x] Task 4: Frontend integration preparation (AC: Document frontend requirements)
  - [x] Document checkbox implementation requirements for frontend
  - [x] Specify API contract: POST /api/auth/login with rememberMe boolean
  - [x] Document token storage expectations (localStorage/sessionStorage)
  - [x] Note: Frontend implementation is Story 1.8 scope


## Dev Notes

### Architecture Compliance Requirements

**NestJS Module Structure:**
- Modify existing LoginDto in `backend/src/modules/auth/dto/login.dto.ts`
- Update existing AuthService.login() method in `backend/src/modules/auth/auth.service.ts`
- No new files required - this is an enhancement to Story 1.4 implementation
- Follow established dependency injection patterns (UsersService, JwtService)
- Maintain existing error handling with NestJS exceptions

**JWT Token Configuration:**
- Use conditional expiration based on rememberMe flag
- Default expiration: '24h' (when rememberMe is false or undefined)
- Extended expiration: '7d' (when rememberMe is true)
- JWT payload remains unchanged: { email, sub: user_id, role }
- Token generation: `this.jwtService.sign(payload, { expiresIn: rememberMe ? '7d' : '24h' })`

**Security Standards:**
- No additional security risks introduced (same JWT mechanism)
- Extended session duration is user-controlled via checkbox
- Token validation remains identical regardless of expiration time
- Existing JWT strategy in jwt.strategy.ts handles both token types
- No changes needed to authentication guards or middleware

### Project Structure Notes

**Existing Auth Module Structure:**
```
backend/src/modules/auth/
├── dto/
│   ├── login.dto.ts (MODIFY - add rememberMe field)
│   └── login.dto.spec.ts (MODIFY - add rememberMe tests)
├── auth.service.ts (MODIFY - update login method)
├── auth.service.spec.ts (MODIFY - add rememberMe test cases)
├── auth.controller.ts (MODIFY - pass rememberMe to service)
└── auth.controller.spec.ts (MODIFY - update controller tests)
```

**No New Files Required:**
- This story enhances existing login functionality from Story 1.4
- All modifications are to existing files
- No database schema changes needed
- No new dependencies required

**Key Dependencies Already Available:**
- @nestjs/jwt: ^10.2.0 (supports expiresIn option)
- class-validator: ^0.14.0 (for @IsBoolean validation)
- All testing frameworks already configured

### Technical Requirements

**LoginDto Modification:**
```typescript
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;

  @IsString()
  @IsOptional()
  turnstileToken?: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean; // NEW FIELD - defaults to false if not provided
}
```

**AuthService.login() Modification:**
```typescript
async login(loginDto: LoginDto, remoteIp?: string) {
  // ... existing validation logic (unchanged) ...

  // Generate JWT token with conditional expiration
  const payload = { email: user.email, sub: user.id, role: user.role };
  const expiresIn = loginDto.rememberMe ? '7d' : '24h'; // MODIFIED LINE
  const access_token = this.jwtService.sign(payload, { expiresIn }); // MODIFIED LINE

  // ... existing return logic (unchanged) ...
}
```

**Current Implementation (Story 1.4):**
```typescript
// Line 96 in auth.service.ts - NEEDS MODIFICATION
const access_token = this.jwtService.sign(payload, { expiresIn: '24h' });
```

**Modified Implementation (Story 1.5):**
```typescript
// Use conditional expiration based on rememberMe flag
const expiresIn = loginDto.rememberMe ? '7d' : '24h';
const access_token = this.jwtService.sign(payload, { expiresIn });
```

**API Contract:**
```typescript
// Request (POST /api/auth/login)
{
  email: string;
  password: string;
  turnstileToken?: string;
  rememberMe?: boolean; // NEW - optional, defaults to false
}

// Response (200 OK) - UNCHANGED
{
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: UserRole;
    balance: number;
  }
}

// Error Response (401) - UNCHANGED
{
  statusCode: 401;
  message: "INVALID_CREDENTIALS";
  error: "Unauthorized";
}
```

### Previous Story Intelligence

**From Story 1.4 (User Login with Email/Password):**
- LoginDto already exists with email, password, turnstileToken fields
- AuthService.login() method fully implemented with:
  - User lookup by email
  - Password verification with bcrypt
  - JWT token generation with 24h expiration (hardcoded)
  - IP-based audit logging
  - Turnstile verification for failed attempts
  - Comprehensive error handling
- Test suite: 25 tests (10 DTO + 11 Service + 4 Controller)
- 100% pass rate established

**Key Implementation Pattern from Story 1.4:**
```typescript
// Current login method structure (lines 62-105 in auth.service.ts)
async login(loginDto: LoginDto, remoteIp?: string) {
  // 1. Turnstile verification (if token provided)
  // 2. User lookup by email
  // 3. Password hash validation
  // 4. Password verification with bcrypt
  // 5. Account active status check
  // 6. JWT token generation with 24h expiration ← MODIFY THIS
  // 7. Audit logging
  // 8. Return access_token and user data
}
```

**What Changes in Story 1.5:**
- Add rememberMe field to LoginDto (optional boolean)
- Change JWT expiration from hardcoded '24h' to conditional logic
- Add test cases for both 24h and 7d expiration scenarios
- All other logic remains identical

**What Stays the Same:**
- User validation logic (email, password, active status)
- Password verification with bcrypt
- JWT payload structure
- Error handling and messages
- Audit logging
- Response format
- Turnstile integration

### Library and Framework Requirements

**JWT Implementation:**
- Use existing @nestjs/jwt JwtService
- JwtService.sign() supports expiresIn option: `{ expiresIn: '24h' | '7d' }`
- No configuration changes needed in AuthModule
- JWT_SECRET from environment remains unchanged
- Token format: Bearer token in Authorization header (unchanged)

**Validation Framework:**
- Add @IsBoolean() decorator for rememberMe field
- Use @IsOptional() to make field optional (defaults to undefined)
- class-validator already configured globally in main.ts
- No new validation dependencies required

**Testing Framework:**
- Use existing Jest test infrastructure
- Mock JwtService.sign() to verify expiresIn parameter
- Test both rememberMe=true and rememberMe=false scenarios
- Maintain 100% test pass rate

### File Structure Requirements

**Files to Modify:**
1. `backend/src/modules/auth/dto/login.dto.ts` - Add rememberMe field
2. `backend/src/modules/auth/dto/login.dto.spec.ts` - Add rememberMe validation tests
3. `backend/src/modules/auth/auth.service.ts` - Update login() method (line 96)
4. `backend/src/modules/auth/auth.service.spec.ts` - Add rememberMe test cases
5. `backend/src/modules/auth/auth.controller.ts` - No changes needed (DTO auto-binds)
6. `backend/src/modules/auth/auth.controller.spec.ts` - Add rememberMe integration tests

**Files to Reference (Do Not Modify):**
- `backend/src/modules/auth/strategies/jwt.strategy.ts` - JWT validation (works with any expiration)
- `backend/src/modules/users/users.service.ts` - User lookup (unchanged)
- `backend/prisma/schema.prisma` - No database changes needed
- `backend/.env` - JWT_SECRET configuration (unchanged)

### Testing Requirements

**Test Coverage Expectations:**
Based on Story 1.4 (25 tests), add approximately 8-10 new tests:

**LoginDto Validation Tests (add 3 tests):**
1. Valid rememberMe=true passes validation
2. Valid rememberMe=false passes validation
3. Missing rememberMe field passes validation (optional)
4. Invalid rememberMe type (string) fails validation

**AuthService.login() Tests (add 4 tests):**
1. rememberMe=true generates JWT with 7d expiration
2. rememberMe=false generates JWT with 24h expiration
3. rememberMe=undefined defaults to 24h expiration
4. JWT payload remains consistent regardless of rememberMe value
5. Verify JwtService.sign() called with correct expiresIn parameter

**AuthController.login() Tests (add 2 tests):**
1. POST /api/auth/login with rememberMe=true returns valid token
2. POST /api/auth/login with rememberMe=false returns valid token

**Minimum New Tests:** 8 tests
**Expected Total Tests:** 33 tests (25 existing + 8 new)
**Expected Pass Rate:** 100% (no failing tests allowed)

**Test Implementation Pattern:**
```typescript
// Example: Testing JWT expiration with rememberMe
it('should generate JWT with 7d expiration when rememberMe is true', async () => {
  const loginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
    rememberMe: true,
  };

  const result = await service.login(loginDto);

  expect(jwtService.sign).toHaveBeenCalledWith(
    expect.any(Object),
    { expiresIn: '7d' }
  );
  expect(result.access_token).toBeDefined();
});
```

### References

**Epic Requirements:** [Source: docs/planning-artifacts/epics.md#Story-1.5]
- FR4: User can enable "Remember Login" to extend session duration from 24h to 7 days
- FR15: System sets JWT expiration to 24h for normal login, 7d for "remember me" login

**Previous Story Context:** [Source: docs/implementation-artifacts/1-4-user-login-with-email-password.md]
- LoginDto structure with email, password, turnstileToken fields
- AuthService.login() method with JWT generation at line 96
- Test suite patterns and coverage expectations (25 tests, 100% pass rate)
- Error handling patterns and audit logging

**Technical Documentation:** [Source: backend/src/modules/auth/auth.service.ts]
- Current JWT generation: `this.jwtService.sign(payload, { expiresIn: '24h' })` at line 96
- JWT payload structure: `{ email, sub: user_id, role }`
- Existing validation and error handling logic

**Frontend Integration:** [Note: Story 1.8 scope]
- Frontend will add "Remember Login" checkbox to login form
- Checkbox value sent as rememberMe boolean in login request
- Token storage and management handled by frontend
- No backend changes needed for frontend integration


## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None - implementation completed without issues

### Completion Notes List

✅ **Task 1: LoginDto rememberMe field**
- Added @IsBoolean() @IsOptional() rememberMe field to LoginDto
- Added IsBoolean import to class-validator imports
- Created 4 comprehensive validation tests
- All tests passing, backward compatible (optional field)

✅ **Task 2: AuthService.login() rememberMe logic**
- Modified JWT generation to use conditional expiration
- Changed from hardcoded '24h' to: `loginDto.rememberMe ? '7d' : '24h'`
- JWT payload structure unchanged: { email, sub: user_id, role }
- Added 5 comprehensive tests covering all scenarios
- All existing tests continue to pass (no regressions)

✅ **Task 3: AuthController integration**
- Controller automatically passes rememberMe via LoginDto (no code changes needed)
- Added 2 integration tests verifying rememberMe=true and rememberMe=false
- Response format unchanged
- IP address extraction continues to work correctly

✅ **Task 4: Frontend integration documentation**
- API contract documented in Dev Notes section
- Frontend requirements specified (Story 1.8 scope)
- Token storage expectations noted

**Implementation Summary:**
- Simple, focused enhancement to existing login flow
- 11 new tests added (4 DTO + 5 Service + 2 Controller)
- Total test count: 101 tests, 100% pass rate
- No breaking changes, fully backward compatible
- JWT expiration now user-controlled: 24h default, 7d with rememberMe

### File List

- backend/src/modules/auth/dto/login.dto.ts (modified - added rememberMe field)
- backend/src/modules/auth/dto/login.dto.spec.ts (modified - added 4 tests)
- backend/src/modules/auth/auth.service.ts (modified - conditional JWT expiration)
- backend/src/modules/auth/auth.service.spec.ts (modified - added 5 tests)
- backend/src/modules/auth/auth.controller.spec.ts (modified - added 2 tests)
- docs/implementation-artifacts/1-5-remember-login-feature.md (modified - marked tasks complete)
- docs/implementation-artifacts/sprint-status.yaml (modified - status updates)
