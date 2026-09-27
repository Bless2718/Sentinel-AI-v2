"use client";

import { FormEvent, useState } from "react";
import {
  Bot,
  Loader2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { askSentinelAI } from "../api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SentinelChatProps {
  datasetId: string | null;
}

export default function SentinelChat({
  datasetId,
}: SentinelChatProps) {
  console.log("Sentinel AI datasetId:", datasetId);
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello. I'm Sentinel AI. Ask me about your dataset, trends, geospatial analysis, forecasts, or risk intelligence.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const question = message.trim();

    if (!question || loading) {
      return;
    }

    if (!datasetId) {
      setMessages((current) => [
        ...current,
        {
          role: "user",
          content: question,
        },
        {
          role: "assistant",
          content:
            "Please select or upload a dataset before asking Sentinel AI a question.",
        },
      ]);

      setMessage("");

      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: question,
      },
    ]);

    setMessage("");

    setLoading(true);

    try {
      const result = await askSentinelAI(
        datasetId,
        question,
      );

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong while contacting Sentinel AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40">

          <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Sentinel AI
                </h2>

                <p className="text-xs text-slate-400">
                  Intelligence Assistant
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">

            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={
                  item.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    item.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-white"
                      : "max-w-[90%] rounded-2xl rounded-bl-md border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-200"
                  }
                >
                  {item.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sentinel is analyzing...
                </div>
              </div>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 p-4"
          >
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 p-2">

              <input
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Ask Sentinel AI..."
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !message.trim()
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>

            </div>
          </form>

        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-primary px-5 py-3 font-semibold text-white shadow-xl shadow-primary/20 transition hover:scale-105"
      >
        <Bot className="h-5 w-5" />
        Sentinel AI
      </button>
    </>
  );
}