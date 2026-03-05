# Story 1.6: Google OAuth Integration

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to log in using my Google account,
So that I can quickly access the marketplace without creating a separate password.

## Acceptance Criteria

**Given** I am on the login page
**When** I click "Login with Google" button
**Then** system redirects to /api/auth/google
**And** Google OAuth flow begins
**And** user selects Google account

**Given** Google authentication succeeds
**When** Google redirects to /api/auth/google/callback
**Then** backend verifies Google token
**And** system extracts email from Google profile

**Given** email already exists in database
**When** Google OAuth completes
**Then** system links Google account by setting google_id field
**And** system generates JWT token
**And** JWT payload includes: user_id, email, role
**And** JWT expiration is 24 hours
**And** system redirects to homepage with token

**Given** email does NOT exist in database
**When** Google OAuth completes
**Then** system creates new user account with:
- email from Google
- username from Google (or generated)
- google_id set
- password_hash remains null
**And** system generates JWT token
**And** system redirects to homepage with token

**Given** Google OAuth fails
**When** authentication error occurs
**Then** system returns error "GOOGLE_LOGIN_FAILED"
**And** user is redirected back to login page

## Tasks / Subtasks

- [x] Task 1: Install Google OAuth dependencies (AC: passport-google-oauth20 installed)
  - [x] Install passport-google-oauth20 package
  - [x] Install @types/passport-google-oauth20 for TypeScript support
  - [x] Verify @nestjs/passport and passport already installed (from Story 1.4)
  - [x] Update package.json and package-lock.json

