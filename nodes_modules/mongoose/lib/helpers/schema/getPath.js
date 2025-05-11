'use strict';

const numberRE = /^\d+$/;

/**
 * Behaves like `Schema#path()`, except for it also digs into arrays without
 * needing to put `.0.`, so `getPath(schema, 'docArr.elProp')` works.
 * @api private
 */

<<<<<<< HEAD
module.exports = function getPath(schema, path) {
=======
module.exports = function getPath(schema, path, discriminatorValueMap) {
>>>>>>> 127bd27cd43add8b39d9aa1596d4ec887b0914a8
  let schematype = schema.path(path);
  if (schematype != null) {
    return schematype;
  }
  const pieces = path.split('.');
  let cur = '';
  let isArray = false;

  for (const piece of pieces) {
    if (isArray && numberRE.test(piece)) {
      continue;
    }
    cur = cur.length === 0 ? piece : cur + '.' + piece;

    schematype = schema.path(cur);
    if (schematype != null && schematype.schema) {
      schema = schematype.schema;
<<<<<<< HEAD
      cur = '';
      if (!isArray && schematype.$isMongooseDocumentArray) {
        isArray = true;
      }
=======
      if (!isArray && schematype.$isMongooseDocumentArray) {
        isArray = true;
      }
      if (discriminatorValueMap && discriminatorValueMap[cur]) {
        schema = schema.discriminators[discriminatorValueMap[cur]] ?? schema;
      }
      cur = '';
>>>>>>> 127bd27cd43add8b39d9aa1596d4ec887b0914a8
    }
  }

  return schematype;
};
