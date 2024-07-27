import { Component } from '@angular/core';

import { Units } from './shared/units';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    readonly title = 'EV Conversion Calculator';

    /* Input Variables */
    public INPUT_GALTOKWH: number = 0;
    public INPUT_KWHTOGAL: number = 0;
    public INPUT_COST_PER_KWH: number = 0;
    public INPUT_COST_MILES: number = 0;
    public INPUT_COST_EFFICIENCY: number = 0;
    public INPUT_GAS_COST: number = 4.10;
    public INPUT_FOSSIL_MPG: number = 25;

    /* Input Variables */
    public OUTPUT_GALTOKWH = '';
    public OUTPUT_KWHTOGAL = '';

    /* Constants [Units: (INPUT_->_OUTPUT)] */
    private readonly GAL_GASOLINE_KWH = 33.705; // US EPA
    private readonly GAL_DIESEL_KWH = this.GAL_GASOLINE_KWH * 1.13; // US DOE (https://afdc.energy.gov/files/u/publication/fuel_comparison_chart.pdf)
    private readonly GAL_PROPANE_LPG_KWH = this.GAL_GASOLINE_KWH * 0.73; // US DOE (https://afdc.energy.gov/files/u/publication/fuel_comparison_chart.pdf)
    private readonly GAL_ETHANOL_E100_KWH = this.GAL_GASOLINE_KWH * 0.67; // US DOE (https://afdc.energy.gov/files/u/publication/fuel_comparison_chart.pdf)
    private readonly GAL_TO_LITRE = 3.79;
    private readonly LITRE_TO_GAL = 1 / this.GAL_TO_LITRE;
    private readonly KWH_TO_WH = 1000;
    private readonly MI_TO_KM = 1.61;
    private readonly KM_TO_M = 1000;

    private kWhToWh(kWh: number): number {
        if (kWh) {
            return (kWh * this.KWH_TO_WH);
        } else {
            throw new Error("Illegal argument");
        }
    }

    private WhTokWh(Wh: number): number {
        if (Wh) {
            return (Wh / this.KWH_TO_WH);
        } else {
            throw new Error("Illegal argument");
        }
    }

    private milesToKilometers(miles: number): number {
        if (miles) {
            return (miles * this.MI_TO_KM);
        } else {
            throw new Error("Illegal argument");
        }
    }

    private kilometersToMeters(kilometers: number): number {
        if (kilometers) {
            return (kilometers * this.KM_TO_M);
        } else {
            throw new Error("Illegal argument");
        }
    }

    public conversionHandler(value: number, inputUnit: string, outputUnit: string, isOutputCurrency: boolean = false): string {
        if (inputUnit === Units.KILOWATT_HOURS) {
            switch (outputUnit) {
                case Units.WATT_HOURS:
                    return this.numericFormattingHandler(this.kWhToWh(value), Units.WATT_HOURS);
                case Units.GALLONS:
                    return this.numericFormattingHandler(this.electricityToGallonsGasoline(value), Units.GALLONS);
                // kWh to Litre of Gasoline
            }
        } else if (inputUnit === Units.WATT_HOURS) {
            switch (outputUnit) {
                case Units.KILOWATT_HOURS:
                    return this.numericFormattingHandler(this.WhTokWh(value), Units.KILOWATT_HOURS);
                case Units.GALLONS:
                    return this.conversionHandler(this.WhTokWh(value), Units.KILOWATT_HOURS, Units.GALLONS);
                // Wh to Litre of Gasoline
            }
        } else if (inputUnit === Units.MILES) {
            switch (outputUnit) {
                case Units.KILOMETERS:
                    return this.numericFormattingHandler(this.milesToKilometers(value), Units.KILOMETERS);
                case Units.METERS:
                    return this.conversionHandler(this.milesToKilometers(value), Units.KILOMETERS, Units.METERS);
            }
        }

        return 'No Conversion Found';
    }

    private numericFormattingHandler(value: number, unit: string): string {
        return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${unit}`;
    }

    public electricityToGallonsGasolineHandler(kWh: number) {
        try {
            this.OUTPUT_KWHTOGAL = this.numericFormattingHandler(this.electricityToGallonsGasoline(this.INPUT_KWHTOGAL), 'gal');
        } catch (error) {
            this.OUTPUT_KWHTOGAL = '';
            console.error(error);
        }
    }

    public electricityToGallonsGasoline(kWh: number): number {
        if (kWh) {
            return (kWh / this.GAL_GASOLINE_KWH);
        } else {
            throw new Error("Input must be a number greater than zero");
        }
    }

    public getGasEquivalent() {
        const TOTAL_ENERGY_KWH = this.INPUT_COST_MILES * this.INPUT_COST_EFFICIENCY / 1000;
        return this.electricityToGallonsGasoline(TOTAL_ENERGY_KWH);
    }

    public getMpgEquivalent() {
        return this.GAL_GASOLINE_KWH / this.INPUT_COST_EFFICIENCY * 1000;
    }

    public electricityToGallonsDiesel(kWh: number): number {
        if (kWh) {
            return (kWh / this.GAL_DIESEL_KWH);
        } else {
            throw new Error("Input must be a number greater than zero");
        }
    }

    public gallonsGasolineToElectricityHandler(gals: number) {
        try {
            this.OUTPUT_GALTOKWH = this.numericFormattingHandler(this.gallonsGasolineToElectricity(this.INPUT_GALTOKWH), 'kWh');
        } catch (error) {
            this.OUTPUT_GALTOKWH = '';
            console.error(error);
        }
    }

    public calculateCostFromEfficiency(costPerKWh: number, milage: number, efficiencyWhPerMile: number) {
        return costPerKWh * milage * efficiencyWhPerMile / 1000;
    }

    public calculateFossilFuelCost(totalCost: number, totalMilage: number, efficiencyMilesPerGallon: number) {
        return totalCost * efficiencyMilesPerGallon / totalMilage;
    }

    public getUsdCurrenctStringFromNumber(currencyValue: number): string {
        return currencyValue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }

    public getGasPriceEquivalent() {
        const GALLONS = this.INPUT_COST_MILES / this.INPUT_FOSSIL_MPG;
        const ELECTRIC_COST = this.calculateCostFromEfficiency(this.INPUT_COST_PER_KWH, this.INPUT_COST_MILES, this.INPUT_COST_EFFICIENCY);

        return this.getUsdCurrenctStringFromNumber(ELECTRIC_COST / GALLONS);
    }

    private gallonsGasolineToElectricity(gals: number): number {
        if (gals) {
            return (gals * this.GAL_GASOLINE_KWH);
        } else {
            throw new Error("Input must be a number greater than zero");
        }
    }

    private equvalentGasolineCostFromElectricity(costPerkWh: number): number {
        if (costPerkWh && costPerkWh >= 0) {
            return (costPerkWh * this.GAL_GASOLINE_KWH);
        } else {
            throw new Error("Input must be positive");
        }
    }

    private equvalentElectricityCostFromGasoline(costOfGasoline: number): number {
        if (costOfGasoline && costOfGasoline >= 0) {
            return (costOfGasoline / this.GAL_GASOLINE_KWH);
        } else {
            throw new Error("Input must be positive");
        }
    }

    private milesPerGallonToMilesPerkWh(milesPerGallon: number): number {
        if (milesPerGallon && milesPerGallon >= 0) {
            return milesPerGallon / this.GAL_GASOLINE_KWH;
        } else {
            throw new Error("Input must be positive");
        }
    }

    private milesPerkWhToWhPerMile(milesPerkWh: number): number {
        if (milesPerkWh && milesPerkWh >= 0) {
            if (milesPerkWh == 0) {
                return 0;
            }
            return (1 / milesPerkWh) * 100;
        } else {
            throw new Error("Input must be positive");
        }
    }

    private WhPerMileToMilesPerkWh(WhPerMile: number): number {
        if (WhPerMile && WhPerMile >= 0) {
            if (WhPerMile == 0) {
                return 0;
            }
            return (1 / (WhPerMile / 1000));
        } else {
            throw new Error("Input must be positive");
        }
    }
}
