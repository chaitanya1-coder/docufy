import React, { useState, useEffect } from 'react';

const ConfigurationPanel = ({ onConfigUpdate }) => {
  const [config, setConfig] = useState({
    blockfrostApiKey: localStorage.getItem('blockfrost_api_key') || '',
    network: localStorage.getItem('cardano_network') || 'preprod'
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Check if configuration is valid
    const valid = config.blockfrostApiKey && config.blockfrostApiKey !== 'preprodYOUR_API_KEY_HERE';
    setIsValid(valid);
    
    // Auto-expand if no valid config
    if (!valid) {
      setIsExpanded(true);
    }

    // Update parent component
    onConfigUpdate && onConfigUpdate(config, valid);
  }, [config, onConfigUpdate]);

  const handleConfigChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    
    // Save to localStorage
    localStorage.setItem('blockfrost_api_key', newConfig.blockfrostApiKey);
    localStorage.setItem('cardano_network', newConfig.network);
  };

  const getNetworkInfo = () => {
    switch (config.network) {
      case 'preprod':
        return { name: 'Pre-production Testnet', color: 'blue' };
      case 'preview':
        return { name: 'Preview Testnet', color: 'green' };
      case 'mainnet':
        return { name: 'Mainnet', color: 'red' };
      default:
        return { name: 'Unknown', color: 'gray' };
    }
  };

  const networkInfo = getNetworkInfo();

  return (
    <div className={`border rounded-lg ${isValid ? 'bg-surface border-primary-light' : 'bg-surface border-primary-light'}`}>
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <h3 className="font-semibold text-text-dark">
            ⚙️ Configuration {isValid ? '✅' : '❌ Required'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded ${
            networkInfo.color === 'red' ? 'bg-red-500 bg-opacity-30 text-red-300 border border-red-500 border-opacity-30' :
            networkInfo.color === 'green' ? 'bg-green-500 bg-opacity-30 text-green-300 border border-green-500 border-opacity-30' :
            'bg-accent-blue bg-opacity-30 text-blue-300 border border-accent-blue border-opacity-30'
          }`}>
            {networkInfo.name}
          </span>
          <svg 
            className={`w-5 h-5 transition-transform text-text-dark ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-primary-light">
          {/* Network Selection */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Cardano Network
            </label>
            <select
              value={config.network}
              onChange={(e) => handleConfigChange('network', e.target.value)}
              className="w-full p-3 bg-surface-light border border-primary-light rounded-md focus:ring-2 focus:ring-accent-blue focus:ring-opacity-50 text-text-dark"
            >
              <option value="preprod" className="bg-surface text-text-dark">Pre-production Testnet (Recommended)</option>
              <option value="preview" className="bg-surface text-text-dark">Preview Testnet</option>
              <option value="mainnet" className="bg-surface text-text-dark">Mainnet (Real ADA - BE CAREFUL!)</option>
            </select>
            <p className="text-xs text-text-medium mt-1">
              Make sure your wallet is set to the same network!
            </p>
          </div>

          {/* Blockfrost API Key */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Blockfrost API Key
            </label>
            <input
              type="password"
              value={config.blockfrostApiKey}
              onChange={(e) => handleConfigChange('blockfrostApiKey', e.target.value)}
              placeholder={`${config.network}YOUR_API_KEY_HERE`}
              className="w-full p-3 bg-surface-light border border-primary-light rounded-md focus:ring-2 focus:ring-accent-blue focus:ring-opacity-50 text-text-dark placeholder-text-medium"
            />
            <div className="text-xs text-text-medium mt-1 space-y-1">
              <p>
                Get your API key from{' '}
                <a 
                  href="https://blockfrost.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-blue underline hover:text-purple-400"
                >
                  blockfrost.io
                </a>
              </p>
              <p>⚠️ Make sure to select <strong>{networkInfo.name}</strong> when creating your project!</p>
            </div>
          </div>

          {/* Quick Setup Guide */}
          <div className="bg-surface-light border border-primary-light rounded-md p-3">
            <h4 className="font-medium text-text-dark mb-2">Quick Setup Steps:</h4>
            <ol className="text-xs text-text-medium list-decimal list-inside space-y-1">
              <li>Go to <a href="https://blockfrost.io" target="_blank" rel="noopener noreferrer" className="underline text-accent-blue hover:text-purple-400">blockfrost.io</a> and sign up.</li>
              <li>Create a new project and select "<strong>{networkInfo.name}</strong>".</li>
              <li>Copy your API key and paste it above.</li>
              <li>Make sure your wallet is on the same network.</li>
              <li>Get test ADA from a <a href="https://docs.cardano.org/cardano-testnet/tools/faucet/" target="_blank" rel="noopener noreferrer" className="underline text-accent-blue hover:text-purple-400">testnet faucet</a>.</li>
            </ol>
          </div>

          {config.blockfrostApiKey && config.blockfrostApiKey !== `${config.network}YOUR_API_KEY_HERE` && (
            <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-md p-3">
              <p className="text-green-400 text-sm">
                ✅ Configuration looks good! You can now issue and verify certificates.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfigurationPanel;
