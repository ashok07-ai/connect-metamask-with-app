"use client"; // Add this at the top to mark this component as a Client Component
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";

import ethereumLogo from "./images/eth-logo.webp"
import nftImage from  "./images/nft-image.png"
import "./globals.css"




export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [connect, isConnected] = useState(false);
  const [balance, setBalance] = useState("");

  const provider = new ethers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
  );

  const checkIfWalletConnected = async () => {
    if (!window.ethereum) return console.error("Please install metamask");

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    console.log(accounts[0]);
    // const address = "0x93793Bd1f3e35a0Efd098c30e486A860A0ef7551";
    const balance = await provider.getBalance(accounts[0]);
  console.log(balance, "balance")
    const showBalance = `${ethers.formatEther(balance)} ETH`;
    setBalance(showBalance);

    if (accounts.length > 1) {
      setCurrentAccount(accounts[0]);
    } else {
      return "Please install metamask";
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return console.error("Please install metamask");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    // window.location.reload();
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  useEffect(()=>{
    async function accountChanged() {
      window.ethereum.on('accountsChanged', async function(){
        const accounts = await window.ethereum.request({
          method: "eth_accounts"
        })

        if (accounts.length > 1) {
          setCurrentAccount(accounts[0]);
        } else {
          window.location.reload()
        }
      })
    }

    accountChanged();
  },[])

  return (
    <div>
      <div className="card-container">
        {!currentAccount ? "" : <span className="pro">PRO</span>}
        <Image  src={nftImage} alt="profile" height={80} width={80}/>
        <h3>Check Ether</h3>

        {!currentAccount ? (
          <div>
            <div className="message">
              <p>Please install metamask</p>
            </div>
            <Image  src={ethereumLogo} alt="ether" height={100} width={100}/>
            <p>Welcome to ether account balance checker!</p>
          </div>
        ) : (
          <div>
            <h6>
              Verified <span className="tick">&#10004;</span>
            </h6>
            <p>
              Ether account and Balance Checker <br />
              Find account details
            </p>
            <div className="buttons">
              <button className="primary-ghost" onClick={() => {}}>
                Ether Account Details
              </button>
            </div>
          </div>
        )}

        {!currentAccount && !connect ? (
          <div className="buttons">
            <button className="primary" onClick={() => connectWallet()}>
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="skills">
            <h6>Your Ether</h6>
            <ul>
              <li>Account</li>
              <li>{currentAccount}</li>
              <li>Balance</li>
              <li>{balance}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
