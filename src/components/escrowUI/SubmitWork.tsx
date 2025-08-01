import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "react-toastify";
import { CheckCircle, Loader2 } from "lucide-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Label } from "@/components/ui/label.tsx";
import { UploadCloud } from "lucide-react";

interface SubmitWorkProps {
  open: boolean;
  onClose: () => void;
  onSubmit: ( file: File) => Promise<void>;
  isWalletVerified: boolean;
}

const allowedTypes = [
  "application/zip",
  "application/x-zip-compressed",
  "application/pdf",
  "image/png",
  "image/jpeg", 
];

export default function SubmitWork({
  open,
  onClose,
  onSubmit,
  isWalletVerified,
}: SubmitWorkProps) {
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const wallet = useAnchorWallet();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!allowedTypes.includes(f.type)) {
      toast.error("Invalid file type. Use zip, png, jpeg, or pdf.");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB.");
      return;
    }

    setFile(f);
    
  };

  const handleSubmit = async () => {
    if (!wallet) return toast.error("Connect your wallet.");
    if (!isWalletVerified) return toast.error("Wallet is not verified.");
    if (!file) return toast.error("No file selected.");

    try {
      setSubmitting(true);
      await onSubmit(file); 
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFile(null);
      }, 1000);
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-secondary rounded-xl shadow-xl p-6 w-[90%] max-w-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            {success ? (
              <div className="flex flex-col items-center justify-center gap-4 text-green-600">
                <CheckCircle className="w-12 h-12" />
                <p className="text-lg font-semibold">Submission successful!</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-2">Submit Your Work</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a valid ZIP, PDF, or image file (max 10MB).
                </p>
               <div className="w-full">
  <Label htmlFor="file-upload" className="text-sm font-medium">
    Upload File
  </Label>

  <label
    htmlFor="file-upload"
    className="mt-2 flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition"
  >
    <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
    <p className="text-sm text-gray-500">
      {file ? (
        <span className="text-gray-800 font-medium">{file.name}</span>
      ) : (
        <>
          <span className="font-medium text-blue-600">Click to browse</span> or
          drag and drop
        </>
      )}
    </p>
    <p className="text-xs text-gray-400 mt-1">ZIP, PNG, JPG, PDF (max 10MB)</p>
    <input
      id="file-upload"
      type="file"
      accept=".zip,.pdf,.png,.jpg,.jpeg"
      onChange={handleFileChange}
      className="hidden"
    />
  </label>
</div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="secondary" onClick={onClose} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting || !file}>
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
