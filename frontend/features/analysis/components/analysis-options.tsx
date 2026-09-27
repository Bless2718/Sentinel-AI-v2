"use client";

import { useState } from "react";

export interface AnalysisConfiguration {
  analysisName: string;
  forecastGoal: string;
  predictionWindow: string;
  geographicScope: string;
  forecastModel: string;
}

interface AnalysisOptionsProps {
  onChange?: (configuration: AnalysisConfiguration) => void;
}

export default function AnalysisOptions({
  onChange,
}: AnalysisOptionsProps) {
  const [configuration, setConfiguration] =
    useState<AnalysisConfiguration>({
      analysisName: "",
      forecastGoal: "Complete Intelligence Report",
      predictionWindow: "30 Days",
      geographicScope: "Entire Dataset",
      forecastModel: "Automatic (Recommended)",
    });

  function updateConfiguration(
    field: keyof AnalysisConfiguration,
    value: string,
  ) {
    const updatedConfiguration = {
      ...configuration,
      [field]: value,
    };

    setConfiguration(updatedConfiguration);
    onChange?.(updatedConfiguration);
  }

  const inputClassName =
    "w-full rounded-xl border border-white/[0.09] bg-[#080610] px-4 py-3 font-serif text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-600 hover:border-white/[0.14] focus:border-violet-400/50 focus:bg-[#0a0812] focus:ring-2 focus:ring-violet-400/[0.08]";

  const labelClassName =
    "mb-2 block font-serif text-sm font-medium tracking-[-0.01em] text-slate-300";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090711]/75 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-violet-500/[0.08] blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-24 h-48 w-48 rounded-full bg-purple-600/[0.045] blur-3xl" />

      <div className="relative">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-violet-300 to-purple-600" />

            <h2 className="font-serif text-2xl font-semibold tracking-[-0.025em] text-white">
              Analysis Configuration
            </h2>
          </div>

          <p className="max-w-2xl font-serif text-sm leading-6 text-slate-400">
            Define how Sentinel AI should process, analyze and
            forecast the uploaded crime intelligence dataset.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Analysis Name */}
          <div>
            <label
              htmlFor="analysis-name"
              className={labelClassName}
            >
              Analysis Name
            </label>

            <input
              id="analysis-name"
              type="text"
              value={configuration.analysisName}
              onChange={(event) =>
                updateConfiguration(
                  "analysisName",
                  event.target.value,
                )
              }
              placeholder="e.g. Crime Forecast 2026"
              className={inputClassName}
            />
          </div>

          {/* Analysis Goal */}
          <div>
            <label
              htmlFor="forecast-goal"
              className={labelClassName}
            >
              Analysis Goal
            </label>

            <select
              id="forecast-goal"
              value={configuration.forecastGoal}
              onChange={(event) =>
                updateConfiguration(
                  "forecastGoal",
                  event.target.value,
                )
              }
              className={inputClassName}
            >
              <option value="Crime Forecasting">
                Crime Forecasting
              </option>

              <option value="Crime Hotspot Prediction">
                Crime Hotspot Prediction
              </option>

              <option value="Crime Trend Analysis">
                Crime Trend Analysis
              </option>

              <option value="Geospatial Risk Analysis">
                Geospatial Risk Analysis
              </option>

              <option value="Complete Intelligence Report">
                Complete Intelligence Report
              </option>
            </select>
          </div>

          {/* Prediction Window */}
          <div>
            <label
              htmlFor="prediction-window"
              className={labelClassName}
            >
              Prediction Window
            </label>

            <select
              id="prediction-window"
              value={configuration.predictionWindow}
              onChange={(event) =>
                updateConfiguration(
                  "predictionWindow",
                  event.target.value,
                )
              }
              className={inputClassName}
            >
              <option value="7 Days">7 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="90 Days">90 Days</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Geographic Scope */}
          <div>
            <label
              htmlFor="geographic-scope"
              className={labelClassName}
            >
              Geographic Scope
            </label>

            <select
              id="geographic-scope"
              value={configuration.geographicScope}
              onChange={(event) =>
                updateConfiguration(
                  "geographicScope",
                  event.target.value,
                )
              }
              className={inputClassName}
            >
              <option value="Entire Dataset">
                Entire Dataset
              </option>

              <option value="District">
                District
              </option>

              <option value="Police Beat">
                Police Beat
              </option>

              <option value="Neighborhood">
                Neighborhood
              </option>
            </select>
          </div>

          {/* Forecast Model */}
          <div className="md:col-span-2">
            <label
              htmlFor="forecast-model"
              className={labelClassName}
            >
              Forecast Model
            </label>

            <select
              id="forecast-model"
              value={configuration.forecastModel}
              onChange={(event) =>
                updateConfiguration(
                  "forecastModel",
                  event.target.value,
                )
              }
              className={inputClassName}
            >
              <option value="Automatic (Recommended)">
                Automatic (Recommended)
              </option>

              <option value="ARIMA">
                ARIMA
              </option>

              <option value="Random Forest">
                Random Forest
              </option>

              <option value="XGBoost">
                XGBoost
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}