- [x] Task 2: Configure Google OAuth environment variables (AC: OAuth credentials configured)
  - [x] Add GOOGLE_CLIENT_ID to .env and .env.example
  - [x] Add GOOGLE_CLIENT_SECRET to .env and .env.example
  - [x] Add GOOGLE_CALLBACK_URL to .env and .env.example (http://localhost:3000/api/auth/google/callback)
  - [x] Document Google Cloud Console setup requirements in README

- [x] Task 3: Create GoogleOAuthStrategy (AC: Passport strategy validates Google tokens)
  - [x] Create strategies/google-oauth.strategy.ts
  - [x] Extend PassportStrategy with 'google' identifier
  - [x] Configure clientID, clientSecret, callbackURL from environment
  - [x] Set scope to ['email', 'profile']
  - [x] Implement validate() method to extract user data from Google profile
  - [x] Return normalized user object: { googleId, email, name }

- [x] Task 4: Create GoogleOAuthGuard (AC: Guard protects OAuth routes)
  - [x] Create guards/google-oauth.guard.ts
  - [x] Extend AuthGuard('google') from @nestjs/passport
  - [x] Export guard for use in controller

- [x] Task 5: Implement AuthService.loginWithGoogle() method (AC: Account linking and creation logic)
  - [x] Accept Google profile data: { googleId, email, name }
  - [x] Check if user exists by email using UsersService.findByEmail()
  - [x] If user exists: Update google_id field to link accounts
  - [x] If user doesn't exist: Create new user with google_id, email, username from name
  - [x] Generate JWT token with 24h expiration (same as Story 1.4)
  - [x] Return access_token and user data
  - [x] Add audit logging for OAuth login attempts

- [x] Task 6: Create AuthController OAuth endpoints (AC: /api/auth/google routes)
  - [x] Add GET /api/auth/google endpoint with @UseGuards(GoogleOAuthGuard)
  - [x] Add GET /api/auth/google/callback endpoint with @UseGuards(GoogleOAuthGuard)
  - [x] Extract user from @Req() req.user (populated by Passport)
  - [x] Call AuthService.loginWithGoogle() with user data
  - [x] Redirect to frontend with token in query parameter or cookie
  - [x] Handle errors and redirect to login page with error message

- [x] Task 7: Update AuthModule configuration (AC: Google strategy registered)
  - [x] Add GoogleOAuthStrategy to providers array
  - [x] Ensure PassportModule is imported
  - [x] Verify JwtModule configuration supports OAuth flow
  - [x] Register GoogleOAuthGuard if needed

- [x] Task 8: Add comprehensive test suite (AC: 100% coverage)
  - [x] Test GoogleOAuthStrategy.validate() with mock Google profile
  - [x] Test AuthService.loginWithGoogle() for existing user (account linking)
  - [x] Test AuthService.loginWithGoogle() for new user (account creation)
  - [x] Test AuthController OAuth endpoints with mocked guards
  - [x] Test error handling for OAuth failures
  - [x] Test JWT token generation for OAuth users
  - [x] Minimum 15 new tests expected
  - [ ] Test AuthService.loginWithGoogle() for existing user (account linking)
  - [ ] Test AuthService.loginWithGoogle() for new user (account creation)
  - [ ] Test AuthController OAuth endpoints with mocked guards
  - [ ] Test error handling for OAuth failures
  - [ ] Test JWT token generation for OAuth users
  - [ ] Minimum 15 new tests expected


## Dev Notes

### Architecture Compliance Requirements

**NestJS Module Structure:**
- Create new GoogleOAuthStrategy in `backend/src/modules/auth/strategies/google-oauth.strategy.ts`
- Create new GoogleOAuthGuard in `backend/src/modules/auth/guards/google-oauth.guard.ts`
- Add new loginWithGoogle() method to existing AuthService
- Add OAuth endpoints to existing AuthController
- Follow established dependency injection patterns (UsersService, JwtService, ConfigService)
- Register strategy in AuthModule providers array

**Passport OAuth Integration:**
- Use passport-google-oauth20 library (industry standard for Google OAuth)
- Extend PassportStrategy with Strategy from passport-google-oauth20
- Strategy identifier: 'google' (used in AuthGuard)
- OAuth flow: GET /api/auth/google → Google login → GET /api/auth/google/callback
- User data populated in req.user by Passport middleware

**Database Integration:**
- User model already has google_id field (nullable, unique)
- Account linking: Update existing user's google_id when email matches
- New account: Create user with google_id, email, username, passwordHash=null
- Use Prisma's upsert or conditional create/update logic
- Maintain unique constraints on email and google_id

**Security Standards:**
- OAuth credentials stored in environment variables (never hardcoded)
- Use ConfigService to access GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
- JWT token generation identical to Story 1.4 (24h expiration, same payload)
- Validate Google profile data before account creation
- Log OAuth attempts with provider information

### Project Structure Notes

**New Files to Create:**
```
backend/src/modules/auth/
├── strategies/
│   ├── jwt.strategy.ts (existing)
│   └── google-oauth.strategy.ts (NEW - Google OAuth validation)
├── guards/
│   ├── jwt-auth.guard.ts (existing)
│   ├── local-auth.guard.ts (existing)
│   ├── roles.guard.ts (existing)
│   └── google-oauth.guard.ts (NEW - OAuth route protection)
├── auth.service.ts (MODIFY - add loginWithGoogle method)
├── auth.controller.ts (MODIFY - add OAuth endpoints)
└── auth.module.ts (MODIFY - register Google strategy)
```

**Test Files to Create/Modify:**
```
backend/src/modules/auth/
├── strategies/
│   └── google-oauth.strategy.spec.ts (NEW)
├── guards/
│   └── google-oauth.guard.spec.ts (NEW)
├── auth.service.spec.ts (MODIFY - add OAuth tests)
└── auth.controller.spec.ts (MODIFY - add OAuth endpoint tests)
```

**Key Dependencies to Install:**
- passport-google-oauth20: ^2.0.0 (Google OAuth strategy)
- @types/passport-google-oauth20: ^2.0.0 (TypeScript definitions)
- @nestjs/passport: ^10.0.3 (already installed)
- passport: ^0.7.0 (already installed)

### Technical Requirements

**GoogleOAuthStrategy Implementation:**
```typescript
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName } = profile;
    
    const user = {
      googleId: id,
      email: emails[0].value,
      name: displayName,
    };
    
    done(null, user);
  }
}
```

**AuthService.loginWithGoogle() Method:**
```typescript
async loginWithGoogle(googleUser: { googleId: string; email: string; name: string }) {
  // Check if user exists by email
  let user = await this.usersService.findByEmail(googleUser.email);

  if (user) {
    // Account linking: Update google_id if not already set
    if (!user.googleId) {
      user = await this.usersService.update(user.id, { googleId: googleUser.googleId });
      this.logger.log(`Linked Google account to existing user ${user.email}`);
    }
  } else {
    // Create new user with Google data
    user = await this.usersService.create({
      email: googleUser.email,
      username: googleUser.name || googleUser.email.split('@')[0], // Generate username from name or email
      googleId: googleUser.googleId,
      passwordHash: null, // OAuth users don't have passwords
    });
    this.logger.log(`Created new user via Google OAuth: ${user.email}`);
  }

  // Generate JWT token (same as Story 1.4)
  const payload = { email: user.email, sub: user.id, role: user.role };
  const access_token = this.jwtService.sign(payload, { expiresIn: '24h' });

  return {
    access_token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      balance: user.balance,
    },
  };
}
```

**AuthController OAuth Endpoints:**
```typescript
@Get('google')
@UseGuards(GoogleOAuthGuard)
async googleAuth(@Req() req) {
  // Guard redirects to Google login
}

@Get('google/callback')
@UseGuards(GoogleOAuthGuard)
async googleAuthRedirect(@Req() req, @Res() res: Response) {
  try {
    const result = await this.authService.loginWithGoogle(req.user);
    
    // Redirect to frontend with token
    // Option 1: Query parameter (simple but less secure)
    res.redirect(`${process.env.FRONTEND_URL}?token=${result.access_token}`);
    
    // Option 2: Set HTTP-only cookie (more secure)
    // res.cookie('access_token', result.access_token, { httpOnly: true, secure: true });
    // res.redirect(process.env.FRONTEND_URL);
  } catch (error) {
    this.logger.error(`Google OAuth failed: ${error.message}`);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=GOOGLE_LOGIN_FAILED`);
  }
}
```

**Environment Variables Required:**
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
FRONTEND_URL=http://localhost:3001
```

