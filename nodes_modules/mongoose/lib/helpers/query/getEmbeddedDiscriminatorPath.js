'use strict';

const cleanPositionalOperators = require('../schema/cleanPositionalOperators');
const get = require('../get');
const getDiscriminatorByValue = require('../discriminator/getDiscriminatorByValue');
const updatedPathsByArrayFilter = require('../update/updatedPathsByArrayFilter');

/**
 * Like `schema.path()`, except with a document, because impossible to
 * determine path type without knowing the embedded discriminator key.
 * @param {Schema} schema
 * @param {Object} [update]
 * @param {Object} [filter]
 * @param {String} path
 * @param {Object} [options]
 * @api private
 */

module.exports = function getEmbeddedDiscriminatorPath(schema, update, filter, path, options) {
<<<<<<< HEAD
  const parts = path.split('.');
=======
  const parts = path.indexOf('.') === -1 ? [path] : path.split('.');
>>>>>>> 127bd27cd43add8b39d9aa1596d4ec887b0914a8
  let schematype = null;
  let type = 'adhocOrUndefined';

  filter = filter || {};
  update = update || {};
  const arrayFilters = options != null && Array.isArray(options.arrayFilters) ?
    options.arrayFilters : [];
  const updatedPathsByFilter = updatedPathsByArrayFilter(update);
<<<<<<< HEAD

  for (let i = 0; i < parts.length; ++i) {
    const originalSubpath = parts.slice(0, i + 1).join('.');
=======
  let startIndex = 0;

  for (let i = 0; i < parts.length; ++i) {
    const originalSubpath = parts.slice(startIndex, i + 1).join('.');
>>>>>>> 127bd27cd43add8b39d9aa1596d4ec887b0914a8
    const subpath = cleanPositionalOperators(originalSubpath);
    schematype = schema.path(subpath);
    if (schematype == null) {
      continue;
    }

    type = schema.pathType(subpath);
    if ((schematype.$isSingleNested || schematype.$isMongooseDocumentArrayElement) &&
        schematype.schema.discriminators != null) {
      const key = get(schematype, 'schema.options.discriminatorKey');
      const discriminatorValuePath = subpath + '.' + key;
      const discriminatorFilterPath =
        discriminatorValuePath.replace(/\.\d+\./, '.');
      let discriminatorKey = null;

      if (discriminatorValuePath in filter) {
        discriminatorKey = filter[discriminatorValuePath];
      }
      if (discriminatorFilterPath in filter) {
        discriminatorKey = filter[discriminatorFilterPath];
      }

      const wrapperPath = subpath.replace(/\.\d+$/, '');
      if (schematype.$isMongooseDocumentArrayElement &&
          get(filter[wrapperPath], '$elemMatch.' + key) != null) {
        discriminatorKey = filter[wrapperPath].$elemMatch[key];
      }

      const discriminatorKeyUpdatePath = originalSubpath + '.' + key;
      if (discriminatorKeyUpdatePath in update) {
        discriminatorKey = update[discriminatorKeyUpdatePath];
      }

      if (discriminatorValuePath in update) {
        discriminatorKey = update[discriminatorValuePath];
      }

      for (const filterKey of Object.keys(updatedPathsByFilter)) {
        const schemaKey = updatedPathsByFilter[filterKey] + '.' + key;
        const arrayFilterKey = filterKey + '.' + key;
        if (schemaKey === discriminatorFilterPath) {
          const filter = arrayFilters.find(filter => filter.hasOwnProperty(arrayFilterKey));
          if (filter != null) {
            discriminatorKey = filter[arrayFilterKey];
          }
        }
      }

      if (discriminatorKey == null) {
        continue;
      }

      const discriminator = getDiscriminatorByValue(schematype.caster.discriminators, discriminatorKey);
      const discriminatorSchema = discriminator && discriminator.schema;
      if (discriminatorSchema == null) {
        continue;
      }

      const rest = parts.slice(i + 1).join('.');
      schematype = discriminatorSchema.path(rest);
<<<<<<< HEAD
=======
      schema = discriminatorSchema;
      startIndex = i + 1;
>>>>>>> 127bd27cd43add8b39d9aa1596d4ec887b0914a8
      if (schematype != null) {
        type = discriminatorSchema._getPathType(rest);
        break;
      }
    }
  }

  return { type: type, schematype: schematype };
};
