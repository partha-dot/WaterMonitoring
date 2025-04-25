import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private orgsocket: WebSocket;
  private devsocket: WebSocket;
  private scheduleSocket: WebSocket;
  public socketStatus:boolean=false;
  client_id:number
  device_id:number
  device:string
  resData:string
  organization_id:any;
//   private baseURL:string="ws://13.49.80.167:8001/api/ws_routes/ws/WMS/"
//   private baseURL:string="wss://wsapi.iotblitz.com/api/ws_routes/ws/WMS/"
  private baseURL:string="wss://wfmsapi.iotblitz.com/api/water_ms_routes/water_station/WFMS/"
    baseURLOrg: string="wss://wfmsapi.iotblitz.com/api/water_ms_routes/water_station_client/WFMS/";
    baseURLScheduling: string="wss://wfmsapi.iotblitz.com/api/water_ms_routes/water_station/WFMS_SETTINGS/";
    // /api/water_ms_routes/water_station/WFMS_SETTINGS/1/44/TECH000001
  constructor(private router: Router,private api:ApiService,private http:HttpClient) { }

  public connect(client_id,d_id,d_name): Observable<any> {

    this.client_id=client_id;
    this.device_id=d_id;
    this.device=d_name;
    const url=`${client_id}/${d_id}/${d_name}`
    this.devsocket = new WebSocket(this.baseURL+url);

    return new Observable(observer => {
      this.devsocket.onopen = (event) => {
        this.socketStatus=true;
        console.log('WebSocket connected');
        this.callData()

      };

      this.devsocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data);
          console.log(data);

        } catch (error) {
          observer.error(error);
          console.log(error);

        }
      };

      this.devsocket.onerror = (error) => {
        observer.error(error);
        console.log(error);
      };

      this.devsocket.onclose = () => {
        console.log('WebSocket closed');
        observer.complete();
        this.socketStatus=false;
      };

      return () => {
        this.devsocket.close();
      };
    });
  }
  public SchedulingConnect(client_id,d_id,d_name): Observable<any> {

    this.client_id=client_id;
    this.device_id=d_id;
    this.device=d_name;
    const url=`${client_id}/${d_id}/${d_name}`
    this.scheduleSocket = new WebSocket(this.baseURLScheduling+url);

    return new Observable(observer => {
      this.scheduleSocket.onopen = (event) => {
        this.socketStatus=true;
        console.log('WebSocket connected');
        // this.callData()

      };

      this.scheduleSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data);
          console.log(data);

        } catch (error) {
          observer.error(error);
          console.log(error);

        }
      };

      this.scheduleSocket.onerror = (error) => {
        observer.error(error);
        console.log(error);
      };

      this.scheduleSocket.onclose = () => {
        console.log('WebSocket closed');
        observer.complete();
        this.socketStatus=false;
      };

      return () => {
        this.scheduleSocket.close();
      };
    });
  }
  public connectOrg(p_id,org_id): Observable<any> {

    this.organization_id=org_id;
    const url=`${p_id}`
    this.orgsocket = new WebSocket(this.baseURLOrg+url);

    return new Observable(observer => {
      this.orgsocket.onopen = (event) => {
        this.socketStatus=true;
        console.log('organization WebSocket connected');
        this.callData2(p_id,org_id)

      };

      this.orgsocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data);
          console.log(data);

        } catch (error) {
          observer.error(error);
          console.log(error);

        }
      };

      this.orgsocket.onerror = (error) => {
        observer.error(error);
        console.log(error);
      };

      this.orgsocket.onclose = () => {
        console.log('Org WebSocket closed');
        observer.complete();
        this.socketStatus=false;
      };

      return () => {
        this.orgsocket.close();
      };
    });
  }
  orgsocketClose(): void {
    if (this.orgsocket && this.orgsocket.readyState === WebSocket.OPEN) {
      this.orgsocket.close();
      this.socketStatus = false;
      console.log('Organization WebSocket disconnected');
    } else {
      console.log('Organization WebSocket is not connected or already closed.');
    }
  }

  devsocketClose(): void {
    if (this.devsocket && this.devsocket.readyState === WebSocket.OPEN) {
      this.devsocket.close();
      this.socketStatus = false;
      console.log('Device WebSocket disconnected');
    } else {
      console.log('Device WebSocket is not connected or already closed.');
    }
  }
  ScheduleSocketClose(): void {
    if (this.scheduleSocket && this.scheduleSocket.readyState === WebSocket.OPEN) {
      this.scheduleSocket.close();
      this.socketStatus = false;
      console.log('Schedule WebSocket disconnected');
    } else {
      console.log('Schedule WebSocket is not connected or already closed.');
    }
  }

//   orgsocketClose(): void {
//     debugger
//     if (this.socketStatus) {
//         debugger
//       this.orgsocket.close();
//       this.socketStatus = false;
//       console.log('WebSocket disconnected');
//     }
//   }
//   devsocketClose(): void {
//     if (this.devsocket) {
//       this.devsocket.close();
//       this.socketStatus = false;
//       console.log('WebSocket disconnected');
//     }
//     else return;
// }
  public sendMessage(message: any) {
    this.orgsocket.send(JSON.stringify(message));
    this.devsocket.send(JSON.stringify(message));
    this.scheduleSocket.send(JSON.stringify(message));
  }
  callData(){
    if(this.socketStatus){

      const credentials = {
        device:this.device,
        device_id:this.device_id,
        client_id:this.client_id
    };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    this.http.post(this.api.baseUrl+'/device/waterflow_data_wfms', credentials, { headers }).subscribe(
        (response) => {

        const res:any=response
        this.resData=res.data;
          console.log(response);

      },
      (error) => {

            if(error.status=='401'){
            this.router.navigate(['/']);

            }
            else{
                return
            }

        console.log(error.status);
        console.error(error);
      })
    }
  }
  callData2(p_id,o_id){
    if(this.socketStatus){

      const credentials = {
        organization_id:o_id,
        project_id:p_id
    };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    this.http.post(this.api.baseUrl+'/device/waterflow_client_data_wfms', credentials, { headers }).subscribe(
        (response) => {

        const res:any=response
        this.resData=res.data;
          console.log(response);

      },
      (error) => {

            if(error.status=='401'){
            this.router.navigate(['/']);

            }
            else{
                return
            }

        console.log(error.status);
        console.error(error);
      })
    }
  }
}
