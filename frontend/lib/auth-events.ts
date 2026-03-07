export const AUTH_STATE_CHANGE_EVENT = 'auth-state-change'

export function dispatchAuthStateChange() {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT))
}
