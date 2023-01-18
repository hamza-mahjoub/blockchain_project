/*
  _____           _   _     
 |_   _| __ _   _| |_| |__  
   | || '__| | | | __| '_ \ 
   | || |  | |_| | |_| | | |
   |_||_|   \__,_|\__|_| |_|
                                                            
*/

// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.8.0;
    library SafeMath {
    
        function add(uint256 a, uint256 b) internal pure returns (uint256) {
            uint256 c = a + b;
            require(c >= a, "SafeMath: addition overflow");
    
            return c;
        }
    
        function sub(uint256 a, uint256 b) internal pure returns (uint256) {
            return sub(a, b, "SafeMath: subtraction overflow");
        }
    
        function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
            require(b <= a, errorMessage);
            uint256 c = a - b;
    
            return c;
        }
    
        function mul(uint256 a, uint256 b) internal pure returns (uint256) {
            if (a == 0) {
                return 0;
            }
    
            uint256 c = a * b;
            require(c / a == b, "SafeMath: multiplication overflow");
    
            return c;
        }
    
        function div(uint256 a, uint256 b) internal pure returns (uint256) {
            return div(a, b, "SafeMath: division by zero");
        }
    
        function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
            require(b > 0, errorMessage);
            uint256 c = a / b;
            return c;
        }
    
    }

/// @title A Decentralised Social Media Platform
/// @author Mohit Bhat
/// @notice You can use this contract to connect to decentralised social network, share your content to the world in a decentralised way!
/// @dev Most of the features are implemented keeping note of security concerns

