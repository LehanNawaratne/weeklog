export function toFieldErrors(error) {
  const problems = error?.fieldErrors ?? []

  return Object.fromEntries(problems.map((problem) => [problem.field, problem.message]))
}
