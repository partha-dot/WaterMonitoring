import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, Subscription, switchMap, timer } from 'rxjs';
import { ApiService } from 'src/app/demo/service/api.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/demo/service/authentication.service';
import {
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexChart,
    ApexLegend,
    ApexResponsive,
    ChartComponent
  } from "ng-apexcharts";
  export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    colors: string[];
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
    responsive: ApexResponsive | ApexResponsive[];
  };


import { MessagesDemoComponent } from '../alert/messagesdemo.component';
import { webSocket, WebSocketSubject  } from 'rxjs/webSocket';
import { WebsocketService } from 'src/app/demo/service/web-socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormLayoutDemoComponent } from '../stockEntry/formlayoutdemo.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Product } from 'src/app/demo/api/product';

export interface WaterData {
    client_id: number;
    created_at: string; // Format: "YYYY-MM-DD HH:mm:ss"
    date: string;       // Format: "YYYY-MM-DD"
    device: string;
    device_id: number;
    di_status: string;
    do_status: string;
    flow_rate1: number;
    flow_rate2: number;
    flow_rate3: number;
    flow_rate4: number;
    flow_rate5: number;
    flow_rate6: number;
    runhr: number;
    time: string;        // Format: "HH:mm:ss"
    total_flow1: number;
    total_flow2: number;
    total_flow3: number;
    total_flow4: number;
    total_flow5: number;
    total_flow6: number;
    tw: number;
    updated_at: string | null; // Nullable
    water_data_id: number;

  }

@Component({
    selector:"app-chartsdemo",
    templateUrl: './chartsdemo.component.html',
    styleUrls:['./chartsdemo.component.scss'],

  providers: [MessageService, ConfirmationService,DialogService, DatePipe]
})
export class ChartsDemoComponent implements OnInit, OnDestroy {
  @ViewChild(MessagesDemoComponent) msg!: MessagesDemoComponent;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
    led1:boolean=false;
    led2:boolean=true;
    led3:boolean=true;
    led4:boolean=false;
    led5:boolean=false;
    led6:boolean=true;
    led7:boolean=true;
    led8:boolean=true;

    do1:boolean=false;
    do2:boolean=false;
    do3:boolean=false;
    do4:boolean=false;
    do5:boolean=false;
    do6:boolean=false;
    do7:boolean=false;
    do8:boolean=false;
    psr:boolean=false;
    valves: boolean[] = Array(8).fill(false); // Initializes 8 checkboxes as unchecked
    maxSelectable = 3;
    spinner:boolean=false;
    client_id:number=(+localStorage.getItem('c_id'))
    ref: DynamicDialogRef | undefined;