contract Truth{
    using SafeMath for uint;
    address payable public owner; //Owner is also a maintainer
    bool public stopped = false;
    
    struct User{
        uint id;
        address ethAddress;
        string username;
        string name;
        string profileImgHash;
        string profileCoverImgHash;
        string bio;
        accountStatus status; // Account Banned or Not
    }
    
    struct Truth{
        uint truthId;
        address author;
        string hashtag;
        string content;
        string imgHash;
        uint timestamp;
        uint likeCount;
        uint reportCount;
        cdStatus status; // Truth Active-Deleted-Banned
    }
    
    struct Comment{
        uint commentId;
        address author;
        uint truthId;
        string content;
        uint likeCount;
        // uint reportCount;
        uint timestamp;
        cdStatus status; // Comment Reported and Banned or not
    }
    
    uint public totalTruths=0;
    uint public totalComments=0;
    uint public totalUsers=0;
    
    ///@dev NP means not present the default value for status 
    enum accountStatus{NP,Active,Banned,Deactivated}
    enum cdStatus{NP,Active, Banned, Deleted}//Comment-Truth status
    // enum truthStatus{NP,Active, Banned, Deleted}
    
    mapping(address=>User) private users; //mapping to get user details from user address
    mapping(string=>address) private userAddressFromUsername;//to get user address from username
    // mapping(address=>bool) private registeredUser; //mapping to get user details from user address
    mapping(string=>bool) private usernames;//To check which username is taken taken=>true, not taken=>false

    
    mapping(uint=>Truth) private truths;// mapping to get truth from Id
    mapping(address=>uint[]) private userTruths; // Array to store truths(Id) done by user
    // mapping(uint=>address[]) private truthLikersList;
    mapping(uint=>mapping(address=>bool)) private truthLikers; // Mapping to track who liked which truth
    
    mapping(uint=>Comment) private comments; //Mapping to get comment from comment Id
    mapping(address=>uint[]) private userComments;// Mapping to track user comments from there address
    // mapping(uint=>mapping(address=>bool)) private commentReporters; // Mapping to track who reported which comment
    // mapping(uint=>mapping(address=>bool)) private commentLikers; // Mapping to track who liked on which comment
    mapping(uint=>uint[]) private truthComments; // Getting comments for a specific truth
    
    modifier stopInEmergency { require(!stopped,"Dapp has been stopped!"); _; }
    modifier onlyInEmergency { require(stopped); _; }
    
    modifier onlyOwner{require(msg.sender==owner,"You are not owner!"); _;}
    modifier onlyTruthAuthor(uint id){require(msg.sender==truths[id].author,"You are not Author!"); _;}
    modifier onlyCommentAuthor(uint id){require(msg.sender==comments[id].author,"You are not Author!"); _;}
    modifier onlyAllowedUser(address user){require(users[user].status==accountStatus.Active,"Not a Registered User!"); _;}
    modifier onlyActiveTruth(uint id){require(truths[id].status==cdStatus.Active,"Not a active truth"); _;}
    modifier onlyActiveComment(uint id){require(comments[id].status==cdStatus.Active,"Not a active comment"); _;}
    modifier usernameTaken(string memory username){require(!usernames[username],"Username already taken"); _;}
 // modifier checkUserExists(){require(registeredUser[msg.sender]); _;}
    modifier checkUserNotExists(address user){require(users[user].status==accountStatus.NP,"User already registered"); _;}

    
    event logRegisterUser(address user, uint id);
    event logUserBanned(address user, uint id);
    event logTruthCreated(address author, uint userid, uint truthid, string hashtag);
    event logTruthDeleted(uint id, string hashtag);
    // event logCommentBanned(uint id, string hashtag);
    
    constructor() {
        owner=msg.sender;
        addMaintainer(msg.sender);
        registerUser("owner","owner","","","owner");
    }
    
    fallback() external{
        revert();
    }
        
/*
**************************************USER FUNCTIONS********************************************************************************
*/

    /// @notice Check username available or not
    /// @param  _username username to Check
    /// @return status true or false
    function usernameAvailable(string memory _username) public view returns(bool status){
        return !usernames[_username];
    }
    
    /// @notice Register a new user
    /// @param  _username username of username
    /// @param _name name of person
    /// @param _imgHash Ipfs Hash of users Profile Image
    /// @param _coverHash Ipfs Hash of user cover Image
    /// @param _bio Biography of user
    function registerUser(string memory _username, string memory _name, string memory _imgHash, string memory _coverHash, string memory _bio ) public stopInEmergency checkUserNotExists(msg.sender) usernameTaken(_username){
        usernames[_username]=true;// Attack Prevented
        totalUsers=totalUsers.add(1);
        uint id=totalUsers;
        users[msg.sender]=User(id, msg.sender, _username, _name, _imgHash, _coverHash, _bio, accountStatus.Active);
        userAddressFromUsername[_username]=msg.sender;
        emit logRegisterUser(msg.sender, totalUsers);
    }
    
    /// @notice Check accountStatus of user-Registered, Banned or Deleted
    /// @return status NP, Active, Banned or Deleted
    function userStatus() public view returns(accountStatus status){
        return users[msg.sender].status;
    }
    
    /// @notice Change username of a user
    /// @param _username New username of user
    function changeUsername(string memory _username) public stopInEmergency onlyAllowedUser(msg.sender) usernameTaken(_username){
        users[msg.sender].username=_username;
    }
    
    /// @notice Get user details
    /// @return id Id of user
    /// @return username username of person
    /// @return name Name of user
    /// @return imghash user profile image ipfs hash
    /// @return coverhash usercCover image ipfs hash
    /// @return bio Biography of user
    function getUser() public view returns(uint id, string memory username, string memory name, string memory imghash, string memory coverhash, string memory bio){
        return(users[msg.sender].id,users[msg.sender].username, users[msg.sender].name, users[msg.sender].profileImgHash, users[msg.sender].profileCoverImgHash, users[msg.sender].bio);
    }
    
    /// @notice Get user details
    /// @param _user address of user
    /// @return id Id of user
    /// @return username username of person
    /// @return name Name of user
    /// @return imghash user profile image ipfs hash
    /// @return coverhash usercCover image ipfs hash
    /// @return bio Biography of user
    function getUser(address _user) public view returns(uint id, string memory username, string memory name, string memory imghash, string memory coverhash, string memory bio){
        return(users[_user].id,users[_user].username, users[_user].name, users[_user].profileImgHash, users[_user].profileCoverImgHash, users[_user].bio);
    }
    
    /// @notice Ban user Internal Function
    /// @param  _user address of user
    function banUser(address _user) internal onlyAllowedUser(_user) onlyMaintainer {
        delete users[_user];
        users[_user].status=accountStatus.Banned;
        emit logUserBanned(msg.sender, users[_user].id);
    }

/*
**************************************DWEET FUNCTIONS***********************************************************
*/      
    /// @notice Create a new truth
    /// @param _hashtag hashtag of truth ex. #ethereum
    /// @param _content content of truth to show
    /// @param _imghash Image type content ipfs hash
    function createTruth(string memory _hashtag, string memory _content, string memory _imghash) public stopInEmergency onlyAllowedUser(msg.sender) {
        totalTruths=totalTruths.add(1);
        uint id=totalTruths;
        truths[id]=Truth(id, msg.sender, _hashtag, _content, _imghash, block.timestamp , 0, 0, cdStatus.Active);
        userTruths[msg.sender].push(totalTruths);
        emit logTruthCreated(msg.sender, users[msg.sender].id, totalTruths, _hashtag);
    }
    
    /// @notice Ban Truth Internal Function
    /// @param  _id Id of truth
    function banTruth(uint _id) internal{
        emit logTruthBanned(_id, truths[_id].hashtag, maintainerId[msg.sender]);
        delete truths[_id];
        truths[_id].status=cdStatus.Banned;
        for(uint i=0;i<truthComments[_id].length;i++){
            delete truthComments[_id][i];
        }
        delete truthComments[_id];
    }
    
    /// @notice Edit a truth 
    /// @param  _id Id of truth
    /// @param  _hashtag New tag of truth
    /// @param  _content New content of truth
    /// @param  _imghash Hash of new image content
    function editTruth(uint _id, string memory _hashtag, string memory _content, string memory _imghash) public stopInEmergency onlyActiveTruth(_id)
    onlyAllowedUser(msg.sender) onlyTruthAuthor(_id) {
        truths[_id].hashtag=_hashtag;
        truths[_id].content=_content;
        truths[_id].imgHash=_imghash;
    }
    
    /// @notice Delete a truth
    /// @param  _id Id of truth
    function deleteTruth(uint _id) public onlyActiveTruth(_id) onlyAllowedUser(msg.sender) stopInEmergency onlyTruthAuthor(_id){
        emit logTruthDeleted(_id, truths[_id].hashtag);
        delete truths[_id];
        truths[_id].status=cdStatus.Deleted;
        for(uint i=0;i<truthComments[_id].length;i++){
            delete truthComments[_id][i];
        }
        delete truthComments[_id];
    }
    
    /// @notice Get a Truth
    /// @param  _id Id of truth
    /// @return author Truth author address 
    /// @return  hashtag Tag of truth
    /// @return  content Content of truth
    /// @return  imgHash Hash of image content
    /// @return  timestamp Truth creation timestamp
    /// @return  likeCount No of likes on truth
    function getTruth(uint _id) public onlyAllowedUser(msg.sender) onlyActiveTruth(_id) view returns ( address author, string memory hashtag, string memory content, string memory imgHash, uint timestamp, uint likeCount ){
        return (truths[_id].author, truths[_id].hashtag, truths[_id].content, truths[_id].imgHash, truths[_id].timestamp, truths[_id].likeCount);
    }
    
    /// @notice Like a truths
    /// @param _id Id of truth to be likeTruth
    function likeTruth(uint _id) public onlyAllowedUser(msg.sender) onlyActiveTruth(_id){
        require(!truthLikers[_id][msg.sender]);
        truths[_id].likeCount=truths[_id].likeCount.add(1);
        truthLikers[_id][msg.sender]=true;
    }
    
    /// @notice Get list of truths done by a user
    /// @return truthList Array of truth ids
    function getUserTruths() public view onlyAllowedUser(msg.sender) returns(uint[] memory truthList){
        return userTruths[msg.sender];
    }
    
    /// @notice Get list of truths done by a user
    /// @param _user User address
    /// @return truthList Array of truth ids
    function getUserTruths(address _user) public view onlyAllowedUser(msg.sender) returns(uint[] memory truthList){
        return userTruths[_user];
    }

/*
**************************************COMMENT FUNCTIONS*************************************************************************
*/ 
    /// @notice Create a comment on truth
    /// @param  _truthid Id of truthList
    /// @param  _comment content of comment
    function createComment(uint _truthid, string memory _comment) public stopInEmergency onlyAllowedUser(msg.sender)  onlyActiveTruth(_truthid){
        totalComments=totalComments.add(1);
        uint id=totalComments;
        comments[id]=Comment(id, msg.sender, _truthid, _comment, 0, block.timestamp, cdStatus.Active);
        userComments[msg.sender].push(totalComments);
        truthComments[_truthid].push(totalComments);
    }
    
    // function banComment(uint _id) internal {
    //     emit logCommentBanned(_id, truths[comments[_id].truthId].hashtag);
    //     delete comments[_id];
    //     comments[_id].status=cdStatus.Banned;
    // }
    
    
    /// @notice Get list of truths done by a user
    /// @param  _commentid Id of comments
    /// @param  _comment New content of comment
    function editComment(uint _commentid, string memory _comment) public stopInEmergency onlyAllowedUser(msg.sender)  onlyActiveComment(_commentid) onlyCommentAuthor(_commentid){
        comments[_commentid].content=_comment;
    }
    
    /// @notice Delete a comment
    /// @param _id Id of comment to be Deleted
    function deleteComment(uint _id) public stopInEmergency onlyActiveComment(_id) onlyAllowedUser(msg.sender) onlyCommentAuthor(_id) {
        delete comments[_id];
        comments[_id].status=cdStatus.Deleted;
    }
    
    /// @notice Get a comment
    /// @param  _id Id of comment
    /// @return author Address of author
    /// @return truthId Id of truth 
    /// @return content content of comment
    /// @return likeCount Likes on commment
    /// @return timestamp Comment creation timestamp
    /// @return status status of Comment active-banned-deleted
    function getComment(uint _id) public view onlyAllowedUser(msg.sender) onlyActiveComment(_id) returns(address author, uint truthId, string memory content, uint likeCount, uint timestamp, cdStatus status){
        return(comments[_id].author, comments[_id].truthId, comments[_id].content, comments[_id].likeCount, comments[_id].timestamp, comments[_id].status);
    }
    
    /// @notice Get comments done by user
    /// @return commentList Array of comment ids
    /// @dev Though onlyAllowedUser can be bypassed easily but still keeping for calls from frontend 
    function getUserComments() public view onlyAllowedUser(msg.sender) returns(uint[] memory commentList){
        return userComments[msg.sender];
    }
    
    /// @notice Get comments done by user
    /// @param _user address of user
    /// @return commentList Array of comment ids
    function getUserComments(address _user) public view onlyAllowedUser(msg.sender) returns(uint[] memory commentList){
        return userComments[_user];
    }
    
    /// @notice Get comments on a truth
    /// @return list Array of comment ids
    function getTruthComments(uint _id) public view onlyAllowedUser(msg.sender) onlyActiveTruth(_id) returns(uint[] memory list){
        return(truthComments[_id]);
    }
        
/*
**********************************Reporting And Maintanining*****************************************************************************************
*/
    uint public totalMaintainers=0;
    uint[] private truthsReportedList;// List of ids of reported truths
    uint private noOfReportsRequired=1;// No of reports required to term a truth reported and send for action
    uint public reportingstakePrice=1936458778290500;// Stake amount to pay while reporting
    uint public reportingRewardPrice=3872917556581000;// Reward of correct reporting
      
    mapping(address=>bool) public isMaintainer;
    mapping(address=>uint) private maintainerId;
    mapping(uint=>mapping(address=>bool)) private truthReporters; // Mapping to track who reported which truth
    mapping(uint=>reportAction) private actionOnTruth;// What is the ction on truth done by maintainers
    mapping(address=>uint[]) public userReportList;// Ids of truths reported by a user
    //mapping(address=>uint) private userRewards;
    mapping(address=>uint) private fakeReportingReward;// Reward a user get when somebody do a fake reporting against that user
    mapping(uint=>mapping(address=>usertruthReportingStatus)) private claimedReward;//To check whether user has claimed reward for a particular reporting
      
    enum usertruthReportingStatus{NP, Reported, Claimed}
    enum reportAction{NP, Banned, Free}
    
    modifier onlyMaintainer(){
        require(isMaintainer[msg.sender],"You are not a maintainer");
        _;
    }
    
    modifier paidEnoughforReporter() { require(msg.value >= reportingstakePrice,"You have not paid enough for advertisement"); _;}
        
    modifier checkValueforReporter() {
        _;
        uint amountToRefund = msg.value.sub(reportingstakePrice);
        msg.sender.transfer(amountToRefund);
    }
      
    /// @notice Add a maintainer to the platform
    /// @param _user Address of user to be added as maintainer
    function addMaintainer(address _user) public onlyOwner {
        isMaintainer[_user]=true;
        totalMaintainers=totalMaintainers.add(1);
        maintainerId[msg.sender]=totalMaintainers;
    }
     
    /// @notice Remove a maintainer 
    /// @param _user Address of user to be removed from maintainer  
    function revokeMaintainer(address _user) public onlyOwner{
        isMaintainer[_user]=false;
    }
      
    event logTruthReported(uint id, string hashtag);
    event logTruthBanned(uint id, string hashtag, uint maintainer); // To track how many truths were banned to specific hashtag
    event logTruthFreed(uint id, string hashtag, uint maintainer); // To track how many truths were banned to specific hashtag
    
    /// @notice Report a truth
    /// @param _truthId Id of the truth to be reported
    function reportTruth(uint _truthId) public payable onlyActiveTruth(_truthId) onlyAllowedUser(msg.sender) paidEnoughforReporter checkValueforReporter{
        require(truths[_truthId].reportCount<=noOfReportsRequired,"Truth have got required no of Reports");
        require(!truthReporters[_truthId][msg.sender],"You have already Reported!");
        truthReporters[_truthId][msg.sender]=true;//Reentracy attack Prevented
        userReportList[msg.sender].push(_truthId);
        claimedReward[_truthId][msg.sender]=usertruthReportingStatus.Reported;
         truths[_truthId].reportCount=truths[_truthId].reportCount.add(1);
        uint reports= truths[_truthId].reportCount;
        if(reports==noOfReportsRequired){
          truthsReportedList.push(_truthId);
          emit logTruthReported(_truthId, truths[_truthId].hashtag);
        }
    }
    
    /// @notice Take action on a reported truths
    /// @param _truthId Id of truths
    /// @param _action ban or free, true or false
    function takeAction(uint _truthId, bool _action) public onlyMaintainer onlyActiveTruth(_truthId) onlyAllowedUser(msg.sender){
        require(actionOnTruth[_truthId]==reportAction.NP,"Action already taken!");
        if(_action){
          actionOnTruth[_truthId]=reportAction.Banned;
          banTruth(_truthId);
        }else{
          actionOnTruth[_truthId]=reportAction.Free;
          fakeReportingReward[truths[_truthId].author]=fakeReportingReward[truths[_truthId].author].add(reportingstakePrice.mul(noOfReportsRequired));
          emit logTruthFreed(_truthId, truths[_truthId].hashtag, maintainerId[msg.sender]);
        }
    }
      
    /// @notice Claim right reporting reward
    /// @param _id Id of truth on which reward is to be claimed  
    function claimReportingReward(uint _id) public onlyAllowedUser(msg.sender){
        require(claimedReward[_id][msg.sender]==usertruthReportingStatus.Reported,"You have not reported or already claimed");
        require(userReportList[msg.sender].length>0);
        require(actionOnTruth[_id]==reportAction.Banned,"Not eligible for reward, Truth has been freed my mainatiners");
        claimedReward[_id][msg.sender]=usertruthReportingStatus.Claimed;//Reentracy Prevented
        msg.sender.transfer(reportingRewardPrice);
    }
    
    /// @notice Claim fake reporting reward(suit)
    function claimSuitReward()public onlyAllowedUser(msg.sender){
        require(fakeReportingReward[msg.sender]>0,"Not enough balance");
        uint amount=fakeReportingReward[msg.sender];
        fakeReportingReward[msg.sender]=0;//Attack Prevented
        msg.sender.transfer(amount);
    }
    
    /// @notice To get list of reportings done by a user
    /// @param list Array of truth Ids reported by user
    function myReportings() public view onlyAllowedUser(msg.sender) returns(uint[] memory list){
        return userReportList[msg.sender];
    }
    
    //   function myReportingReward() public view onlyAllowedUser(msg.sender) returns(uint balance){
    //       return userRewards[msg.sender];
    //   }
    
    /// @notice To get claim status of reporting
    /// @param _id Id of truthsReportedList
    /// @return status status of claim reported or claimed
    function reportingClaimStatus(uint _id) public view onlyAllowedUser(msg.sender) returns(usertruthReportingStatus status){
        return claimedReward[_id][msg.sender];
    }
    
    /// @notice To get fake reporting reward balance
    /// @return balance reward balance of user
    function fakeReportingSuitReward() public view onlyAllowedUser(msg.sender) returns(uint balance){
        return fakeReportingReward[msg.sender];
    }
    
    /// @notice To get list of reported truths on the platform
    /// @return list Array of reported truth ids
    function getReportedTruths() public view onlyAllowedUser(msg.sender) returns(uint[] memory list){
        return(truthsReportedList);
    }
    
    /// @notice Get action status of reporting on a truth
    /// @param _truthId Id of truth
    /// @return status status of action NP-BAN_FREE
    function getReportedTruthStatus(uint _truthId) public view onlyAllowedUser(msg.sender) returns(reportAction status){
        return(actionOnTruth[_truthId]);
    }
    
/*
*******************************************Advertisement **************************************************************
*/
    uint public advertisementCost=96822938914524992;
    uint public totalAdvertisements=0;
    uint[] private advertisementsList;
    
    enum AdApprovalStatus{NP, Approved, Rejected}
    
    struct Advertisement{
        uint id;
        address advertiser;
        string imgHash;
        string link;
        AdApprovalStatus status;// Advertisement Approve or Rejected
        uint expiry; //timestamp to put expiry of Advertisement
    }
    
    modifier paidEnoughforAdvertisement() { require(msg.value >= advertisementCost); _;}
    modifier checkValueforAdvertisement() {
        _;
        uint amountToRefund = msg.value - advertisementCost;
        msg.sender.transfer(amountToRefund);
    }
    
    mapping(address=>uint[]) public advertiserAdvertisementsList;
    mapping(uint=>Advertisement) private advertisements;
    
    event logAdvertisementApproved(uint id, uint maintainer);
    event logAdvertisementRejected(uint id, uint maintainer);
    
    
    /// @notice Submit a new advertisement
    /// @param _imgHash Ipfs hash of image to be shown as advertisement
    /// @param _link Href link for the advertisement
    function submitAdvertisement(string memory _imgHash, string memory _link) public payable onlyAllowedUser(msg.sender) paidEnoughforAdvertisement checkValueforAdvertisement{
        totalAdvertisements=totalAdvertisements.add(1);
        uint id=totalAdvertisements;
        advertisements[id]=Advertisement(id, msg.sender, _imgHash, _link, AdApprovalStatus.NP, 0);
        advertisementsList.push(id);
        advertiserAdvertisementsList[msg.sender].push(id);
    }
    
    /// @notice Approve or reject advertisements
    /// @param _id Id of advertisement
    /// @param _decision Approval decision Accepted or Rejected, true or false
    function advertisementApproval(uint _id, bool _decision) public onlyMaintainer{
        require(advertisements[_id].status==AdApprovalStatus.NP,"Approval already given!");
        if(_decision){
            advertisements[_id].status=AdApprovalStatus.Approved;
            advertisements[_id].expiry=block.timestamp.add(1 days);
            emit logAdvertisementApproved(_id,maintainerId[msg.sender]);
        }else{
            advertisements[_id].status=AdApprovalStatus.Rejected;
            uint refund=advertisementCost.mul(8).div(100);
            msg.sender.transfer(refund);
            emit logAdvertisementRejected(_id,maintainerId[msg.sender]);
        }
    }
    
    /// @notice Get all ads submitted on platform
    /// @return list Array of advertisement ids
    function getAds() public view onlyAllowedUser(msg.sender) returns(uint[] memory list){
        return(advertisementsList);
    }
    
    /// @notice Get details of a advertisement
    /// @param _id Id of advertisement
    /// @return advertiser address of advertiser
    /// @return imgHash Ipfs hash of advertisement image
    /// @return link Href link of advertisement
    /// @return status Approval status of advertisements
    /// @return expiry advertisement expiry timestamp
    function getAd(uint _id) public view onlyAllowedUser(msg.sender) returns(address advertiser, string memory imgHash, string memory link, AdApprovalStatus status, uint expiry){
        return(advertisements[_id].advertiser, advertisements[_id].imgHash, advertisements[_id].link, advertisements[_id].status, advertisements[_id].expiry);
    }
    
    /// @notice Get advertisement done by user
    /// @return list Array of advertisement ids
    function myAdvertisements() public view onlyAllowedUser(msg.sender) returns(uint[] memory list){
        return(advertiserAdvertisementsList[msg.sender]);
    }
    
    /// @notice Status of a advertisement
    /// @param _id Id of advertisement
    /// @return status Approval status accepted or rejected 
    function getAdvertisementStatus(uint _id) public view onlyAllowedUser(msg.sender) returns(AdApprovalStatus status){
        return advertisements[_id].status;
    }

/*
****************************************Owner Admin ******************************************************************************************
*/
    /// @notice Get balance of contract 
    /// @return balance balance of contract
    function getBalance()public view onlyOwner() returns(uint balance){
        return address(this).balance;
    }
    
    /// @notice Withdraw contract funds to owner
    /// @param _amount Amount to be withdrawn
    function transferContractBalance(uint _amount)public onlyOwner{
        require(_amount<=address(this).balance,"Withdraw amount greater than balance");
        msg.sender.transfer(_amount);
    }
    
    function stopDapp() public onlyOwner{
        require(!stopped,"Already stopped");
        stopped=true;
    }
    
    function startDapp() public onlyOwner{
        require(stopped,"Already started");
        stopped=false;
    }
    
    function changeOwner(address payable _newOwner) public onlyOwner{
        owner=_newOwner;
    }
    
}