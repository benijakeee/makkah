import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';

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
  private R_EARTH = 6378137; // 地球の赤道半径
  private RAD = Math.PI / 180; // 1°あたりのラジアン
  private lat2 = 21.4225; // カーバ神殿の北緯
  private lon2 = 39.826111; // カーバ神殿の東経
  private targetAzimuth: number;
  private positionCurrent = {
      lat: null,
      lng: null,
      hng: null
  };
  private compassOptions = {
      frequency:5
      //filter: 1
  };
  private heading;

  constructor(public navCtrl: NavController, private deviceOrientation: DeviceOrientation, private geolocation: Geolocation, private platform: Platform) {
    debugger;
    //interface HTMLElementEvent<T extends HTMLElement> extends Event {
    //  target: T;
    //}
    //window.addEventListener('load', {handleEvent: (event: HTMLElementEvent<HTMLInputElement>) => {
    //  this.initDeviceInfo();}},
    //false,);
    //this.initDeviceInfo();
    window.onload = e => {
      this.initDeviceInfo()
    }
  }
  
  initDeviceInfo(){
    let self = this;
    debugger;
    let locationUpdate = function(position) {
        //console.log(position.coords.latitude);
        self.positionCurrent.lat = position.coords.latitude;
        self.positionCurrent.lng = position.coords.longitude;

        //自分と相手の緯度・経度から相手の居る方位角を計算。真東を0としているので、90から引く。
        self.targetAzimuth = 90 - azimuth(self.positionCurrent.lat, self.positionCurrent.lng, self.lat2, self.lon2);
        if (0 > self.targetAzimuth) {
            self.targetAzimuth = 360 + self.targetAzimuth;
        }

    }
    let locationUpdateFail = function(error) {
        //positionLat.textContent = "n/a";
        //positionLng.textContent = "n/a";
        console.log("location fail: ", error);
    }

    let azimuth = function(lat1, lon1, lat2, lon2) {
        // 度をラジアンに変換
        lat1 *= self.RAD;
        lon1 *= self.RAD;
        lat2 *= self.RAD;
        lon2 *= self.RAD;

        var lat_c = (lat1 + lat2) / 2; // 緯度の中心値
        var dx = self.R_EARTH * (lon2 - lon1) * Math.cos(lat_c);
        var dy = self.R_EARTH * (lat2 - lat1);


        if (dx == 0 && dy == 0) {
            return 0; // dx, dyともに0のときは強制的に0とする。
        } else {
            return Math.atan2(dy, dx) / self.RAD; // 結果は度単位で返す
        }
    }

    let rotate = function() {
        var rose = document.getElementById("rose")
        var heading = self.heading;
        var workswell:number;
        if (rose == null || typeof heading == "undefined" || typeof self.positionCurrent == "undefined"){
          workswell = 1;
        }

        if (typeof heading !== "undefined" && heading !== null || workswell == 1) { // && typeof orientation !== "undefined") {
            // we have a browser that reports device heading and orientation
            //相手のいる方位角からデバイスの方位角を引く。
            self.positionCurrent.hng = self.targetAzimuth - heading;
            var phase = self.positionCurrent.hng < 0 ? 360 + self.positionCurrent.hng : self.positionCurrent.hng;
            //self.positionHng.textContent = (360 - phase | 0) + "°";
            // apply rotation to compass rose
            if (typeof rose.style.transform !== "undefined") {
                rose.style.transform = "rotateZ(" + self.positionCurrent.hng + "deg)";
            } else if (typeof rose.style.webkitTransform !== "undefined") {
                rose.style.webkitTransform = "rotateZ(" + self.positionCurrent.hng + "deg)";
            }
        } else {
          //self.imgSet();
            // device can't show heading

            //positionHng.textContent = "n/a";
            //showHeadingWarning();
        }

    }
    let onCompassError = function(error: any) {
        console.log(error + "err");
    }

    let onCompassChange = function(response2: DeviceOrientationCompassHeading) {
        self.heading = response2.magneticHeading;
        rotate();
    }
    let onready = function() {
      debugger;
      console.log(self.platform);

      //geolocation init
      navigator.geolocation.getCurrentPosition(locationUpdate,locationUpdateFail,{
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 27000,
    });

      //start watchPosition
      navigator.geolocation.watchPosition(locationUpdate, locationUpdateFail, {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
    });

      //start watchHeading
      self.deviceOrientation.watchHeading(self.compassOptions);
      const watchCompassId = self.deviceOrientation.watchHeading(self.compassOptions);
      watchCompassId.subscribe(onCompassChange, onCompassError);

    }

    document.addEventListener("deviceready",onready);
      //self.platform.ready().then(() => {

    //})

    
  }
  
}
