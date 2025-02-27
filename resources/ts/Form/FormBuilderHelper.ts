import { createContext, useContext } from 'react';

export interface FileFormState {
  files: File[];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormContext = createContext<any>(undefined);
export const useFormContext = () => useContext(FormContext);

// export const createDefaultAttributeValues = (
//   schema: JSONSchema7Definition,
//   path: string,
//   current: Partial<Asset['attributes']> | Partial<Job['attributes']>
// ) => {
//   if (typeof schema === 'boolean') throw Error('Invalid attributes schema');
//   const propertyKey = path.split('.').pop();
//   if (!propertyKey) return;
//   switch (schema.type) {
//     case 'object':
//       if (!schema.properties) throw Error(`Invalid object type at ${path}`);
//       return Object.keys(schema.properties).map((property) => {
//         if (!schema.properties) throw Error(`Invalid object type at ${path}`); // TS can't infer defined from outside the function annoyingly
//         createDefaultAttributeValues(
//           schema.properties[property],
//           `${path}.${property}`,
//           current
//         );
//       });
//     case 'array':
//       if (!Array.isArray(schema.items))
//         throw Error(`Unsupported array type at ${path}`);
//       return schema.items.map((item, index) => {
//         createDefaultAttributeValues(item, `${path}.${index}`, {});
//       });
//     case 'string':
//     case 'number':
//     case 'integer':
//       current[propertyKey] = schema.default ?? '';
//       break;
//     case 'boolean':
//       current[propertyKey] = schema.default ?? false;
//       break;
//     default:
//       current[propertyKey] = schema.default ?? '';
//   }
// };
