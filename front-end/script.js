    const BATCH_NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const UNIT_NFT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    // ABIs (minimal - add your full ABIs)
    const BATCH_ABI = [
        "function mintBatch(string memory drugName, uint256 expiryDate, uint256 totalUnits) external",
        "function dispenseUnit(uint256 batchId) external",
        "function batches(uint256) view returns (string drugName, uint256 expiryDate, uint256 totalUnits, uint256 remainingUnits)",
        "function batchCounter() view returns (uint256)"
    ];

    const UNIT_ABI = [
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function unitCounter() view returns (uint256)"
    ];

    let provider, signer, batchContract, unitContract, userAddress;

    async function connectWallet() {
        try {
            if (typeof window.ethereum === 'undefined') {
                alert('Please install MetaMask!');
                return;
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();

            batchContract = new ethers.Contract(BATCH_NFT_ADDRESS, BATCH_ABI, signer);
            unitContract = new ethers.Contract(UNIT_NFT_ADDRESS, UNIT_ABI, signer);

            document.getElementById('connectSection').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            
            document.getElementById('walletInfo').innerHTML = `
                <div class="status success">
                    Connected: <div class="wallet-address">${userAddress}</div>
                </div>
            `;
        } catch (error) {
            showStatus('walletInfo', error.message, 'error');
        }
    }

    async function mintBatch() {
        const drugName = document.getElementById('drugName').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const totalUnits = document.getElementById('totalUnits').value;

        if (!drugName || !expiryDate || !totalUnits) {
            showStatus('mintStatus', 'Please fill all fields', 'error');
            return;
        }

        try {
            const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);
            showStatus('mintStatus', 'Minting batch... Please wait', 'info');
            
            const tx = await batchContract.mintBatch(drugName, expiryTimestamp, totalUnits);
            await tx.wait();

            const batchId = await batchContract.batchCounter();
            showStatus('mintStatus', `✅ Batch #${batchId} minted successfully!`, 'success');
            
            // Clear form
            document.getElementById('drugName').value = '';
            document.getElementById('expiryDate').value = '';
            document.getElementById('totalUnits').value = '';
        } catch (error) {
            showStatus('mintStatus', `Error: ${error.message}`, 'error');
        }
    }

    async function dispenseUnit() {
        const batchId = document.getElementById('dispenseBatchId').value;

        if (!batchId) {
            showStatus('dispenseStatus', 'Please enter batch ID', 'error');
            return;
        }

        try {
            showStatus('dispenseStatus', 'Dispensing unit... Please wait', 'info');
            
            const tx = await batchContract.dispenseUnit(batchId);
            await tx.wait();

            const unitId = await unitContract.unitCounter();
            showStatus('dispenseStatus', `✅ Unit #${unitId} dispensed successfully!`, 'success');
            
            // Generate QR Code
            generateQR(unitId);
        } catch (error) {
            showStatus('dispenseStatus', `Error: ${error.message}`, 'error');
        }
    }

    async function viewBatch() {
        const batchId = document.getElementById('viewBatchId').value;

        if (!batchId) {
            showStatus('batchDetails', 'Please enter batch ID', 'error');
            return;
        }

        try {
            const batch = await batchContract.batches(batchId);
            const expiryDate = new Date(batch.expiryDate.toNumber() * 1000).toLocaleDateString();
            
            document.getElementById('batchDetails').innerHTML = `
                <div class="batch-info">
                    <h3>Batch #${batchId} Details</h3>
                    <div class="info-row">
                        <span class="info-label">Drug Name:</span>
                        <span class="info-value">${batch.drugName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Expiry Date:</span>
                        <span class="info-value">${expiryDate}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total Units:</span>
                        <span class="info-value">${batch.totalUnits.toString()}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Remaining Units:</span>
                        <span class="info-value">${batch.remainingUnits.toString()}</span>
                    </div>
                </div>
            `;
        } catch (error) {
            showStatus('batchDetails', `Error: ${error.message}`, 'error');
        }
    }

    async function viewUnit() {
        const unitId = document.getElementById('viewUnitId').value;

        if (!unitId) {
            showStatus('unitDetails', 'Please enter unit ID', 'error');
            return;
        }

        try {
            const owner = await unitContract.ownerOf(unitId);
            
            document.getElementById('unitDetails').innerHTML = `
                <div class="batch-info">
                    <h3>Unit #${unitId} Details</h3>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-value" style="color: green;">✅ Authentic</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Owner:</span>
                        <span class="info-value" style="font-family: monospace; font-size: 12px;">${owner}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Verification:</span>
                        <span class="info-value">Verified on Blockchain</span>
                    </div>
                </div>
            `;
        } catch (error) {
            showStatus('unitDetails', `Error: Unit not found or invalid`, 'error');
        }
    }

    function generateQR(unitId) {
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        
        const qrDiv = document.createElement('div');
        const verificationUrl = `${window.location.origin}?verify=${unitId}`;
        
        new QRCode(qrDiv, {
            text: verificationUrl,
            width: 200,
            height: 200
        });
        
        qrContainer.appendChild(qrDiv);
        
        const label = document.createElement('p');
        label.style.textAlign = 'center';
        label.style.marginTop = '10px';
        label.style.fontWeight = '600';
        label.textContent = `QR Code for Unit #${unitId}`;
        qrContainer.appendChild(label);
    }

    function showStatus(elementId, message, type) {
        const statusDiv = document.getElementById(elementId);
        statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    }

    // Check if URL has verify parameter and auto-verify
    window.onload = async function() {
        const urlParams = new URLSearchParams(window.location.search);
        const verifyUnit = urlParams.get('verify');
        if (verifyUnit) {
            // Wait a bit for wallet connection
            setTimeout(async () => {
                document.getElementById('viewUnitId').value = verifyUnit;
                if (userAddress) {
                    await viewUnit();
                }
            }, 2000);
        }
    };

    // Handle network changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload();
        });
        
        window.ethereum.on('chainChanged', function (chainId) {
            window.location.reload();
        });
    }