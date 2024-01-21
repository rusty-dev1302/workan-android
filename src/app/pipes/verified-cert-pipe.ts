import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "certificate"
  })
  export class VerifiedCertificatePipe implements PipeTransform {
    transform(items: any[]) {
        return items.filter(
            (cert) => {
                if(cert.status=='Verified') {
                    return cert;
                }
            }
        );
    }
  }