import Link from 'next/link'
import { Puzzle, ArrowRight } from 'lucide-react'

export default function BuildYourOwnBanner() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-400 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Puzzle size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-white text-xl sm:text-2xl">Build your own package</h2>
              <p className="text-orange-50 text-sm sm:text-base mt-1 max-w-lg">
                Pick exactly what you need, watch your price as you go, and we will pack it and deliver it.
              </p>
            </div>
          </div>
          <Link
            href="/store/build-your-own"
            className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-white text-orange-600 font-semibold text-sm hover:bg-orange-50 transition-colors flex-shrink-0"
          >
            Start building <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
