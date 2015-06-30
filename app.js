var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;
var IpCharacteristic = require('./ip_characteristic');

bleno.on('servicesSet', function() {
  console.log('on -> servicesSet');
});

bleno.on('accept', function() {
  console.log('on -> accept');
});

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('ardrobot', ['ec00']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: '01010101010101010101010101010101',
        characteristics: [
          new IpCharacteristic()
        ]
      })
    ]);
  }
});
