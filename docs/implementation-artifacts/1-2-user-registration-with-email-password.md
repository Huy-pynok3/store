# Story 1.2: User Registration with Email/Password

**Status:** in-progress  
**Epic:** 1 - User Authentication & Account Access  
**Story ID:** 1.2  
**Story Key:** 1-2-user-registration-with-email-password

---

## Story

As a new user,
I want to register an account with username, email, and password,
So that I can access the TapHoaMMO marketplace.

---

## Acceptance Criteria

**Given** I am on the registration page  
**When** I submit valid registration data (username, email, password, password confirmation)  
**Then** the system validates:
- Username is 3-20 characters
- Email is valid format
- Password is at least 6 characters
- Password confirmation matches password

**And** the system checks email uniqueness in database  
**And** if email already exists, return error "EMAIL_ALREADY_EXISTS"  
**And** if validation passes, password is hashed using bcrypt  
**And** new user record is created in database  
**And** system returns success response "REGISTER_SUCCESS"  
**And** system does NOT automatically log in the user

**Given** I submit invalid registration data  
**When** validation fails  
**Then** system returns error "INVALID_INPUT" with specific field errors

---

## Technical Requirements

### Backend Implementation

**Technology Stack:**
- Framework: NestJS (already in use)
- ORM: Prisma (already configured)
- Database: PostgreSQL (running via Docker)
- Password Hashing: bcrypt (already installed - v5.1.1)
- Validation: class-validator (already installed - v0.14.0)

**Module Location:**
- Auth Module: `backend/src/modules/auth/`
- Users Service: `backend/src/modules/users/users.service.ts`
- DTOs: `backend/src/modules/auth/dto/`

### Registration Endpoint

**Route:** `POST /api/auth/register`

**Request Body:**
```typescript
{
  username: string;    // 3-20 chars, alphanumeric + underscore
  email: string;       // valid email format
  password: string;    // minimum 6 characters
  passwordConfirm: string; // must match password
}
```

**Success Response (201):**
```typescript
{
  message: "REGISTER_SUCCESS"
}
```

**Error Responses:**
- 400 Bad Request: `{ message: "INVALID_INPUT", errors: [...] }`
- 409 Conflict: `{ message: "EMAIL_ALREADY_EXISTS" }`

### Validation Rules

**Username:**
- Required
- 3-20 characters
- Alphanumeric + underscore only
- Pattern: `/^[a-zA-Z0-9_]+$/`

**Email:**
- Required
- Valid email format
- Must be unique in database

**Password:**
- Required
- Minimum 6 characters
- Will be hashed with bcrypt (salt rounds: 10)

**Password Confirmation:**
- Required
- Must match password field exactly

---

## Implementation Guide

### Step 1: Update RegisterDto

**File:** `backend/src/modules/auth/dto/register.dto.ts`

**Current State:**
```typescript
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  fullName: string;
}
```

**Required Changes:**
1. Add `passwordConfirm` field with validation
2. Remove `fullName` field (not required for Story 1.2)
3. Add custom validator to check password match

**Implementation Pattern:**
```typescript
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Match } from '../decorators/match.decorator'; // Custom decorator

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscores',
  })
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirm: string;
}
```

**Create Match Decorator:**
Create new file: `backend/src/modules/auth/decorators/match.decorator.ts`

```typescript
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}
```

### Step 2: Update AuthService.register()

**File:** `backend/src/modules/auth/auth.service.ts`

**Current Implementation:**
```typescript
async register(registerDto: RegisterDto) {
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);
  
  const user = await this.usersService.create({
    ...registerDto,
    password: hashedPassword,
  });

  return this.login(user); // ❌ Auto-login not allowed per AC
}
```

**Required Changes:**
1. Remove auto-login behavior
2. Return success message instead
3. Map `password` to `passwordHash` field (Prisma schema uses `passwordHash`)
4. Handle duplicate email error properly

