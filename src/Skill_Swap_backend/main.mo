import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
// import Text "mo:base/Text";
// import Array "mo:base/Array";
import Nat "mo:base/Nat";
// import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Hash "mo:base/Hash";

actor SkillExchangeCanister {
  type Skill = {
    id: Nat;
    name: Text;
    category: Text;
    experienceLevel: Nat;
  };

  type UserProfile = {
    id: Nat;
    principal: Principal;
    username: Text;
    email: ?Text;
    bio: Text;
    offeredSkills: [Skill];
    desiredSkills: [Skill];
    availabilitySchedule: Text;
    points: Nat;
    createdAt: Time.Time;
    updatedAt: Time.Time;
  };

  type SkillExchangeRequest = {
    id: Nat;
    requesterPrincipal: Principal;
    responderPrincipal: Principal;
    offeredSkill: Skill;
    requestedSkill: Skill;
    status: { #Pending; #Accepted; #Rejected; #Completed };
    createdAt: Time.Time;
  };

  // Storage structures
  let userProfiles = HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);
  let skillExchangeRequests = HashMap.HashMap<Nat, SkillExchangeRequest>(10, Nat.equal, Hash.hash);
  // Counters for generating unique IDs
  var userIdCounter : Nat = 0;
  var _skillIdCounter : Nat = 0;
  var exchangeRequestIdCounter : Nat = 0;

  // User Profile CRUD Operations
  public shared(msg) func createUserProfile(
    username: Text, 
    email: ?Text,
    bio: Text, 
    offeredSkills: [Skill],
    desiredSkills: [Skill],
    availabilitySchedule: Text
  ) : async Result.Result<UserProfile, Text> {
    let now = Time.now();
    let newProfile : UserProfile = {
      id = userIdCounter;
      principal = msg.caller;
      username = username;
      email = email;
      bio = bio;
      offeredSkills = offeredSkills;
      desiredSkills = desiredSkills;
      availabilitySchedule = availabilitySchedule;
      points = 0;
      createdAt = now;
      updatedAt = now;
    };

    userProfiles.put(msg.caller, newProfile);
    userIdCounter += 1;
    
    #ok(newProfile)
  };

  public shared(msg) func updateUserProfile(
    updates: {
      username: ?Text;
      email: ?Text;
      bio: ?Text;
      offeredSkills: ?[Skill];
      desiredSkills: ?[Skill];
      availabilitySchedule: ?Text;
    }
  ) : async Result.Result<UserProfile, Text> {
    switch (userProfiles.get(msg.caller)) {
      case (null) { #err("Profile not found") };
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          id = existingProfile.id;
          principal = existingProfile.principal;
          username = Option.get(updates.username, existingProfile.username);
          email = switch (updates.email) {
            case (null) { existingProfile.email };
            case (?newEmail) { ?newEmail };
          };
          bio = Option.get(updates.bio, existingProfile.bio);
          offeredSkills = Option.get(updates.offeredSkills, existingProfile.offeredSkills);
          desiredSkills = Option.get(updates.desiredSkills, existingProfile.desiredSkills);
          availabilitySchedule = Option.get(updates.availabilitySchedule, existingProfile.availabilitySchedule);
          points = existingProfile.points;
          createdAt = existingProfile.createdAt;
          updatedAt = Time.now();
        };

        userProfiles.put(msg.caller, updatedProfile);
        #ok(updatedProfile)
      };
    }

  };  public shared(msg) func deleteUserProfile() : async Result.Result<(), Text> {
    switch (userProfiles.get(msg.caller)) {
      case (null) { #err("Profile not found") };
      case (?_) { 
        userProfiles.delete(msg.caller);
        #ok() 
      };
    }
  };

  public query func getUserProfile(principal: Principal) : async ?UserProfile {
    userProfiles.get(principal)
  };

  // Skill Exchange Request CRUD
  public shared(msg) func createSkillExchangeRequest(
    responderPrincipal: Principal,
    offeredSkill: Skill,
    requestedSkill: Skill
  ) : async Result.Result<SkillExchangeRequest, Text> {
    let newRequest : SkillExchangeRequest = {
      id = exchangeRequestIdCounter;
      requesterPrincipal = msg.caller;
      responderPrincipal = responderPrincipal;
      offeredSkill = offeredSkill;
      requestedSkill = requestedSkill;
      status = #Pending;
      createdAt = Time.now();
    };

    skillExchangeRequests.put(exchangeRequestIdCounter, newRequest);
    exchangeRequestIdCounter += 1;

    #ok(newRequest)
  };

  public shared(msg) func updateSkillExchangeRequest(
    requestId: Nat,
    newStatus: { #Pending; #Accepted; #Rejected; #Completed }
  ) : async Result.Result<SkillExchangeRequest, Text> {
    switch (skillExchangeRequests.get(requestId)) {
      case (null) { #err("Exchange request not found") };
      case (?existingRequest) {
        // Ensure only the requester or responder can update
        if (msg.caller != existingRequest.requesterPrincipal and 
            msg.caller != existingRequest.responderPrincipal) {
          return #err("Unauthorized to update this request");
        };

        let updatedRequest : SkillExchangeRequest = {
          id = existingRequest.id;
          requesterPrincipal = existingRequest.requesterPrincipal;
          responderPrincipal = existingRequest.responderPrincipal;
          offeredSkill = existingRequest.offeredSkill;
          requestedSkill = existingRequest.requestedSkill;
          status = newStatus;
          createdAt = existingRequest.createdAt;
        };

        skillExchangeRequests.put(requestId, updatedRequest);
        #ok(updatedRequest)
      };
    }
  };

  public query func getSkillExchangeRequest(requestId: Nat) : async ?SkillExchangeRequest {
    skillExchangeRequests.get(requestId)
  };
  public func getEmailLength() : async Nat {
    let _emailLength : Nat = switch maybeEmail {
      case (?email) { email.size() };
      case null { 0 };
    };
    return _emailLength;
  };
  let maybeEmail : ?Text = null;
  let _emailLength : Nat = switch maybeEmail {
    case (?email) { email.size() };  // Access .size() only if email is present
    case null { 0 };                 // Default value if email is null
};

};

