/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  var schedule = require('node-schedule');
  sails.config.crontab.crons().forEach(function(item){
    schedule.scheduleJob(item.interval,sails.config.crontab[item.method]);
  });
  /*
  const client = createClient({
      password: 'UFxa1l9RHHrU1WX8HPOInlGJfHQp2wBg',
      socket: {
          host: 'redis-19549.c93.us-east-1-3.ec2.cloud.redislabs.com',
          port: 19549
      }
  });
  */
  
  var client = RedisService.prepareConnect().createClient("//default:WLfUMnz3AesMUaF88FmsxV3OVFQ2owob@redis-16911.c325.us-east-1-4.ec2.cloud.redislabs.com:16911"/*{
    password: 'UFxa1l9RHHrU1WX8HPOInlGJfHQp2wBg_',
    host: 'redis-19549.c93.us-east-1-3.ec2.cloud.redislabs.com',
    socket: {
      host: 'redis-19549.c93.us-east-1-3.ec2.cloud.redislabs.com',
      port: 19549
    }
  }*/);
  client.on('connect',function(){
      sails.log.debug('Redis connected');
      //console.log(client.select(0))
      client.select(0);
      //console.log(client)
      RedisService.setConnection(client);
    
  });

  sails.io.on('connect', function (socket) { 
    socket.on('join', function (data) {
      sails.log.debug("Socket Conectado")
      sails.sockets.join(socket,'roomName');
    });
  });

};