**Google Cloud Console Setup:**
1. Create project at https://console.cloud.google.com
2. Enable Google+ API and Google Identity API
3. Create OAuth 2.0 Client ID credentials
4. Add authorized redirect URI: http://localhost:3000/api/auth/google/callback
5. Copy Client ID and Client Secret to .env file

### Previous Story Intelligence

**From Story 1.4 (User Login with Email/Password):**
- JWT token generation pattern established: `this.jwtService.sign(payload, { expiresIn: '24h' })`
- JWT payload structure: `{ email, sub: user_id, role }`
- Response format: `{ access_token, user: { id, email, username, role, balance } }`
- IP-based audit logging pattern: `this.logger.log(\`Successful login for \${user.email} from \${remoteIp}\`)`
- Error handling: UnauthorizedException with 'INVALID_CREDENTIALS' message
- Test suite: 25 tests with 100% pass rate

**From Story 1.5 (Remember Login Feature):**
- JWT expiration can be conditional (24h default, 7d with rememberMe)
- For OAuth, use default 24h expiration (no rememberMe checkbox in OAuth flow)
- LoginDto pattern: optional fields with @IsOptional() decorator
- Test suite: 11 new tests added, maintaining 100% pass rate
- Backward compatibility critical: existing functionality must not break

**From Story 1.2 (User Registration):**
- UsersService.create() method available for new user creation
- ConflictException handling for duplicate email/username
- Username generation pattern if not provided
- passwordHash can be null for OAuth users (already supported)
- No auto-login after registration (but OAuth is different - auto-login expected)

**From Story 1.1 (Database Schema):**
- User model has google_id field (nullable, unique, indexed)
- passwordHash field is nullable (supports OAuth users without passwords)
- email field has unique constraint (prevents duplicate accounts)
- isActive field defaults to true for new users
- UserRole enum defaults to USER

