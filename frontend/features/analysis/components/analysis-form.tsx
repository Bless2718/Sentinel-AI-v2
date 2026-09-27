"use client";

import { useState } from "react";

import AnalysisOptions, {
  type AnalysisConfiguration,
} from "./analysis-options";
import AnalysisUpload from "./analysis-upload";
import CreateAnalysisButton from "./create-analysis-button";

interface AnalysisFormProps {
  onDatasetUploaded: (datasetId: string) => void;
}

export default function AnalysisForm({
  onDatasetUploaded,
}: AnalysisFormProps) {
  const [datasetId, setDatasetId] = useState<string | null>(null);

  const [configuration, setConfiguration] =
    useState<AnalysisConfiguration>({
      analysisName: "",
      forecastGoal: "Complete Intelligence Report",
      predictionWindow: "30 Days",
      geographicScope: "Entire Dataset",
      forecastModel: "Automatic (Recommended)",
    });

  function handleDatasetUploaded(id: string) {
    setDatasetId(id);
    onDatasetUploaded(id);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <AnalysisOptions onChange={setConfiguration} />

      <AnalysisUpload
        onDatasetUploaded={handleDatasetUploaded}
      />

      <CreateAnalysisButton
        datasetId={datasetId}
        configuration={configuration}
      />
    </div>
  );
}