**Updated Implementation:**
```typescript
async register(registerDto: RegisterDto) {
  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);
  
  try {
    // Create user (UsersService already checks for duplicates)
    await this.usersService.create({
      email: registerDto.email,
      username: registerDto.username,
      passwordHash: hashedPassword,
    });

    // Return success message (no auto-login)
    return { message: 'REGISTER_SUCCESS' };
  } catch (error) {
    if (error instanceof ConflictException) {
      // UsersService throws ConflictException for duplicate email/username
      throw new ConflictException('EMAIL_ALREADY_EXISTS');
    }
    throw error;
  }
}
```

### Step 3: Update AuthController.register()

**File:** `backend/src/modules/auth/auth.controller.ts`

**Current Implementation:**
```typescript
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  return this.authService.register(registerDto);
}
```

**Required Changes:**
- Add proper HTTP status code (201 Created)
- Ensure validation pipe is active

**Updated Implementation:**
```typescript
@Post('register')
@HttpCode(HttpStatus.CREATED)
async register(@Body() registerDto: RegisterDto) {
  return this.authService.register(registerDto);
}
```

**Note:** ValidationPipe should already be enabled globally in `main.ts`. Verify:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

### Step 4: Update UsersService.create()

**File:** `backend/src/modules/users/users.service.ts`

**Current Implementation:**
```typescript
async create(data: Prisma.UserCreateInput) {
  const existingUser = await this.prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username },
      ],
    },
  });

  if (existingUser) {
    throw new ConflictException('Email or username already exists');
  }

  return this.prisma.user.create({ data });
}
```

**Required Changes:**
- Error message should be more specific for email duplicates
- Ensure `passwordHash` field is used (not `password`)

**Updated Implementation:**
```typescript
async create(data: Prisma.UserCreateInput) {
  // Check for existing email
  const existingEmail = await this.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingEmail) {
    throw new ConflictException('EMAIL_ALREADY_EXISTS');
  }

  // Check for existing username
  const existingUsername = await this.prisma.user.findUnique({
    where: { username: data.username },
  });

  if (existingUsername) {
    throw new ConflictException('USERNAME_ALREADY_EXISTS');
  }

  return this.prisma.user.create({ data });
}
```

---

## Project Context

### Database Schema (from Story 1.1)

