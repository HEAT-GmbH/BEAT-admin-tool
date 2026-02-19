import * as z from "zod";

/**
 * Get the full name of a person
 * @param firstName - The first name
 * @param middleName - The middle name
 * @param lastName - The last name
 * @returns The full name
 */
export function fullName(firstName: string, middleName: string | null, lastName: string) {
  return `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;
}

/**
 * Get the initials of a person
 * @param firstName - The first name
 * @param middleName - The middle name
 * @param lastName - The last name
 * @returns The initials
 */
export function initials(firstName: string, middleName: string | null, lastName: string) {
  return `${firstName.charAt(0)}${middleName ? middleName.charAt(0) : ""}${lastName.charAt(0)}`;
}

/**
 * Delay for a given number of milliseconds
 * @param ms - The number of milliseconds to delay
 * @returns A promise that resolves after the delay
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a date is valid
 * @param date - The date to check
 * @returns True if the date is valid, false otherwise
 */
export function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

function unwrap(schema: z.ZodTypeAny): z.ZodTypeAny {
  while (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable ||
    schema instanceof z.ZodDefault ||
    schema instanceof z.ZodCatch
  ) {
    schema = schema.def.innerType as any;
  }
  return schema;
}

function getSchemaForPath(
  schema: z.ZodTypeAny,
  path: string[]
): z.ZodTypeAny | undefined {
  let current = schema;

  for (const key of path) {
    // Unwrap optional | nullable repeatedly
    while (
      current instanceof z.ZodOptional ||
      current instanceof z.ZodNullable
    ) {
      current = current.def.innerType as any;
    }

    if (current instanceof z.ZodObject) {
      const shape = current.shape;
      const next = shape[key];
      if (!next) return undefined;
      current = next;
      continue;
    }

    if (current instanceof z.ZodArray) {
      current = current.def.type as any;
      continue;
    }

    return undefined;
  }

  return current;
}

function isOptionalDeep(schema: z.ZodTypeAny): boolean {
  if (schema instanceof z.ZodOptional) return true;

  if (schema instanceof z.ZodUnion) {
    return schema.options.some((opt) => opt instanceof z.ZodOptional);
  }

  return false;
}

/**
 * Check if a field is required in a Zod schema
 * @param schema - The Zod schema
 * @param fieldName - The field name to check
 * @returns True if the field is required, false otherwise
 */
export function isFieldRequired(
  schema: z.ZodTypeAny,
  fieldPath: string
): boolean {
  const pathParts = fieldPath.split(".");
  const fieldSchema = getSchemaForPath(schema, pathParts);
  if (!fieldSchema) return false;

  return !isOptionalDeep(fieldSchema);
}

/**
 * Get the file name from a path
 * @param str - The path to get the file name from
 * @returns The file name
 */
export function fileNameFromPath(str: string){
  return str.split(/[\/\\]/).pop();
}

export function fileSizeUnit(size: number): string{
  switch (true) {
    case size < 1024:
      return (size / 1024).toFixed(2) + "KB"
    default:
      return (size / (1024 * 1024)).toFixed(2) + "MB"
  }
}
