
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Company } from 'src/app/demo/api/company';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProjectComponent implements OnInit{
  productDialog: boolean = false;

  products!: Company[];
  companys!: any[];
  models!: any[];

  product!: Company;

  selectedProducts!: Company[] | null;

  submitted: boolean = false;

  statuses!: any[];
  companyList:any=[]
  productList:any=[]
  modelList:any=[]
  countries: any[] | undefined;
  selectedCountry: any | undefined;
userForm: FormGroup;
ct:any;
value:any='';
editMode:boolean=false;
spinner:boolean=false;
client_id:number=(+localStorage.getItem('c_id'))
  constructor(private router: Router,private formBuilder: FormBuilder,private http:HttpClient ,private productService: ProductService,
     private messageService: MessageService, private confirmationService: ConfirmationService,private api:ApiService) {
    this.userForm = this.formBuilder.group({
      organization_id: ['0', Validators.required],
      p_id: [''],
      name: ['', Validators.required],
    //   project_id:['', Validators.required],
    //   email: ['', Validators.required],
    //   password: ['', Validators.required],
    });
   }

  ngOnInit() {
    this.ct=this.userForm.controls
  this.getDeviceCompany();
  // this.getDeviceProduct();
  this.getDeviceModel();

  }
  getDeviceModel(){
const apiUrl = this.api.baseUrl;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
  const credentials = {
    client_id:this.client_id
  };
  this.spinner=true;
  this.http.post(apiUrl+'/client/manage_projects/list', credentials,{ headers }).subscribe(
      (response) => {
        this.spinner=false;
        console.log(response);
        this.modelList=response
        this.models=this.modelList.data

      },
      (error) => {
        if(error.status=='401'){
          this.router.navigate(['/']);

         }
        console.log(error.status);
        this.spinner=false;
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side!!', life: 3000 });
      }

    );
}
getDeviceCompany(){
  const apiUrl = this.api.baseUrl;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const credentials = {
      client_id:this.client_id
    };
    this.spinner=true;
    this.http.post(apiUrl+'/client/manage_organization/list',credentials, { headers }).subscribe(
        (response) => {
          this.spinner=false;
          console.log(response);
          this.companyList=response
          this.companys=this.companyList.data

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

  openNew() {
      this.editMode=false;
      this.userForm.reset();
      this.userForm.patchValue({
        organization_id:0
      });
      this.value='';
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
  }

  deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete the selected products?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter((organization_id) => !this.selectedProducts?.includes(organization_id));
              this.selectedProducts = null;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
          }
      });
  }
  changePass(){
    this.editMode=false

  }

  editProduct(product: Company) {
    this.editMode=true;

      this.product = { ...product };
      this.productDialog = true;
      this.userForm.patchValue({
        organization_id:product.organization_id,
        p_id:product.project_id,
        name:product.project_name,
        // email:product.user_email,
        // password:product.password,
      })
  }

  deleteProduct(product: Company) {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete ' + product.project_name + '?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.DeleteCompany(product.project_id);

          }
      });
  }

  hideDialog() {
    this.value=''
      this.productDialog = false;
      // this.submitted = false;
  }

  saveProduct() {
      // this.submitted = true;
      // if(this.ct.password.value==this.value){

        if (this.product.project_id) {

              this.updateCompany(this.ct.organization_id.value,this.ct.user_id.value,this.ct.name.value)
              this.productDialog = false;
              this.product = {};

            // this.products[this.findIndexById(this.product.organization_id)] = this.product;
        } else {

            this.AddCompany(this.ct.organization_id.value,this.ct.name.value);
            this.productDialog = false;
            this.product = {};


        }

        // this.products = [...this.products];

    //   }
    //  else{
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'password and Confirm password can not matched', life: 3000 });


    //  }

  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].organization_id === id) {
              index = i;
              break;
          }
      }

      return index;
  }


  updateCompany(o_id,u_id,u_name){
      const credentials = {
          organization_id:o_id,
          project_id:u_id,
          project_name:u_name,
        //   email:email,

          // password:pass,
        };
      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

      this.spinner=true;
      this.http.post(apiUrl+'/client/manage_projects/edit', credentials,{ headers }).subscribe(
          (response) => {
            this.spinner=false;
            console.log(response);

            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Updated', life: 3000 });
            this.getDeviceModel();
          },
          (error) => {
        if(error.status=='401'){
          this.router.navigate(['/']);

         }
        console.log(error.status);
            this.spinner=false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Related Issue!!', life: 3000 });
            console.error(error);
          }
        );
  }
  AddCompany(o_id,name){
      const credentials = {
          organization_id:o_id,
          project_name:name,
        //   email:email,
        //   password:pass,
        //   confirm_password:pass
        };
      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

      this.spinner=true;
      this.http.post(apiUrl+'/client/manage_projects/add', credentials,{ headers }).subscribe(
          (response) => {
            this.spinner=false;
            console.log(response);

            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Created', life: 3000 });
            this.getDeviceModel();
          },
          (error) => {
        if(error.status=='401'){
          this.router.navigate(['/']);

         }
        console.log(error.status);
            this.spinner=false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Related Issue!!', life: 3000 });
            console.error(error);
          }
        );
  }
  DeleteCompany(user:any){

      const credentials = {
          project_id:user
        };
      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

      this.spinner=true;
      this.http.post(apiUrl+'/client/manage_projects/delete', credentials,{ headers }).subscribe(
          (response) => {
            this.spinner=false;
            console.log(response);

            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Deleted', life: 3000 });
            this.getDeviceModel();
          },
          (error) => {
        if(error.status=='401'){
          this.router.navigate(['/']);

         }
        console.log(error.status);
            this.spinner=false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Related Issue!!', life: 3000 });
            console.error(error);
          }
        );
  }
}
