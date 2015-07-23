    'use strict';

    var wait = require('wait.for')
    var Cylon = require('cylon');
    var bleno = require('bleno');
    var ip = require('ip');

    require('wait.for/parallel-tests.js')

    Cylon.robot({
        name: 'ardrobot',

        connections: {
            edison: {
                adaptor: 'intel-iot'
            }
        },

        devices: {
            turnServo: {
                driver: 'servo',
                pin: 3,
            },
            driveServo: {
                driver: 'servo',
                pin: 5,
            }
        },

        //These correspond to the actual api endpoints
        commands: function() {
            return {
                //servo
                set_angle: this.setAngle,
                set_drive_speed: this.setSpeed,
                do_arm: this.arm
            };
        },

        setAngle: function(val) {
            if (val != null) {
                this.turnServo.angle(this.turnServo.safeAngle(+val));
            }
        },

        setSpeed: function(val) {
            if (val != null) {
                this.driveServo.angle(this.driveServo.safeAngle(+val));
            }
        },

        arm: function() {
            var my = this;

            function arm1(param, callback) {
                console.log('on -> arming sequence step 1');
                my.setSpeed(180);
                wait.miliseconds(5000);
            };

            function arm2(param, callback) {
                console.log('on -> arming sequence step 2');
                my.setSpeed(0);
                wait.miliseconds(5000);
            };

            function arm3(param, callback) {
                console.log('on -> arming sequence step 3');
                my.setSpeed(90);
            };

            function prepareArm() {
                console.log('on -> starting arming sequence');
                wait.for(arm1);
                wait.for(arm2);
                wait.for(arm3);
                console.log('on -> finished arming sequence');
            };

            wait.launchFiber(prepareArm);
        },

        work: function(my) {}

    }).start();

    Cylon.api(
        'http', {
            host: ip.address(),
            ssl: false,
            port: '3000'
        });