import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "certificate",
    standalone: true
})
  export class VerifiedCertificatePipe implements PipeTransform {
    transform(items: any[]) {
        return items.filter(
            (cert) => {
                if(cert.status=='Verified'&&cert.profileVisibility==true) {
                    return cert;
                }
            }
        );
    }
  }