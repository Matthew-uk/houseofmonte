"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { IMAGE_KINDS, type ImageKind } from "@/lib/catalog-constants";
import { ACCEPTED_IMAGE_TYPES, imageFileProblem, uploadImage } from "@/lib/upload";

export interface ImageItem {
  key: string;
  id?: string;
  url: string; // delivery URL when done; a blob: preview while uploading
  kind: ImageKind;
  alt: string;
  status: "uploading" | "done" | "error";
  error?: string;
  file?: File; // kept until the upload succeeds, for retry
}

type Update = (updater: (images: ImageItem[]) => ImageItem[]) => void;

const DEFAULT_KINDS: ImageKind[] = ["FRONT", "BACK", "DETAIL", "MODEL"];
const SMALL_BUTTON = "min-h-9 px-1 text-meta uppercase hover:underline disabled:text-muted disabled:no-underline";

let nextKey = 0;

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

// Upload, label, reorder and remove the images of one colour. The first image
// is the cover. Uploads run straight from the browser (see lib/upload.ts).
export function ImageManager({
  images,
  onChange,
  label,
}: {
  images: ImageItem[];
  onChange: Update;
  label: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [rejected, setRejected] = useState<string[]>([]);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dropActive, setDropActive] = useState(false);

  function patch(key: string, change: Partial<ImageItem>) {
    onChange((list) => list.map((i) => (i.key === key ? { ...i, ...change } : i)));
  }

  async function start(item: ImageItem) {
    if (!item.file) return;
    patch(item.key, { status: "uploading", error: undefined });
    try {
      const url = await uploadImage(item.file);
      URL.revokeObjectURL(item.url);
      patch(item.key, { url, status: "done", file: undefined });
    } catch (err) {
      patch(item.key, {
        status: "error",
        error: err instanceof Error ? err.message : "Upload failed.",
      });
    }
  }

  function addFiles(files: File[]) {
    const problems: string[] = [];
    const accepted: ImageItem[] = [];
    files.forEach((file) => {
      const problem = imageFileProblem(file);
      if (problem) {
        problems.push(`${file.name}: ${problem}`);
        return;
      }
      accepted.push({
        key: `new-${nextKey++}`,
        url: URL.createObjectURL(file),
        kind: DEFAULT_KINDS[images.length + accepted.length] ?? "OTHER",
        alt: "",
        status: "uploading",
        file,
      });
    });
    setRejected(problems);
    if (accepted.length === 0) return;
    onChange((list) => [...list, ...accepted]);

    // Three at a time: batches of large photos shouldn't saturate a phone's uplink.
    const queue = [...accepted];
    const worker = async () => {
      for (let item = queue.shift(); item; item = queue.shift()) await start(item);
    };
    void Promise.all([worker(), worker(), worker()]);
  }

  return (
    // Files can land anywhere in this section; otherwise the browser would
    // navigate to the dropped file and lose the form.
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragKey) setDropActive(true);
      }}
      onDragLeave={() => setDropActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDropActive(false);
        if (e.dataTransfer.files.length > 0) addFiles(Array.from(e.dataTransfer.files));
      }}
    >
      <button
        type="button"
        onClick={() => input.current?.click()}
        className={`flex min-h-20 w-full items-center justify-center border border-dashed px-3 py-4 text-ui uppercase ${
          dropActive ? "border-fg bg-surface" : "border-line"
        }`}
      >
        Drop images or click to upload — JPEG, PNG, WebP, up to 10 MB
      </button>
      <input
        ref={input}
        type="file"
        multiple
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        aria-label={`Upload images for ${label}`}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          addFiles(Array.from(e.target.files ?? []));
          e.target.value = ""; // allow picking the same file again
        }}
      />

      {rejected.length > 0 && (
        <ul role="alert" className="mt-2 text-meta text-accent">
          {rejected.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      {images.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {images.map((img, index) => (
            <li
              key={img.key}
              draggable
              onDragStart={(e) => {
                setDragKey(img.key);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragEnd={() => setDragKey(null)}
              onDrop={(e) => {
                if (!dragKey) return;
                e.preventDefault();
                e.stopPropagation();
                onChange((list) =>
                  move(list, list.findIndex((i) => i.key === dragKey), index),
                );
                setDragKey(null);
              }}
              className={dragKey === img.key ? "opacity-50" : ""}
            >
              <div className="relative aspect-[4/5] cursor-grab bg-surface">
                <Image
                  src={img.url}
                  alt={img.alt || `${label} image ${index + 1}`}
                  fill
                  sizes="(min-width: 1280px) 15vw, (min-width: 768px) 25vw, 50vw"
                  unoptimized={img.url.startsWith("blob:")}
                  className={`object-cover ${img.status === "done" ? "" : "opacity-50"}`}
                />
                {index === 0 && (
                  <span className="absolute left-0 top-0 bg-fg px-2 py-1 text-meta uppercase text-inverse">
                    Cover
                  </span>
                )}
                {img.status === "uploading" && (
                  <span role="status" className="absolute inset-x-0 bottom-0 bg-bg px-2 py-1 text-meta uppercase">
                    Uploading…
                  </span>
                )}
              </div>

              {img.status === "error" ? (
                <div role="alert" className="mt-1">
                  <p className="text-meta text-accent">{img.error}</p>
                  <button type="button" className={SMALL_BUTTON} onClick={() => start(img)}>
                    Retry
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-1">
                  <label className="sr-only" htmlFor={`${img.key}-kind`}>
                    Image type
                  </label>
                  <select
                    id={`${img.key}-kind`}
                    value={img.kind}
                    onChange={(e) => patch(img.key, { kind: e.target.value as ImageKind })}
                    className="h-9 w-full border border-line bg-bg px-2 text-meta uppercase"
                  >
                    {IMAGE_KINDS.map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                  <label className="sr-only" htmlFor={`${img.key}-alt`}>
                    Alt text
                  </label>
                  <input
                    id={`${img.key}-alt`}
                    value={img.alt}
                    maxLength={200}
                    placeholder="Alt text (optional)"
                    onChange={(e) => patch(img.key, { alt: e.target.value })}
                    className="h-9 w-full border border-line bg-bg px-2 text-[13px]"
                  />
                </div>
              )}

              <div className="mt-1 flex flex-wrap justify-between">
                <button
                  type="button"
                  className={SMALL_BUTTON}
                  disabled={index === 0}
                  aria-label={`Move image ${index + 1} earlier`}
                  onClick={() => onChange((list) => move(list, index, index - 1))}
                >
                  ←
                </button>
                <button
                  type="button"
                  className={SMALL_BUTTON}
                  disabled={index === 0}
                  onClick={() => onChange((list) => move(list, index, 0))}
                >
                  Cover
                </button>
                <button
                  type="button"
                  className={SMALL_BUTTON}
                  onClick={() => onChange((list) => list.filter((i) => i.key !== img.key))}
                >
                  Remove
                </button>
                <button
                  type="button"
                  className={SMALL_BUTTON}
                  disabled={index === images.length - 1}
                  aria-label={`Move image ${index + 1} later`}
                  onClick={() => onChange((list) => move(list, index, index + 1))}
                >
                  →
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
