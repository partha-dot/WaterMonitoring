import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Renderer2,OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/demo/api/company';
import { ApiService } from 'src/app/demo/service/api.service';
import { WebsocketService } from 'src/app/demo/service/web-socket.service';

interface Water {
    name: string;
    code: number;
}
@Component({
    selector:'app-formlayoutdemo-component',
    templateUrl: './formlayoutdemo.component.html',
    providers:[MessageService,ConfirmationService]
})
export class FormLayoutDemoComponent implements OnInit{
    cities: Water[] | undefined;
    week:Water[] | undefined;
    selectedCity: Water | undefined;
    selectedCountryAdvanced:any
    selectedDealer:any;
    selectedSetting:any;
    filteredCountries: any[] = [];
    filteredDealer: any[] = [];
    countries: any[] = [];
    selectedState: any = null;
    stockIn: FormGroup;
    spinner:boolean=false;

    status: string = '';
    message: string = '';
    data: any = {};
    states: any[] = [
        {name: 'Arizona', code: 'Arizona'},
        {name: 'California', value: 'California'},
        {name: 'Florida', code: 'Florida'},
        {name: 'Ohio', code: 'Ohio'},
        {name: 'Washington', code: 'Washington'}
    ];

    dropdownItems = [
        { name: 'Valve 1', code: 1 },
        { name: 'Valve 2', code: 2 },
        { name: 'Valve 3', code: 3 },
        { name: 'Valve 4', code: 4 },
        { name: 'Valve 5', code: 5 },
        { name: 'Valve 6', code: 6 },
        { name: 'Valve 7', code: 7 },
        { name: 'Valve 8', code: 8 },
        { name: 'Pressure', code: 9 }
    ];
    dropdownItems2 = [
        { name: 'Auto', code: 0 },
        { name: 'Manual', code: 1 }
    ];

    subscription: Subscription;
    cities1: any[] = [];

    cities2: any[] = [];

    city1: any = null;
    ct:any;
    wsData:any;
    waterData:any;
    city2: any = null;
    models:any={};
    modelList:any=[];
    product_n:string;
    dealer!: any[];
    dealerList:any=[];
    company_n:string;
    lastAddedIndex: number = -1;
    warr_in_month:any;
    modelID:any
    selectedMode:number=0;
    private websocketSubscription: Subscription;
    @ViewChild('itemInput') itemInput: ElementRef;

