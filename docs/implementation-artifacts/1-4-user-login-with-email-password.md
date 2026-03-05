# Story 1.4: User Login with Email/Password

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a registered user,
I want to log in with my email and password,
So that I can access my account and use the marketplace.

## Acceptance Criteria

**Given** I am on the login page
**When** I submit valid email and password
**Then** system validates email and password are provided
**And** system looks up user by email
**And** if user not found, return error "INVALID_CREDENTIALS"
**And** system verifies password using bcrypt compare
**And** if password incorrect, return error "INVALID_CREDENTIALS"
**And** if credentials valid, system generates JWT token
**And** JWT payload includes: user_id, email, role
**And** JWT expiration is set to 24 hours (default)
**And** system returns access_token in response
**And** frontend stores token
**And** frontend redirects user to homepage

**Given** I submit invalid credentials
**When** email or password is incorrect
**Then** system returns "INVALID_CREDENTIALS" error
**And** system does NOT reveal whether email or password was wrong

## Tasks / Subtasks

- [x] Task 1: Create LoginDto with validation (AC: email and password required)
  - [x] Add email field with @IsEmail() validation
  - [x] Add password field with @IsString() validation
  - [x] Add optional turnstileToken field for failed attempt protection
- [x] Task 2: Implement AuthService.login() method (AC: credential validation and JWT generation)
  - [x] Validate user exists by email lookup
  - [x] Verify password using bcrypt.compare()
  - [x] Generate JWT with user_id, email, role payload
  - [x] Set 24h expiration (default) or 7d if remember me
  - [x] Return access_token and user data
- [x] Task 3: Create AuthController.login() endpoint (AC: POST /api/auth/login)
  - [x] Handle POST /api/auth/login route
  - [x] Extract IP address for audit logging
  - [x] Call AuthService.login() with credentials
  - [x] Return standardized response format
- [x] Task 4: Add comprehensive test suite (AC: 100% coverage)
  - [x] Test successful login with valid credentials
  - [x] Test invalid email returns INVALID_CREDENTIALS
  - [x] Test invalid password returns INVALID_CREDENTIALS
  - [x] Test inactive user account handling
  - [x] Test JWT token generation and payload
  - [x] Test password verification with bcrypt

## Dev Notes

### Architecture Compliance Requirements

**NestJS Module Structure:**
- Follow existing auth module patterns from Stories 1.2 and 1.3
- Use dependency injection for UsersService and JwtService
- Implement proper error handling with NestJS exceptions
- Use class-validator for DTO validation

**Database Integration:**
- Use Prisma ORM with existing User model
- Leverage unique email constraint for user lookup
- Handle nullable passwordHash for OAuth users
- Check isActive status before allowing login

**Security Standards:**
- Use bcrypt.compare() for password verification (never manual comparison)
- Generate JWT with secure payload: { email, sub: user_id, role }
- Set appropriate token expiration (24h default)
- Never reveal whether email or password was incorrect
- Log authentication attempts with IP addresses

### Project Structure Notes

**Existing Auth Module Structure:**
```
backend/src/modules/auth/
├── decorators/
│   ├── roles.decorator.ts
│   └── match.decorator.ts
├── dto/
│   ├── login.dto.ts (needs implementation)
│   └── register.dto.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── local-auth.guard.ts
│   └── roles.guard.ts
├── services/
│   └── turnstile.service.ts
├── strategies/
│   └── jwt.strategy.ts
├── auth.controller.ts
├── auth.module.ts
└── auth.service.ts
```

**Key Dependencies Already Available:**
- bcrypt: ^5.1.1 (password hashing/verification)
- @nestjs/jwt: ^10.2.0 (JWT token generation)
- @nestjs/passport: ^10.0.3 (authentication strategies)
- class-validator: ^0.14.0 (DTO validation)
- Prisma Client (database ORM)

### Technical Requirements

**LoginDto Specification:**
```typescript
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;

  @IsString()
  @IsOptional()
  turnstileToken?: string; // For failed attempt protection
}
```

**JWT Token Configuration:**
- Secret: From JWT_SECRET environment variable
- Algorithm: HS256 (default)
- Payload: { email: string, sub: string, role: UserRole }
- Expiration: '24h' (default) or '7d' (remember me - Story 1.5)
- Header: Authorization: Bearer <token>

