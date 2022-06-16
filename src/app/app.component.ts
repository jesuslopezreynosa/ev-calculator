import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EV Conversion Calculator';

  /* Input Variables */
  public INPUT_GALTOKWH: number = 0;
  public INPUT_KWHTOGAL: number = 0;

  /* Input Variables */
  public OUTPUT_GALTOKWH = '';
  public OUTPUT_KWHTOGAL = '';

  /* Constants */
  private readonly GASOLINE_KWH = 33.7;

  private kWhToWh(kWh: number): number {
    if (kWh) {
      return (kWh * 1000);
    } else {
      throw new Error("Illegal argument");
    }
  }

  private WhTokWh(Wh: number): number {
    if (Wh) {
      return (Wh / 1000);
    } else {
      throw new Error("Illegal argument");
    }
  }

  public electricityToGallonsGasolineHandler(kWh: number) {
    try {
      this.OUTPUT_KWHTOGAL = this.electricityToGallonsGasoline(this.INPUT_KWHTOGAL)
        .toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' gal';
    } catch (error) {
      this.OUTPUT_KWHTOGAL = '';
      console.error(error);
    }
  }

  private electricityToGallonsGasoline(kWh: number): number {
    if (kWh) {
      return (kWh / this.GASOLINE_KWH);
    } else {
      throw new Error("Illegal argument");
    }
  }

  public gallonsGasolineToElectricityHandler(gals: number) {
    try {
      this.OUTPUT_GALTOKWH = this.gallonsGasolineToElectricity(this.INPUT_GALTOKWH)
        .toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' kWh';
    } catch (error) {
      this.OUTPUT_GALTOKWH = '';
      console.error(error);
    }
  }

  private gallonsGasolineToElectricity(gals: number): number {
    if (gals) {
      return (gals * this.GASOLINE_KWH);
    } else {
      throw new Error("Input must be a number greater than zero");
    }
  }
 
  // private milePerWhToWhPerMile(milesPerWh: number): number {
  //   if (milesPerWh) {
  //     int calc = 
  //   } else {
  //     throw new Error("Illegal argument");
  //   }
  // }
}
