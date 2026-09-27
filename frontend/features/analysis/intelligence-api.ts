export interface DateRange {
  start: string;
  end: string;
}

export interface CrimeType {
  crime_type: string;
  count: number;
}

export interface Neighborhood {
  neighborhood: string;
  count: number;
}

export interface DatasetIntelligence {
  total_rows?: number;
  total_columns?: number;
  columns?: string[];
  detected_schema?: Record<string, unknown>;
  crime_type_count?: number;
  top_crime_types?: CrimeType[];
  most_common_crime?: CrimeType;
  most_common_crime_concentration?: number;
  neighborhood_count?: number;
  top_neighborhoods?: Neighborhood[];
  unique_locations?: number;
  date_range?: DateRange | null;
  year_range?: string;
  yearly_crime_counts?: Record<string, number>;
  monthly_crime_counts?: Record<string, number>;
  geographic_points?: number;
  invalid_coordinates?: number;
  missing_values?: unknown;
}

export interface Preprocessing {
  rows_before?: number;
  rows_after?: number;
  rows_removed?: number;
  mapping?: Record<string, string>;
  warnings?: string[];
}

export interface TrendSummary {
  trend?: string;
  seasonal_periods?: number;
  anomaly_count?: number;
}

export interface SeasonalityPoint {
  month: number;
  average_crime: number;
}

export interface TrendData {
  trend?: string;
  summary?: TrendSummary;
  seasonality?: SeasonalityPoint[];
  anomalies?: unknown[];
}

export interface ForecastPrediction {
  period: number | string;
  prediction: number;
}

export interface ForecastModel {
  model_name?: string;
  mae?: number;
  rmse?: number;
  r2_score?: number;
  confidence?: number;
  predictions?: ForecastPrediction[];
}

export interface ForecastBestForecast {
  model_name?: string;
  trend?: string;
  mae?: number;
  rmse?: number;
  r2_score?: number;
  confidence?: number;
  predictions?: ForecastPrediction[];
}

export interface ForecastData {
  models?: Record<string, ForecastModel>;
  best_model?: string;
  best_forecast?: ForecastBestForecast;
  comparison?: unknown;
}

export interface Risk {
  risk_score?: number;
  risk_level?: string;
  confidence?: number;
  recommendations?: string[];
  alerts?: string[];
}

export interface Intelligence {
  trend?: string;
  summary?: string;
  recommendation?: string;
}

export interface GeospatialData {
  summary?: unknown;
  statistics?: unknown;
  hotspots?: unknown[];
  clusters?: unknown[];
  heatmap?: unknown;
  geojson?: unknown;
  ai?: unknown;
}

export interface IntelligenceResponse {
  dataset?: DatasetIntelligence;
  preprocessing?: Preprocessing;
  geospatial?: GeospatialData;
  trends?: TrendData;
  forecast?: ForecastData;
  risk?: Risk;
  intelligence?: Intelligence;
  forecast_periods?: number;
  previous?: unknown;
}

export type ForecastPeriod = 1 | 3 | 6 | 12 | 24 | 36;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function generateIntelligence(
  datasetId: string,
  periods: ForecastPeriod = 12,
): Promise<IntelligenceResponse> {
  const response = await fetch(
    `${API_BASE_URL}/intelligence/${datasetId}?periods=${periods}`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    let detail = "Failed to generate intelligence.";

    try {
      const data = await response.json();

      if (data?.detail) {
        detail = data.detail;
      }
    } catch {
      // Keep default error.
    }

    throw new Error(detail);
  }

  return response.json();
}