**Error Response Format:**
```typescript
// Success Response (200)
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

// Error Response (401)
{
  statusCode: 401;
  message: "INVALID_CREDENTIALS";
  error: "Unauthorized";
}
```

### Previous Story Intelligence

**From Story 1.1 (Database Schema):**
- User model uses CUID for primary keys (not auto-increment)
- passwordHash field is nullable (supports OAuth users)
- isActive field controls account status
- UserRole enum provides type safety
- Comprehensive test coverage required (17 tests, 100% pass rate)

**From Story 1.2 (Registration):**
- AuthService patterns established
- bcrypt hashing with 10 salt rounds
- ConflictException handling for duplicates
- Custom validators with class-validator
- IP address extraction in controllers
- No auto-login behavior (explicit requirement)

**From Story 1.3 (Turnstile Integration):**
- TurnstileService available for bot protection
- IP address extraction via getClientIp() method
- Environment variable management with ConfigService
- Optional turnstileToken field in DTOs
- Comprehensive error handling and logging

**Established Patterns to Follow:**
```typescript
// Service Method Pattern
async methodName(dto: SomeDto, remoteIp?: string) {
  try {
    // Business logic
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof SpecificException) {
      throw error; // Re-throw with original message
    }
    throw new GenericException('GENERIC_ERROR_MESSAGE');
  }
}

// Controller Pattern
@Post('endpoint')
async methodName(@Body() dto: SomeDto, @Req() req: Request) {
  const remoteIp = this.getClientIp(req);
  return this.service.methodName(dto, remoteIp);
}

// Test Pattern
describe('ServiceName', () => {
  // Comprehensive test coverage
  // Mock external dependencies
  // Test all acceptance criteria
  // Test edge cases and error scenarios
});
```

### Library and Framework Requirements

**JWT Implementation:**
- Use @nestjs/jwt JwtService for token generation
- Configure in AuthModule with JWT_SECRET from environment
- Follow existing JWT strategy pattern in jwt.strategy.ts
- Token format: Bearer token in Authorization header

**Password Verification:**
- Use bcrypt.compare(plainPassword, hashedPassword)
- Never use manual string comparison
- Handle null passwordHash gracefully (OAuth users)
- Log failed attempts for security monitoring

**Database Queries:**
- Use UsersService.findByEmail() for user lookup
- Leverage Prisma's unique constraint on email field
- Include all necessary user fields in response
- Exclude sensitive fields (passwordHash, twoFactorSecret)

**Validation Framework:**
- Use class-validator decorators in LoginDto
- @IsEmail() for email format validation
- @IsString() with @MinLength(1) for password
- Global ValidationPipe already configured in main.ts

### File Structure Requirements

**Files to Create/Modify:**
1. `backend/src/modules/auth/dto/login.dto.ts` - Login request validation
2. `backend/src/modules/auth/auth.service.ts` - Add login() method
3. `backend/src/modules/auth/auth.controller.ts` - Add login endpoint
4. `backend/src/modules/auth/auth.service.spec.ts` - Update test suite
5. `backend/src/modules/auth/dto/login.dto.spec.ts` - New test suite

**Files to Reference (Do Not Modify):**
- `backend/src/modules/auth/strategies/jwt.strategy.ts` - JWT configuration
- `backend/src/modules/users/users.service.ts` - User lookup methods
- `backend/prisma/schema.prisma` - User model structure
- `backend/.env` - JWT_SECRET configuration

### Testing Requirements

**Test Coverage Expectations:**
Based on previous stories (1.1: 17 tests, 1.2: 20 tests, 1.3: 32 tests), create comprehensive test suite:

**AuthService.login() Tests:**
1. Successful login with valid credentials
2. User not found returns INVALID_CREDENTIALS
3. Invalid password returns INVALID_CREDENTIALS
4. Inactive user account returns INVALID_CREDENTIALS
5. OAuth user (null passwordHash) returns INVALID_CREDENTIALS
6. JWT token generation with correct payload
7. JWT token expiration set to 24h
8. User data returned excludes sensitive fields

