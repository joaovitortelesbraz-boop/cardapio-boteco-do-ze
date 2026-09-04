"use client";

import { useRef, useState } from "react";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  formatBytes,
} from "@/src/shared/lib/image-upload";

interface ImageUploadFieldProps {
  name?: string;
  defaultValue?: string | null;
}

type Status = "idle" | "uploading" | "error";

const ACCEPT = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_EXTENSIONS.map((e) => `.${e}`),
].join(",");

export function ImageUploadField({
  name = "imageUrl",
  defaultValue,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>(defaultValue ?? "");
  const [fileName, setFileName] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [dragging, setDragging] = useState(false);

  async function send(file: File) {
    // Valida no cliente só para dar resposta imediata; a rota revalida tudo,
    // inclusive os bytes reais do arquivo.
    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      setStatus("error");
      setMessage("Formato não permitido. Use JPG, PNG ou WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setStatus("error");
      setMessage(
        `Imagem tem ${formatBytes(file.size)}; o limite é ${formatBytes(MAX_IMAGE_BYTES)}.`,
      );
      return;
    }

    setStatus("uploading");
    setMessage("");

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/admin/api/upload", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setStatus("error");
        setMessage(data.error ?? "Falha ao enviar a imagem.");
        return;
      }

      setUrl(data.url);
      setFileName(file.name);
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage("Falha de rede ao enviar a imagem.");
    }
  }

  function onPick(files: FileList | null) {
    const file = files?.[0];
    if (file) void send(file);
  }

  function clear() {
    setUrl("");
    setFileName("");
    setStatus("idle");
    setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]">
        Imagem do produto
      </label>

      {/* O caminho salvo continua indo no mesmo campo imageUrl, então os
          server actions de criar/editar não mudam. */}
      <input type="hidden" name={name} value={url} />

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(event) => onPick(event.target.files)}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          onPick(event.dataTransfer.files);
        }}
        className={`rounded-md border border-dashed p-4 transition ${
          dragging
            ? "border-[#ffcf62] bg-[#ffbc24]/10"
            : "border-[#e7a316]/30 bg-[#090603]"
        }`}
      >
        {url ? (
          <div className="flex items-center gap-4">
            <span className="relative size-20 shrink-0 overflow-hidden rounded-md border border-[#e7a316]/20 bg-[#0b0704]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Pré-visualização da imagem selecionada"
                className="size-full object-cover"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-[#fff0c2]">
                {fileName || url.split("/").pop()}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[#9e8b62]">{url}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-md border border-[#e7a316]/30 px-3 py-1.5 text-xs font-bold text-[#cdb886] transition hover:border-[#ffbc24]/70 hover:text-[#ffbc24]"
                >
                  Trocar
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:border-red-500/70 hover:bg-red-500/10"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={status === "uploading"}
              className="rounded-md border border-[#ffcf62] bg-gradient-to-b from-[#ffbc24] to-[#c57908] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#100b07] transition hover:brightness-110 disabled:opacity-60"
            >
              {status === "uploading" ? "Enviando..." : "Selecionar imagem"}
            </button>
            <p className="mt-2 text-[11px] text-[#9e8b62]">
              ou arraste e solte aqui — JPG, PNG ou WEBP, até{" "}
              {formatBytes(MAX_IMAGE_BYTES)}
            </p>
          </div>
        )}
      </div>

      {status === "uploading" && url ? (
        <p className="mt-1.5 text-[11px] text-[#9e8b62]">Enviando...</p>
      ) : null}

      {status === "error" ? (
        <p className="mt-1.5 text-[11px] text-red-400">{message}</p>
      ) : null}
    </div>
  );
}
