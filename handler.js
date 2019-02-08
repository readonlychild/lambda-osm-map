'use strict';

const fs = require('fs');
const staticmaps = require('staticmaps');
const utils = require('./utils.js');

module.exports.map = (event, context, callback) => {
  console.log(event);
  var qs = event.queryStringParameters || {};
  var lat = qs.lat || '37.7955843';
  var lng = qs.lng || '-122.3934109';
  var z = qs.z || '15';
  lat = parseFloat(lat);
  lng = parseFloat(lng);
  z = parseInt(z);
  var imgname = `${lat}_${lng}_${z}.png`;
  console.log('imgname', imgname);
  var path = `/tmp/${imgname}`;
  if (!fs.existsSync(path)) {
    console.log('does not exist, generating...');
    var center = [ lng, lat ];
    var zoom = z;
    /*var map = new staticmaps({
      zoom: zoom,
      center: center,
      options: { width: 400, height: 220 }
    });*/
    var map = new staticmaps({
      width: 400, height: 220, zoom: zoom, center: center
    });
    var marker = { img: 'https://i.imgur.com/OGMRWnh.png', width: 40, height: 40, coord: center };
    console.log('adding marker...');
    map.addMarker(marker);
    console.log('added :)');
    map.render(center, zoom)
    .then(() => {
      console.log('saving...');
      map.image.save(path)
      .then(() => {
        console.log('saved :)');
        var imageData = fs.readFileSync(path);
        setTimeout(() => {
          callback(null, utils.apiBinaryResponse('image/png', imageData));
        }, 1200);
      })
      .catch((savex) => { console.log(savex.message); console.log(savex); });
    })
    .catch((err) => {
      console.log(`map: `, err.message);
      console.log(err);
    });
  } else {
    console.log('already exists :D');
    var imageData = fs.readFileSync(path);
    callback(null, utils.apiBinaryResponse('image/png', imageData));
  }
};