**Key Implementation Patterns to Follow:**
```typescript
// Service Method Pattern (from Story 1.4)
async methodName(dto: SomeDto, remoteIp?: string) {
  // 1. Validate input
  // 2. Database operations
  // 3. Generate JWT token
  // 4. Audit logging
  // 5. Return standardized response
}

// JWT Generation Pattern (from Story 1.4 & 1.5)
const payload = { email: user.email, sub: user.id, role: user.role };
const access_token = this.jwtService.sign(payload, { expiresIn: '24h' });

// Error Handling Pattern (from Story 1.2 & 1.4)
try {
  // Business logic
} catch (error) {
  if (error instanceof SpecificException) {
    throw error; // Re-throw with original message
  }
  throw new GenericException('GENERIC_ERROR_MESSAGE');
}
```

**What's Different in OAuth Flow:**
- No password validation (Google handles authentication)
- User data comes from Google profile, not form input
- Account linking logic required (update google_id if email exists)
- Auto-login expected (unlike registration in Story 1.2)
- Redirect-based flow instead of JSON API response
- Guard-based authentication instead of DTO validation

### Library and Framework Requirements

**Passport Google OAuth20:**
- Package: passport-google-oauth20@^2.0.0
- Strategy class: Strategy from 'passport-google-oauth20'
- Profile interface: Profile type for Google user data
- Scope: ['email', 'profile'] for basic user information
- Callback signature: validate(accessToken, refreshToken, profile, done)

**NestJS Passport Integration:**
- Use @nestjs/passport PassportStrategy base class
- Strategy identifier: 'google' (used in AuthGuard)
- Guard: AuthGuard('google') protects OAuth routes
- User data automatically populated in req.user after successful authentication
- ConfigService for environment variable access

