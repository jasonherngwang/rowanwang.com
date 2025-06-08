"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WATER_G_PER_FL_OZ = 29.5735295625;
const FORMULA_G_PER_FL_OZ = 4.4;
const FORMULA_TO_WATER_RATIO = FORMULA_G_PER_FL_OZ / WATER_G_PER_FL_OZ;

export default function FormulaCalculatorPage() {
  const [numBottles, setNumBottles] = useState(4);
  const [gramsPerBottle, setGramsPerBottle] = useState(100);
  const [bufferPercent, setBufferPercent] = useState(10);

  const totalGrams =
    numBottles * gramsPerBottle * (1 + bufferPercent / 100);
  const waterGrams = totalGrams / (1 + FORMULA_TO_WATER_RATIO);
  const formulaGrams = totalGrams - waterGrams;

  return (
    <div className="flex w-full min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Baby Formula Calculator</CardTitle>
          <CardDescription>
            Calculate grams of water and formula needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="bottle-slider" className="font-medium">
                Number of Bottles: {numBottles}
              </label>
              <Slider
                id="bottle-slider"
                min={1}
                max={12}
                step={1}
                value={[numBottles]}
                onValueChange={(value) => setNumBottles(value[0])}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="final-grams-slider" className="font-medium">
                Amount per Bottle: {gramsPerBottle}g
              </label>
              <Slider
                id="final-grams-slider"
                min={100}
                max={200}
                step={10}
                value={[gramsPerBottle]}
                onValueChange={(value) => setGramsPerBottle(value[0])}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="buffer-slider" className="font-medium">
                Buffer: {bufferPercent}%
              </label>
              <Slider
                id="buffer-slider"
                min={0}
                max={50}
                step={1}
                value={[bufferPercent]}
                onValueChange={(value) => setBufferPercent(value[0])}
              />
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <div className="flex flex-col gap-2 text-center">
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground">Water</span>
                  <span className="text-2xl font-bold font-mono">
                    {waterGrams.toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground">Formula</span>
                  <span className="text-2xl font-bold font-mono">
                    {formulaGrams.toFixed(1)}g
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold font-mono">
                    {totalGrams.toFixed(1)}g
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Based on 4.4g formula per 1 fl oz water (≈29.6g).
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
