var util = require('util');

var bleno = require('bleno');
exec = require('child_process').exec;

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;
var ip = require('ip');
var current_ip = ip.address();

function IpCharacteristic(ip) {
  IpCharacteristic.super_.call(this, {
    uuid: '01010101010101010166616465524742',
    properties: ['read', 'notify', 'write', 'indicate'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Public IP broadcast service'
      })
    ]
  });

  this.ip = ip;
};

util.inherits(IpCharacteristic, BlenoCharacteristic);

IpCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('on -> onWriteRequest: value = ' + data.toString());
  callback(this.RESULT_SUCCESS);

  exec('/home/root/hellonode/set_network ' + data.toString(), 
  function (err, stdout, stderr) {
  });
};

IpCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('on -> onReadRequest: value = ' + data.toString());  
  callback(this.RESULT_SUCCESS, ip.address());
};

IpCharacteristic.prototype.onSubscribe = function(maxValueSize, 
updateValueCallback) {
  console.log('on -> onSubscribe');
  
  this._updateValueCallback = updateValueCallback;
  setInterval(function() {
      updateValueCallback(new Buffer(ip.address().toString('hex')));
  }, 100 * 60);
};

IpCharacteristic.prototype.onNotify = function() {
  console.log('on -> onNotify - ' + ip.address());

    exec('node server.js',       
    function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
};

IpCharacteristic.prototype.onUnsubscribe = function() {
  console.log('on -> onUnsubscribe');
  
  this._updateValueCallback = null;
};

module.exports = IpCharacteristic;
