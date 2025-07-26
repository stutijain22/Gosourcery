export const SEND_BADGE_SCANNER_EMAIL = `
   mutation sendBadgeScannerEmail( 
   $clientEmail: String!,$collectionId: String!, $collectionName: String!, $eventId: String!, $zip: String,
   $notes: String!, $rawInfo: String!, $userId: String!, $workspaceId: String!, $workspaceName: String!, 
   $resend:Boolean!, $transactionId: String, $state: String, $phoneNumber: String, $lastName: String
   $firstName: String!, $country: String, $companyName: String, $city: String, $businessType: String,
   $address: String) {
  sendBadgeScannerEmail(clientEmail: $clientEmail, collectionId: $collectionId, collectionName: $collectionName, 
  eventId: $eventId, notes: $notes, rawInfo:$rawInfo, userId:$userId, workspaceId:$workspaceId, 
  workspaceName:$workspaceName, resend:$resend, transactionId:$transactionId, state:$state, 
  phoneNumber:$phoneNumber, lastName:$lastName, firstName:$firstName, country:$country,
  companyName:$companyName, city:$city, businessType:$businessType, address:$address, zip:$zip) {
    clientEmail
    collectionId
    collectionName
    emailStatus
    eventId
    notes
    rawInfo
    timestamp
    transactionId
    userId
    workspaceId
    workspaceName
    }
  }
`;

export const UPDATE_USER_PROFILE = `
   mutation updateUserProfile($username: String!, $attributes: UserInput) {
    updateUserProfile(username: $username, attributes: $attributes) {
      name 
      email 
      id
      isVerified 
      picture
      company
      job_title
      logo
      paymentStatus
      projectSortingMode
      projectSortingModeAscending
      collectionSortingMode
      collectionSortingModeAscending
      location
      projectTeamRole
    }
  }
`;