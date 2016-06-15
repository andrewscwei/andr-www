// (c) Andrew Wei

const _ = require('lodash');
const moment = require('moment');
const Prismic = require('prismic.io').Prismic;

/**
 * Gets the Prismic API.
 *
 * @param {string} [apiEndpoint] - API endpoint.
 * @param {Object} [options] - Additional options.
 *
 * @return {Promise} - Promise with API object as fulfillment.
 */
exports.getAPI = function(apiEndpoint, options) {
  return Prismic.Api(apiEndpoint, options);
};

/**
 * Gets all the documents from Prismic repo.
 *
 * @param {Object} api - The API object.
 * @param {string} [ref] - Ref for query.
 * @param {string} [query=''] - Query string.
 * @param {Array} [orderings] - Orderings.
 *
 * @return {Promise} - Promise with queried results as fulfillment.
 */
exports.getEverything = function(api, ref, query, orderings) {
  return api
    .form('everything')
    .ref(ref || api.master())
    .query(query || '')
    .orderings(orderings)
    .submit()
};

/**
 * Reduces fetched Prismic document(s) into compact data.
 *
 * @param {Object|Object[]} docs - Raw Prismic document(s) to reduce.
 * @param {boolean} [relative] - Specifies whether to attach `prev` and `next`
 *                               pointers to each document.
 *
 * @return {Object} - Object with reduced document data.
 */
exports.reduce = function(docs, relative) {
  if (docs instanceof Array) {
    let ret = {};

    docs.forEach((doc, i) => {
      const r = exports.reduce(doc);
      if (!ret[doc.type]) ret[doc.type] = [];
      ret[doc.type].push(r);
    });

    if (relative) {
      // Add prev and next references.
      for (let key in ret) {
        let collection = ret[key];
        let n = collection.length;

        collection.forEach((doc, i) => {
          doc.prev = (i > 0) ? collection[i-1] : undefined;
          doc.next = (i < (n - 1)) ? collection[i+1] : undefined;
        });
      }
    }

    return ret;
  }
  else {
    let r = _.mapKeys(_.mapValues(docs.data, (v, k) => {
      switch (v.type) {
        case 'StructuredText':
          return docs.getStructuredText(k).asText();
        case 'Image':
          return docs.getImage(k).url;
        case 'Number':
          return docs.getNumber(k);
        case 'SliceZone':
          return docs.getSliceZone(k).asHtml();
        case 'Date':
          return moment(docs.getDate(k)).format('YYYY-MM-DD');
        case 'Link.web':
          return docs.getLink(k).url();
        default:
          return undefined;
      }
    }), (v, k) => {
      return _.replace(k, `${docs.type}.`, '');
    });

    r.id = docs.id;
    r.uid = docs.uid;
    r.type = docs.type;
    r.tags = docs.tags;

    return r;
  }
};

/**
 * Prismic preview cookie name.
 *
 * @type {string}
 */
exports.previewCookie = Prismic.previewCookie;

/**
 * Prismic Predicate class.
 *
 * @type {Class}
 */
exports.Predicates = Prismic.Predicates;
