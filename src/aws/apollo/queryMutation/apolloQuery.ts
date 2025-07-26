
export const GET_LIST_MY_WORKSPACES = `
   query listMyWorkspaces($limit:Int) {
    listMyWorkspaces(limit: $limit) {
      data {
        id
        name 
        }
      nextToken
    }
  }
`;

export const GET_LIST_MY_COLLECTIONS = `
   query listMyCollections($limit: Int, $workspaceId: String, $collectionGroup: CollectionGroup!) {
    listMyCollections(limit: $limit, workspaceId: $workspaceId, collectionGroup: $collectionGroup) {
      data { 
      id
      lastModified 
      createdDate 
      name 
      libraryId
        creator { 
      name 
      email 
      id 
      picture
      paymentStatus 
      projectTeamRole 
      }
      productsCount 
      type 
      logo 
      publish
      workspaceId 
      follow 
      publishExpirationDate
      publishExpirationMessage 
      createdProUser
      suggested 
      isVerified 
      verifiedPageId
      verifiedPageName 
      pictures { 
      attachment{ 
      filename 
      size 
      id 
      type 
      url
      key 
      thumbnails { 
        full { height url width key } 
        large { height url width key } 
        small { height url width key } 
        medium { height url width key } 
      } 
} } }
      amount
      nextToken 
    }
  }
`;

export const GET_BADGE_SCANNER_HISTORY = `
   query getBadgeScannerHistory( $eventId: String!, $userId: String!, $workspaceId: String, $limit: Int, $emailStatus:String ) {
    getBadgeScannerHistory(eventId: $eventId, userId: $userId, workspaceId: $workspaceId, limit: $limit, emailStatus: $emailStatus) {
      data {
        userId
        eventId
        clientEmail
        collectionName
        collectionId
        workspaceId
        workspaceName
        emailStatus
        timestamp
        notes
        transactionId 
        zip
        rawInfo
        state
        phoneNumber
        lastName
        firstName
        country
        companyName
        city
        businessType
        address
      }
      nextToken
    }
  }
`;

export const GET_USER_PROFILE = `
   query getUserProfile($username: String!) {
    getUserProfile(username: $username) {
      name
      email
      isVerified
      picture
      company
      job_title
      logo
      collectionSortingModeAscending
      location
      projectTeamRole
    }
  }
`;