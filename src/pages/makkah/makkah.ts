import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import {} from 'cordova-plugin-device-orientation';
import { Geolocation } from '@ionic-native/geolocation';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
//import { RADIO_VALUE_ACCESSOR } from '@angular/forms';
/**
 * Generated class for the MakkahPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-makkah',
  templateUrl: 'makkah.html',
})
export class MakkahPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var c:HTMLCanvasElement;
    var ctx:CanvasRenderingContext2D;
    var angle:number;
    var image:HTMLImageElement;
    var imgUrl = "./assets/imgs/compass.jpg";
    var R_EARTH = 6378137;			// 地球の赤道半径
    var RAD = Math.PI / 180;  	// 1°あたりのラジアン
    var lat2 = 21.4225          // カーバ神殿の北緯
    var lon2 = 39.826111        // カーバ神殿の東経


    window.onload = () =>{
      document.addEventListener("deviceready", onReady, false);

      c = <HTMLCanvasElement>document.getElementById('c_1');
      ctx = c.getContext("2d");    
      angle = 45;

      image = new Image();
      image.onload = () =>{
        c.width = image.width;
        c.height = image.height;
        imgSet();
      };
      drawImg()
    }

    function draw(heading){

    }

    function drawImg(){
      image.src = imgUrl;
    }

    function onReady() {
      start_watch();
    }

    function start_watch(){
      var options = { frequency : 500}
      navigator.geolocation.watchPosition(onSuccess,onError);
    }

    function stop_watch(){

    }

    function imgSet() {
      var theta = angle * Math.PI / 180;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.save();
      ctx.translate(c.width / 2, c.height / 2);
      ctx.rotate(theta);
      ctx.drawImage(image, -image.width/2, -image.height/2);
      ctx.restore();
    }

    function onSuccess(position) {
      var heading = position.coords.heading;
      var lat1 = position.coords.latitude;
      var lon1 = position.coords.longitude;
      angle = getAngle(lat1,lon1,lat2,lon2);

      }
       
    function onError(compassError) {
          alert('Compass Error: ' + compassError.code);
      }
    
    function getAngle(lat1,lon1,lat2,lon2){
      lat1 *= RAD;
      lon1 *= RAD;
      lat2 *= RAD;
      lon2 *= RAD;
      
      var lat_c = (lat1 + lat2) / 2;					// 緯度の中心値
      var dx = R_EARTH * (lon2 - lon1) * Math.cos(lat_c);
      var dy = R_EARTH * (lat2 - lat1);
    
      if (dx == 0 && dy == 0) {
        return 0;	// dx, dyともに0のときは強制的に0とする。
      }
      else {
        return Math.atan2(dy, dx) / RAD;	// 結果は度単位で返す
      }
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MakkahPage');
  }
}
