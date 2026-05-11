"use client";

import React, { useState, useRef, useEffect } from "react";
import DashboardTopbar from "../dashboard/DashboardTopbar";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import Logo from "../logo/logo";
import { apiRequest } from "../../lib/api";
import { useRouter } from "next/navigation";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function NewNote() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"audio" | "document" | "text">("audio");
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await apiRequest<any[]>("/workspaces");
        setWorkspaces(data);
      } catch (err) {
        console.error("Failed to fetch workspaces", err);
      }
    };
    fetchWorkspaces();
  }, []);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const wordCount = transcript.trim() === "" ? 0 : transcript.trim().split(/\s+/).length;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([audioBlob], `recording-${new Date().getTime()}.webm`, {
          type: "audio/webm",
        });
        setAudioFile(file);
        stream.getTracks().forEach((track) => track.stop()); // Stop microphone
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/") && !file.name.match(/\.(mp3|wav|m4a|ogg|mp4|webm)$/i)) {
      setError("Please upload a valid audio or video file (mp3, wav, m4a, mp4)");
      return;
    }

    setAudioFile(file);
    setError(null);
  };

  const handleDocFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(txt|md|csv|pdf|doc|docx)$/i) && !file.type.includes("pdf") && !file.type.includes("word")) {
      setError("Please upload a valid document (.pdf, .docx, .txt)");
      return;
    }

    setDocFile(file);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!title.trim()) {
      setError("Please provide a title for your meeting.");
      return;
    }

    if (mode === "text" && !transcript.trim()) {
      setError("No transcript found. Please paste text.");
      return;
    }

    if (mode === "audio" && !audioFile) {
      setError("Please upload an audio file or record a meeting.");
      return;
    }

    if (mode === "document" && !docFile) {
      setError("Please upload a document.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      
      if (selectedWorkspaceId) {
        formData.append("workspaceId", selectedWorkspaceId);
      }
      
      if (mode === "text") {
        formData.append("transcript", transcript);
      } else if (mode === "audio" && audioFile) {
        formData.append("file", audioFile);
      } else if (mode === "document" && docFile) {
        formData.append("file", docFile);
      }

      await apiRequest("/notes", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Redirect to dashboard immediately while it processes in the background!
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message || "Failed to create meeting note.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetGenius"
        logoHref="/dashboard"
        workspaceName="My Workspace"
        ctaLabel="+ Note"
        logo={<Logo />}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar links={sidebarLinks} activeLinkId="notes" />
        <main className="flex-1 overflow-y-auto px-6 sm:px-12 py-10 bg-zinc-50/10">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">New meeting note</h1>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl animate-in fade-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Product Roadmap Sync"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm bg-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Save to Workspace
                </label>
                <select
                  value={selectedWorkspaceId}
                  onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                >
                  <option value="">Personal Note (No Workspace)</option>
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex bg-zinc-100 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setMode("audio")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "audio" ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"}`}
                >
                  Record & Upload Audio
                </button>
                <button
                  onClick={() => setMode("document")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "document" ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"}`}
                >
                  Upload Document
                </button>
                <button
                  onClick={() => setMode("text")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "text" ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"}`}
                >
                  Paste Text
                </button>
              </div>

              {mode === "audio" ? (
                <div className="border border-zinc-200 rounded-2xl p-8 bg-white shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    
                    {/* Recording Status UI */}
                    <div className="h-24 flex items-center justify-center w-full mb-6">
                      {isRecording ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center relative mb-3">
                            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping" />
                            <div className="w-4 h-4 bg-red-500 rounded-sm" />
                          </div>
                          <span className="text-xl font-mono font-medium text-red-600">{formatTime(recordingTime)}</span>
                        </div>
                      ) : audioFile ? (
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-medium text-zinc-900">{audioFile.name}</span>
                          <span className="text-xs text-zinc-500 mt-1">Ready for analysis</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-zinc-400">
                          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-3 border border-zinc-100">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">Record a meeting directly</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-1 border-t border-zinc-100" />
                      
                      {isRecording ? (
                        <button 
                          onClick={stopRecording}
                          className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20 active:scale-95"
                        >
                          Stop Recording
                        </button>
                      ) : (
                        <button 
                          onClick={startRecording}
                          className={`px-6 py-2.5 font-medium rounded-full transition-all shadow-sm active:scale-95 ${audioFile ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800 shadow-black/10'}`}
                        >
                          {audioFile ? 'Re-record' : 'Start Recording'}
                        </button>
                      )}

                      <div className="flex-1 border-t border-zinc-100" />
                    </div>

                    {/* Upload Alternative */}
                    {!isRecording && (
                      <div className="mt-8 text-sm text-zinc-500">
                        Or{' '}
                        <label className="text-blue-600 font-medium cursor-pointer hover:underline">
                          upload an audio file
                          <input 
                            type="file" 
                            accept="audio/*,video/mp4" 
                            className="hidden" 
                            onChange={handleAudioFile} 
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ) : mode === "document" ? (
                <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-zinc-50 hover:bg-zinc-100 transition-colors group relative cursor-pointer">
                  <input 
                    type="file" 
                    accept=".txt,.md,.csv,.pdf,.doc,.docx" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleDocFile} 
                  />
                  <div className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center mb-4 group-hover:bg-zinc-300 transition-colors">
                    <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                    {docFile ? docFile.name : "Upload Text Document"}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {docFile ? "Document ready" : "TXT, PDF, or DOCX"}
                  </p>
                </div>
              ) : (
                <div className="card p-5 border border-zinc-200 rounded-2xl bg-zinc-50">
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    rows={12}
                    placeholder="[00:00] John: Let us get started with the standup..."
                    className="w-full p-0 border-none text-sm font-mono bg-transparent placeholder:text-zinc-400 resize-none focus:ring-0"
                  />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-200">
                    <span className="text-xs font-medium text-zinc-500">{wordCount} words</span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={isSubmitting || isRecording || (!title.trim() || (mode === "audio" && !audioFile) || (mode === "text" && !transcript.trim()) || (mode === "document" && !docFile))}
                  className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-black/10 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading & Processing...
                    </>
                  ) : (
                    "Transcribe & Analyze"
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
