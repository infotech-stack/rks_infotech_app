import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import * as CryptoJS from 'crypto-js';
import html2canvas from 'html2canvas';
import jspdf, { jsPDF } from 'jspdf';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-employee-attendence',
  templateUrl: './employee-attendence.component.html',
  styleUrl: './employee-attendence.component.scss'
})
export class EmployeeAttendenceComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  @ViewChild('content', { static: false }) content!: ElementRef;
  //* -----------------------  Variable Declaration  -----------------------*//
  is_loading: boolean = false;
  filteredEmpId: any;
  employeeForm: FormGroup;
  is_filter: boolean = true;
  employeeAttendance: any[] = [];
  filteredAttendance: any;
  employeeList:any;
  employees: any[] = [];
  totalRecords!: number ;
  pageSize: number = 5;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 20, 0];
totalPages: number = 1;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private fb: FormBuilder,
     private _apiService: ApiService, 
    //  private cdRef: ChangeDetectorRef, 
     public dialog: MatDialog, 
     private _snakbar: SnackBarService) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit() {
    this.getAllEmployee();
    this.getEmployeeAttendance(this.currentPage);
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  getEmployeeAttendance(current_page:number) {

    this.is_loading = true;
    const limit = this.pageSize === 0 ? 0 : Number(this.pageSize);
    this._apiService.getEmployeeAttendance(current_page,this.pageSize).subscribe({
      next: (res) => {
        this.totalPages = this.pageSize === 0 ? Math.ceil(res.total / 10) : Math.ceil(res.total / Number(this.pageSize));
        this.is_loading=false;
        this._snakbar.success(res.message);
        this.employeeAttendance = res.data;
     
        
        this.filteredAttendance = [...this.employeeAttendance];
        this.is_filter = true;
        // this.cdRef.detectChanges();

      },
      error: (err) => {
        this.is_loading=false;
        this._snakbar.error('Something Went Wrong');
        this.is_filter = true;
        // this.cdRef.detectChanges();
        throw err;
      }
    });
  }
  getAllEmployee(){
    this._apiService.getAllEmployee().subscribe({
      next: (res) => {
        this.employeeList = res.data;
      },
      error: (err) => {
        throw err;
      }
    })
  }
  //* --------------------------  Public methods  --------------------------*//
  get formControls() {
    return this.employeeForm.controls;
  }
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getEmployeeAttendance(this.currentPage);
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = +target.value;
    this.currentPage = 1; // Reset to the first page when page size changes
    this.getEmployeeAttendance(this.currentPage);
  }
  //* ------------------------------ Helper Function -----------------------*//
  onSubmit() {
    this.filterEmpIdByName();
    let obj = {
      empId: this.filteredEmpId,
      login_date_from: this.employeeForm.controls['startDate'].value,
      login_date_to: this.employeeForm.controls['endDate'].value
    };
    this.is_loading = true;
    const limit = this.pageSize === 0 ? 0 : Number(this.pageSize);
    this._apiService.employeeFilter(obj.empId, obj.login_date_from, obj.login_date_to).subscribe({
      next: (res) => {
        this.is_loading = false;
        this._snakbar.success(res.message);
        this.is_filter = false;
        this.filteredAttendance = res.data;
      
        
        this.totalPages = this.pageSize === 0 ? Math.ceil(res.total / 10) : Math.ceil(res.total / Number(this.pageSize));
        // this.cdRef.detectChanges();
   
      },
      error: (error) => {
        this.is_loading = false;
        this._snakbar.error('Something Went Wrong');
        throw error;
      }
    });
  }
  filterAttendance(filterCriteria: any) {
    this.filteredAttendance = this.employeeAttendance.filter((employee: { employee_name: string; login_date_time: string; logout_date_time: string; }) => {
      const isNameMatch = !filterCriteria.name || employee.employee_name.toLowerCase().includes(filterCriteria.name.toLowerCase());
      const isStartDateMatch = !filterCriteria.startDate || this.isDateMatch(employee.login_date_time, filterCriteria.startDate);
      const isEndDateMatch = !filterCriteria.endDate || this.isDateMatch(employee.logout_date_time, filterCriteria.endDate);
      return isNameMatch && isStartDateMatch && isEndDateMatch;
    });
  }
  filterEmpIdByName() {
    const name = this.employeeForm.controls['name'].value;
    name?.trim().toLowerCase();
    const employee = this.employeeAttendance.find((emp: { employee_name: string; }) => emp.employee_name.toLowerCase() === name);
    if (employee) {
      this.filteredEmpId = employee.empId;
  

    } else {
      this.filteredEmpId = undefined;
    }
  }
  refreshData() {
  
    this.is_filter = true;
    this.getEmployeeAttendance(this.currentPage);
    this.employeeForm.reset();
  }
  private isDateMatch(dateTimeString: string, dateFilter: string): boolean {
    if (!dateTimeString) {
      return false;
    }
    const dateTime = new Date(dateTimeString);
    const filterDate = new Date(dateFilter);
    return dateTime.getFullYear() === filterDate.getFullYear() &&
      dateTime.getMonth() === filterDate.getMonth() &&
      dateTime.getDate() === filterDate.getDate();
  }
  // public convertToPDF(): void {
  //   const content: HTMLElement | null = document.getElementById('content');
  //   if (!content) {
  //     console.error('Element not found!');
  //     return;
  //   }
  
  //   const margin = 10; // Margin on all sides
  
  //   html2canvas(content, { scale: 2 }).then(canvas => {
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const imgWidth = 210 - 2 * margin; // A4 width in mm
  //     const pageHeight = 295; // A4 height in mm
  //     const imgHeight = canvas.height * imgWidth / canvas.width;
  //     let heightLeft = imgHeight;
  
  //     let position = margin;
  
  //     // Add the first page
  //     pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight - 2 * margin;
  
  //     // Add additional pages if content spans multiple pages
  //     while (heightLeft > 0) {
  //       pdf.addPage();
  //       position = heightLeft - imgHeight + margin;
  //       pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight - 2 * margin;
  //     }
  
  //     pdf.save('new-file.pdf');
  //   });
  // }
  public convertToPDF(): void {
    const content: HTMLElement | null = document.getElementById('content');
    if (!content) {
      console.error('Element not found!');
      return;
    }
  
    const margin = 10; // Margin on all sides
    const padding = 15; // Padding on all sides
  
    html2canvas(content, { scale: 2 }).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 295; // A4 height in mm
      const imgWidth = pdfWidth - 2 * margin; // Image width minus margins
      const imgHeight = canvas.height * imgWidth / canvas.width; // Calculate image height based on aspect ratio
      let position = margin; // Starting position
  
      // Add the first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, position, imgWidth, imgHeight);
  
      let heightLeft = imgHeight - (pdfHeight - 2 * margin);
  
      // Add additional pages if content spans multiple pages
      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + margin;
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 2 * margin;
      }
  
      pdf.save('new-file.pdf');
    });
  }
  

  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };
  formatDateTime12Hour(dateTime:any) {
    const date = new Date(dateTime);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} `;
  
    return `${year}-${month}-${day} ${formattedTime}`;
  }
  //! -------------------------------  End  --------------------------------!//
}
