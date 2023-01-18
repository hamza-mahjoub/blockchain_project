App = {
  loading: false,
  /*ipfs: window.IpfsApi('ipfs.infura.io/', 5001, 
    {
      protocol: 'https', 
    }),*/
  ipfs: {
    files: {
      add: async (buf) => {
        const response = await fetch('http://localhost:3001/add/image', {
          method: 'POST',
          body: JSON.stringify({
            buf
          }),
          mode: "cors",
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json()
        return [data]
      },
    },
  },
  contracts: {},
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.loadUserProfile();
    await App.render();
  },

  loadWeb3: async () => {

    if (window.ethereum) {
      console.log("Metamask Detected");
      window.web3 = new Web3(window.ethereum);
      try {
        $("#msg").text("Please connect your metamask")
        var res = await ethereum.enable();
        App.network = await web3.eth.net.getNetworkType();
        console.log(App.network);
      } catch (error) {
        $("#generalMsgModal").modal("show");
        $("#generalModalMessage").text("Permission Denied, Metamask Not connected!");
      }
    }

    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      $("#generalMsgModal").modal("show");
      $("#generalModalMessage").html("Non-Ethereum browser detected. You should consider trying MetaMask! <br> <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'>Download Here</a>");
    }
  },

  loadAccount: async () => {
    App.account = await web3.givenProvider.selectedAddress;
  },

  loadContract: async () => {

    let abi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "addMaintainer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "_decision",
            "type": "bool"
          }
        ],
        "name": "advertisementApproval",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "changeOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_username",
            "type": "string"
          }
        ],
        "name": "changeUsername",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "claimReportingReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "claimSuitReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_truthid",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_comment",
            "type": "string"
          }
        ],
        "name": "createComment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_hashtag",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_content",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_imghash",
            "type": "string"
          }
        ],
        "name": "createTruth",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "deleteComment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "deleteTruth",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_commentid",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_comment",
            "type": "string"
          }
        ],
        "name": "editComment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_hashtag",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_content",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_imghash",
            "type": "string"
          }
        ],
        "name": "editTruth",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "likeTruth",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "maintainer",
            "type": "uint256"
          }
        ],
        "name": "logAdvertisementApproved",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "maintainer",
            "type": "uint256"
          }
        ],
        "name": "logAdvertisementRejected",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "hashtag",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "maintainer",
            "type": "uint256"
          }
        ],
        "name": "logTruthBanned",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "author",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "userid",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "truthid",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "hashtag",
            "type": "string"
          }
        ],
        "name": "logTruthCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "hashtag",
            "type": "string"
          }
        ],
        "name": "logTruthDeleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "hashtag",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "maintainer",
            "type": "uint256"
          }
        ],
        "name": "logTruthFreed",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "hashtag",
            "type": "string"
          }
        ],
        "name": "logTruthReported",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "user",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "logRegisterUser",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "user",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "logUserBanned",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_username",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_imgHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_coverHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_bio",
            "type": "string"
          }
        ],
        "name": "registerUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_truthId",
            "type": "uint256"
          }
        ],
        "name": "reportTruth",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "revokeMaintainer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "startDapp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "stopDapp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_imgHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_link",
            "type": "string"
          }
        ],
        "name": "submitAdvertisement",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_truthId",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "_action",
            "type": "bool"
          }
        ],
        "name": "takeAction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "transferContractBalance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "stateMutability": "nonpayable",
        "type": "fallback"
      },
      {
        "inputs": [],
        "name": "advertisementCost",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "advertiserAdvertisementsList",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "fakeReportingSuitReward",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "getAd",
        "outputs": [
          {
            "internalType": "address",
            "name": "advertiser",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "imgHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "link",
            "type": "string"
          },
          {
            "internalType": "enum Truth.AdApprovalStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "expiry",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAds",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "list",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "getAdvertisementStatus",
        "outputs": [
          {
            "internalType": "enum Truth.AdApprovalStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "getComment",
        "outputs": [
          {
            "internalType": "address",
            "name": "author",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "truthId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "content",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "likeCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "enum Truth.cdStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "getTruth",
        "outputs": [
          {
            "internalType": "address",
            "name": "author",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "hashtag",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "content",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "imgHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "likeCount",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "getTruthComments",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "list",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getReportedTruths",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "list",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_truthId",
            "type": "uint256"
          }
        ],
        "name": "getReportedTruthStatus",
        "outputs": [
          {
            "internalType": "enum Truth.reportAction",
            "name": "status",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "getUser",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "username",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "imghash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "coverhash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "bio",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getUser",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "username",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "imghash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "coverhash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "bio",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "getUserComments",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "commentList",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getUserComments",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "commentList",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "getUserTruths",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "truthList",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getUserTruths",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "truthList",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "isMaintainer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "myAdvertisements",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "list",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "myReportings",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "list",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "reportingClaimStatus",
        "outputs": [
          {
            "internalType": "enum Truth.usertruthReportingStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "reportingRewardPrice",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "reportingstakePrice",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "stopped",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalAdvertisements",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalComments",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalTruths",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalMaintainers",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalUsers",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_username",
            "type": "string"
          }
        ],
        "name": "usernameAvailable",
        "outputs": [
          {
            "internalType": "bool",
            "name": "status",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "userReportList",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "userStatus",
        "outputs": [
          {
            "internalType": "enum Truth.accountStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    App.Rinkeby = "0x483EADa90CBBBC571879220325Ce5e487cdA8f44";
    App.Ropsten = "0xB8224485479051c4299449f3570058e3eF783C15";
    App.Kovan = "0x70Cb84cAB67Ab0E8D30A99c08a5D6DD21c585FCa";
    App.Goerli = "0x634CdABb2177491aC07517929E35fBB237086906";
    App.Private = "0x8BA5211A2951555Bd73D868f93B60fcf4A8C913d";

    if (App.network == "rinkeby") App.contracts.truth = new web3.eth.Contract(abi, App.Rinkeby);
    else if (App.network == "ropsten") App.contracts.truth = new web3.eth.Contract(abi, App.Ropsten);
    else if (App.network == "goerli") App.contracts.truth = new web3.eth.Contract(abi, App.Goerli);
    else if (App.network == "private") App.contracts.truth = new web3.eth.Contract(abi, App.Private);
    else App.showError("Please Connect to valid network");
    console.log(App.contracts.truth);
  },

  loadUserProfile: async () => {
    App.userStatus = await App.contracts.truth.methods.userStatus().call({ from: App.account });
    App.userStatus = 5
    App.setLoading(false);
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return;
    }

    // Update app loading state
    App.setLoading(true);

    // Render Tasks
    await App.renderTruths();

    // Update loading state
    App.setLoading(false);
    App.showAdvertisements();
  },

  renderTruths: async () => {
    let totalTruths = await App.contracts.truth.methods.totalTruths().call({ from: App.account });
    let truthcard = $("#truth")
    $("#truth").remove();
    App.truthsLoaded = totalTruths - 2;
    if (App.truthsLoaded <= 0) App.truthsLoaded = 1;
    console.log(totalTruths);
    for (var i = totalTruths; i >= App.truthsLoaded; i--) {
      try {
        let truth = await App.contracts.truth.methods.getTruth(i).call({ from: App.account });
        let author = await App.contracts.truth.methods.getUser(truth.author).call({ from: App.account });
        console.log(author);
        console.log(truth);
        let dweeettemplate = truthcard.clone();
        dweeettemplate.find(".fullname strong").html(author.name + `<img src="/public/assets_index/img/tick.png" height="20" width="20">`);
        if (truth.imghash != "") dweeettemplate.find(".tweet-text img").attr("src", "https://ipfs.io/ipfs/" + truth.imgHash);
        dweeettemplate.find(".tweet-text p").text(truth.content);
        dweeettemplate.find(".tweet-text h4").text(truth.hashtag);
        dweeettemplate.find(".username ").html(author.username);
        let timestamp = new Date(truth.timestamp * 1000);
        dweeettemplate.find(".tweet-time").html(timestamp.toDateString());
        dweeettemplate.find(".tweet-card-avatar").attr("src", "https://ipfs.io/ipfs/" + author.imghash);
        dweeettemplate.find(".tweet-footer-btn").attr("id", i);
        dweeettemplate.find(".like span").text(truth.likeCount);
        dweeettemplate.find(".like").on("click", App.like);
        dweeettemplate.find(".comment").on("click", App.showComments);
        dweeettemplate.find(".report").on("click", App.report);
        console.log(dweeettemplate);
        $("#truth-list").append(dweeettemplate);
      } catch (e) {
        console.log(e);
      }
    }
  },

  like: async (e) => {
    let truthId = e.currentTarget.id;
    await App.contracts.truth.methods.likeTruth(parseInt(truthId)).send({ from: App.account });
  },

  report: async (e) => {
    let truthId = e.currentTarget.id;
    let price = await App.contracts.truth.methods.reportingstakePrice().call({ from: App.account });
    console.log(price);
    await App.contracts.truth.methods.reportTruth(truthId).send({ from: App.account, value: price });
  },

  showComments: async (e) => {
    $("#commentModal").modal("show");
    let commentTemplate = $("#commentDiv");
    $("#commentDiv").remove();
    let truthId = parseInt(e.currentTarget.id);
    $(".commentBtn").attr("id", truthId);
    let comments = await App.contracts.truth.methods.getTruthComments(truthId).call({ from: App.account });
    console.log(comments);
    if (comments.length == 0) $("#commentContainer").html("<h3 class='mx-5'>There are no Comments!</h3>").height("50px");
    else for (var i = 0; i <= comments.length - 1; i++) {
      let comment = await App.contracts.truth.methods.getComment(comments[i]).call({ from: App.account });
      let author = await App.contracts.truth.methods.getUser(comment.author).call({ from: App.account });
      let commentDiv = commentTemplate.clone();
      commentDiv.find(".image img").attr("src", "https://ipfs.io/ipfs/" + author.imghash);
      commentDiv.find(".title a").html("<b>" + author.name + "</b> @" + author.username);
      commentDiv.find(".time").text(new Date(comment.timestamp * 1000).toDateString());
      commentDiv.find(".post-description p").text(comment.content);
      $("#commentContainer").append(commentDiv);
    }

    $(".commentBtn").on("click", async (e) => {
      let truthId = e.currentTarget.id;
      console.log(e.currentTarget.id);
      await App.contracts.truth.methods.createComment(truthId, $("#commentArea").val()).send({ from: App.account });
      $("#commentArea").val("");
      $("#commentModal").modal("hide");
    });


  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      // content.hide();
    } else {
      loader.hide();
      // content.show();
    }
  },

  showError: async (msg) => {
    $("#generalMsgModal").modal("show");
    $("#generalModalMessage").text(msg);
  },

  RenderMoreTruths: async () => {
    $(window).scroll(async function () {
      console.log("calling Scroll");
      var position = $(window).scrollTop();
      var bottom = $(document).height() - $(window).height();
      console.log(position, " ", bottom);
      if (position >= bottom) {
        let currentTruth = App.truthsLoaded;
        App.truthsLoaded = App.truthsLoaded - 2;
        if (App.truthsLoaded <= 0) App.truthsLoaded = 1;
        if (currentTruth <= 0) currentTruth = 1;
        console.log(App.truthsLoaded + "\n" + currentTruth);
        for (var i = currentTruth; i > App.truthsLoaded; i--) {
          console.log("FOR LOOP WORKING");
          let truthcard = $("#truth");
          try {
            let truth = await App.contracts.truth.methods.getTruth(i).call({ from: App.account });
            let author = await App.contracts.truth.methods.getUser(truth.author).call({ from: App.account });
            console.log(author);
            console.log(truth);
            let dweeettemplate = truthcard.clone();
            dweeettemplate.find(".fullname strong").html(author.name + `<img src="/public/assets_index/img/tick.png" height="20" width="20">`);
            if (truth.imghash != "") dweeettemplate.find(".tweet-text img").attr("src", "https://ipfs.io/ipfs/" + truth.imgHash);
            dweeettemplate.find(".tweet-text p").text(truth.content);
            dweeettemplate.find(".username ").html(author.username);
            let timestamp = new Date(truth.timestamp * 1000);
            dweeettemplate.find(".tweet-time").html(timestamp.toDateString());
            dweeettemplate.find(".tweet-card-avatar").attr("src", "https://ipfs.io/ipfs/" + author.imghash);
            dweeettemplate.find(".tweet-footer-btn").attr("id", i);
            dweeettemplate.find(".like span").text(truth.likeCount);
            dweeettemplate.find(".like").on("click", App.like);
            dweeettemplate.find(".comment").on("click", App.showComments);
            dweeettemplate.find(".report").on("click", App.report);
            console.log(dweeettemplate);
            $("#truth-list").append(dweeettemplate);
          } catch (e) {
            console.log(e);
          }

        }


      }

    });
  },



  truth: async () => {
    $("#truthModalMsg").text("Processing....");
    let image = $("#truthImage").prop("files")[0];
    let hash = "";
    if (image) {
      const reader1 = new FileReader();
      reader1.readAsArrayBuffer(image);
      reader1.onloadend = async function () {
        buf1 = buffer.Buffer(reader1.result);
        var result = await App.ipfs.files.add(buf1);
        hash = result[0].hash;
        await App.contracts.truth.methods.createTruth($("#truthTag").val(), $("#truthContent").val(), hash).send({ from: App.account });
        $("#truthModalMsg").text("Truthed!!!");
      }
    } else {
      await App.contracts.truth.methods.createTruth($("#truthTag").val(), $("#truthContent").val(), hash).send({ from: App.account });
      $("#truthModalMsg").text("Truthed!!!");
    }
  },

  advertise: async () => {
    $("#advertisementModal").modal("show");
    $("#adSubmit").on("click", async () => {
      let image = $("#adImage").prop("files")[0];
      let link = $("#adLink").val();
      let price = await App.contracts.truth.methods.advertisementCost().call({ from: App.account });
      const reader1 = new FileReader();
      reader1.readAsArrayBuffer(image);
      reader1.onloadend = async function () {
        buf1 = buffer.Buffer(reader1.result);
        var result = await App.ipfs.files.add(buf1);
        hash = result[0].hash;
        await App.contracts.truth.methods.submitAdvertisement(hash, link).send({ from: App.account, value: price });
        $("#reportTruthModalMsg").text("Success!!!");
      }
    });

  },

  showAdvertisements: async () => {
    App.advertisementsList = await App.contracts.truth.methods.getAds().call({ from: App.account });
    App.noOfAds = App.advertisementsList.length;
    App.currentAd = 0;

    async function show() {

      if (App.noOfAds > 0) {

        App.currentAd = (++App.currentAd) % App.noOfAds;
        let adindex = App.currentAd + 1;

        let ad = await App.contracts.truth.methods.getAd(adindex).call({ from: App.account });
        if (ad.status == 1 && (Date.now() / 1000) < ad.expiry) {
          $("#ad").attr("href", ad.link);
          $("#ad img").attr("src", "https://ipfs.io/ipfs/" + ad.imgHash)
        } else {
          if (App.noOfAds > 1) show();
          else clearInterval(App.adInterval);
        }
      }
    }

    App.adInterval = setInterval(show, 6000);
  },

  showAdvertisementStatus: async () => {
    $("#statusModal").modal("show");
    $("#reportStatusHead").hide();
    $("#advertisementStatusHead").show();
    $("#statusModalBody").empty();
    let advertisementsList = await App.contracts.truth.methods.myAdvertisements().call({ from: App.account });
    for (var i = 0; i < advertisementsList.length; i++) {
      let status = await App.contracts.truth.methods.getAdvertisementStatus(advertisementsList[i]).call({ from: App.account });
      if (status == 0) {
        let html = `      <tr>
        <td>`+ advertisementsList[i] + `</td>
        <td>Pending</td>
        </tr>`;
        $("#statusModalBody").append(html);
      } else if (status == 1) {
        let html = `      <tr>
        <td>`+ advertisementsList[i] + `</td>
        <td>Accepted</td>
        </tr>`;
        $("#statusModalBody").append(html);
      } else {
        let html = `<tr>
        <td>`+ advertisementsList[i] + `</td>
        <td>Rejected</td>
        </tr>`;
        $("#statusModalBody").append(html);
      }

    }
  },

  showReportStatus: async () => {
    $("#statusModal").modal("show");
    $("#reportStatusHead").show();
    $("#advertisementStatusHead").hide();
    $("#statusModalBody").empty();
    let reportsList = await App.contracts.truth.methods.myReportings().call({ from: App.account });
    for (var i = 0; i < reportsList.length; i++) {
      let status = await App.contracts.truth.methods.getReportedTruthStatus(reportsList[i]).call({ from: App.account });
      if (status == 0) {
        let html = `      <tr>
        <td>`+ reportsList[i] + `</td>
        <td>Pending</td>
        <td>-</td>
        </tr>`;
        $("#statusModalBody").append(html);
      } else if (status == 1) {
        let userClaimStatus = await App.contracts.truth.methods.reportingClaimStatus(reportsList[i]).call({ from: App.account });
        if (userClaimStatus == 1) {
          let html = `      <tr>
            <td>`+ reportsList[i] + `</td>
            <td>Banned</td>
            <td><button type="button" class="btn-success claimReportReward" id="`+ reportsList[i] + `">Claim</button></td>
            </tr>`;
          $("#statusModalBody").append(html);
        } else if (userClaimStatus == 2) {
          let html = `      <tr>
            <td>`+ reportsList[i] + `</td>
            <td>Banned</td>
            <td>Claimed</td>
            </tr>`;
          $("#statusModalBody").append(html);
        } else { }

      } else {
        let html = `<tr>
        <td>`+ reportsList[i] + `</td>
        <td>Free</td>
        <td>Not Eligible</td>
        </tr>`;
        $("#statusModalBody").append(html);
      }
    }

    $(".claimReportReward").on("click", async (e) => {
      console.log("Hell0");
      let id = e.currentTarget.id;
      await App.contracts.truth.methods.claimReportingReward(id).send({ from: App.account });
      $("#statusModalMsg").text("Reward Sent");
    });
  },

  showFakeReportingReward: async () => {
    $("#fakeSuitModal").modal("show");
    let reward = await App.contracts.truth.methods.fakeReportingSuitReward().call({ from: App.account });
    $("#suitBalance").text(reward);

    $("#withdrawSuitReward").on("click", async () => {
      await App.contracts.truth.methods.claimSuitReward().send({ from: App.account });
      let reward = await App.contracts.truth.methods.fakeReportingSuitReward().call({ from: App.account });
      $("#suitBalance").text(reward);
    });
  }


};

$(() => {
  $(window).on("load", () => {
    App.load();
    $("#truthBtn").on("click", () => {
      $("#truthModal").modal("show");
    });

    $("#truthSubmit").on("click", () => {
      App.truth();
    });

    $("#adBtn").on("click", App.advertise);


    $("#reportStatusBtn").on("click", () => {
      App.showReportStatus();
    });

    $("#adStatusBtn").on("click", () => {
      App.showAdvertisementStatus();
    });

    $("#suitRewardBtn").on("click", () => {
      App.showFakeReportingReward();
    });

    App.RenderMoreTruths();

  });
});