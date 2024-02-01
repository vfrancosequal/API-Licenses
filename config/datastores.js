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
    url: process.env.db_url || 'mongodb://Sbot_dllo:RmqSfk8admQ8nQxU@cluster0-shard-00-00-bkdec.azure.mongodb.net:27017,cluster0-shard-00-01-bkdec.azure.mongodb.net:27017,cluster0-shard-00-02-bkdec.azure.mongodb.net:27017/X-BOT_DLLO?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
    ssl: true,
    database: 'X-BOT_DLLO',
  },
  develop: {
    adapter: 'sails-mongo',
    url: 'mongodb://Sbot_dllo:RmqSfk8admQ8nQxU@cluster0-shard-00-00-bkdec.azure.mongodb.net:27017,cluster0-shard-00-01-bkdec.azure.mongodb.net:27017,cluster0-shard-00-02-bkdec.azure.mongodb.net:27017/X-BOT_DLLO?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
    ssl: true,
    database: 'X-BOT_DLLO',
  },

};
