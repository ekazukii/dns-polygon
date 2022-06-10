/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWeb3React } from '@web3-react/core';
import polygonLogo from '../assets/polygonlogo.png';
import ethLogo from '../assets/ethlogo.png';
import { networks } from '../utils/networks';
import { useEffect, useState } from 'react';
import contractABI from '../utils/contractABI.json';
import { ethers } from 'ethers';

const REVERSE_ADDRESS = '0x73D38666dF4F165189cb8124Be1Ac636a5bCe8b5';

export default function ConnectionStatus() {
  const { account, chainId, library } = useWeb3React();
  const [name, setName] = useState<undefined | string>();

  useEffect(() => {
    if (!account || !library) return;
    console.log('présent');
    const signer = library.getSigner();
    const contract = new ethers.Contract(REVERSE_ADDRESS, contractABI.reverseAbi, signer);
    contract.resolve(account).then((name: any) => {
      setName(name + '.hold');
    });
  }, [account, library]);

  return (
    <div className="right">
      <img
        alt="Network logo"
        className="logo"
        src={
          //@ts-ignore
          networks[chainId?.toString(16)]?.includes('Polygon') ? polygonLogo : ethLogo
        }
      />
      {account ? (
        <p>
          {name ? (
            <>Wallet: {name}</>
          ) : (
            <>
              Wallet: {account.slice(0, 6)}...{account.slice(-4)}
            </>
          )}{' '}
        </p>
      ) : (
        <p> Not connected </p>
      )}
    </div>
  );
}
