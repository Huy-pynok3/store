# Story 1.8: Login/Register Page UI Layout

**Status:** completed  
**Epic:** 1 - User Authentication & Account Access  
**Story ID:** 1.8  
**Story Key:** 1-8-login-register-page-ui-layout

---

## Story

As a user,
I want to see a split-panel login/register page with functional forms,
So that I can easily choose between logging in or creating a new account.

---

## Acceptance Criteria

### AC1: Page Layout Structure

**Given** I navigate to the login/register page (`/dang-ky`)
**When** page loads
**Then** page displays split layout with two panels:

**Left Panel (Login):**
- Title: "Đăng nhập"
- Email input field
- Password input field
- "Quên mật khẩu" link
- "Ghi nhớ đăng nhập" checkbox
- "Đăng nhập" button
- "Login with Google" button

**Right Panel (Register):**
- Title: "Đăng ký"
- Warning message about Captcha bypass programs
- Username input field
- Email input field
- Password input field
- Confirm Password input field
- "Đồng ý điều khoản" checkbox
- "Đăng ký" button

### AC2: Login Form Functionality

**Given** I am on the login/register page
**When** I fill in valid email and password in the login form
**And** I click "Đăng nhập"
**Then** system validates the inputs
**And** system makes API call to `/auth/login`
**And** on success, stores JWT token
**And** redirects to homepage

**Given** I check "Ghi nhớ đăng nhập"
**When** I submit login form
**Then** system requests extended JWT expiration (7 days)

**Given** I enter invalid credentials
**When** I submit login form
**Then** system displays error message using SweetAlert2
**And** form remains on page for retry

### AC3: Registration Form Functionality

**Given** registration form is already functional (from Story 1.7)
**Then** registration form continues to work as specified
**And** displays success toast on completion
**And** redirects to login page after success

### AC4: Responsive Design

**Given** I view the page on desktop (≥1024px)
**When** page loads
**Then** login and register panels display side-by-side

**Given** I view the page on tablet/mobile (<1024px)
**When** page loads
**Then** panels stack vertically
**And** login panel appears first (top)
**And** register panel appears second (bottom)

### AC5: Form Validation & Feedback

**Given** I interact with any form field
**When** I enter invalid data
**Then** field shows validation error
**And** submit button remains enabled (validation on submit)

**Given** I submit a form with empty required fields
**When** form is submitted
**Then** system displays appropriate error message
**And** highlights invalid fields

### AC6: Google OAuth Button

**Given** I click "Login with Google" button
**When** button is clicked
**Then** system redirects to Google OAuth flow
**And** handles OAuth callback appropriately

---

## Current State Analysis

### Already Implemented ✅
- Split layout structure (left: login, right: register)
- Registration form with full functionality
- Registration form validation
- Registration success toast
- Responsive grid layout
- Proper styling and spacing
- Registration form state management

### Needs Implementation 🔨
- Login form state management
- Login form submit handler
- Login API integration
- Login error handling with SweetAlert2
- "Remember me" checkbox functionality
- Google OAuth button functionality
- Login success redirect
- Form validation feedback
- Loading states for login form

---

## Implementation Tasks

### Task 1: Add Login Form State Management
- [x] Create state for login form (email, password, rememberMe)
- [x] Create handleLoginInputChange function
- [x] Add isLoginSubmitting state
- [x] Bind login form inputs to state

### Task 2: Implement Login Form Validation
- [x] Validate email format
- [x] Validate password is not empty
- [x] Show validation errors using SweetAlert2

### Task 3: Implement Login API Integration
- [x] Create handleLoginSubmit function
- [x] Make POST request to `/auth/login`
- [x] Include rememberMe flag in request
- [x] Handle response data

### Task 4: Add Login Success Handling
- [x] Store JWT token in localStorage or cookies
- [x] Redirect to homepage on success
- [x] Show success feedback (optional)

### Task 5: Add Login Error Handling
- [x] Display error toast for invalid credentials
- [x] Display error toast for network errors
- [x] Show appropriate error messages

### Task 6: Implement Remember Me Functionality
- [x] Bind checkbox to rememberMe state
- [x] Send rememberMe flag to backend
- [x] Backend returns JWT with appropriate expiration

### Task 7: Add Google OAuth Integration
- [x] Implement Google OAuth button click handler
- [x] Redirect to `/api/auth/google` endpoint
- [x] Handle OAuth callback (if needed on frontend)

### Task 8: Add Loading States
- [x] Disable login button while submitting
- [x] Show loading text "Đang đăng nhập..."
- [x] Add disabled styles

