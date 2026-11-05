'use client'
import { X, Share, PlusSquare } from 'lucide-react'

export default function IOSInstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-gray-900">Install PASAM Store</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">Add PASAM to your home screen for quick access:</p>
        <ol className="space-y-4 text-sm text-gray-700">
          <li className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
              <Share size={15} />
            </span>
            <span className="pt-1">Tap the <strong>Share</strong> button in Safari&apos;s toolbar</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
              <PlusSquare size={15} />
            </span>
            <span className="pt-1">Scroll down and tap <strong>Add to Home Screen</strong></span>
          </li>
        </ol>
        <p className="text-xs text-gray-400 mt-5">Works in Safari only. If you&apos;re in another browser, open this page in Safari first.</p>
      </div>
    </div>
  )
}
