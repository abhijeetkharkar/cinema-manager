import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithSuffix',
})
export class NumberWithSuffixPipe implements PipeTransform {
  transform(input: any, fractionDigits?: number): string {
    const suffixes = ['T', 'M', 'B', 'T', 'Z'];

    if (Number.isNaN(input)) {
      return '';
    }

    if (input < 1000) {
      return input + '';
    }

    const exp = Math.floor(Math.log(input) / Math.log(1000));

    return (input / Math.pow(1000, exp)).toFixed(fractionDigits) + suffixes[exp - 1];
  }
}
