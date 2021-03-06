import {
    Component, ChangeDetectionStrategy, ViewChild, Input, ChangeDetectorRef, Output,
    EventEmitter
} from "@angular/core";
import {AdnetActions} from "../../../../adnet/AdnetActions";
import {AppStore} from "angular2-redux-util";
import {AdnetCustomerModel} from "../../../../adnet/AdnetCustomerModel";
import {AdnetTargetModel} from "../../../../adnet/AdnetTargetModel";
import {List} from "immutable";
import {ISimpleListItem, SimpleList} from "../../../simplelist/Simplelist";
import * as _ from "lodash";
import {Lib} from "../../../../Lib";
import AdnetConfigTargetStationsTemplate from './AdnetConfigTargetStations.html!text';

@Component({
    selector: 'AdnetConfigTargetStations',
    changeDetection: ChangeDetectionStrategy.OnPush,
    moduleId: __moduleName,
    template: AdnetConfigTargetStationsTemplate,
    styles: [`
        .row {
            padding: 15px;
        }
        
        .btns {
            padding: 0 10px 10px 0px;
            font-size: 1.8em;
            color: #313131;
        }
        
        .btns:hover {
            color: red;
        }
        
        .enabled {
            opacity: 1
        }
        
        .disabled {
            opacity: 0.2;
            cursor: default;
        }
        `]
})
export class AdnetConfigTargetStations {
    constructor(private appStore: AppStore, private adnetAction: AdnetActions, private cd: ChangeDetectorRef) {
        this['me'] = Lib.GetCompSelector(this.constructor)
    }

    @ViewChild(SimpleList)
    simpleList: SimpleList

    @Input()
    set adnetCustomerModel(i_adnetCustomerModel: AdnetCustomerModel) {
        this.customerModel = i_adnetCustomerModel;
        this.resetSelection();
    }

    @Output()
    onTargetSelected:EventEmitter<AdnetTargetModel> = new EventEmitter<AdnetTargetModel>();

    ngOnInit() {
        this.adTargets = this.appStore.getState().adnet.getIn(['targets']) || {};
        this.unsub = this.appStore.sub((i_adTargets: List<AdnetTargetModel>) => {
            this.adTargets = i_adTargets;
            this.render();
        }, 'adnet.targets');
        this.render();
    }

    private isWebLocation(): boolean {
        if (!this.selectedAdnetTargetModel || this.selectedAdnetTargetModel.getTargetType() == "0")
            return true;
        return false;
    }

    private renderIcon(index: number, adnetTargetModel: AdnetTargetModel) {
        if (adnetTargetModel.getTargetType() == '0')
            return 'fa-tv'
        return 'fa-globe';
    }

    private onAddWeb() {
        var id = this.customerModel.customerId();
        this.appStore.dispatch(this.adnetAction.addAdnetTarget(id));
    }

    private onWebPlayerSnippet(){

    }

    private onRemoveWeb() {
        if (this.isWebLocation())
            return;
        this.appStore.dispatch(this.adnetAction.removeAdnetTarget(this.selectedAdnetTargetModel.getId(), this.customerModel.customerId()));
        this.simpleList.deselect();

    }

    private resetSelection() {
        if (this.customerModel)
            this.render();
        if (this.simpleList)
            this.simpleList.deselect();
    }

    private onSelection(items: Array<any>) {
        _.forEach(items, (simpleItem: ISimpleListItem)=> {
            if (simpleItem.selected) {
                this.selectedAdnetTargetModel = simpleItem.item;
                this.onTargetSelected.emit(this.selectedAdnetTargetModel);
            }
        })
    }

    private selectedAdnetTargetModel: AdnetTargetModel;
    private customerModel: AdnetCustomerModel;
    private adTargets: List<AdnetTargetModel>;
    private adTargetsFiltered: List<AdnetTargetModel> = List<AdnetTargetModel>();
    private unsub: Function;

    private render() {
        if (!this.adTargets)
            return;
        this.adTargetsFiltered = List<AdnetTargetModel>();
        this.adTargets.forEach((i_adTarget: AdnetTargetModel)=> {
            // if (i_adTarget.getCustomerId() == this.customerModel.customerId() && i_adTarget.getTargetType() == 0) {
            if (i_adTarget.getCustomerId() == this.customerModel.customerId()) {
                this.adTargetsFiltered = this.adTargetsFiltered.push(i_adTarget);
            }
        })
        this.cd.markForCheck();
    }

    private getContent(item: AdnetTargetModel) {
        return item.getName();
    }

    ngOnDestroy() {
        this.unsub();
    }
}