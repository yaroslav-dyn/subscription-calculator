import { PieChart } from 'lucide-react';

export const NoRecordsState = ({
  showAddFormhandler
}: { showAddFormhandler: (state: boolean) => void }
) => {
  return <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-12 shadow-xl text-center">
    <PieChart className="w-16 h-16 text-white/40 mx-auto mb-4" />
    <h3 className="text-white text-xl font-semibold mb-2">
      No Subscriptions Yet
    </h3>
    <p className="text-white/70 mb-6">
      Add your first subscription to see the lifetime cost analysis
    </p>
    <button onClick={() => showAddFormhandler(true)} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
      Get Started
    </button>
  </div>;
}
