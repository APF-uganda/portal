// src/data/managementMembers.ts
import leader5 from '../assets/images/aboutPage-images/leader5.jpeg';
import leader2 from '../assets/images/aboutPage-images/leader6.jpeg';
import leader7 from '../assets/images/aboutPage-images/leader7.jpeg';


export type ManagementMember = {
  id: number;
  slug: string;
  name: string;
  role: string;
  photo: string;
  summary: string;
  whoTheyAre: string;
  outsideApf: string;
};

export const managementMembers: ManagementMember[] = [
    {
        id: 5,
        slug: 'silver-boss-mwebesa',
        name: 'CPA Silver Boss Mwebesa',
        role: 'Treasurer',
        photo: leader5,
        summary:
          'CPA Silver Boss Mwebesa serves as Treasurer, overseeing APF financial stewardship, planning discipline, and prudent resource allocation. He supports transparent reporting and sustainable financing for member-focused programs. Outside APF, he is engaged in financial management and advisory work that helps organizations strengthen controls and performance.',
        whoTheyAre:
          'A finance-focused CPA with strong expertise in stewardship, controls, and fiscal planning.',
        outsideApf:
          'Works in financial management and advisory roles across private and institutional settings.',
      },
 
  {
    id: 7,
    slug: 'charles-lutimba',
    name: 'CPA Charles Lutimba',
    role: 'ICPAU Representative / Ex Official Board Member',
    photo: leader7,
    summary:
      'CPA Charles Lutimba represents ICPAU and contributes institutional perspective as an Ex Official Board Member at APF Uganda. He supports harmonization of APF programs with broader professional standards and regulatory expectations. Outside APF, he contributes to professional capacity-building and technical guidance in accountancy and compliance practice.',
    whoTheyAre:
      'An experienced CPA and institutional representative with strong professional standards orientation.',
    outsideApf:
      'Contributes to accountancy capacity-building, compliance guidance, and technical mentorship.',
  },
  
  {
    id: 2,
    slug: 'ronald-mutumba',
    name: 'CPA Ronald Mutumba',
    role: 'Implementing Director / Board Member',
    photo: leader2,
    summary:
      'CPA Ronald Mutumba serves as Implementing Director and Board Member, leading execution of APF priorities and day-to-day delivery of strategic programs. He supports institutional coordination, member engagement, and operational excellence. Outside APF, he works across professional practice and business advisory assignments that strengthen organizations and reporting quality.',
    whoTheyAre:
      'A results-oriented accounting professional with strong execution and stakeholder coordination skills.',
    outsideApf:
      'Involved in advisory and practice operations supporting compliance and business improvement.',
  },

];