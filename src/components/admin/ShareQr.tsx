import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Copy, ClipboardCheck, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ShareQr = ({ url, filename = "qr-code" }: { url: string; filename?: string }) => {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, { width: 512, margin: 1 }).then(setDataUrl).catch(() => setDataUrl(""));
  }, [url]);

  const copyPng = async () => {
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      toast({ title: "Copied!", description: "QR code copied as PNG" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Use Download instead", variant: "destructive" });
    }
  };

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${filename}.png`;
    a.click();
  };

  if (!dataUrl) return null;

  return (
    <div className="flex items-center gap-3 mt-3">
      <img src={dataUrl} alt="QR code for survey link" className="w-32 h-32 rounded border border-border bg-white" />
      <div className="flex flex-col gap-2">
        <Button variant="outline" size="sm" onClick={copyPng}>
          {copied ? <ClipboardCheck className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          Copy PNG
        </Button>
        <Button variant="outline" size="sm" onClick={download}>
          <Download className="w-4 h-4 mr-2" />Download
        </Button>
      </div>
    </div>
  );
};

export default ShareQr;