**JWT Token Generation:**
- Use existing JwtService from @nestjs/jwt (already configured)
- Same payload structure as Story 1.4: { email, sub: user_id, role }
- Default 24h expiration (OAuth users don't have rememberMe option)
- Token format: Bearer token in Authorization header

**Database Operations:**
- Use existing UsersService.findByEmail() for user lookup
- Use existing UsersService.create() for new user creation
- Add UsersService.update() method if not exists (for google_id linking)
- Prisma handles unique constraints on email and google_id automatically

### File Structure Requirements

**Files to Create:**
1. `backend/src/modules/auth/strategies/google-oauth.strategy.ts` - Google OAuth validation
2. `backend/src/modules/auth/strategies/google-oauth.strategy.spec.ts` - Strategy tests
3. `backend/src/modules/auth/guards/google-oauth.guard.ts` - OAuth route protection
4. `backend/src/modules/auth/guards/google-oauth.guard.spec.ts` - Guard tests

**Files to Modify:**
1. `backend/src/modules/auth/auth.service.ts` - Add loginWithGoogle() method
2. `backend/src/modules/auth/auth.service.spec.ts` - Add OAuth test cases
3. `backend/src/modules/auth/auth.controller.ts` - Add OAuth endpoints
4. `backend/src/modules/auth/auth.controller.spec.ts` - Add OAuth endpoint tests
5. `backend/src/modules/auth/auth.module.ts` - Register GoogleOAuthStrategy
6. `backend/src/modules/users/users.service.ts` - Add update() method if missing
7. `backend/package.json` - Add passport-google-oauth20 dependency
8. `backend/.env` - Add Google OAuth credentials
9. `backend/.env.example` - Document Google OAuth variables
10. `backend/README.md` - Add Google Cloud Console setup instructions

**Files to Reference (Do Not Modify):**
- `backend/src/modules/auth/strategies/jwt.strategy.ts` - JWT validation (works with OAuth tokens)
- `backend/prisma/schema.prisma` - User model with google_id field (already configured)
- `backend/src/modules/auth/auth.module.ts` - Module configuration pattern

### Testing Requirements

**Test Coverage Expectations:**
Based on previous stories (1.4: 25 tests, 1.5: 11 tests), create comprehensive test suite:

**GoogleOAuthStrategy Tests (5 tests):**
1. Strategy validates Google profile successfully
2. Strategy extracts email from profile.emails[0].value
3. Strategy extracts googleId from profile.id
4. Strategy extracts name from profile.displayName
5. Strategy returns normalized user object

**GoogleOAuthGuard Tests (2 tests):**
1. Guard extends AuthGuard('google')
2. Guard is injectable and usable in controllers

**AuthService.loginWithGoogle() Tests (8 tests):**
1. Existing user with email → links google_id and returns token
2. Existing user already has google_id → returns token without update
3. New user → creates account with google_id and returns token
4. Username generated from displayName if provided
5. Username generated from email if displayName missing
6. JWT token has correct payload: { email, sub, role }
7. JWT token has 24h expiration
8. Audit logging for OAuth login attempts

**AuthController OAuth Endpoints Tests (5 tests):**
1. GET /api/auth/google triggers Google OAuth flow
2. GET /api/auth/google/callback processes successful OAuth
3. Callback redirects to frontend with token
4. Callback handles OAuth failure and redirects with error
5. User data extracted from req.user correctly

**Minimum New Tests:** 20 tests (5 Strategy + 2 Guard + 8 Service + 5 Controller)
**Expected Total Tests:** 121 tests (101 existing + 20 new)
**Expected Pass Rate:** 100% (no failing tests allowed)

**Test Implementation Pattern:**
```typescript
// Example: Testing account linking for existing user
it('should link google_id to existing user when email matches', async () => {
  const googleUser = {
    googleId: 'google-123',
    email: 'existing@example.com',
    name: 'John Doe',
  };

  const existingUser = {
    id: 'user-123',
    email: 'existing@example.com',
    username: 'existinguser',
    googleId: null, // Not yet linked
    role: UserRole.USER,
    balance: 0,
  };

  jest.spyOn(usersService, 'findByEmail').mockResolvedValue(existingUser);
  jest.spyOn(usersService, 'update').mockResolvedValue({ ...existingUser, googleId: 'google-123' });

  const result = await service.loginWithGoogle(googleUser);

  expect(usersService.update).toHaveBeenCalledWith('user-123', { googleId: 'google-123' });
  expect(result.access_token).toBeDefined();
  expect(result.user.email).toBe('existing@example.com');
});
```

### References

**Epic Requirements:** [Source: docs/planning-artifacts/epics.md#Story-1.6]
- FR3: User can log in using Google OAuth
- FR8: System automatically links Google account to existing email-based account if email matches
- FR9: System creates new account for Google OAuth users if email doesn't exist
- FR14: System generates JWT token with user_id, email, and role in payload
- FR15: System sets JWT expiration to 24h for normal login
- NFR3: password_hash field is nullable (to support Google OAuth users)
- NFR4: google_id field is nullable (to support email/password users)

**Previous Story Context:** [Source: docs/implementation-artifacts/1-4-user-login-with-email-password.md, 1-5-remember-login-feature.md]
- JWT token generation pattern with JwtService.sign()
- JWT payload structure: { email, sub: user_id, role }
- Response format: { access_token, user: { id, email, username, role, balance } }
- Audit logging pattern with Logger service
- Test coverage standards: 100% pass rate required

**Database Schema:** [Source: backend/prisma/schema.prisma]
- User.googleId field: String? @unique (nullable, unique constraint, indexed)
- User.passwordHash field: String? (nullable for OAuth users)
- User.email field: String @unique (unique constraint for account linking)
- User.username field: String @unique @db.VarChar(20) (3-20 character constraint)

**Technical Documentation:** [Source: Web Research]
- NestJS Passport integration uses PassportStrategy base class
- Google OAuth strategy requires clientID, clientSecret, callbackURL configuration
- OAuth flow: Initial request → Google login → Callback with user data
- User data populated in req.user by Passport middleware
- Guard-based route protection with @UseGuards(GoogleOAuthGuard)

**Frontend Integration:** [Note: Story 1.8 scope]
- Frontend will add "Login with Google" button to login form
- Button triggers GET /api/auth/google endpoint
- After OAuth callback, frontend receives token via redirect
- Token storage and management handled by frontend
- Error handling for GOOGLE_LOGIN_FAILED message


## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None - implementation completed without issues

### Completion Notes List

✅ **Task 1: Install Google OAuth dependencies**
- Added passport-google-oauth20@^2.0.0 to dependencies
- Added @types/passport-google-oauth20@^2.0.0 to devDependencies
- Verified @nestjs/passport and passport already installed
- npm install completed successfully

✅ **Task 2: Configure Google OAuth environment variables**
- Added GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL to .env.example
- Added Google OAuth credentials to .env (user needs to update CLIENT_SECRET from downloaded JSON)
- Documented Google Cloud Console setup in README with step-by-step instructions

✅ **Task 3: Create GoogleOAuthStrategy**
- Implemented GoogleOAuthStrategy extending PassportStrategy with 'google' identifier
- Configured clientID, clientSecret, callbackURL from ConfigService
- Set scope to ['email', 'profile'] for basic user information
- Implemented validate() method extracting googleId, email, name from profile
- Added null safety for emails and displayName fields
- Created 6 comprehensive tests covering all validation scenarios
- All tests passing

✅ **Task 4: Create GoogleOAuthGuard**
- Implemented GoogleOAuthGuard extending AuthGuard('google')
- Guard protects OAuth routes and triggers Passport flow
- Created 2 tests verifying guard functionality
- All tests passing

✅ **Task 5: Implement AuthService.loginWithGoogle()**
- Implemented account linking logic: updates google_id if email exists
- Implemented new user creation: creates account with google_id, null passwordHash
- Username generation: uses displayName or email prefix
- JWT token generation: 24h expiration, same payload as Story 1.4
- Added audit logging for OAuth login attempts
- Added UsersService.update() method for account linking
- Created 8 comprehensive tests covering linking, creation, JWT generation
- All tests passing (34 total in auth.service.spec.ts)

✅ **Task 6: Create AuthController OAuth endpoints**
- Added GET /api/auth/google endpoint with GoogleOAuthGuard
- Added GET /api/auth/google/callback endpoint with GoogleOAuthGuard
- Implemented redirect to frontend with token in query parameter
- Error handling redirects to login page with GOOGLE_LOGIN_FAILED error
- Added Logger for OAuth error tracking
- Created 5 comprehensive tests covering OAuth flow and error handling
- All tests passing (18 total in auth.controller.spec.ts)

✅ **Task 7: Update AuthModule configuration**
- Added GoogleOAuthStrategy to providers array
- Imported GoogleOAuthStrategy in auth.module.ts
- PassportModule already imported and configured
- JwtModule configuration supports OAuth flow (no changes needed)

✅ **Task 8: Comprehensive test suite**
- Total new tests: 21 (6 Strategy + 2 Guard + 8 Service + 5 Controller)
- Total test count: 123 tests (102 existing + 21 new)
- 100% pass rate across all test suites
- Covers all acceptance criteria and edge cases

**Implementation Summary:**
- Complete Google OAuth integration with Passport
- Account linking for existing users (updates google_id)
- New user creation for OAuth-only accounts
- JWT token generation consistent with Story 1.4
- Comprehensive error handling and audit logging
- 21 new tests, 123 total tests, 100% pass rate
- No breaking changes, fully backward compatible

### File List

- backend/package.json (modified - added passport-google-oauth20 dependencies)
- backend/package-lock.json (modified - dependency lockfile updated)
- backend/.env.example (modified - added Google OAuth variables)
- backend/.env (modified - added Google OAuth credentials)
- backend/README.md (modified - added Google Cloud Console setup instructions)
- backend/src/modules/auth/strategies/google-oauth.strategy.ts (created)
- backend/src/modules/auth/strategies/google-oauth.strategy.spec.ts (created - 6 tests)
- backend/src/modules/auth/guards/google-oauth.guard.ts (created)
- backend/src/modules/auth/guards/google-oauth.guard.spec.ts (created - 2 tests)
- backend/src/modules/auth/auth.service.ts (modified - added loginWithGoogle method)
- backend/src/modules/auth/auth.service.spec.ts (modified - added 8 OAuth tests)
- backend/src/modules/auth/auth.controller.ts (modified - added OAuth endpoints)
- backend/src/modules/auth/auth.controller.spec.ts (modified - added 5 OAuth tests)
- backend/src/modules/auth/auth.module.ts (modified - registered GoogleOAuthStrategy)
- backend/src/modules/users/users.service.ts (modified - added update method)
- docs/implementation-artifacts/1-6-google-oauth-integration.md (modified - marked tasks complete)
- docs/implementation-artifacts/sprint-status.yaml (modified - status updates)

