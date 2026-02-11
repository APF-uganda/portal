
export interface EmailData {
    memberName: string;
    memberId: string;
    portalLink: string;
    dashboardLink: string;
  }
  
  export const APF_APPROVAL_EMAIL = (data: EmailData): string => {
    return `
  Subject: Welcome to the APF: Your Membership Application has been Approved
  
  Dear ${data.memberName},
  
  On behalf of the Accountancy Practitioner Forum (APF), I am pleased to inform you that your request to join our organization has been officially approved.
  
  We are thrilled to have you as part of a community dedicated to excellence in accountancy practice. As a member, you now have access to your Member Dashboard.
  
  Your Membership Details:
      Member ID: ${data.memberId}
      Member Portal: ${data.portalLink}
      Initial Setup: Please log in to the ${data.dashboardLink} to complete your practitioner profile.
  


  
  Welcome to the APF!
  
  Best regards,
  
  Membership Committee
  Accountancy Practitioners Forum (APF)
    `.trim();
  };