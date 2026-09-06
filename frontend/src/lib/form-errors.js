/**
 * The backend reports validation problems as a list, because one request can
 * break several rules at once:
 *
 *   [
 *     { field: 'name',     message: 'Name must be at least 2 characters' },
 *     { field: 'password', message: 'Password must be at least 8 characters' }
 *   ]
 *
 * A form needs the opposite shape - it renders one field at a time and wants to
 * ask "is there a problem with THIS field?". So this turns the list into an
 * object keyed by field name:
 *
 *   {
 *     name: 'Name must be at least 2 characters',
 *     password: 'Password must be at least 8 characters'
 *   }
 *
 * A page can then simply read `fieldErrors.password`, which is `undefined`
 * when that field is fine.
 *
 * Pass it the error thrown by any api/ function. Errors that are not about a
 * specific field - a wrong password, a duplicate email - carry no list, so this
 * returns {} and the page shows its top-level message instead.
 */
export function toFieldErrors(error) {
  const problems = error?.fieldErrors ?? []

  return Object.fromEntries(problems.map((problem) => [problem.field, problem.message]))
}
