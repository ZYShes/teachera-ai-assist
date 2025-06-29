import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { FileCode2 } from "lucide-react"

export interface FileModalProps {
  isOpen: boolean
  onClose: () => void
  files: {
    name: string
    type: "code" | "image" | "document" | "link" 
    date?: string
  }[]
}

const FileModal = ({ isOpen, onClose, files }: FileModalProps) => {
  const [selectedTab, setSelectedTab] = useState<"all" | "document" | "image" | "code" | "link">("all")

  const filteredFiles = selectedTab === "all"
    ? files
    : files.filter(f => f.type === selectedTab)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xl p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-4">所有文件</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {["all", "document", "image", "code", "link"].map((type) => (
            <button
              key={type}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                selectedTab === type ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedTab(type as any)}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
            </button>
          ))}
        </div>

        {/* File List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <div className="flex items-center gap-3 text-gray-800">
                <FileCode2 className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-xs text-gray-500">{file.date ?? "Earlier"}</div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6-2a2 2 0 100 4 2 2 0 000-4zm4 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FileModal