  public activeOptionButton = "all";
  public updateOptionsData = {
    "1m": {
      xaxis: {
        min: new Date("28 Jan 2013").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "6m": {
      xaxis: {
        min: new Date("27 Sep 2012").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "1y": {
      xaxis: {
        min: new Date("27 Feb 2012").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "1yd": {
      xaxis: {
        min: new Date("01 Jan 2013").getTime(),
        max: new Date("01 Jan 2013").getTime()
      }
    },
    all: {
      xaxis: {
        min: undefined,
        max: undefined
      }
    }
  };



    private websocketSubscription: Subscription;

    colors = ['#8f304e', '#30458f', '#4e8f30', '#ff5722', '#607d8b'];
    icons = ['pi pi-clock', 'pi pi-chart-bar', 'pi pi-cog', 'pi pi-globe', 'pi pi-sun'];

    rpm: any;
    flow: any;
    flow2: any;

    barData: any;

    pieData: any;

    polarData: any;

    radarData: any;

    lineOptions: any;

    barOptions: any;

    pieOptions: any;

    polarOptions: any;

    donatoptions:any;

    donatdata:any;

    radarOptions: any;

    subscription: Subscription;
    // spinner:boolean=false;
    selectedCountryAdvanced:any
    selectedDealer:any
    filteredCountries: any[] = [];
    filteredDealer: any[] = [];
    countries: any[] = [];
    selectedState: any = null;
    dealer!: any[];
    data1:any=[];
    cities:any=[];
    liveData:any=[];
    liveData2:any;
    currTm:any;
    currDt:any;
    flowData:any[]=[];
    flowDate:any[]=[];
    rpmData:any[]=[];
    rpmDate:any[]=[];
    user_type:any='';
    lastUpdateTime:any='';
    checked:boolean=true;
    options: any;
    options2: any;
    data: any;
    selectedAlert:any
    alert_type:string='';

    cities2:any=[
    {
      "unit_name": "Single Phase",
      "unit": "single"
    },
    {
      "unit_name": "Two Phase",
      "unit": "two"
    },
    {
      "unit_name": "Three Phase",
      "unit": "three"
    }];
    items: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;
    ws: WebSocketSubject<any>;
    messages: string[] = [];
    currentDateTime: Date;
    private intervalId: any;

    selectedPhase:any={
    "unit_name": "Single Phase",
    "unit": "single"}
    selectedDevice:any;
    loginType:string=localStorage.getItem('loginType');
    WaterData:any=[]

    atm_pressure:number=0;
    humidity:number=0;
    rainfall:number=0;
    rainfall_cumulative:number=0;
    solar_radiation:number=0;
    temperature:number=0;
    wind_direction:number=0;
    wind_speed:number=0;

    wsData:any;
    livechart:any[]=[];
    livechartForGraph:any[]=[];
    weekdayName: any[]=[];

    humidity1: any[]=[];
    rainfall1: any[]=[];
    rainfall_cum: any[]=[];
    solar_radiation1: any[]=[];
    temperature1: any[]=[];
    wind_direction1: any[]=[];
    atm_pressure1: any[]=[];
    wind_speed1: any[]=[];
    sig_st:any
    organizationName!: any;
    dodiStatus:boolean=false;
    displayModal: boolean = false;
  isComponentLoaded: boolean = false;

    WaterData2 = {
        total_flow1: 120,
        total_flow2: 150,
        flow_rate1: 30,
        flow_rate2: 40
      };
      products:any[]=[];
    constructor(public dialogService: DialogService,private route: ActivatedRoute,private router: Router,private datePipe: DatePipe,public layoutService: LayoutService, private authservice:AuthenticationService,


        private fb: FormBuilder,private http:HttpClient ,private productService: ProductService, private websocketService: WebsocketService,

        private messageService: MessageService, private confirmationService: ConfirmationService,private api:ApiService) {
        // this.getOrganization();
        this.getDevice1();

        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
        });
        this.chartOptions = {
            series: [96, 87, 71, 66, 68, 72],
            chart: {
              height: 390,
              type: "radialBar"
            },
            plotOptions: {
              radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                  margin: 5,
                  size: "30%",
                  background: "transparent",
                  image: undefined
                },
                dataLabels: {
                  name: {
                    show: false
                  },
                  value: {
                    show: false
                  }
                }
              }
            },
            colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5","#3ba592","#05a43c"],
            labels: ["Flow Rate-1", "Flow Rate-2", "Flow Rate-3", "Flow Rate-4","Flow Rate-5","Flow Rate-6"],
            legend: {
              show: true,
              floating: true,
              fontSize: "16px",
              position: "left",
              offsetX: 50,
              offsetY: 10,
              labels: {
                useSeriesColors: true
              },
              formatter: function(seriesName, opts) {
                return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
              },
              itemMargin: {
                horizontal: 3
              }
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    show: false
                  }
                }
              }
            ]
          };


    }
    convertToISTDateTime(utcDatetime: string) {
        const utcDateTime = new Date(utcDatetime);
        const istTime = this.datePipe.transform(utcDateTime, 'dd-MM-yyyy HH:mm:ss', '+0530');
        return istTime || '';
      }
   ggg(){
    //
   }
    ngOnInit() {
        this.organizationName=this.api.routingORGid
        console.log(this.api.routingORGid);

        this.dodiStatus=false;
        this.updateDateTime();
        this.intervalId = setInterval(() => this.updateDateTime(), 1000);

      this.items = [
        { label: 'Live', icon: 'pi pi-fw pi-home',routerLink: ['/app/outlet/alert']  },
        { label: 'device Info', icon: 'pi pi-fw pi-calendar',routerLink: ['/app/outlet/alert']  },
        { label: 'Graphical View', icon: 'pi pi-fw pi-pencil',routerLink: ['/app/outlet/alert']  },
        { label: 'Create Alert', icon: 'pi pi-fw pi-file',routerLink: ['/app/outlet/alert']  },
        { label: 'Historic Data', icon: 'pi pi-fw pi-cog',routerLink: ['/app/outlet/alert']  }
      ];
      this.activeItem = this.items[0];
        //
        // this.getDevice1();

        // setInterval(()=>{
        //     this.currTm= ' '+ '| '+ new Date().toString().substring(16,24)+ ' '
        //     this.currDt= new Date().toString().substring(0,15)
        //   ,1000})

        //   setInterval(() => {
        //     this.selectedDealer?.device_name ? this.getDeviceLiveData(this.selectedDealer?.device_name) : console.log('hii');
        //     this.getDevice();
        //   }, 20000);
    }
    show() {

        this.ref = this.dialogService.open(FormLayoutDemoComponent, {
            header: 'Scheduling Details',
        //     data: {
        //       null
        //   },
            width: '70%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true
        });

        this.ref.onClose.subscribe((product: Product) => {
            if (product) {
                this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
            }
        });

        this.ref.onMaximize.subscribe((value) => {
            this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
        });
    }
    showModal() {
        this.displayModal = true;
        // Dynamically load the component
        setTimeout(() => {
          this.isComponentLoaded = true; // Simulates loading of component
        }, 0); // Add a delay if needed for async operations
      }

      hideModal() {
        this.displayModal = false;
        this.isComponentLoaded = false;
      }
      private updateDateTime(): void {
        this.currentDateTime = new Date();
      }
     getWindDirection(degrees) {
        const directions = [
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
        ];

        // Normalize the degrees to a value between 0 and 360
        const normalizedDegrees = degrees % 360;

        // Calculate the index for the directions array
        const index = Math.round(normalizedDegrees / 22.5) % 16;

        return directions[index];
    }

    // Example usage
    //let wind_direction_val = 22.3;
