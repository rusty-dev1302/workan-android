import { Pipe } from "@angular/core";

@Pipe({
    name: "phone",
    standalone: true
})
  export class PhonePipe {
    transform(rawNumStr:number) {

      let rawNum = rawNumStr+""
      rawNum = "+1"+ rawNum;
  
      const countryCodeStr = rawNum.slice(0,2);
      const areaCodeStr = rawNum.slice(2,5);
      const midSectionStr = rawNum.slice(5,8);
      const lastSectionStr = rawNum.slice(8);
  
      return `${countryCodeStr} (${areaCodeStr}) ${midSectionStr}-${lastSectionStr}`;
    }
  }