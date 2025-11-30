import React from 'react';
import { MeshProvider, useWallet } from '@meshsdk/react';
import SimpleIssueCertificate from './SimpleIssueCertificate';
import StatusDisplay from './StatusDisplay';
import CustomWalletConnect from './CustomWalletConnect';
import ConfigurationPanel from './ConfigurationPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faKey, faLink, faWallet } from '@fortawesome/free-solid-svg-icons';

function WalletStatus({ status }) {
  const { connected, wallet } = useWallet();

  const handleConnect = React.useCallback(async () => {
    console.log('handleConnect called.');
    try {
      if (wallet) {
        console.log('Wallet object before getChangeAddress:', wallet);
        const address = await wallet.getChangeAddress();
        console.log('Wallet address:', address);
        console.log('Wallet object after getChangeAddress:', wallet);
      } else {
        console.log('Wallet object is null or undefined.');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  }, [wallet]);

  React.useEffect(() => {
    if (connected) {
      handleConnect();
    }
  }, [connected, handleConnect]);

  return (
    <div className="mb-4">
      <p className={`text-sm ${status.connected ? 'text-green-400 font-medium' : 'text-text-dark'}`}>
        Wallet Status: {status.connected ? '✅ Connected' : '❌ Not Connected'}
      </p>
      {status.connected && status.walletName && (
        <p className="text-xs text-text-medium mt-1">
          Using: {status.walletName} Wallet
        </p>
      )}
      {status.error && (
        <p className="text-xs text-red-400 mt-1">
          Error: {status.error.message || status.error}
        </p>
      )}
    </div>
  );
}

const IssueCertificatePage = ({ onBack, onHome }) => {
  const [connectionStatus, setConnectionStatus] = React.useState({
    connected: false,
    error: null,
    walletName: null,
  });

  const [statusMessages, setStatusMessages] = React.useState([]);
  
  const [appConfig, setAppConfig] = React.useState({
    blockfrostApiKey: '',
    network: 'preprod',
    isValid: false
  });

  const addStatusMessage = (message, type = 'info', details = null) => {
    const newMessage = {
      id: Date.now(),
      message,
      type,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setStatusMessages(prev => [newMessage, ...prev.slice(0, 19)]);
  };

  const clearStatusMessages = () => {
    setStatusMessages([]);
  };

  const handleConfigUpdate = (config, isValid) => {
    setAppConfig({
      ...config,
      isValid
    });
    
    if (window.blockchainServiceConfig) {
      window.blockchainServiceConfig = config;
    } else {
      window.blockchainServiceConfig = config;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary-light relative">
      <header className="relative z-10 bg-surface bg-opacity-95 backdrop-blur-md border-b border-primary-light shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onBack()}
                className="flex items-center gap-2 text-text-dark hover:text-accent-blue transition-colors mr-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Menu
              </button>
              <div className="flex items-center justify-center">
                <img 
                  src="https://i.postimg.cc/C518GY8y/Screenshot-2025-11-30-at-12-19-16-PM.png" 
                  alt="Docufy Logo" 
                  className="h-12 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onHome()}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-2">
                <WalletStatus status={connectionStatus} />
                <div className="flex gap-2 items-center">
                  <CustomWalletConnect 
                    onConnected={(walletInfo) => {
                      setConnectionStatus({ 
                        connected: true, 
                        error: null, 
                        walletName: walletInfo.name,
                        walletApi: walletInfo.api,
                        address: walletInfo.address,
                        networkId: walletInfo.networkId
                      });
                      addStatusMessage(`Wallet connected: ${walletInfo.name} (${walletInfo.networkId === 0 ? 'Testnet' : 'Mainnet'})`, 'success');
                    }}
                    onDisconnected={() => {
                      setConnectionStatus({ connected: false, error: null, walletName: null });
                      addStatusMessage('Wallet disconnected', 'info');
                    }}
                    onError={(error) => {
                      setConnectionStatus({ connected: false, error: error, walletName: null });
                      addStatusMessage(`Connection failed: ${error.message}`, 'error');
                    }}
                  />
                  {statusMessages.length > 0 && (
                    <button
                      onClick={clearStatusMessages}
                      className="text-sm bg-primary-light hover:bg-secondary text-text-dark px-3 py-2 rounded-lg transition-colors border border-primary-light"
                    >
                      Clear Log
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative z-10 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-text-dark mb-2">Issue Certificate</h2>
            <p className="text-lg text-text-medium">
              Upload and register certificates on the Cardano blockchain
            </p>
          </div>
          
          {/* Configuration Panel */}
          <div className="mb-6">
            <ConfigurationPanel onConfigUpdate={handleConfigUpdate} />
          </div>
          
          {/* Issue Certificate Section */}
          <div className="mb-6">
            <SimpleIssueCertificate 
              onStatusUpdate={addStatusMessage} 
              walletApi={connectionStatus.walletApi}
              config={appConfig}
            />
          </div>
          
          {/* Status Display Section */}
          <div className="mb-6">
            <StatusDisplay messages={statusMessages} />
          </div>
          
          {/* Tutorial Information Section */}
          <div className="mb-6 bg-surface rounded-lg shadow-lg border border-primary-light p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-3xl text-text-dark">
                <FontAwesomeIcon icon={faCertificate} />
              </div>
              <h2 className="text-2xl font-semibold text-text-dark">Issuing Certificates - How It Works</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-surface-light rounded-lg border border-primary-light">
                <h3 className="text-lg font-semibold text-text-dark mb-3">Step-by-Step Process:</h3>
                <ol className="list-decimal list-inside space-y-2 text-text-medium">
                  <li>Configure your Blockfrost API key in the settings above.</li>
                  <li>Connect your Cardano wallet using the wallet button.</li>
                  <li>Upload your PDF certificate file using the form above.</li>
                  <li>Click "Issue" to store the file hash on blockchain.</li>
                  <li>Transaction creates permanent proof of authenticity.</li>
                </ol>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-accent-blue bg-opacity-10 border border-accent-blue border-opacity-30 rounded-md">
                  <p className="text-sm text-accent-blue">
                    <FontAwesomeIcon icon={faKey} className="mr-2" />
                    <strong>Note:</strong> This app uses Cardano's testnet for demonstration.
                    Make sure your wallet is set to "Preview" or "Pre-production" testnet mode and has test ADA.
                  </p>
                </div>
                
                <div className="p-3 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-md">
                  <p className="text-sm text-green-400">
                    <FontAwesomeIcon icon={faLink} className="mr-2" />
                    <strong>Real Blockchain:</strong> This app creates real Cardano blockchain transactions.
                    Configure your Blockfrost API key in the settings to enable transaction submission and verification.
                  </p>
                </div>
                
                <div className="p-3 bg-accent-purple bg-opacity-10 border border-accent-purple border-opacity-30 rounded-md">
                  <p className="text-sm text-accent-purple">
                    <FontAwesomeIcon icon={faWallet} className="mr-2" />
                    <strong>Setup Required:</strong> Get your free Blockfrost API key at{' '}
                    <a href="https://blockfrost.io" target="_blank" rel="noopener noreferrer" className="underline text-accent-purple hover:text-purple-400">
                      blockfrost.io
                    </a>{' '}
                    and enter it in the configuration panel above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueCertificatePage;