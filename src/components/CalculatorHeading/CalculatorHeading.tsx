import { Calculator } from 'lucide-react';

interface HeadingCalculatorTypes {
  heading?: string
  slogan?: string
  classes?: string
}

export const CalculatorHeading = (
  { heading = '', slogan = '', classes = '' }:
    HeadingCalculatorTypes

) => {
  return (
    <div className={`calc_heading ${classes}`}>
      <div className="text-center mt-6">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4 shadow-lg">
          <Calculator className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {heading ? heading : 'Subscription Cost Calculator'}
        </h1>
        <p className="text-white/70">
          {slogan ? slogan : 'Discover the true lifetime cost of your subscriptions'}
        </p>
      </div>
    </div>
  )
}