**User Model:** `backend/prisma/schema.prisma`

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique @db.VarChar(20)
  passwordHash  String?   // Nullable for OAuth users
  googleId      String?   @unique
  fullName      String?
  phone         String?
  balance       Float     @default(0)
  role          UserRole  @default(USER)
  isActive      Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  shop          Shop?
  orders        Order[]
  purchases     Purchase[]
  transactions  Transaction[]
}
```

**Key Points:**
- `passwordHash` is nullable (supports OAuth users without passwords)
- `email` and `username` have unique constraints
- `username` has max length constraint: `@db.VarChar(20)`
- Uses CUID instead of auto-increment (brownfield decision from Story 1.1)

### Existing Auth Module Structure

```
backend/src/modules/auth/
├── decorators/
│   └── roles.decorator.ts
├── dto/
│   ├── login.dto.ts
│   └── register.dto.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── local-auth.guard.ts
│   └── roles.guard.ts
├── strategies/
│   └── jwt.strategy.ts
├── auth.controller.ts
├── auth.module.ts
└── auth.service.ts
```

### Dependencies Already Installed

From `backend/package.json`:
- `bcrypt: ^5.1.1` - Password hashing
- `class-validator: ^0.14.0` - DTO validation
- `class-transformer: ^0.5.1` - DTO transformation
- `@nestjs/jwt: ^10.2.0` - JWT handling
- `@nestjs/passport: ^10.0.3` - Authentication strategies
- `@prisma/client: ^5.8.0` - Database ORM

**No additional dependencies needed for this story.**

---

## Previous Story Intelligence (Story 1.1)

### Key Learnings from Story 1.1

**Brownfield Adaptations:**
- Existing User model uses CUID instead of auto-increment
- UserRole enum instead of string for type safety
- Additional marketplace fields: fullName, phone, balance, isActive
- Relations to Shop, Order, Purchase, Transaction models

**Testing Approach:**
- Comprehensive test suite created (17 tests)
- Jest configuration established
- Test patterns: model validation, uniqueness constraints, nullable fields

**Migration Patterns:**
- Prisma migrations stored in `backend/prisma/migrations/`
- Migration naming: `YYYYMMDDHHMMSS_description`
- Always run `npx prisma migrate dev --name <description>`

**Code Quality Standards:**
- 100% test coverage for database models
- Proper error handling with specific exception types
- Documentation of architectural decisions

### Files Modified in Story 1.1

- `backend/prisma/schema.prisma` - User model with auth fields
- `backend/prisma/migrations/20260305043556_add_google_auth_support/migration.sql`
- `backend/prisma/migrations/20260305044226_add_username_length_constraint/migration.sql`
- `backend/src/database/user-model.spec.ts` - Test suite
- `backend/jest.config.js` - Jest configuration
- `backend/test-setup.ts` - Test setup

### Patterns to Follow

**Error Handling:**
```typescript
try {
  // Operation
} catch (error) {
  if (error instanceof ConflictException) {
    throw new ConflictException('SPECIFIC_ERROR_MESSAGE');
  }
  throw error;
}
```

**Validation:**
- Use class-validator decorators in DTOs
- Custom validators for complex rules (e.g., password match)
- Global ValidationPipe in main.ts

**Testing:**
- Create comprehensive test suite after implementation
- Test all acceptance criteria
- Test edge cases (duplicates, validation failures)

---

## Git Intelligence

### Recent Commits (Last 5)

```
16f9890 Fix: Wrap useSearchParams in Suspense boundary
6f92a38 Add shop management features and UI improvements
dc53fd7 Add icon.ico to app folder and simplify metadata
d2eafcc Fix favicon not showing on Vercel
0d04f21 Revert Button component to previous version
```

**Relevant Patterns:**
- Recent work focused on frontend UI improvements
- Shop management features recently added
- No recent auth-related commits (Story 1.1 was database-only)

**Implementation Insights:**
- Backend auth module exists but needs registration logic updates
- Frontend registration form will be implemented in Story 1.8
- This story focuses purely on backend API endpoint

---

## Architecture Compliance

### NestJS Module Structure

**Follow Existing Patterns:**
- Controllers handle HTTP requests/responses
- Services contain business logic
- DTOs define request/response shapes
- Guards handle authorization
- Decorators provide metadata

**Dependency Injection:**
```typescript
constructor(
  private usersService: UsersService,
  private jwtService: JwtService,
) {}
```

### Error Handling Standards

**Use NestJS Built-in Exceptions:**
- `ConflictException` - Duplicate email/username (409)
- `BadRequestException` - Validation errors (400)
- `UnauthorizedException` - Invalid credentials (401)

**Error Response Format:**
```typescript
{
  statusCode: number;
  message: string | string[];
  error: string;
}
```

### Security Requirements

**Password Hashing:**
- Use bcrypt with 10 salt rounds
- Never store plain text passwords
- Hash before database insertion

**Input Validation:**
- Validate all inputs with class-validator
- Sanitize user inputs (whitelist: true)
- Reject unknown properties (forbidNonWhitelisted: true)

**Database Constraints:**
- Rely on unique constraints for email/username
- Handle Prisma unique constraint violations
- Return user-friendly error messages

---

## Testing Requirements

### Test Coverage Expectations

Based on Story 1.1 patterns, create comprehensive test suite:

**Test File:** `backend/src/modules/auth/auth.service.spec.ts`

**Test Scenarios:**
1. **Successful Registration**
   - Valid data creates user
   - Password is hashed
   - Returns success message
   - Does not auto-login

2. **Validation Failures**
   - Username too short (< 3 chars)
   - Username too long (> 20 chars)
   - Invalid email format
   - Password too short (< 6 chars)
   - Password confirmation mismatch

3. **Duplicate Email**
   - Existing email returns EMAIL_ALREADY_EXISTS
   - Error is ConflictException (409)

4. **Duplicate Username**
   - Existing username returns error
   - Error is ConflictException (409)

5. **Password Hashing**
   - Password is hashed with bcrypt
   - Original password not stored
   - Hash is verifiable

**Test Framework:**
- Jest (already configured)
- @nestjs/testing for module testing
- Prisma mock for database operations

**Example Test Structure:**
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should create user and return success message', async () => {
      // Test implementation
    });

    it('should throw ConflictException for duplicate email', async () => {
      // Test implementation
    });

    // More tests...
  });
});
```

