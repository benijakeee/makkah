import { Injectable } from '@angular/core';
import { MAKKAH_LNG, MAKKAH_LAT } from '../shared/constant';

@Injectable()
export class CalcLogic {


    constructor() {}

    getMakkahAngle(lat:number,lng:number,head:number){
        let angle:number;
        // ここから角度
        // 緯度経度 lat1, lng1 の点を出発として、緯度経度 lat2, lng2 への方位
        // 北を０度で右回りの角度０～３６０度
        let Y = Math.cos(MAKKAH_LNG * Math.PI / 180) * Math.sin(MAKKAH_LAT * Math.PI / 180 - lat * Math.PI / 180);
        let X1 = Math.cos(lng * Math.PI / 180) * Math.sin(MAKKAH_LNG * Math.PI / 180) - Math.sin(lng * Math.PI / 180) 
               * Math.cos(MAKKAH_LNG * Math.PI / 180) * Math.cos(MAKKAH_LAT * Math.PI / 180 - lat * Math.PI / 180);
        let dirE0 = 180 * Math.atan2(Y, X1) / Math.PI; // 東向きが０度の方向
        if (dirE0 < 0) {
            dirE0 = dirE0 + 360; //0～360 にする。
        }
        let dirN0 = (dirE0 + 90) % 360; //(dirE0+90)÷360の余りを出力 北向きが０度の方向
        angle = dirN0 + head;
        if (angle >= 360) {
             angle = angle - 360; //0～360 にする。
        }
        return angle;
        //角度ここまで
    }

    getMakkahDistance(lat:number,lng:number){
        let distance:number;
        //var distance = 0;
        if ((Math.abs(lat - MAKKAH_LAT) < 0.00001) && (Math.abs(lng - MAKKAH_LNG) < 0.00001)) {
            distance = 0;
        } else {
            let lat1:number = lat * Math.PI / 180;
            let lng1:number = lng * Math.PI / 180;
            let lat2:number = MAKKAH_LAT * Math.PI / 180;
            let lng2:number = MAKKAH_LNG * Math.PI / 180;
        
            //赤道半径
            let A = 6378140;
            //極半径
            let B = 6356755;
            let F = (A - B) / A;
    
            let P1 = Math.atan((B / A) * Math.tan(lat1));
            let P2 = Math.atan((B / A) * Math.tan(lat2));
    
            let X2 = Math.acos(Math.sin(P1) * Math.sin(P2) + Math.cos(P1) * Math.cos(P2) * Math.cos(lng1 - lng2));
            let L = (F / 8) * ((Math.sin(X2) - X2) * Math.pow((Math.sin(P1) + Math.sin(P2)), 2) / Math.pow(Math.cos(X2 / 2), 2) 
              - (Math.sin(X2) - X2) * Math.pow(Math.sin(P1) - Math.sin(P2), 2) / Math.pow(Math.sin(X2), 2));
    
            distance = A * (X2 + L);
            let decimal_no = Math.pow(10, 5); //引数2個目は小数点以下の桁数
            distance = Math.round(decimal_no * distance / 1) / decimal_no /1000;   // km
            //HomePage.prototype.distance=distance;
        }

        return distance;
    }

}