import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {Http, Jsonp} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {List, Map} from 'immutable';
import {StationModel} from "./StationModel";
import {Subject} from "rxjs/Subject";


export const RECEIVE_STATIONS = 'RECEIVE_STATIONS';

@Injectable()
export class StationsAction extends Actions {

    constructor(private appStore:AppStore, private _http:Http, private jsonp:Jsonp) {
        super(appStore);
        this.m_parseString = require('xml2js').parseString;
        // this.listenFetchBusinessUser();
    }

    private m_parseString;
    // private businessesRequest$;
    private unsub;


    // demo
    // var s = ['https://neptune.signage.me','https://earth.signage.me','https://moon.signage.me']
    // this.appStore.dispatch(this.stationsAction.fetchBusinessUser(s));
    // setTimeout(()=>{
    // // this.appStore.dispatch(this.stationsAction.fetchBusinessUser([]));
    // },100)

    // demo
    // private listenFetchBusinessUser() {
    //     this.businessesRequest$ = new Subject();
    //     this.unsub = this.businessesRequest$
    //         .map(v=> {
    //             return v;
    //         })
    //         .debounceTime(100)
    //         .switchMap((values:{servers:Array<string>, dispatch:(value:any)=>any}):any => {
    //             if (values.servers.length == 0)
    //                 return 'CANCEL_PENDING_NET_CALLS';
    //             var dispatch = values.dispatch;
    //             // Observable.forkJoin
    //             return values.servers.map(i_source => {
    //                 var url:string = 'https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetCustomers&resellerUserName=rs@ms.com&resellerPassword=rrr'
    //                 return this._http.get(url)
    //                     .map(result => {
    //                         console.log(result);
    //                     }).subscribe((res)=> {
    //                     }, err=> {
    //                         console.log(err);
    //                     }, ()=> {
    //                         console.log();
    //                     });
    //             })
    //
    //         }).share()
    //         .subscribe();
    // }

    // demo
    // public fetchBusinessUser(servers:Array<string>) {
    //     Observable.forkJoin(
    //         this._http.get('https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetCustomers&resellerUserName=rs@ms.com&resellerPassword=rrr'),
    //         this._http.get('https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetCustomers&resellerUserName=rs@ms.com&resellerPassword=rrr')
    //     ).subscribe(
    //         data => {
    //             console.log(data);
    //         },
    //         err => console.error(err)
    //     );
    //
    //     return (dispatch) => {
    //         this.businessesRequest$.next({servers: servers, dispatch: dispatch});
    //     };
    // }

    public getStationsInfo(i_source:string, i_businesses:Array<any>) {
        var self = this;
        return (dispatch)=> {
            //todo: need to add user auth for getSocketStatusList
            var businesses = i_businesses.join(',');
            var url:string = `http://${i_source}/WebService/StationService.asmx/getSocketStatusList?i_businessList=${businesses}`;
            this._http.get(url)
                .map(result => {
                    var xmlData:string = result.text()
                    xmlData = xmlData.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>');
                    this.m_parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                        if (err) {
                            bootbox.alert('problem loading user info')
                            return;
                        }
                        /**
                         * redux inject stations sources
                         **/
                        var stations:List<StationModel> = List<StationModel>();
                        result.string.SocketStatus["0"].Business.forEach((business)=> {
                            var businessId = business._attr.businessId;
                            business.Stations["0"].Station.forEach((station)=> {
                                var stationData = {
                                    businessId: businessId,
                                    source: i_source,
                                    airVersion: station._attr.airVersion,
                                    appVersion: station._attr.appVersion,
                                    caching: station._attr.caching,
                                    cameraStatus: station._attr.cameraStatus,
                                    connection: station._attr.connection,
                                    id: station._attr.id,
                                    lastCameraTest: station._attr.lastCameraTest,
                                    lastUpdate: station._attr.lastUpdate,
                                    name: station._attr.name,
                                    os: station._attr.os,
                                    peakMemory: station._attr.peakMemory,
                                    runningTime: station._attr.runningTime,
                                    socket: station._attr.socket,
                                    startTime: station._attr.startTime,
                                    status: station._attr.status,
                                    totalMemory: station._attr.totalMemory,
                                    watchDogConnection: station._attr.watchDogConnection
                                };
                                var stationModel:StationModel = new StationModel(stationData)
                                stations = stations.push(stationModel);
                            })
                        })
                        dispatch(self.receiveStations(stations, i_source));
                    });
                }).subscribe(
                data => {
                },
                err => {
                    var stationModel:StationModel = new StationModel({})
                    var stations:List<StationModel> = List<StationModel>();
                    stations = stations.push(stationModel);
                    dispatch(self.receiveStations(stations, i_source));
                },
                () => {
                }
            );
        }
    }

    public receiveStations(stations:List<StationModel>, source) {
        return {
            type: RECEIVE_STATIONS,
            stations,
            source
        }
    }

}