//let wind_direction = getWindDirection(wind_direction_val);
   // console.log(wind_direction);  // Output: "NE"

    // connectToWebSocket(c_id,d_id,d_name) {
    //   this.spinner=true;
    //   this.websocketSubscription = this.websocketService.connect(c_id,d_id,d_name)
    //     .subscribe(
    //       (message) => {
    //         this.spinner=false;
    //         console.log('Received message:', message);
    //         const jsonString = message
    //         const AllData: any = JSON.parse(jsonString);
    //         console.log(AllData);
    //         this.wsData=AllData.lastdata;
    //         this.WaterData = AllData.lastdata;
    //         this.livechart = AllData.last10row;
    //         this.livechartForGraph = AllData.last10row;
    //         if(this.WaterData.created_at){
    //             this.lastUpdateTime=''
    //             this.lastUpdateTime=this.convertToISTDateTime(this.WaterData.created_at)
    //             console.log(this.lastUpdateTime);
    //         }
    //         if(this.livechart?.length>0){
    //         this.livechartForGraph.sort((a, b) => {
    //                 return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    //               });
    //         this.initCharts();
    //         }
    //         if(this.WaterData.do_status){
    //             const statusDOArray = this.WaterData.do_status.split('').map(char => char === '1');
    //             const statusDIArray = this.WaterData.di_status.split('').map(char => char === '1');

    //             this.do1 = statusDOArray[0] || false;
    //             this.do2 = statusDOArray[1] || false;
    //             this.do3 = statusDOArray[2] || false;
    //             this.do4 = statusDOArray[3] || false;
    //             this.do5 = statusDOArray[4] || false;
    //             this.do6 = statusDOArray[5] || false;

    //             this.led1 = statusDIArray[0] || false;
    //             this.led2 = statusDIArray[1] || false;
    //             this.led3 = statusDIArray[2] || false;
    //             this.led4 = statusDIArray[3] || false;
    //             this.led5 = statusDIArray[4] || false;
    //             this.led6 = statusDIArray[5] || false;
    //         }
    //         else{
    //         this.initCharts();
    //         }

    //         this.atm_pressure=parseFloat(this.wsData?.atm_pressure?this.wsData?.atm_pressure.toFixed(2):0);
    //         this.humidity=parseFloat(this.wsData?.humidity?this.wsData?.humidity.toFixed(2):0);
    //         this.rainfall=parseFloat(this.wsData?.rainfall?this.wsData?.rainfall.toFixed(2):0);
    //         this.rainfall_cumulative=parseFloat(this.wsData?.rainfall_cumulative?this.wsData?.rainfall_cumulative.toFixed(2):0);
    //         this.solar_radiation=parseFloat(this.wsData?.solar_radiation?this.wsData?.solar_radiation.toFixed(2):0);
    //         this.temperature=parseFloat(this.wsData?.temperature?this.wsData?.temperature.toFixed(2):0);
    //         this.wind_direction=parseFloat(this.wsData?.wind_direction?this.wsData?.wind_direction.toFixed(2):0);
    //         this.wind_speed=parseFloat(this.wsData?.wind_speed?this.wsData?.wind_speed.toFixed(2):0);
    //         this.spinner=false;

    //       },
    //       (error) => {
    //             if(error.status=='401'){
    //             this.router.navigate(['/']);
    //
    //             }
    //             console.log(error.status);
    //             this.spinner=false;
    //             console.error('WebSocket error:', error);
    //       },
    //       () => {
    //         this.spinner=false;
    //         console.log('WebSocket connection closed');
    //       }
    //     );

    // }
    connectToWebSocket(c_id,d_id,d_name) {
        this.spinner=true;
        this.websocketSubscription = this.websocketService.connect(c_id,d_id,d_name)
          .subscribe(
            (message) => {
              this.spinner=false;
              console.log('Received message:', message);
              const jsonString = message
              const AllData: any = JSON.parse(jsonString);
              console.log(AllData);
              this.wsData=AllData.lastdata;
              this.WaterData = AllData.lastdata;
              this.livechart = AllData.last10row;
              this.livechartForGraph = AllData.last10row;
              if(this.WaterData.created_at){
                  this.lastUpdateTime=''
                  this.lastUpdateTime=this.convertToISTDateTime(this.WaterData.created_at)
                  console.log(this.lastUpdateTime);
              }
              if(this.livechart?.length>0){
              this.livechartForGraph.sort((a, b) => {
                      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    });
              this.initCharts();
              }
              if(this.WaterData.do_status){
                  const statusDOArray = this.WaterData.do_status.split('').map(char => char === '1');
                  const statusDIArray = this.WaterData.di_status.split('').map(char => char === '1');

                  this.do1 = statusDOArray[0] || false;
                  this.do2 = statusDOArray[1] || false;
                  this.do3 = statusDOArray[2] || false;
                  this.do4 = statusDOArray[3] || false;
                  this.do5 = statusDOArray[4] || false;
                  this.do6 = statusDOArray[5] || false;
                  this.do7 = statusDOArray[6] || false;
                  this.do8 = statusDOArray[7] || false;

                  this.led1 = statusDIArray[0] || false;
                  this.led2 = statusDIArray[1] || false;
                  this.led3 = statusDIArray[2] || false;
                  this.led4 = statusDIArray[3] || false;
                  this.led5 = statusDIArray[4] || false;
                  this.led6 = statusDIArray[5] || false;
                  this.led7 = statusDIArray[6] || false;
                  this.led8 = statusDIArray[7] || false;
              }
              else{
              this.initCharts();
              }

              this.atm_pressure=parseFloat(this.wsData?.atm_pressure?this.wsData?.atm_pressure.toFixed(2):0);
              this.humidity=parseFloat(this.wsData?.humidity?this.wsData?.humidity.toFixed(2):0);
              this.rainfall=parseFloat(this.wsData?.rainfall?this.wsData?.rainfall.toFixed(2):0);
              this.rainfall_cumulative=parseFloat(this.wsData?.rainfall_cumulative?this.wsData?.rainfall_cumulative.toFixed(2):0);
              this.solar_radiation=parseFloat(this.wsData?.solar_radiation?this.wsData?.solar_radiation.toFixed(2):0);
              this.temperature=parseFloat(this.wsData?.temperature?this.wsData?.temperature.toFixed(2):0);
              this.wind_direction=parseFloat(this.wsData?.wind_direction?this.wsData?.wind_direction.toFixed(2):0);
              this.wind_speed=parseFloat(this.wsData?.wind_speed?this.wsData?.wind_speed.toFixed(2):0);
              this.spinner=false;

            },
            (error) => {
                  if(error.status=='401'){
                  this.router.navigate(['/']);

                  }
                  console.log(error.status);
                  this.spinner=false;
                  console.error('WebSocket error:', error);
            },
            () => {
              this.spinner=false;
              console.log('WebSocket connection closed');
            }
          );

      }
    convertToPercentage(value: number): number {
        if (value < 0) {
          return 0;
        } else if (value > 30) {
          return 100;
        } else {
          return (value / 30) * 100;
        }
      }
      getRouterLink(device: string, cardType: string): string[] {
        return ['/app/outlet', device, cardType.toLowerCase().replace(' ', '-')];
      }
    // ngOnDestroy() {
    //   this.websocketSubscription.unsubscribe();
    //   if (this.subscription) {
    //     this.subscription.unsubscribe();
    // }
    // }
    setPhase(i:any){

        console.log(i,this.selectedPhase)
    }
    dodi(){
        this.router.navigate(['/app/outlet/']);
        // this.dodiStatus=true;
    }
    back(){

        this.router.navigate([`/app/outlet/${this.organizationName}`]);

            // this.dodiStatus=false;
        }
    abc(){
        this.alert_type=''
        console.log(this.selectedAlert);
        this.alert_type=this.selectedAlert?.unit_name
        this.alert_type=' '+this.alert_type;

      }
      getCardTitle(cardType: string, device: string): string {
        return `${cardType} (${device})`;
      }

      // Helper method to resolve dynamic values
      getValue(key: string): any {
        return key.split('.').reduce((o, i) => o[i], this);
      }
    getDevice1(){
        const credentials = {
            organization_id:this.api.routingORGid,
            client_id:this.client_id
          };

    const apiUrl = this.api.baseUrl;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
  this.spinner=true;
  this.http.post(apiUrl+'/client/devices/list', credentials,{ headers }).subscribe(
      (response) => {
        console.log(response);
        this.spinner=false;
        this.data1=response;
        this.cities=this.data1.data;
        this.selectedDealer= this.api.selectedDevice
        debugger
        // this.selectedDealer=this.cities[0]//to be changelllllll
        this.getDeviceLiveData(this.selectedDealer.device,this.selectedDealer.device_id);

        console.log(this.selectedDealer);


      },
      (error) => {
        if(error.status=='401'){
          this.router.navigate(['/']);

         }
        console.log(error.status);
        this.spinner=false
        if(error.status=='422'){
          this.router.navigate(['/']);

         }
        console.log(error.status);
      }
    );
}

      dateConvt(timestamp:any){
      const dateObject = new Date(timestamp);

      // Extract month and day
      const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
      const day = String(dateObject.getDate()).padStart(2, '0');

      // Create the desired format
      const result = `${month}/${day}`;

      console.log(result);
      return result
      }
      getDeviceLiveData(name:any,id:number){

      this.connectToWebSocket(this.client_id,id,name);
      console.log(this.websocketService.socketStatus);
      this.spinner=true
      if(this.websocketService.resData){
        console.log(this.websocketService.resData);

      }

        //  if(name){
        //     const token = localStorage.getItem('token');
        //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

        //     this.liveData=[];
        //     this.liveData2=null;

        //     const credentials = {
        //         device_id:name
        //     };

        //     this.http.post(this.api.baseUrl+'/device-data/last', credentials, { headers }).subscribe(
        //         (response) => {

        //             console.log(response);

        //             this.data1=response
        //             this.data1=this.data1.data
        //             if(this.data1) {
        //                 this.flowDate=[]
        //                 this.flowData=[]
        //                 this.rpmDate=[]
        //                 this.rpmData=[]
        //                 this.liveData=this.data1.chart_data_list
        //                 this.liveData2=this.data1.device_data_list
        //                 this.liveData.forEach(e => {

        //                     this.flowDate.push(this.dateConvt(e.created_at))
        //                     this.flowData.push(e.flow)
        //                     this.rpmDate.push(this.dateConvt(e.created_at))
        //                     this.rpmData.push(e.rpm.toString())


        //                     console.log(this.flowDate);
        //                     console.log(this.flowData);
        //                     console.log(this.rpmDate);
        //                     console.log(this.rpmData);

        //                 });

        //                 if(this.flowDate && this.flowData && this.rpmDate && this.rpmData){
        //                     this.lastUpdateTime=''
        //                     this.lastUpdateTime=this.convertToISTDateTime(this.liveData2.created_at)
        //                     console.log(this.lastUpdateTime);
        //                     var currentdate = new Date();
        //                     var datetime = currentdate.getDate() + "-"
        //                         + (currentdate.getMonth()+1)  + "-"
        //                         + currentdate.getFullYear() + " "
        //                         + currentdate.getHours() + ":"
        //                         + currentdate.getMinutes() + ":"
        //                         + currentdate.getSeconds();
        //                         console.log(datetime);


        //                     this.initCharts();

        //                 }

        //             }


        //         },
        //         (error) => {
        // if(error.status=='401'){
        //   this.router.navigate(['/']);
        //
        //  }
        // console.log(error.status);
        //             console.error(error);
        //         }
        //         );
        //  }

}
        dateChange(i:any){
            const utcTimestamp = i;

            // Convert UTC timestamp to Date object
            const date = new Date(this.liveData2.created_at);

            // Set the desired timezone (in this case, +05:30)
            const timeZone = "Asia/Kolkata"; // Time zone identifier for Indian Standard Time

            // Options for formatting
            const options:any = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false, // 24-hour format
            timeZone: timeZone,
            };

            // Format the date
            const formattedDate = date.toLocaleString('en-US', options);

            console.log(formattedDate);
            return formattedDate
        }
    setDevice(){
        console.log(this.selectedDealer);

        this.getDeviceLiveData(this.selectedDealer.device,this.selectedDealer.device_id);


    }
    filterDealer(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.cities.length; i++) {
            const dealer = this.cities[i];
            if (dealer.device.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(dealer);

            }
        }

        this.filteredDealer = filtered;

    }
    getWeekdayName(dateString: string): string {
      const date = new Date(dateString);
      const options:any = { weekday: 'long' };
      return date.toLocaleDateString('en-US', options);
    }

    initCharts() {
      this.weekdayName=[];
      this.humidity1=[];
      this.humidity1=[];
      this.rainfall1=[];
      this.rainfall_cum=[];
      this.solar_radiation1=[];
      this.temperature1=[];
      this.wind_direction1=[];
      this.wind_speed1=[];
      this.atm_pressure1=[];
      this.livechartForGraph?.forEach(e=>{
        // e.day=this.getWeekdayName(e.date);
        this.weekdayName?.push(e.time);
        this.humidity1?.push(Number(e.humidity));
        this.rainfall1?.push(Number(e.rainfall));
        this.rainfall_cum?.push(Number(e.rainfall_cumulative));
        this.solar_radiation1?.push(Number(e.solar_radiation));
        this.temperature1?.push(Number(e.temperature));
        this.wind_direction1?.push(Number(e.wind_direction));
        this.atm_pressure1?.push(Number(e.atm_pressure));
        this.wind_speed1?.push(Number(e.wind_speed));
      })

        console.log(this.weekdayName);
        console.log(this.temperature1,);
        console.log(this.humidity1);
        console.log(this.wind_direction1);
        console.log(this.atm_pressure1);
        console.log(this.wind_speed1);
        console.log(this.rainfall1);
        console.log(this.solar_radiation1);


        // this.chartOptions = {
        //     series: [
        //       {
        //         name: "Temperature",
        //         data: this.temperature1
        //       },
        //       {
        //         name: "Humidity",
        //         data: this.humidity1
        //       },
        //       {
        //         name: "Atm Pressure",
        //         data: this.atm_pressure1
        //       },
        //       {
        //         name: "Wind Speed",
        //         data: this.wind_speed1
        //       }
        //       ,
        //       {
        //         name: "Wind Direction",
        //         data: this.wind_direction1
        //       }
        //       ,
        //       {
        //         name: "Solar Radiation",
        //         data: this.solar_radiation1
        //       }
        //       ,
        //       {
        //         name: "Rainfall",
        //         data: this.rainfall1
        //       },
        //       {
        //         name: "Rainfall Cumultive",
        //         data: this.rainfall_cum
        //       }
        //     ],
        //     chart: {
        //       height: 350,
        //       type: "line"
        //     },
        //     dataLabels: {
        //       enabled: false
        //     },
        //     // stroke: {
        //     //   width: 5,
        //     //   curve: "straight",
        //     //   dashArray: [0, 8, 5]
        //     // },
        //     title: {
        //       text: "Live Chart",
        //       align: "left"
        //     },
        //     // legend: {
        //     //   tooltipHoverFormatter: function(val, opts) {
        //     //     return (
        //     //       val +
        //     //       " - <strong>" +
        //     //       opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        //     //       "</strong>"
        //     //     );
        //     //   }
        //     // },
        //     markers: {
        //       size: 0,
        //       hover: {
        //         sizeOffset: 6
        //       }
        //     },
        //     xaxis: {
        //       labels: {
        //         trim: false
        //       },
        //       categories: this.weekdayName
        //     //   [
        //     //     "01 Jan",
        //     //     "02 Jan",
        //     //     "03 Jan",
        //     //     "04 Jan",
        //     //     "05 Jan",
        //     //     "06 Jan",
        //     //     "07 Jan",
        //     //     "08 Jan",
        //     //     "09 Jan",
        //     //     "10 Jan",
        //     //     "11 Jan",
        //     //     "12 Jan"
        //     //   ]
        //     },
        //     tooltip: {
        //       y: [
        //         {
        //           title: {
        //             // formatter: function(val) {
        //             //   return val + " (mins)";
        //             // }
        //           }
        //         },
        //         {
        //           title: {
        //             // formatter: function(val) {
        //             //   return val + " per session";
        //             // }
        //           }
        //         },
        //         {
        //           title: {
        //             // formatter: function(val) {
        //             //   return val;
        //             // }
        //           }
        //         }
        //       ]
        //     },
        //     grid: {
        //       borderColor: "#f1f1f1"
        //     }
        //   };




    }



    public generateDayWiseTimeSeries(baseval, count, yrange) {
        var i = 0;
        var series = [];
        while (i < count) {
          var x = baseval;
          var y =
            Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

          series.push([x, y]);
          baseval += 86400000;
          i++;
        }
        return series;
      }

    ngOnDestroy() {
      // this.websocketSubscription.unsubscribe();
        if (this.subscription) {
          this.subscription.unsubscribe();
      }
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.websocketService.devsocketClose();
debugger
    }

    onCheckbox1Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(1,2)

          } else {
              this.getDevice(1,1)

          }
      }
      onCheckbox2Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
          this.getDevice(2,2)

        } else {
            this.getDevice(2,1)

        }
      }
      onCheckbox3Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(3,2)

          } else {
              this.getDevice(3,1)

          }
      }
      onCheckbox4Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(4,2)

          } else {
              this.getDevice(4,1)

          }
      }
      onCheckbox5Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(5,2)

          } else {
              this.getDevice(5,1)

          }
      }
      onCheckbox6Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(6,2)

          } else {
              this.getDevice(6,1)

          }
      }
      onCheckbox7Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(7,2)

          } else {
              this.getDevice(7,1)

          }
      }
      onCheckbox8Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(8,2)

          } else {
              this.getDevice(8,1)

          }
      }
      onCheckbox9Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(9,2)

          } else {
              this.getDevice(9,1)

          }
      }
      getCheckedCount(): number {
        return [this.do1, this.do2, this.do3, this.do4, this.do5, this.do6, this.do7, this.do8].filter(v => v).length;
      }

      onCheckboxChange(valve: string, event: Event) {
        const getValveNumber = (valve: string): number => {
            return parseInt(valve.replace('do', ''), 10);
          };
        const isChecked = (event.target as HTMLInputElement).checked;

        if (isChecked && this.getCheckedCount() >= this.maxSelectable) {
          // Prevent checking if the max limit is reached
          (event.target as HTMLInputElement).checked = false;
          this.getDevice(getValveNumber(valve),1)
          debugger
        } else {
          this[valve] = isChecked;
          this.getDevice(getValveNumber(valve),2)
          debugger
        }
      }
      isDisabled(valve: string): boolean {
        return this.getCheckedCount() >= this.maxSelectable && !this[valve];
      }
      getOrganization(){
        this.spinner=true;
        const apiUrl = this.api.baseUrl;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

        const credentials = {
            client_id:this.client_id
          };
        this.http.post(apiUrl+'/client/manage_organization/list',credentials, { headers }).subscribe(
            (response) => {
              console.log(response);

              this.spinner=false;
              this.data1=response
              this.products=this.data1.data
            // this.getDevice1(this.products[0]?.organization_id);


            },
            (error) => {
            this.spinner=false;
            if(error.status=='401'){
              this.router.navigate(['/']);

             }
            console.log(error.status);
              console.error(error);
            }
          );
        }
      getDevice(no,status){
        const credentials = {
            device:this.selectedDealer.device,
            device_id:this.selectedDealer.device_id,
            do_no:no,
            do_status:status
          };

    const apiUrl = this.api.baseUrl;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
  this.spinner=true;
  this.http.post(apiUrl+'/mqtt/publish_digital_output', credentials,{ headers }).subscribe(
      (res) => {
        console.log(res);
        this.spinner=false;
        const response:any=res
        if(response.status=="success"){
            this.spinner=false;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Valve '+no+' Updated', life: 3000 });
        //   this.resetData();
        debugger
          }
          else{
            this.spinner=false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Related Issue!!', life: 3000 });
          }


      },
      (error) => {
        if(error.status=='401'){
          this.router.navigate(['/']);

         }
        console.log(error.status);
        this.spinner=false
        if(error.status=='401'){
          this.router.navigate(['/']);

         }
        console.log(error.status);
      }
    );
}

}
