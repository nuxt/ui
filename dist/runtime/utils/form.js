export function isSuperStructSchema(schema) {
  return "schema" in schema && typeof schema.coercer === "function" && typeof schema.validator === "function" && typeof schema.refiner === "function";
}
export function isStandardSchema(schema) {
  return "~standard" in schema;
}
export async function validateStandardSchema(state, schema) {
  const result = await schema["~standard"].validate(state);
  if (result.issues) {
    return {
      errors: result.issues?.map((issue) => ({
        name: issue.path?.map((item) => typeof item === "object" ? item.key : item).join(".") || "",
        message: issue.message
      })) || [],
      result: null
    };
  }
  return {
    errors: null,
    result: result.value
  };
}
async function validateSuperstructSchema(state, schema) {
  const [err, result] = schema.validate(state);
  if (err) {
    const errors = err.failures().map((error) => ({
      message: error.message,
      name: error.path.join(".")
    }));
    return {
      errors,
      result: null
    };
  }
  return {
    errors: null,
    result
  };
}
export function validateSchema(state, schema) {
  if (isStandardSchema(schema)) {
    return validateStandardSchema(state, schema);
  } else if (isSuperStructSchema(schema)) {
    return validateSuperstructSchema(state, schema);
  } else {
    throw new Error("Form validation failed: Unsupported form schema");
  }
}
export function getAtPath(data, path) {
  if (!path) return data;
  const value = path.split(".").reduce(
    (value2, key) => value2?.[key],
    data
  );
  return value;
}
export function setAtPath(data, path, value) {
  if (!path) return Object.assign(data, value);
  if (!data) return data;
  const keys = path.split(".");
  let current = data;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === void 0 || current[key] === null) {
      if (i + 1 < keys.length && !Number.isNaN(Number(keys[i + 1]))) {
        current[key] = [];
      } else {
        current[key] = {};
      }
    }
    current = current[key];
  }
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  return data;
}
