import {StoreModel} from "../models/StoreModel";
export class AdnetTargetModel extends StoreModel {

    constructor(data: any = {}) {
        super(data);
    }

    public setId(value) {
        return this.setKey<AdnetTargetModel>(AdnetTargetModel,'Key',value);
    }

    public getId() {
        return this.getKey('Key');
    }

    public getName() {
        return this.getKey('Value').label;
    }

    public getEnabled() {
        return this.getKey('Value').enabled;
    }

    public getDeleted() {
        return this.getKey('Value').deleted;
    }

    public getCoordinates() {
        var lat = this.getKey('Value').locationLat;
        var lng = this.getKey('Value').locationLng;
        if (!lat)
            lat = 0;
        if (!lng)
            lng = 0;
        return {lat, lng};
    }

    public getRateId() {
        return this.getKey('Value').rateId || ''
        // return this.getKey('Value').hRate;
    }

    public getField(i_field) {
        return this.getKey('Value')[i_field];
    }

    public setField(i_field, i_value) {
        var value = this.getKey('Value');
        value[i_field] = i_value;
        return this.setKey<AdnetTargetModel>(AdnetTargetModel, 'Value', value);
    }

    public getCustomerId() {
        return this.getKey('Value').customerId;
    }

    public getKeys() {
        return this.getKey('Value').keys;
    }

    public getComments() {
        return this.getKey('Value').comments;
    }

    // 0 stations
    // 2 websites
    public getTargetType() {
        return this.getKey('Value').targetType;
    }

    // 0 stations
    // 2 websites
    public getTargetTypeName() {
        if (this.getKey('Value').targetType == 0)
            return 'station'
        return 'website';
    }
}