    constructor(private router: Router,private renderer:Renderer2, private websocketService: WebsocketService,private fb: FormBuilder,private http:HttpClient ,private messageService: MessageService,
        private confirmationService: ConfirmationService,private api:ApiService){
            this.stockIn = this.fb.group({
                organization_id: [''],
                device_id: [''],
                device: [''],
                do_type: [0],
                do_no: [''],
                one_on_time: ['',[Validators.required]],
                one_off_time: ['',[Validators.required]],
                two_on_time: ['',[Validators.required]],
                two_off_time: ['',[Validators.required]],
                datalog_sec :[0,[Validators.required, Validators.min(1)]]
              });
              this.week=[
                {
                    code: 1,
                    name: "Monday"
                  },
                  {
                    code: 2,
                    name: "Tuesday"
                  },
                  {
                    code: 3,
                    name: "Wednesday"
                  },
                  {
                    code: 4,
                    name: "Thursday"
                  },
                  {
                    code: 5,
                    name: "Friday"
                  },
                  {
                    code: 6,
                    name: "Saturday"
                  },
                  {
                    code: 7,
                    name: "Sunday"
                  }
            ]
        }
    ngOnInit(): void {
        this.connectToWebSocket(localStorage.getItem('c_id'),localStorage.getItem('routeDeviceId'),localStorage.getItem('routeDevice'))
        this.ct=this.stockIn.controls;
        console.log(this.ct.value);
this.ct['datalog_sec'].setValue(5);
        //   this.getDeviceModel();
        //   this.addSkill() ;
          this.getDealer();
        }
    resetData(){
        this.resetDevice();

    }
    connectToWebSocket(c_id,d_id,d_name) {
        // this.spinner=true;
        this.websocketSubscription = this.websocketService.SchedulingConnect(c_id,d_id,d_name)
          .subscribe(
            (message) => {
              this.spinner=false;
              console.log('Received message:', message);
              const jsonString = message
              const AllData: any = JSON.parse(jsonString);
              console.log(AllData);
              this.wsData=AllData.shedulingdata
;
              this.waterData = AllData.shedulingdata

            //   this.selectedSetting=this.dropdownItems2.filter(e=>e.code==this.data.do_type)[0]
              this.selectedDealer=this.dropdownItems.filter(e=>e.code==this.waterData?.do_no)[0]
console.log( this.dropdownItems.filter(e=>e.code==this.waterData.do_no)[0],this.dropdownItems2.filter(e=>e.code==this.waterData.do_type)[0]);

                this.stockIn.patchValue({
                    // organization_id: this.data.organization_id,
                    // device_id: this.data.device_id,
                    device: this.waterData.device,
                    do_type: this.dropdownItems2.filter(e=>e.code==this.waterData.do_type)[0],
                    do_no: this.dropdownItems.filter(e=>e.code==this.waterData.do_no)[0],
                    one_on_time: this.convertToDate(this.waterData.one_on_time),
                    one_off_time: this.convertToDate(this.waterData.one_off_time),
                    two_on_time: this.convertToDate(this.waterData.two_on_time),
                    two_off_time: this.convertToDate(this.waterData.two_off_time),
                    datalog_sec :this.waterData.datalog_sec
                });


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
    resetDevice(){
        const apiUrl = this.api.baseUrl;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
          const dt={
              organization_id:this.api.routingORGid,
              device_id:this.api.selectedDevice.device_id,
              device:this.api.selectedDevice.device,
              client_id:localStorage.getItem('c_id')
          }
          this.http.post(apiUrl+'/mqtt/reset_sheduling',dt, { headers }).subscribe(
              (response) => {
                console.log(response);
                // this.stockIn.reset();
                // this.selectedSetting=[];
                // this.selectedDealer={};
                this.spinner=false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Reset Device', life: 3000 });

              },
              (error) => {
          if(error.status=='401'){
            this.router.navigate(['/']);

           }
          console.log(error.status);
                console.error(error);
              }

            );
    }
    getSettingfrmDevice(){
      if(this.selectedDealer){
        const apiUrl = this.api.baseUrl;
        this.spinner=true
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
          const dt={
              organization_id:this.api.routingORGid,
              device_id:this.api.selectedDevice.device_id,
              device:this.api.selectedDevice.device,
              client_id:localStorage.getItem('c_id'),
              do_no:this.selectedDealer?this.selectedDealer.code:0
          }
          this.http.post(apiUrl+'/mqtt/read_sheduling',dt, { headers }).subscribe(
              (response) => {
                console.log(response);
                // this.stockIn.reset();
                // this.selectedSetting=[];
                // this.selectedDealer={};
                this.spinner=false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Get Device Setting', life: 3000 });

              },
              (error) => {
          if(error.status=='401'){
            this.router.navigate(['/']);

           }
          console.log(error.status);
                console.error(error);
              }

            );
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Select a Valve', life: 3000 });

      }

    }
    mode(i:any){
        console.log(i);
        console.log(i.value.name);
        this.selectedMode=i.value.code;

    }
    convertToISTDate(timeString: string): string {
        // Get the current date for reference
        const currentDate = new Date();

        // Split the time string into hours, minutes, and seconds
        const [hours, minutes, seconds] = timeString.split(':').map(Number);

        // Create a Date object for the current day with the given time
        const istDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          hours,
          minutes,
          seconds
        );

        // Format the Date object into the desired string format
        return istDate.toString(); // Automatically formats to `GMT+0530 (India Standard Time)`
      }
    getDeviceModel(){
        this.spinner=true;
        const apiUrl = this.api.baseUrl;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
          const dt={
            organization_id:this.api.routingORGid,
            device_id:this.api.selectedDevice.device_id,
            device:this.api.selectedDevice.device,
            do_no:this.selectedDealer.code
        }
          this.http.post(apiUrl+'/mqtt/publish_schedule_data', dt,{ headers }).subscribe(
              (response:any) => {
                console.log(response);
                this.status = response.status;
                this.message = response.message;
                this.data = response.data;
                // console.log(this.models!=null);
                console.log(this.data);
                if (this.data === null || (Object.keys(this.data).length === 0 && this.data.constructor === Object)) {
                //   this.stockIn.reset();
                  this.spinner=false;
                  this.stockIn.reset();
                //   this.stockIn.controls['do_no'].setValue(this.selectedDealer.code)
                this.stockIn.patchValue({
                    do_no: this.selectedDealer?.code ,
                    datalog_sec:5
                });
                  debugger
                }
                else{
                  debugger
                  this.spinner=false;
                  this.selectedSetting=this.dropdownItems2.filter(e=>e.code==this.data.do_type)[0]
                  this.selectedDealer=this.dropdownItems.filter(e=>e.code==this.data.do_no)[0]
                  // this.messageService.add({ severity: 'info', summary: 'Successful', detail: 'Fatch Setting Data', life: 3000 });

                  this.stockIn.patchValue({
                      organization_id: this.data.organization_id,
                      device_id: this.data.device_id,
                      device: this.data.device,
                      do_type: this.selectedSetting,
                      do_no: this.selectedDealer,
                      one_on_time: this.convertToDate(this.data.one_on_time),
                      one_off_time: this.convertToDate(this.data.one_off_time),
                      two_on_time: this.convertToDate(this.data.two_on_time),
                      two_off_time: this.convertToDate(this.data.two_off_time),
                      datalog_sec :this.data.datalog_sec
                    });
                      console.log(this.ct.value);
                      console.log( this.stockIn.controls);

                      //
                      // this.ct.do_type.setValue(this.selectedSetting.code)
                      debugger
                }
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
    convertToDate(time: string) {
      const today = new Date(); // Use today's date
      const [hours, minutes, seconds] = time?.split(':').map(Number);
      return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds);
  };
    getDealer(){
      const apiUrl = this.api.baseUrl;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
        const dt={
            organization_id:this.api.routingORGid,
            client_id:localStorage.getItem('c_id')
        }
        this.http.post(apiUrl+'/client/devices/list',dt, { headers }).subscribe(
            (response) => {
              console.log(response);
              this.dealerList=response
              this.dealer=this.dealerList.data

            },
            (error) => {
        if(error.status=='401'){
          this.router.navigate(['/']);

         }
        console.log(error.status);
              console.error(error);
            }

          );
  }
  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
    insertStockData(){
        if(this.stockIn.valid){
            this.spinner=true;

            const credentials = {


              organization_id: this.api.routingORGid ,//// org id pathabe
              device_id: this.api.selectedDevice.device_id, //// device id
              device: this.api.selectedDevice.device, //// device
              do_type: this.selectedMode,
              do_no: this.selectedDealer.code, //  1 to 8
              one_on_time: this.formatTime(this.ct.one_on_time.value),
              one_off_time:this.formatTime(this.ct.one_off_time.value),
              two_on_time: this.formatTime(this.ct.two_on_time.value),
              two_off_time: this.formatTime(this.ct.two_off_time.value),
              datalog_sec :this.ct.datalog_sec .value
              // sels_warranty:this.formatedDate(this.ct.sels_warranty.value)
            };
      console.log(credentials);

          const apiUrl = this.api.baseUrl;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

          this.http.post(apiUrl+'/mqtt/publish_schedule', credentials,{ headers }).subscribe(
              (response) => {
                console.log(response);
                const res:any=response

                if(res.status){
                  this.spinner=false;
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Setting Changed', life: 3000 });

              //   this.resetData();
                  this.stockIn.reset();
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
                console.error(error);
                  this.spinner=false;
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side !!', life: 3000 });
              }
            );
        }
        else{
            this.spinner=false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fill all value...', life: 3000 });

        }

    }

    filterCountry(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.dealer.length; i++) {
            const country = this.dealer[i];
            if (country.device.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);

            }
        }

        this.filteredCountries = filtered;

    }
    filterDealer(event: any) {
      const filtered: any[] = [];
      const query = event.query;
      for (let i = 0; i < this.dealer.length; i++) {
          const dealer = this.dealer[i];
          if (dealer.shop_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(dealer);

          }
      }

      this.filteredDealer = filtered;

  }
    setWarranty(){
        this.warr_in_month=this.warr_in_month?this.warr_in_month:0;
        const inputDateObject = new Date(this.ct.purchase_date.value);
        if (!isNaN(inputDateObject.getTime())) {
          inputDateObject.setMonth(inputDateObject.getMonth() + Number(this.warr_in_month));

          this.stockIn.get('warranty_expired').setValue(inputDateObject);
        } else {
          console.error('Invalid date input');
        }

    }
    calculateOutputDate() {

      }
      selected(){
        console.log(this.selectedCountryAdvanced);
        this.modelID=this.selectedCountryAdvanced.model_id;
        this.product_n=this.selectedCountryAdvanced.product_name;
        this.company_n=this.selectedCountryAdvanced.company_name;

    }
    setDealer(i:any){
        console.log(i.value);
        this.selectedDealer=i.value
      console.log(this.selectedDealer);
      this.stockIn.controls['do_no'].setValue(this.selectedDealer?.code)
      this.getDeviceModel();

    //   this.ct.purchase_by.setValue(this.selectedDealer.id);

  }
    get skillsFormArray() {
      return this.stockIn.get('sl_no') as FormArray;
    }
    addSkill() {
      this.skillsFormArray.push(this.fb.control(''));
    }

    removeSkill(index: number) {
      this.skillsFormArray.removeAt(index);
    }
    addItem(i:any){
      if (i.keyCode === 13) {
        this.addSkill();

       this.lastAddedIndex=this.skillsFormArray.length;
        const ln = this.skillsFormArray.length;
        this.lastAddedIndex=ln-1
        // this.removeSkill(ln-1);

      }
    }
    formatedDate(dt:any){
      const originalDateStr = dt;
      const originalDate = new Date(originalDateStr);

      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1 and pad with 0 if needed
      const day = String(originalDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      console.log(formattedDate);
      return formattedDate;
    }
    ngOnDestroy() {
        // this.websocketSubscription.unsubscribe();
          if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.websocketService.ScheduleSocketClose();
  debugger
      }


}



