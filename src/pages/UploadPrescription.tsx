import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, LoaderCircle, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/Layout";
import { DeliveryChip } from "@/components/layout/DeliveryChip";
import { ProcessSteps } from "@/components/home/Sections";
import { Button } from "@/components/ui/button";
import { KineticTextLoader } from "@/components/ui/kinetic-text-loader";
import { cn } from "@/lib/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import prescriptionImg from "@/assets/img/prescription.webp";

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export default function UploadPrescription() {
  usePageTitle("Upload prescription");
  const inputId = useId();
  const inputRef = useRef(null);
  const [files, setFiles] = useState<{ id: string; file: File; preview: string | null }[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Free any remaining preview URLs when the page unmounts.
  const filesRef = useRef(files);
  filesRef.current = files;
  useEffect(
    () => () => filesRef.current.forEach((f) => f.preview && URL.revokeObjectURL(f.preview)),
    []
  );

  const addFiles = (list: FileList | null) => {
    const incoming = Array.from(list!);
    const rejected = incoming.filter((f) => !ACCEPTED.includes(f.type) || f.size > MAX_SIZE);
    if (rejected.length) toast.error("Use JPG, PNG, WebP or PDF files up to 5 MB.");
    const accepted = incoming
      .filter((f) => ACCEPTED.includes(f.type) && f.size <= MAX_SIZE)
      .map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      }));
    setFiles((prev) => {
      const merged = [...prev, ...accepted.filter((a) => !prev.some((p) => p.id === a.id))];
      if (merged.length > MAX_FILES) toast.error(`You can upload up to ${MAX_FILES} files.`);
      return merged.slice(0, MAX_FILES);
    });
  };

  const removeFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.preview) URL.revokeObjectURL(target.preview);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!files.length) {
      toast.error("Please add a photo of your prescription first.");
      return;
    }
    setSubmitting(true);
    // TODO(backend): send `files` to a prescription upload endpoint when one exists.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitting(false);
    files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    setFiles([]);
    toast.success("Prescription received. We'll call you to confirm your medicines.");
  };

  return (
    <>
      {submitting && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-white/70 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <KineticTextLoader text="Loading" className="scale-60 sm:scale-75" />
        </div>
      )}
      <PageHeader
        crumbs={[{ label: "Upload prescription" }]}
        title="Order with prescription"
        description="Upload your prescription and get your order delivered."
      />

      <section className="container-page mt-10 grid items-start gap-8 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={onSubmit} className="rounded-3xl border bg-white p-6 shadow-soft sm:p-8">
          <label
            htmlFor={inputId}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              addFiles(event.dataTransfer.files);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
              dragging ? "border-brand-strong bg-brand-50" : "border-slate-200 hover:border-brand/50 hover:bg-surface"
            )}
          >
            <img src={prescriptionImg} alt="" className="h-28 w-auto" />
            <span className="mt-4 inline-flex items-center gap-2 font-semibold text-slate-900">
              <Upload className="size-4" /> Drag and drop, or click to upload
            </span>
            <span className="mt-1 text-sm text-slate-500">JPG, PNG, WebP or PDF · up to 5 MB each</span>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              multiple
              accept={ACCEPTED.join(",")}
              className="sr-only"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {files.map(({ id, file, preview }) => (
                <motion.li
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 rounded-xl border p-2"
                >
                  {preview ? (
                    <img src={preview} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-strong">
                      <FileText className="size-6" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFile(id)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X />
                  </Button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="mt-6 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <DeliveryChip className="sm:max-w-64" />
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? <LoaderCircle className="animate-spin" /> : <Upload />}
              Submit prescription
            </Button>
          </div>
        </form>

        <aside>
          <h2 className="mb-4 text-lg font-bold">How the process works</h2>
          <ProcessSteps compact />
        </aside>
      </section>
    </>
  );
}
