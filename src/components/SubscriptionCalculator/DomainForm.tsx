import React from 'react'

interface Domain {
  name: string
  provider: string
  expiryDate: string
  renewalCost: string
  autoRenewal: boolean
}

interface DomainFormProps {
  domain: Domain
  setDomain: React.Dispatch<React.SetStateAction<Domain>>
  onAdd: () => void
  onCancel: () => void
}

const DomainForm: React.FC<DomainFormProps> = ({
  domain,
  setDomain,
  onAdd,
  onCancel,
}) => {
  return (
    <div className="space-y-3 mb-4">
      <input
        type="text"
        placeholder="domain.com"
        value={domain.name}
        onChange={(e) => setDomain({ ...domain, name: e.target.value })}
        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex flex-col gap-2">
        <select
          value={domain.provider}
          onChange={(e) => setDomain({ ...domain, provider: e.target.value })}
          className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Cloudflare">Cloudflare</option>
          <option value="GoDaddy">GoDaddy</option>
          <option value="Namecheap">Namecheap</option>
          <option value="Google Domains">Google Domains</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="number"
          placeholder="Renewal cost"
          value={domain.renewalCost}
          onChange={(e) =>
            setDomain({ ...domain, renewalCost: e.target.value })
          }
          className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <input
        type="date"
        value={domain.expiryDate}
        onChange={(e) => setDomain({ ...domain, expiryDate: e.target.value })}
        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex items-center">
        <input
          type="checkbox"
          id="autoRenewal"
          checked={domain.autoRenewal}
          onChange={(e) =>
            setDomain({ ...domain, autoRenewal: e.target.checked })
          }
          className="mr-2"
        />
        <label htmlFor="autoRenewal" className="text-white/80 text-sm">
          Auto-renewal enabled
        </label>
      </div>

      <div className="mt-6 flex flex-col md:flex-row md:justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-white/10 rounded-xl text-white/80 hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onAdd}
          className="w-full p-2 bg-blue-500/30 rounded-xl text-white hover:bg-blue-500/40 transition-all duration-300"
        >
          Add Domain
        </button>
      </div>
    </div>
  )
} //

export default DomainForm
