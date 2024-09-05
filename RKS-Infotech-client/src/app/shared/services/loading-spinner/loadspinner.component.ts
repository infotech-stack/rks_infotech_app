import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
     <div class="loader">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
  `,
  styles: [
    `
      @keyframes moveAndHide {
    0% {
      opacity: 0;
      transform: translateX(0);
    }
    30% {
      opacity: 1;
      transform: translateX(20px);
    }
    100% {
      opacity: 0;
      transform: translateX(40px); 
    }
  }
  
  .loader {
    display: flex;
    width: 120px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .dot {
    width: 20px; 
    height: 20px;
    background-color: #3498db; 
    border-radius: 50%;
    display: inline-block;
    animation: moveAndHide 1s ease-in-out infinite; 
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.5s; 
  }
  
  .dot:nth-child(3) {
    animation-delay: 1s; 
  }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class LoadingSpinnerComponent implements OnInit {
  title: any;
  message: any;

  constructor() { }

  ngOnInit(): void { }
}
// @Component({
//   selector: 'app-loading-spinner',
//   template: `
//     <div class="overlay">
//       <div class="lds-ripple">
//         <div></div>
//         <div></div>
//       </div>
//     </div>
//   `,
//   styles: [
//     `
//       :host {
//         display: block;
//         height: 100%;
//       }

//       .overlay {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         background-color: rgba(255, 255, 255, 0.8);
//         z-index: 1000;
//       }

//       .lds-ripple {
//         display: inline-block;
//         position: relative;
//         width: 100px;
//         height: 100px;
//       }

//       .lds-ripple div {
//         position: absolute;
//         border: 4px solid #3366ff;
//         opacity: 1;
//         border-radius: 50%;
//         animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
//       }

//       .lds-ripple div:nth-child(2) {
//         animation-delay: -0.5s;
//       }

//       @keyframes lds-ripple {
//         0% {
//           top: 50%;
//           left: 50%;
//           width: 0;
//           height: 0;
//           opacity: 1;
//           transform: translate(-50%, -50%);
//         }
//         100% {
//           top: 50%;
//           left: 50%;
//           width: 100px;
//           height: 100px;
//           opacity: 0;
//           transform: translate(-50%, -50%);
//         }
//       }
//     `,
//   ],
//   encapsulation: ViewEncapsulation.None,
// })