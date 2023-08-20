import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  product!: Product;
  currentProductId: number = 0;
  currentSlotDay: string = "";
  currentSlotTime: string = "";

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.handleProductsRouting();
    });
  }

  handleProductsRouting() {
    if(this.route.snapshot.paramMap.has("id")) {
      this.currentProductId = +this.route.snapshot.paramMap.get("id")!;
      // this.productService.getProductById(this.currentProductId).subscribe(
      //   (data) => {
      //     this.product = data;
      //   }
      // );
    }
  }


  setSlotDay(slotDay: string) {
    this.currentSlotDay = slotDay;
  }

  setSlotTime(slotTime: string) {
    this.currentSlotTime = slotTime;
  }

}
