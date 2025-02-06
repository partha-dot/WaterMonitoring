import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../demo/service/product.service';

import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api.service';
import { ChartsDemoComponent } from '../demo/components/uikit/energy/chartsdemo.component';
@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    providers: [MessageService, ConfirmationService]
})
export class AppMenuComponent implements OnInit {
    u_type:any
    model: any[] = [];
    spinner:boolean=false;
    client_id:number=(+localStorage.getItem('c_id'))
    products:any
    primeNGIcons = ['pi pi-users'];
    menuItems: { label: string; icon: string; routerLink: string[] }[] = [];

    constructor(private router: Router,private http:HttpClient ,public layoutService: LayoutService,private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService,private api:ApiService) {
    }

    ngOnInit() {



        this.getDeviceDATA();


    }
    callMenu(){
        this.u_type=localStorage.getItem("u_type");
        if(this.u_type=="U"){
            this.model=[
                {
                    label: 'Device',
                    items: [
                        { label: 'Overview',
                        icon: 'pi pi-th-large',
                        items: [
                                {
                                    label: 'water',
                                    icon: 'pi pi-bolt',
                                    routerLink: ['/app/outlet/water']
                                },
                                // {
                                //     label: 'UPS',
                                //     icon: 'pi pi-server',
                                //     routerLink: ['/app/outlet/UPS']
                                // },
                                // {
                                //     label: 'DG',
                                //     icon: 'pi pi-exclamation-triangle',
                                //     routerLink: ['/app/outlet/DG']
                                // }
                            ]
                        },

                    ]
                }
                // ,{
                //     label: 'Reports',
                //     items: [
                //             {
                //                 label: 'Daily',
                //                 icon: 'pi pi-clock',
                //                 routerLink: ['/app/outlet/DlyRep']
                //             },
                //             {
                //                 label: 'Monthly',
                //                 icon: 'pi pi-calendar',
                //                 routerLink: ['/app/outlet/monthRep']
                //             },
                //             {
                //                 label: 'Yearly',
                //                 icon: 'pi pi-calendar-minus',
                //                 routerLink: ['/app/outlet/yearRep']
                //             },]
                // }
            ]
        }
        else{
            this.model = [
                {
                    label: 'Master',
                    items: [
                       {
                            label: 'Master',
                            icon: 'pi pi-user',
                            items: [
                                {
                                    label: 'Add Organization',
                                    icon: 'pi pi-building',
                                    routerLink: ['/app/outlet/org']
                                },
                                {
                                    label: 'Add User',
                                    icon: 'pi pi-users',
                                    routerLink: ['/app/outlet/usr']
                                },

                                // {
                                //     label: 'Model',
                                //     icon: 'pi pi-box',
                                //     routerLink: ['/app/outlet/model']
                                // },
                                // { label: 'Barcode Generate',
                                // icon: 'pi pi-qrcode',
                                // routerLink: ['/app/outlet/barcode'] },
                            ]
                        }
                    ]
                },

                {
                    label: 'Projects',
                    items:this.menuItems
                },
                {
                    label:'Devices',
                    items:[
                        { label: 'Device Info', icon: 'pi pi-fw pi-info-circle',routerLink: ['/app/outlet/water_devInfo'] , permission:'N' },
                        // { label: 'Graphical View', icon: 'pi pi-fw pi-chart-pie',routerLink: ['/app/outlet/water_chart'], permission:'N' },
                        { label: 'Historic Data', icon: 'pi pi-fw pi-book',routerLink: ['/app/outlet/report'], permission:'N'  },
                    ]
                },
                {
                    label: 'Management',
                    items: [
                        { label: 'Device Management', icon: 'pi pi-sitemap', routerLink: ['/app/outlet/device_m'], permission:'N' },
                        { label: 'User Management', icon: 'pi pi-users', routerLink: ['/app/outlet/device_s'] , permission:'N'},
                        // {
                        // label:'Settings',
                        // icon: 'pi pi-spin pi-cog',
                        // items: [
                        //     {
                        //         label: 'Organization Settings',
                        //         icon: 'pi pi-building',
                        //         routerLink: ['/app/outlet/org_setting']
                        //     },
                        //     {
                        //         label: 'Screen Settings',
                        //         icon: 'pi pi-desktop',
                        //         routerLink: ['/app/outlet/screen_Setting']
                        //     },]
                        // }
                    ]
                }
                // ,{
                //     label: 'Reports',
                //     items:[
                //         {
                //             label: 'Daily',
                //             icon: 'pi pi-clock',
                //             routerLink: ['/app/outlet/DlyRep']
                //         },
                //         {
                //             label: 'Monthly',
                //             icon: 'pi pi-calendar',
                //             routerLink: ['/app/outlet/monthRep']
                //         },
                //         {
                //             label: 'Yearly',
                //             icon: 'pi pi-calendar-minus',
                //             routerLink: ['/app/outlet/yearRep']
                //         },]
                // }
            ]
            }
    }
    getDeviceDATA(){
        const apiUrl = this.api.baseUrl;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

        const credentials = {
            client_id:this.client_id
          };
          this.spinner=true;
        this.http.post(apiUrl+'/client/manage_organization/list', credentials,{ headers }).subscribe(
            (response) => {
              console.log(response);

              const data1:any=response
              this.products=data1.data

              this.menuItems = this.products.map((org, index) => {
                const randomIcon = this.primeNGIcons[Math.floor(Math.random() * this.primeNGIcons.length)];
                return {
                    label: org.organization_name,
                    icon: randomIcon,
                    routerLink: '/app/outlet/'+ org.organization_id // Dynamic path

                  };
              });
              console.log(this.menuItems);
              if(this.menuItems){
                this.callMenu();
              }
              this.spinner=false;


            },
            (error) => {
            if(error.status=='401'){
              this.router.navigate(['/']);

             }
            console.log(error.status);
              this.spinner=false;
              console.error(error);
            }
          );
        }

}
