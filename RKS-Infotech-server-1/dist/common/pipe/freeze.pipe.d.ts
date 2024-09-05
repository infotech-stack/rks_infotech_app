import { PipeTransform } from '@nestjs/common';
export declare class FreezePipe implements PipeTransform {
    private readonly logger;
    transform(value: any): any;
}