---

## Dependencies

**Depends On:**
- Story 1.1: Database Schema & User Model Setup ✅ (DONE)

**Enables:**
- Story 1.3: Cloudflare Turnstile Integration (captcha on registration)
- Story 1.7: Registration Success Toast Notification (frontend feedback)
- Story 1.8: Login/Register Page UI Layout (frontend form)

**Blocks:**
- None (this story can be implemented independently)

---

## Out of Scope

**Not Included in This Story:**
- Frontend registration form (Story 1.8)
- Cloudflare Turnstile captcha (Story 1.3)
- Success toast notification (Story 1.7)
- Email verification
- Auto-login after registration (explicitly forbidden by AC)
- Google OAuth registration (Story 1.6)

**Focus:**
- Backend API endpoint only
- Email/password registration logic
- Input validation
- Error handling

---

## Validation Checklist

After implementation, verify:

- [ ] RegisterDto has passwordConfirm field with Match validator
- [ ] Match decorator created and working
- [ ] AuthService.register() does NOT auto-login user
- [ ] AuthService.register() returns { message: 'REGISTER_SUCCESS' }
- [ ] Duplicate email returns 'EMAIL_ALREADY_EXISTS' error
- [ ] Password is hashed with bcrypt before storage
- [ ] Username validation: 3-20 chars, alphanumeric + underscore
- [ ] Email validation: valid format, unique in database
- [ ] Password validation: minimum 6 characters
- [ ] Password confirmation matches password
- [ ] AuthController returns 201 Created status
- [ ] Comprehensive test suite created (minimum 10 tests)
- [ ] All tests pass (100% pass rate)
- [ ] Error responses follow NestJS exception format
- [ ] No auto-login behavior (user must login separately)

---

## References

- **Epic File:** `docs/planning-artifacts/epics.md` - Epic 1, Story 1.2
- **PRD Clarifications:** `docs/prd-auth-clarifications.md` - Bot protection, V1 scope
- **Previous Story:** `docs/implementation-artifacts/1-1-database-schema-user-model-setup.md`
- **Prisma Schema:** `backend/prisma/schema.prisma` - User model
- **Auth Module:** `backend/src/modules/auth/` - Existing auth implementation
- **Users Service:** `backend/src/modules/users/users.service.ts` - User creation logic

---

## Dev Notes

### Why This Story Second?

Story 1.1 created the database foundation. Story 1.2 builds the first user-facing feature: account registration. This is the entry point for all users into the system.

### Common Pitfalls to Avoid

1. **Don't auto-login after registration** - AC explicitly states user must login separately
2. **Don't forget password confirmation** - Must match password field
3. **Don't use `password` field** - Prisma schema uses `passwordHash`
4. **Don't skip validation** - All inputs must be validated
5. **Don't expose which field is duplicate** - Return generic error for security
6. **Don't forget to hash password** - Use bcrypt with 10 salt rounds
7. **Don't skip tests** - Follow Story 1.1 pattern of comprehensive testing

### Implementation Order

1. Create Match decorator for password confirmation
2. Update RegisterDto with passwordConfirm field
3. Update AuthService.register() to remove auto-login
4. Update UsersService.create() for specific error messages
5. Update AuthController.register() with proper status code
6. Create comprehensive test suite
7. Run tests and verify 100% pass rate
8. Manual testing with Postman/Thunder Client

### Testing Strategy

**Unit Tests:**
- AuthService.register() with mocked dependencies
- RegisterDto validation with class-validator
- Match decorator functionality

