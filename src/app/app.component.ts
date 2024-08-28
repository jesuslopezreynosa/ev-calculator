import { Component } from '@angular/core';

import { Units } from './shared/units';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    readonly Units = Units;

    readonly title = 'EV Conversion Calculator';

    /* Input Variables */
    public INPUT_COST_PER_KWH: number = 0;

    public INPUT_COST_MILES: number = 0;
    public INPUT_COST_EFFICIENCY: number = 0;
    public INPUT_FOSSIL_MPG: number = 25;

    public INPUT_COST_KM: number = 0;
    public INPUT_COST_EFFICIENCY_KM: number = 0;
    public INPUT_FOSSIL_L_PER_100KM: number = 9.0;

    /* Output Variables */
    public OUTPUT_GALTOKWH = '';
    public OUTPUT_KWHTOGAL = '';

    /* Constants [Units: (INPUT_->_OUTPUT)] */
    private readonly GAL_GASOLINE_KWH = 33.705; // US EPA
    private readonly GAL_DIESEL_KWH = this.GAL_GASOLINE_KWH * 1.13; // US DOE (https://afdc.energy.gov/files/u/publication/fuel_comparison_chart.pdf)
    // private readonly GAL_PROPANE_LPG_KWH = this.GAL_GASOLINE_KWH * 0.73; // US DOE (https://afdc.energy.gov/files/u/publication/fuel_comparison_chart.pdf)
    // private readonly GAL_ETHANOL_E100_KWH = this.GAL_GASOLINE_KWH * 0.67; // US DOE (https://afdc.energy.gov/files/u/publication/fuel_comparison_chart.pdf)
    private readonly GAL_TO_LITRE = 3.79;
    // private readonly KWH_TO_WH = 1000;
    // private readonly MI_TO_KM = 1.61;
    // private readonly KM_TO_M = 1000;
    private readonly WH_PER_KM_TO_KWH_PER_100KM: number = 10;
    private readonly KWH_PER_LITRE = this.GAL_GASOLINE_KWH / this.GAL_TO_LITRE;

    public getLitresPer100KmEquivalent(efficiencyWhPerKm: number): number {
        return efficiencyWhPerKm / (this.KWH_PER_LITRE * this.WH_PER_KM_TO_KWH_PER_100KM);
    }

    public gallonsToLitres(gallons: number): number {
        return gallons * this.GAL_TO_LITRE;
    }

    public getGasEquivalent(costPerKwh: number, efficiencyWhPerUnit: number, outputUnit: Units): number {
        const TOTAL_ENERGY_KWH = costPerKwh * efficiencyWhPerUnit / 1000;

        return this.electricityToUnitsGasoline(TOTAL_ENERGY_KWH, outputUnit) as number;
    }

    public getDieselEquivalent(costPerKwh: number, efficiencyWhPerUnit: number, outputUnit: Units): number {
        const TOTAL_ENERGY_KWH = (costPerKwh * efficiencyWhPerUnit) / 1000;

        return this.electricityToGallonsDiesel(TOTAL_ENERGY_KWH, outputUnit) as number;
    }

    public electricityToUnitsGasoline(energyKwh: number, outputUnit: Units): number | undefined {
        if (energyKwh !== 0) {
            const GAL_VALUE = energyKwh / this.GAL_GASOLINE_KWH;

            if (outputUnit == Units.LITRES) {
                return this.gallonsToLitres(GAL_VALUE);
            } else {
                return GAL_VALUE;
            }
        } else {
            return undefined;
        }
    }

    public electricityToGallonsDiesel(energyKwh: number, outputUnit: Units): number | undefined {
        if (energyKwh !== 0) {
            const GAL_VALUE = energyKwh / this.GAL_DIESEL_KWH;

            if (outputUnit == Units.LITRES) {
                return this.gallonsToLitres(GAL_VALUE);
            } else {
                return GAL_VALUE;
            }
        } else {
            return undefined;
        }
    }

    public getMpgEquivalent() {
        return this.GAL_GASOLINE_KWH / this.INPUT_COST_EFFICIENCY * 1000;
    }

    public calculateCostFromEfficiency(costPerKWh: number, distance: number, efficiencyWhPerUnit: number) {
        return costPerKWh * distance * efficiencyWhPerUnit / 1000;
    }

    public getUsdCurrencyStringFromNumber(currencyValue: number): string {
        return currencyValue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }

    public getGasPriceEquivalent(inputRange: number, fossilEfficiency: number, electricEfficiencyWhPerUnit: number, inputUnit: Units): string {
        const ELECTRIC_COST = this.calculateCostFromEfficiency(this.INPUT_COST_PER_KWH, inputRange, electricEfficiencyWhPerUnit);

        if (inputUnit == Units.KILOMETERS) {
            return this.getUsdCurrencyStringFromNumber(1/((fossilEfficiency * inputRange) / ELECTRIC_COST) * 100); // Correct math
        } else {
            const FUEL_QUANTITY = inputRange / fossilEfficiency;
            return this.getUsdCurrencyStringFromNumber(ELECTRIC_COST / FUEL_QUANTITY);
        }
    }

}