### Task 9: Improve UX
- [x] Add smooth transitions
- [x] Ensure proper focus management
- [x] Test responsive behavior
- [x] Verify accessibility

### Task 10: Testing & Validation
- [x] Test login with valid credentials
- [x] Test login with invalid credentials
- [x] Test remember me functionality
- [x] Test Google OAuth flow
- [x] Test responsive layout on mobile
- [x] Test form validation
- [x] Test error handling

---

## Technical Notes

### API Endpoints
- `POST /auth/login` - Login with email/password
  - Request: `{ email, password, rememberMe }`
  - Response: `{ access_token, user }`
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback handler

### Token Storage
- Consider using httpOnly cookies for better security
- Or localStorage with proper XSS protection
- Token should be included in Authorization header for API requests

### Remember Me Implementation
- Backend should check `rememberMe` flag
- Set JWT expiration to 7 days if true, 24 hours if false

---

## Dependencies

- Story 1.4 (User Login with Email/Password) - Backend API must be implemented
- Story 1.5 (Remember Login Feature) - Backend support for extended JWT
- Story 1.6 (Google OAuth Integration) - Backend OAuth endpoints must exist
- Story 1.7 (Registration Success Toast) - Already completed ✅

---

## Dev Agent Record

### Implementation Summary
Implemented complete login form functionality on the split-panel login/register page with full state management, API integration, and error handling.

### Changes Made
1. **frontend/app/dang-ky/page.tsx**
   - Added login form state management (email, password, rememberMe)
   - Implemented handleLoginInputChange for form input handling
   - Created handleLoginSubmit with full validation and API integration
   - Added handleGoogleLogin for OAuth redirect
   - Integrated SweetAlert2 for success/error notifications
   - Added loading states with "Đang đăng nhập..." text
   - Implemented token storage in localStorage
   - Added redirect to homepage on successful login
   - Bound all login form inputs to state with proper event handlers
   - Added disabled states during submission

### Technical Decisions
- Used localStorage for JWT token storage (access_token and isLoggedIn flag)
- Implemented rememberMe flag to be sent to backend for extended JWT expiration
- Used SweetAlert2 for consistent notification experience across login and registration
- Added optional success toast with 1.5s timer for better UX
- Google OAuth redirects to backend endpoint which handles the OAuth flow
- Maintained existing registration form functionality without changes
- Used same styling patterns as registration form for consistency

### API Integration
- Login endpoint: `POST /auth/login`
- Request payload: `{ email, password, rememberMe }`
- Expected response: `{ access_token, user }`
- Google OAuth: Redirects to `/auth/google` endpoint

### Testing Notes
- Form validation works for empty email/password
- Loading state prevents double submission
- Remember me checkbox properly bound to state
- Google OAuth button redirects to correct endpoint
- Error messages display appropriately for invalid credentials
- Success flow stores token and redirects to homepage
- Responsive layout maintained (split on desktop, stacked on mobile)

---

## File List

### Modified Files
- `frontend/app/dang-ky/page.tsx` - Added complete login form functionality with state management, API integration, and error handling

---

## Definition of Done

- [x] Login form has full state management
- [x] Login form validates inputs
- [x] Login form makes API call to backend
- [x] Login success stores token and redirects to homepage
- [x] Login errors display appropriate messages
- [x] Remember me checkbox works correctly
- [x] Google OAuth button initiates OAuth flow
- [x] Layout is responsive on mobile and desktop
- [x] All forms have proper validation feedback
- [x] Loading states prevent double submission
- [x] No TypeScript errors
- [x] Code follows project conventions

---

## Acceptance Criteria Verification

✅ **AC1**: Page layout structure with split panels (already existed, maintained)  
✅ **AC2**: Login form functionality with validation, API call, token storage, and redirect  
✅ **AC3**: Registration form functionality continues to work (unchanged)  
✅ **AC4**: Responsive design works on desktop and mobile  
✅ **AC5**: Form validation and feedback with SweetAlert2  
✅ **AC6**: Google OAuth button redirects to OAuth flow

---

## Definition of Done

- [ ] Login form has full state management
- [ ] Login form validates inputs
- [ ] Login form makes API call to backend
- [ ] Login success stores token and redirects to homepage
- [ ] Login errors display appropriate messages
- [ ] Remember me checkbox works correctly
- [ ] Google OAuth button initiates OAuth flow
- [ ] Layout is responsive on mobile and desktop
- [ ] All forms have proper validation feedback
- [ ] Loading states prevent double submission
- [ ] No TypeScript errors
- [ ] Code follows project conventions
