export class DeviceInfo{
    private loc_lat: number;
    private loc_lng: number;
    private magneticHeading: any;

    constructor() {}
    
    public getLoclat(): number {
        return this.loc_lat;
    }
    public setLoclat(loc_lat: number): void {
        this.loc_lat = loc_lat;
    }

    public getLoclng(): number {
        return this.loc_lng;
    }
    public setLoclng(loc_lng: number): void {
        this.loc_lng = loc_lng;
    }

    public getMagneticHeading(): number {
        return this.magneticHeading;
    }
    public setMagneticHeading(magneticHeading: number): void {
        this.magneticHeading = magneticHeading;
    }

}