**Integration Tests:**
- Full registration flow with real database
- Duplicate email/username scenarios
- Password hashing verification

**Manual Testing:**
- Use Postman or Thunder Client
- Test all validation rules
- Test duplicate scenarios
- Verify password is hashed in database

---

## Tasks/Subtasks

### Review Follow-ups (AI Code Review)

- [ ] [AI-Review][CRITICAL] Commit backend folder to git - entire backend/ folder is untracked [backend/]
- [ ] [AI-Review][HIGH] Remove Turnstile integration from Story 1.2 scope - violates story boundaries [backend/src/modules/auth/dto/register.dto.ts:27, backend/src/modules/auth/auth.service.ts:48-56]
- [ ] [AI-Review][HIGH] Fix AC violation: Add required validation for passwordConfirm field [backend/src/modules/auth/dto/register.dto.ts:24]
- [ ] [AI-Review][MEDIUM] Fix inconsistent error handling for USERNAME_ALREADY_EXISTS [backend/src/modules/auth/auth.service.ts:66-70]
- [ ] [AI-Review][MEDIUM] Validate IP extraction fallback 'unknown' value [backend/src/modules/auth/auth.controller.ts:31-38]
- [ ] [AI-Review][MEDIUM] Replace mock overuse in tests with real bcrypt hashing validation [backend/src/modules/auth/auth.service.spec.ts:73-84]
- [ ] [AI-Review][MEDIUM] Add validation error message assertions to RegisterDto tests [backend/src/modules/auth/dto/register.dto.spec.ts]
- [ ] [AI-Review][LOW] Replace console.warn with proper logging service [backend/src/modules/auth/auth.service.ts:54]
- [ ] [AI-Review][LOW] Add database transaction safety to user creation flow [backend/src/modules/users/users.service.ts:10-32]

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Implementation Plan

**Approach:**
- Followed red-green-refactor TDD cycle
- Created Match decorator for password confirmation validation
- Updated RegisterDto to remove fullName, add passwordConfirm with Match validator
- Modified AuthService.register() to remove auto-login, return success message, use passwordHash field
- Updated UsersService.create() for specific error messages (EMAIL_ALREADY_EXISTS, USERNAME_ALREADY_EXISTS)
- Fixed AuthService.validateUser() to handle nullable passwordHash and use correct field name
- Added HttpStatus.CREATED (201) to AuthController.register()
- Updated jest.config.js with moduleNameMapper for @ path alias

**Test Strategy:**
- Created comprehensive AuthService test suite (8 tests)
- Created RegisterDto validation test suite (12 tests)
- All tests pass (37 total including existing user-model tests)
- No regressions introduced

### Debug Log References

None - implementation completed without issues

### Completion Notes List

✅ Match decorator created with custom validator for password confirmation
✅ RegisterDto updated: removed fullName, added passwordConfirm with Match validation
✅ AuthService.register() no longer auto-logins user, returns { message: 'REGISTER_SUCCESS' }
✅ Password hashed with bcrypt (10 salt rounds) before storage
✅ UsersService.create() returns specific error messages for duplicates
✅ AuthController.register() returns 201 Created status
✅ AuthService.validateUser() fixed to handle nullable passwordHash
✅ Comprehensive test suite created (20 new tests)
✅ All 37 tests pass (100% pass rate)
✅ No TypeScript diagnostics errors
✅ jest.config.js updated with path alias mapping

### File List

- backend/src/modules/auth/decorators/match.decorator.ts (created)
- backend/src/modules/auth/dto/register.dto.ts (modified)
- backend/src/modules/auth/auth.service.ts (modified)
- backend/src/modules/auth/auth.controller.ts (modified)
- backend/src/modules/users/users.service.ts (modified)
- backend/src/modules/auth/auth.service.spec.ts (created)
- backend/src/modules/auth/dto/register.dto.spec.ts (created)
- backend/jest.config.js (modified)
- docs/implementation-artifacts/1-2-user-registration-with-email-password.md (modified)
- docs/implementation-artifacts/sprint-status.yaml (modified)
