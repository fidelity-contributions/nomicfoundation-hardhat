import { ethers } from "ethers";
import { AssertionError, expect } from "chai";

import "../src/internal/add-chai-matchers";

describe("Contract & Signer matcher", () => {
  const signer = ethers.Wallet.createRandom();
  const address = signer.address;
  const contract = new ethers.Contract(address, []);

  const otherSigner = ethers.Wallet.createRandom();
  const otherAddress = otherSigner.address;
  const otherContract = new ethers.Contract(otherAddress, []);

  const elements = [
    { name: "address", object: address, class: address },
    { name: "signer", object: signer, class: address },
    { name: "contract", object: contract, class: address },
    { name: "other address", object: otherAddress, class: otherAddress },
    { name: "other signer", object: otherSigner, class: otherAddress },
    { name: "other contract", object: otherContract, class: otherAddress },
  ];

  for (const el1 of elements)
    for (const el2 of elements) {
      const expectEqual = el1.class === el2.class;

      it(`expect "${el1.name}" to equal "${el1.name}": should ${
        expectEqual ? "not " : ""
      }revert`, () => {
        if (expectEqual) {
          expect(el1.object).to.equal(el2.object);
        } else {
          expect(() => expect(el1.object).to.equal(el2.object)).to.throw(
            AssertionError,
            `expected '${el1.class}' to equal '${el2.class}'.`
          );
        }
      });

      it(`expect "${el1.name}" to not equal "${el1.name}": should ${
        expectEqual ? "" : "not "
      }revert`, () => {
        if (expectEqual) {
          expect(() => expect(el1.object).to.not.equal(el2.object)).to.throw(
            AssertionError,
            `expected '${el1.class}' to not equal '${el2.class}'.`
          );
        } else {
          expect(el1.object).to.not.equal(el2.object);
        }
      });
    }
});
