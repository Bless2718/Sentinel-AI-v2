"use client";

import { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

import { uploadDataset } from "../api";

interface AnalysisUploadProps {
  onDatasetUploaded: (
    datasetId: string,
  ) => void;
}

export default function AnalysisUpload({
  onDatasetUploaded,
}: AnalysisUploadProps) {
  const [file, setFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [datasetId, setDatasetId] =
    useState<string | null>(null);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    multiple: false,

    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        [".xlsx"],
    },

    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      const selectedFile =
        acceptedFiles[0];

      setFile(selectedFile);
      setError(null);
      setDatasetId(null);
      setUploading(true);

      try {
        const result =
          await uploadDataset(
            selectedFile,
          );

        setDatasetId(
          result.dataset_id,
        );

        onDatasetUploaded(
          result.dataset_id,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Dataset upload failed.",
        );
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#090711]/75 p-8 shadow-xl shadow-black/30 backdrop-blur-xl">

      <h2 className="font-serif text-2xl font-semibold tracking-[-0.02em] text-white">
        Dataset Intelligence
      </h2>

      <p className="mt-2 font-serif text-slate-400">
        Upload a crime dataset to begin automated validation and forecasting.
      </p>

      <div
        {...getRootProps()}
        className={`mt-8 cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center backdrop-blur-xl transition-all duration-300 ${
          isDragActive
            ? "border-violet-400/70 bg-violet-500/[0.08] shadow-[0_0_35px_rgba(139,92,246,0.12)]"
            : "border-white/[0.10] bg-white/[0.015] hover:border-violet-400/40 hover:bg-violet-500/[0.025]"
        }`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-violet-300" />
        ) : (
          <UploadCloud className="mx-auto h-12 w-12 text-violet-300" />
        )}

        <h3 className="mt-5 font-serif text-xl font-semibold tracking-[-0.01em] text-white">
          {uploading
            ? "Uploading Dataset..."
            : "Drag & Drop Dataset"}
        </h3>

        <p className="mt-2 font-serif text-slate-400">
          CSV or Excel (.xlsx)
        </p>

        <p className="mt-4 font-serif text-sm text-slate-500">
          or click to browse files
        </p>
      </div>

      {file && (
        <div className="mt-8 rounded-xl border border-violet-400/[0.16] bg-violet-500/[0.045] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.15)]">

          <div className="flex items-center gap-3">

            <FileSpreadsheet className="text-violet-300" />

            <div>
              <h3 className="font-serif font-semibold text-white">
                {file.name}
              </h3>

              <p className="font-serif text-sm text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {datasetId && (
              <CheckCircle2 className="ml-auto text-violet-300" />
            )}

          </div>

          {datasetId && (
            <p className="mt-3 font-serif text-xs text-slate-400">
              Dataset uploaded successfully.
            </p>
          )}

        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-400/[0.18] bg-red-500/[0.06] p-4 font-serif text-sm text-red-300">
          {error}
        </div>
      )}

    </div>
  );
}