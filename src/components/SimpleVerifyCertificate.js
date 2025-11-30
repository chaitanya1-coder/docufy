import React, { useState } from 'react';
import blockchainService from '../services/blockchainService';

const SimpleVerifyCertificate = ({ onStatusUpdate, walletAddress, config, walletApi }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const isConnected = !!walletAddress;
  const isConfigured = config && config.isValid;

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      blockchainService.validateFile(file);
      setSelectedFile(file);
      setVerificationResult(null);
      onStatusUpdate(`File selected: ${file.name}`, 'success');
    } catch (error) {
      onStatusUpdate(`File validation error: ${error.message}`, 'error');
      setSelectedFile(null);
    }
  };

  const handleVerify = async () => {
    if (!isConnected) {
      onStatusUpdate('Please connect your wallet first', 'error');
      return;
    }

    if (!isConfigured) {
      onStatusUpdate('Please configure Blockfrost API key in the configuration panel', 'error');
      return;
    }

    if (!selectedFile) {
      onStatusUpdate('Please select a certificate file first', 'error');
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);

    try {
      onStatusUpdate('Calculating file hash...', 'info');
      const fileHash = await blockchainService.calculateFileHash(selectedFile);
      
      onStatusUpdate('Getting wallet address...', 'info');
      
      // Get bech32 address if we have wallet API, otherwise use the provided address
      let searchAddress = walletAddress;
      if (walletApi) {
        try {
          searchAddress = await blockchainService.getBech32Address(walletApi);
          console.log('Using bech32 address for search:', searchAddress);
        } catch (addressError) {
          console.warn('Could not get bech32 address, using provided address:', addressError);
          searchAddress = walletAddress;
        }
      }
      
      onStatusUpdate('Searching blockchain for certificate...', 'info');
      const result = await blockchainService.verifyCertificate(fileHash, searchAddress);
      
      setVerificationResult(result);

      if (result.valid) {
        onStatusUpdate(`Certificate is VALID! Found on blockchain in transaction: ${result.transactionHash}`, 'success');
      } else {
        onStatusUpdate('Certificate is INVALID - not found on blockchain', 'error');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      onStatusUpdate(`Verification failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-primary-light p-6">
      <h2 className="text-2xl font-bold text-text-dark mb-4 flex items-center gap-2">
        🔍 Verify Certificate
      </h2>

      <div className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Select Certificate File (PDF)
          </label>
          <input
            id="verify-file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="w-full p-3 bg-surface-light border border-primary-light rounded-md focus:ring-2 focus:ring-accent-blue focus:ring-opacity-50 text-text-dark placeholder-text-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
          />
          {selectedFile && (
            <div className="mt-2 text-sm text-green-400 bg-green-500 bg-opacity-20 p-2 rounded border border-green-500 border-opacity-30">
              ✅ Selected: {selectedFile.name} ({blockchainService.formatFileSize(selectedFile.size)})
            </div>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={!isConnected || !isConfigured || !selectedFile || isLoading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-all backdrop-blur-sm ${
            !isConnected || !isConfigured || !selectedFile || isLoading
              ? 'bg-gray-600 bg-opacity-50 text-gray-400 cursor-not-allowed border border-gray-500 border-opacity-50'
              : 'bg-green-500 text-white hover:bg-green-600 border border-green-400 border-opacity-50 hover:border-opacity-80'
          }`}
        >
          {isLoading ? 'Verifying...' : 'Verify Certificate'}
        </button>

        {/* Verification Result */}
        {verificationResult && (
          <div className={`p-4 rounded-lg border ${
            verificationResult.valid 
              ? 'bg-green-500 bg-opacity-20 border-green-500 border-opacity-30' 
              : 'bg-red-500 bg-opacity-20 border-red-500 border-opacity-30'
          }`}>
            <div className={`font-medium ${
              verificationResult.valid ? 'text-green-400' : 'text-red-400'
            }`}>
              {verificationResult.valid ? '✅ VALID Certificate' : '❌ INVALID Certificate'}
            </div>
            
            {verificationResult.valid && (
              <div className="mt-2 text-sm text-text-medium space-y-1">
                <div><strong>Transaction:</strong> {verificationResult.transactionHash}</div>
                <div><strong>Issued:</strong> {verificationResult.issuedAt}</div>
                <div><strong>File:</strong> {verificationResult.fileName}</div>
                <div><strong>Issuer:</strong> {verificationResult.issuer}</div>
                <div className="text-xs bg-accent-blue bg-opacity-20 text-text-dark p-2 rounded mt-2 border border-accent-blue border-opacity-30">
                  🔗 <strong>Blockchain Verified:</strong> This certificate was verified using real Cardano blockchain data.
                </div>
              </div>
            )}
            
            {!verificationResult.valid && (
              <div className="mt-1 text-sm text-red-300">
                This certificate was not found on the blockchain or has been tampered with.
              </div>
            )}
          </div>
        )}

        {/* Status Messages */}
        {!isConnected && (
          <div className="text-sm text-red-400 bg-red-500 bg-opacity-10 p-3 rounded border border-red-500 border-opacity-30">
            ❌ Wallet not connected
          </div>
        )}
        {!isConfigured && (
          <div className="text-sm text-orange-400 bg-orange-500 bg-opacity-10 p-3 rounded border border-orange-500 border-opacity-30">
            ⚠️ Blockfrost API key not configured
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleVerifyCertificate;
