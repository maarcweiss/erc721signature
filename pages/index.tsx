import { useAddress, useContract, Web3Button } from "@thirdweb-dev/react";
import { SignedPayload721WithQuantitySignature } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
//import ethers

//address of the erc20 signature token
const signatureDropAddress = "0x37e2B2F4b8AA264B436D19c2fD5C5c3a5812E1CC";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract: signatureDrop } = useContract(
    signatureDropAddress,
    "signature-drop"
  );

  //GENERATE SIGNATURE FOR ERC20's: https://portal.thirdweb.com/sdk/interacting-with-contracts/erc20/erc20signaturemintable
  const startTime = new Date();
  const endTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
  // const payload = {
  //   quantity: 4.2, // The quantity of tokens to be minted
  //   to: {{wallet_address}}, // Who will receive the tokens
  //   price: 0.5, // the price to pay for minting those tokens
  //   currencyAddress: NATIVE_TOKEN_ADDRESS, // the currency to pay with
  //   mintStartTime: startTime, // can mint anytime from now
  //   mintEndTime: endTime, // to 24h from now,
  //   primarySaleRecipient: "0x...", // custom sale recipient for this token mint
  // };
  // const signedPayload = await contract.erc20.signature.generate(payload);
  // now anyone can use these to mint the NFT using `contract.erc20.signature.mint(signedPayload)`

  // async function claim() {
  //   try {
  //     const tx = await signatureDrop?.claim(1);
  //     alert(`Succesfully minted NFT!`);
  //   } catch (error: any) {
  //     alert(error?.message);
  //   }
  // }
  const mintTokens = async () => {
    //create contract and mint
    await signatureDrop.mintTo(
      "0x7A1654D059df0A04b183BB577834B607230224EA",
      200
    );
  };

  async function claimWithSignature() {
    const signedPayloadReq = await fetch(`/api/generate-mint-signature`, {
      method: "POST",
      body: JSON.stringify({
        address: address,
      }),
    });

    console.log(signedPayloadReq);

    if (signedPayloadReq.status === 400) {
      alert(
        "Looks like you don't own an early access NFT :( You don't qualify for the free mint."
      );
      return;
    } else {
      try {
        const signedPayload =
          (await signedPayloadReq.json()) as SignedPayload721WithQuantitySignature;

        console.log(signedPayload);

        const nft = await signatureDrop?.signature.mint(signedPayload);

        alert(`Succesfully minted NFT!`);
      } catch (error: any) {
        alert(error?.message);
      }
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>Guess you got offered some free Dabloons !</h1>
      <p className={styles.describe}>
        Check all our ecosystem {""}
        <a href="https://dabloons.wtf/">
          and do not forget to talk to mr. Cranky
        </a>{" "}
        You can mint for free using the{" "}
        <a href="https://portal.thirdweb.com/pre-built-contracts/signature-drop#signature-minting">
          the button down below.{" "}
        </a>
        If you do not have gas fees bla bla bla
      </p>

      <img
        src={`/catAI.png`}
        alt="cat-AI"
        style={{ borderRadius: 50, width: 350 }}
      ></img>
      <div className={styles.nftBoxGrid}>
        {/* <div className={styles.optionSelectBox}>
          <img src={`/icons/drop.webp`} alt="drop" className={styles.cardImg} />
          <h2 className={styles.selectBoxTitle}>Claim NFT</h2>
          <p className={styles.selectBoxDescription}>
            Use the normal <code>claim</code> function to mint an NFT under the
            conditions of the claim phase.
          </p>

          <Web3Button
            contractAddress={signatureDropAddress}
            action={() => claim()}
            colorMode="dark"
          >
            Claim
          </Web3Button>
        </div> */}

        {/* <div className={styles.optionSelectBox}> */}
        {/* <img
          src={`/catAI.png`}
          alt="signature-mint"
          className={styles.cardImg}
        /> */}
        <h2 className={styles.selectBoxTitle}>Mint Free Dabloons</h2>
        {/* <p className={styles.selectBoxDescription}>
          You can only do this once, so do not try to trick mr. Quitles
        </p> */}

        <Web3Button
          contractAddress={signatureDropAddress}
          action={() => mintTokens()}
          colorMode="dark"
        >
          Mint Dabloons
        </Web3Button>
      </div>
    </div>
    // </div>
  );
};

export default Home;
