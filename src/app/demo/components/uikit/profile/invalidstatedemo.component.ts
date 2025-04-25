import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/demo/service/country.service';
import * as bcrypt from 'bcryptjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
export interface UserData {
    user_id: number;
    user_name: string;
    user_email: string;
    user_info_id: number;
    user_active_status: string;
    user_type: string;
    otp_number: number;
    otp_active_status: string;
    o_password: string;
    n_password: string;
    cn_password: string;
    created_by: number;
    created_at: string;
    client_id: number;
    client_name: string;
    client_address: string;
    client_mobile: string;
    client_email: string;
  }
@Component({
    templateUrl: './invalidstatedemo.component.html',
    styleUrls:['./invalidstatedemo.component.scss'],
    providers:[MessageService,ConfirmationService]
})
export class InvalidStateDemoComponent implements OnInit {
    uploadedFiles: any[] = [];

    countries: any[] = [];
    selectedFile: File | null = null;
    userData:UserData;

    cities: any[];

    filteredCountries: any[] = [];

    email: any;

    userName: any;

    visible: boolean = false;
    visible2: boolean = false;
    spinner:boolean=false;
    old_p:string;
    _p:string;
    c_p:string;

    constructor(private router: Router,private countryService: CountryService,private fb: FormBuilder,private http:HttpClient ,private messageService: MessageService,
        private confirmationService: ConfirmationService,private api:ApiService) {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    }

    ngOnInit() {
        this.email=localStorage.getItem('email');
        this.userName=localStorage.getItem('ORG_NAME');
        const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log(storedUserData);
        this.userData=storedUserData;
        const hashedPassword = '$2b$12$39Zwv2vx3IUEpQ7g/axHLeyI68c4BvQVUl.HM3NcZS/mllLmeR2dG';

        // The plain text password input by the user
        const plainTextPassword = 'user_input_password';

        // Function to verify password
        const isMatch = bcrypt.compareSync(plainTextPassword, hashedPassword);

        if (isMatch) {
        console.log('Password matches!');
        } else {
        console.log('Password does not match!');
        }

        this.countryService.getCountries().then(countries => {
            this.countries = countries;
        });
    }
    onUpload(event:UploadEvent) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
    searchCountry(event: any) {
        // in a real application, make a request to a remote url with the query and return filtered results,
        // for demo we filter at client side
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.countries.length; i++) {
            const country = this.countries[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredCountries = filtered;
    }
    insertChangePassword(){
        this.spinner=true;

        const credentials = {
            old_password:this.userData.o_password,
            password:this.userData.n_password,
            confirm_password:this.userData.cn_password
        };

      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

      this.http.post(apiUrl+'/client_user/change_password', credentials,{ headers }).subscribe(
          (response) => {
            console.log(response);
            const res:any=response

            if(res.status){
              this.spinner=false;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Password Changed', life: 3000 });

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

changePassword(){
   this.visible2=true;



}
    check(){
        const hashedPassword = '$2b$12$39Zwv2vx3IUEpQ7g/axHLeyI68c4BvQVUl.HM3NcZS/mllLmeR2dG';

        // The plain text password input by the user
        const plainTextPassword = this.userData.o_password;
        console.log(this.userData.o_password);

        // Function to verify password
        const isMatch = bcrypt.compareSync(plainTextPassword, hashedPassword);

        if (isMatch) {
        console.log('Password matches!');
        } else {
        console.log('Password does not match!');
        }
    }
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          this.selectedFile = input.files[0];
        }
      }
    editUser() {
       this.visible=true;
    }
    Profilesave(){
        console.log(this.uploadedFiles);
        if(this.uploadedFiles){
        this.spinner=true;


        const formData = new FormData();
    // Append form data
    formData.append('client_name', this.userData.client_name);
    formData.append('client_address', this.userData.client_address);
    formData.append('client_mobile',this.userData.client_mobile);
    formData.append('client_email', this.userData.client_email);

    // Simulating file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      formData.append('file', fileInput.files[0]);
    }


      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

      this.http.post(apiUrl+'/client_user/client_logo_upload', formData,{ headers }).subscribe(
          (response) => {
            console.log(response);
            const res:any=response

            if(res.filename){
              this.spinner=false;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Profile Information Changed', life: 3000 });

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
      } else {
        console.error('No file selected');
      }
    }

}