**LoginDto Validation Tests:**
1. Valid email and password passes validation
2. Invalid email format fails validation
3. Empty email fails validation
4. Empty password fails validation
5. Optional turnstileToken field works

**AuthController.login() Tests:**
1. Successful login returns 200 with access_token
2. Invalid credentials return 401 with INVALID_CREDENTIALS
3. IP address extraction works correctly
4. Request/response format validation

**Minimum Test Count:** 15 tests (following established patterns)
**Expected Pass Rate:** 100% (no failing tests allowed)

### References

**Epic Requirements:** [Source: docs/planning-artifacts/epics.md#Story-1.4]
- FR2: User can log in with email and password
- FR7: System validates login inputs (email and password required)
- FR13: After successful login, system redirects user to homepage
- FR14: System generates JWT token with user_id, email, and role in payload
- FR15: System sets JWT expiration to 24h for normal login

**Previous Story Context:** [Source: docs/implementation-artifacts/1-1-database-schema-user-model-setup.md, 1-2-user-registration-with-email-password.md, 1-3-cloudflare-turnstile-integration.md]
- Database schema with User model (CUID, nullable passwordHash, isActive)
- Authentication patterns (bcrypt, JWT, error handling)
- Turnstile integration for bot protection
- Testing standards and coverage expectations

**Architecture Patterns:** [Source: backend/src/modules/auth/]
- NestJS module structure with controllers, services, DTOs
- Dependency injection with UsersService, JwtService, TurnstileService
- JWT strategy configuration and token validation
- Error handling with specific exception types

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4

### Debug Log References

None - implementation completed without issues

### Completion Notes List

✅ **Task 1: LoginDto with validation**
- Created LoginDto with @IsEmail(), @IsString(), @MinLength(1) validation
- Added optional turnstileToken field for failed attempt protection
- Comprehensive test suite (10 tests) covering all validation scenarios

✅ **Task 2: AuthService.login() method**
- Implemented credential validation with user lookup by email
- Added bcrypt.compare() for secure password verification
- JWT generation with payload: { email, sub: user_id, role }
- 24h token expiration explicitly configured
- Optional Turnstile verification for failed attempt protection
- Proper error handling with INVALID_CREDENTIALS for all failure cases
- IP-based audit logging for all login attempts
- Comprehensive test suite (11 tests) covering all acceptance criteria

✅ **Task 3: AuthController.login() endpoint**
- Created POST /api/auth/login endpoint
- IP address extraction for audit logging (Cloudflare, proxy, direct)
- Integration with AuthService.login() method with IP parameter
- Standardized response format with access_token and user data
- Comprehensive test suite (4 tests) covering endpoint functionality

✅ **Task 4: Comprehensive test coverage**
- Total: 25 new tests (10 DTO + 11 Service + 4 Controller)
- 100% pass rate across all test suites (91 total tests)
- Covers all acceptance criteria and edge cases
- Follows established testing patterns from previous stories

**Implementation Approach:**
- Followed red-green-refactor TDD cycle for all tasks
- Used existing architectural patterns from Stories 1.2 and 1.3
- Maintained consistency with established error handling and security standards
- All tests written first, then implementation to make them pass

**Code Review Fixes Applied:**
- Fixed IP address extraction - now passed to service for audit logging
- Added Turnstile verification for failed attempt protection
- Explicitly set JWT expiration to 24h (AC requirement)
- Removed unused test variables (usersService, turnstileService, authService)
- Added comprehensive JSDoc documentation for login method
- Enhanced test coverage for IP logging and Turnstile verification
- Added 3 additional tests for Turnstile integration (total 25 tests)

### File List

- backend/src/modules/auth/dto/login.dto.ts (created)
- backend/src/modules/auth/dto/login.dto.spec.ts (created)
- backend/src/modules/auth/auth.service.ts (modified - added login method)
- backend/src/modules/auth/auth.service.spec.ts (modified - added login tests)
- backend/src/modules/auth/auth.controller.ts (modified - updated login endpoint)
- backend/src/modules/auth/auth.controller.spec.ts (modified - updated login tests)
- docs/implementation-artifacts/1-4-user-login-with-email-password.md (modified)
- docs/implementation-artifacts/sprint-status.yaml (modified)
