/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {


 prod: {
    adapter: 'sails-mongo',
    url: process.env.db_url || 'mongodb+srv://vfranco19:tZqJSJWgi8GRDy@cluster0.qd4o3to.mongodb.net/apolo-desk-prod?retryWrites=true&w=majority',
  },
  develop: {
    adapter: 'sails-mongo',
    url: 'mongodb+srv://vfranco19:tZqJSJWgi8GRDy@cluster0.qd4o3to.mongodb.net/sequalgea?retryWrites=true&w=majority',
  },

};
