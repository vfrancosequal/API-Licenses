var redis     = require("redis");
var flat      = require('flat');
var unflat    = require('flat').unflatten;
var bluebird  = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client=redis.createClient("//default:WLfUMnz3AesMUaF88FmsxV3OVFQ2owob@redis-16911.c325.us-east-1-4.ec2.cloud.redislabs.com:16911"/*{
  password: 'UFxa1l9RHHrU1WX8HPOInlGJfHQp2wBg_',
  host: 'redis-19549.c93.us-east-1-3.ec2.cloud.redislabs.com',
  socket: {
    host: 'redis-19549.c93.us-east-1-3.ec2.cloud.redislabs.com',
    port: 19549
  }  
}*/);

module.exports = {
  prepareConnect : function(){
    //console.log(redis)
    return redis;
  },
  setConnection : function(connection){
    client = connection;
    //console.log(client)
  },
  auth : function(password){
    return new Promise(function (resolve, reject){
      client.auth(password,function(err,reply) {
        if(err)
          return reject(err);
        return resolve(reply);
      });
    });
  },
  setExpire : function(key,expire){
    return new Promise(function (resolve, reject){
      client.expire(key,expire, function (err, expireResult) {
        if(err)
          return reject(err);
        return resolve(expireResult);
      });
    });
  },
  set : function (key,obj,expire) {
    return new Promise(function (resolve, reject){
      client.hmset(key,flat(obj),function (err, result) {
        if(err)
          return reject(err);

        if (expire) {
          client.expire(key,expire, function (err, expireResult) {
            if(err)
              return reject(err);
            return resolve(expireResult);
          });
        }else{
          return resolve(result);
        }
        });
    });
  },
  setString : function(key,store,expire = 600){
    return new Promise(function (resolve, reject){
      client.setex(key,expire,JSON.stringify(store),function(err,result){
        if(err){
          console.log(err)
          return reject(false);
        }
        return resolve(true);
      });
    });
  },
  getString : function(key){
    return new Promise(function (resolve, reject){
      client.get(key,function(err,result){
        if(err){
          console.log(err)
          return reject([]);
        }
        return resolve(result==null?[]:JSON.parse(result));
      });
    });
  },
  get : function(key) {
    return new Promise(function (resolve, reject){
      client.hgetall(key,function (err, obj) {
        var hash = unflat(obj) ? unflat(obj): {notFoundAtRedis: true};
        if(err)
          return reject(err);
        return resolve(hash);
        });
    });
  },
  delete : function(key){
    return new Promise(function (resolve, reject){
      client.del(key,function(err,result){
        if(err)
          return reject(err)
        return resolve(result);
      })
    });
  },
  existsKey : function(key){
    return new Promise(function (resolve, reject){
      client.exists(key,function(err,result){
        if(err)
          return reject(err);
        return resolve(resresult);
      })
    });
  },
  keys : function(key){
    return new Promise(function (resolve, reject){
      client.keys(`*${key}*`,function(err,result){
        if(err)
          return reject(err);
        return resolve(result==null?[]:result);
      })
    });
  },
  native : function(){
    return  client;
  },
  deleteKeys: async function(name){
    return new Promise( async function (resolve, reject){
      let keys= await RedisService.keys(name)
      keys.forEach(async function (reply, index) {
            await RedisService.delete(reply)
      });
      resolve(true)
    });
  }
}
