import clone from 'clone';

export const normalizeJson = (payload: any, method: string) => {
  const normalizedPayload = clone(payload);

  Object.entries(normalizedPayload).forEach(([key, value]) => {
    if (value instanceof Date) {
      normalizedPayload[key] = new Date(value).toISOString();
    }
    if (value === '') {
      switch (method) {
        case 'POST':
          normalizedPayload[key] = undefined;
          break;
        case 'PATCH':
        case 'PUT':
          normalizedPayload[key] = null;
          break;
      }
    } else if (typeof value === 'object' && value !== null) {
      normalizedPayload[key] = normalizeJson(value, method);
    } else if (typeof value === 'string') {
      normalizedPayload[key] = value.trim();
    }
  });

  return normalizedPayload;
};
