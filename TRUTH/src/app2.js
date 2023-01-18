App={
    loading:false,
    ipfs: window.IpfsApi('ipfs.infura.io', 5001,{ protocol: 'https'}),
    contracts:{},
    load: async()=>{
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.checkUser();
        await App.render();
    },

    loadWeb3: async () => {

      if (window.ethereum) {
        console.log("Metamask Detected");
        window.web3 = new Web3(window.ethereum);
        try {
        $("#msg").text("Please connect your metamask")  
        var res = await ethereum.enable();
        App.network=await web3.eth.net.getNetworkType();
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
        
        App.Rinkeby="0x483EADa90CBBBC571879220325Ce5e487cdA8f44";
        App.Ropsten="0xB8224485479051c4299449f3570058e3eF783C15";
        App.Kovan="0x70Cb84cAB67Ab0E8D30A99c08a5D6DD21c585FCa";
        App.Goerli="0x634CdABb2177491aC07517929E35fBB237086906";
        App.Private = "0x8BA5211A2951555Bd73D868f93B60fcf4A8C913d";

        if(App.network=="kovan") App.contracts.truth = new web3.eth.Contract(abi, App.Kovan);
        else if(App.network=="rinkeby") App.contracts.truth = new web3.eth.Contract(abi, App.Rinkeby);
        else if(App.network=="ropsten") App.contracts.truth = new web3.eth.Contract(abi, App.Ropsten);
        else if(App.network=="goerli") App.contracts.truth = new web3.eth.Contract(abi, App.Goerli);
        else if (App.network == "private") App.contracts.truth = new web3.eth.Contract(abi, App.Private);
        else App.showError("Please Connect to valid network");
        console.log(App.contracts.truth);
      },

    checkUser: async ()=>{

      let isMaintainer=await App.contracts.truth.methods.isMaintainer(App.account).call({from:App.account});
      console.log(isMaintainer);
      if(!isMaintainer){
        App.setLoading(true);
        $("#generalMsgModal").modal("show");
        $("#generalModalMessage").text("You are not a Maintainer or Owner, Access Denied!");
      }

    } , 
    render: async () => {
        // Prevent double render
        if (App.loading) {
          return;
        }
    
        // Update app loading state
        App.setLoading(true);
    
        // Render Tasks
        await App.renderData();
    
        // Update loading state
        App.setLoading(false);
    },

    renderData:async()=>{
      let totalTruths=await App.contracts.truth.methods.totalTruths().call({from:App.account});
      let totalUsers=await App.contracts.truth.methods.totalUsers().call({from:App.account});
      $("#totalUsers").text(totalUsers);
      $("#totalTruths").text(totalTruths);
      await App.renderReports();
      await App.renderAdvertisements();
    },
    renderReports:async()=>{
      try{
        let ReportsList=await App.contracts.truth.methods.getReportedTruths().call({from:App.account});
        $("#totalReports").text(ReportsList.length);
        for(var i=0;i<ReportsList.length;i++){
          let status=await App.contracts.truth.methods.getReportedTruthStatus(ReportsList[i]).call({from:App.account});
          if(status==0){
            let html=`<tr><td> `+ReportsList[i]+`</td>
         <td><button type="button" class="btn-warning viewtruth" id="`+ReportsList[i]+`">View</button></td>
         <td>
            <button type="button" class="btn-success ban" id="`+ReportsList[i]+`">Ban</button>
            <button type="button" class="btn-danger free" id="`+ReportsList[i]+`">Free</button>
         </td></tr>`;
            $("#reportsTbody").prepend(html);
          }else if(status==1){
            let html=`<tr><td> `+ReportsList[i]+`</td>
            <td><button type="button" class="btn-warning viewtruth" id="`+ReportsList[i]+`">View</button></td>
            <td>
               Banned
            </td></tr>`;
               $("#reportsTbody").append(html);
          }
          else{
            let html=`<tr><td> `+ReportsList[i]+`</td>
            <td><button type="button" class="btn-warning viewtruth" id="`+ReportsList[i]+`">View</button></td>
            <td>
               Free
            </td></tr>`;
               $("#reportsTbody").append(html);
          }
        }
      }catch(e){
        $("#generalMsgModal").modal("show");
        $("#generalModalMessage").text("Error! You are not a user of this Platform! Please Register to Continue");
        App.setLoading(true);
        // App.load();
      }

      $(".ban").on("click",async (e)=>{
        let truthId=e.currentTarget.id;
        await App.contracts.truth.methods.takeAction(truthId,true).send({from:App.account});
      });
  
      $(".free").on("click",async (e)=>{
        let truthId=e.currentTarget.id;
        await App.contracts.truth.methods.takeAction(truthId,false).send({from:App.account});
      });
  
      
      $(".viewtruth").on("click",async (e)=>{
        let truthId=e.currentTarget.id;
        console.log(truthId);
        let truth=await App.contracts.truth.methods.getTruth(truthId).call({from:App.account});
        $("#reportedTruthModal").modal("show");
        $("#truthTag").text(truth.hashtag);
        $("#truthImage").attr("src","https://ipfs.io/ipfs/" + truth.imgHash);
        $("#truthContent").text(truth.content);
      });
    

    },

    renderAdvertisements:async()=>{
      let advertisementsList=await App.contracts.truth.methods.getAds().call({from:App.account});
      $("#totalAdvertisements").text(advertisementsList.length);
      try{
      for(var i=0;i<advertisementsList.length;i++){
        let status=await App.contracts.truth.methods.getAdvertisementStatus(advertisementsList[i]).call({from:App.account});
        if(status==0){
          let html=`<tr><td> `+advertisementsList[i]+`</td>
       <td><button type="button" class="btn-warning viewad" id="`+advertisementsList[i]+`">View</button></td>
       <td>
          <button type="button" class="btn-success accept" id="`+advertisementsList[i]+`">Accept</button>
          <button type="button" class="btn-danger reject" id="`+advertisementsList[i]+`">Reject</button>
       </td></tr>`;
          $("#advertisementsTbody").prepend(html);
        }else if(status==1){
          let html=`<tr><td> `+advertisementsList[i]+`</td>
          <td><button type="button" class="btn-warning viewad" id="`+advertisementsList[i]+`">View</button></td>
          <td>
            Accepted
          </td></tr>`;
             $("#advertisementsTbody").append(html);
        }
        else{
          let html=`<tr><td> `+advertisementsList[i]+`</td>
          <td><button type="button" class="btn-warning viewad" id="`+advertisementsList[i]+`">View</button></td>
          <td>
             Rejected
          </td></tr>`;
             $("#advertisementsTbody").append(html);
        }
      }

      }catch(e){
        $("#generalMsgModal").modal("show");
        $("#generalModalMessage").text("Error! You are not a user of this Platform! Please Register to Continue");
        App.setLoading(true);
        // App.load();
      }

      $(".accept").on("click",async (e)=>{
        let adId=e.currentTarget.id;
        await App.contracts.truth.methods.advertisementApproval(adId,true).send({from:App.account});
      });

      $(".reject").on("click",async (e)=>{
        let adId=e.currentTarget.id;
        await App.contracts.truth.methods.advertisementApproval(adId,false).send({from:App.account});
      });

      $(".viewad").on("click",async (e)=>{
        let adId=e.currentTarget.id;
        console.log(adId);
        let ad=await App.contracts.truth.methods.getAd(adId).call({from:App.account});
        $("#advertisementModal").modal("show");
        $("#adLink").text(ad.link);
        $("#adImage").attr("src","https://ipfs.io/ipfs/" + ad.imgHash);
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

  showError:async(msg)=>{
    $("#generalMsgModal").modal("show");
    $("#generalModalMessage").text(msg);
  },

  maintainerSettings:async()=>{
    let owner=await App.contracts.truth.methods.owner().call({from:App.account});
    if(App.account.toLowerCase()==owner.toLowerCase()){
      $("#maintainerModal").modal("show");
      $("#addMaintainerBtn").on("click",async()=>{
        let address=$("#maintainerAddress").val();
        await  App.contracts.truth.methods.addMaintainer(address).send({from:App.account});
        $("#MaintainerModalMsg").text("Success, Maintainer Added Successfully")
      });

      $("#removeMaintainerBtn").on("click",async()=>{
        let address=$("#maintainerAddress").val();
        await  App.contracts.truth.methods.revokeMaintainer(address).send({from:App.account});
        $("#MaintainerModalMsg").text("Success, Maintainer Removed Successfully")
      });
      
    }else{
      $("#generalMsgModal").modal("show");
      $("#generalModalMessage").text("Access Denied!!! You are not Owner of this Platform");
    }
  },

  withdrawContractFunds:async()=>{
    let owner=await App.contracts.truth.methods.owner().call({from:App.account});
    console.log(owner);
    console.log(App.account);
    if(App.account.toLowerCase()==owner.toLowerCase()){
      $("#contractBalanceModal").modal("show");
      let balance=await App.contracts.truth.methods.getBalance().call({from:App.account});
      $("#contractBalance").text(balance);
  
      $("#WithdrawContractBalance").on("click", async()=>{
         let amount=$("#fundsWithdrawAmount").val();
         await App.contracts.truth.methods.transferContractBalance(amount).send({from:App.account});
        let balance=await App.contracts.truth.methods.getBalance().call({from:App.account});
        $("#contractBalance").text(balance);
      });
      
    }else{
      $("#generalMsgModal").modal("show");
      $("#generalModalMessage").text("Access Denied!!! You are not Owner of this Platform");
    }
  }

 

 


};

$(() => {
  $(window).on("load",() => {
    App.load();
    $("#fundsBtn").on("click",App.withdrawContractFunds);
    $("#maintainerBtn").on("click",App.maintainerSettings);

  });
});