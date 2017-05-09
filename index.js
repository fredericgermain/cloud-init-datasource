var express = require('express');
var fs = require('fs');
var app = express();


const dbData = JSON.parse(fs.readFileSync(process.argv[2] || 'dbdata.json'))
console.log(process.argv)

const data = {
  '2009-04-04': {
    'user-data': dbData.userData,
    'meta-data': {
      'ami-id': dbData.amiId,
      'ami-launch-index': '0',
      'ami-manifest-path': '(unknown)',
      'block-device-mapping': {
        'ami': '/dev/sda1',
      },
      'hostname': 'ip-'+dbData.localIP.replace(/\./g, '-')+'.' +dbData.availabilityRegion+ '.compute.internal',
      'instance-action': 't2.nano',
      'instance-id': dbData.instanceId,
      'instance-type': 'none',
    //'kernel-id',
      'local-hostname': 'ip-'+dbData.localIP.replace(/\./g, '-')+'.'+dbData.availabilityRegion+'.compute.internal',
      'local-ipv4': dbData.localIP,
      'placement': {
        'availability-zone': dbData.availabilityRegion,
        'cluster': dbData.cluster,
        'server': dbData.server,
      },
    //  'profile': 'default-hvm', // aws
      'public-hostname': 'ows-' + dbData.publicIP.replace(/\./g, '-') + '.' + dbData.availabilityRegion + '.compute.' + dbData.cloudDomain,
      'public-ipv4': dbData.publicIP,
      'public-keys': {
        '_': ['0=fredg'],
        '0': {
          'openssh-key': dbData.sshKeyData,
        }
      },
      'ramdisk-id': '(unknown)',
      'reservation-id': dbData.reservationId,
      'security-groups': ['front'],
    },
  }
}


app.use((req, res, next) => {
    console.log(req.originalUrl);
    const splitPath = req.originalUrl.split('/').slice(1);
    const obj = splitPath.reduce(function(prev, curr) {
        if (curr === '')
            return prev;

        return prev ? prev[curr] : undefined
    }, data)
    if (typeof obj === 'string') {
      res.send(obj);
    } else if (obj instanceof Array) {
      res.send(obj.join('\n'));
    } else if (obj instanceof Object) {
      if (obj._) {
        res.send(obj._.join('\n'));
      } else {
        if (splitPath[splitPath.length - 1] === '') {
          res.send(Object.keys(obj).reduce((acc, k) => {
            if ((typeof obj[k] === 'string') || (obj[k] instanceof Array))
                acc.push(k);
            else
                acc.push(k + '/');
            return acc;
          }, []).sort().join('\n'));
        } else {
          // this is aws behavior...
          res.redirect(301, 'http://169.254.169.254/' + req.originalUrl +'/');
        }
      }
    } else {
      console.log(typeof obj, (typeof obj === 'object') ? obj.prototype : '', obj instanceof Array, obj);
      res.status(404).send('Not Found');
    }
    next();
});



app.listen(80, function () {
  console.log('Example app listening on port 80!');
});
