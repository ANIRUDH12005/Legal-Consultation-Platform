export interface Lawyer {
  id: string
  _id?: string
  name: string
  specialization: string
  experience: number
  fees: number
  rating: number
  reviewCount: number
  location: string
  bio: string
  education: string
  languages: string[]
  image?: string
}

export const lawyers: Lawyer[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    specialization: "Corporate Law",
    experience: 12,
    fees: 250,
    rating: 4.9,
    reviewCount: 128,
    location: "New York, NY",
    bio: "Experienced corporate attorney specializing in mergers, acquisitions, and business contracts. Former partner at a top-tier law firm with a track record of successful deals worth over $500 million.",
    education: "Harvard Law School",
    languages: ["English", "Spanish"],
  },
  {
    id: "2",
    name: "James Rodriguez",
    specialization: "Family Law",
    experience: 8,
    fees: 180,
    rating: 4.8,
    reviewCount: 95,
    location: "Los Angeles, CA",
    bio: "Compassionate family law attorney dedicated to helping families through difficult transitions. Specializes in divorce, child custody, and adoption cases.",
    education: "UCLA School of Law",
    languages: ["English", "Spanish", "Portuguese"],
  },
  {
    id: "3",
    name: "Emily Chen",
    specialization: "Criminal Law",
    experience: 15,
    fees: 300,
    rating: 4.9,
    reviewCount: 203,
    location: "Chicago, IL",
    bio: "Former prosecutor turned defense attorney with extensive trial experience. Known for meticulous case preparation and strong courtroom presence.",
    education: "Northwestern University School of Law",
    languages: ["English", "Mandarin"],
  },
  {
    id: "4",
    name: "Michael Thompson",
    specialization: "Property Law",
    experience: 10,
    fees: 200,
    rating: 4.7,
    reviewCount: 87,
    location: "Houston, TX",
    bio: "Real estate and property law specialist handling residential and commercial transactions. Expert in land use, zoning, and property disputes.",
    education: "University of Texas School of Law",
    languages: ["English"],
  },
  {
    id: "5",
    name: "Amanda Foster",
    specialization: "Immigration Law",
    experience: 7,
    fees: 175,
    rating: 4.8,
    reviewCount: 142,
    location: "Miami, FL",
    bio: "Passionate immigration attorney helping individuals and families navigate the complex immigration system. Fluent in multiple languages.",
    education: "University of Miami School of Law",
    languages: ["English", "Spanish", "French"],
  },
  {
    id: "6",
    name: "David Kim",
    specialization: "Intellectual Property",
    experience: 9,
    fees: 275,
    rating: 4.6,
    reviewCount: 64,
    location: "San Francisco, CA",
    bio: "Tech-savvy IP attorney specializing in patents, trademarks, and copyrights. Former software engineer with deep understanding of tech industry.",
    education: "Stanford Law School",
    languages: ["English", "Korean"],
  },
  {
    id: "7",
    name: "Rachel Green",
    specialization: "Employment Law",
    experience: 11,
    fees: 220,
    rating: 4.9,
    reviewCount: 156,
    location: "Boston, MA",
    bio: "Employment law expert representing both employees and employers. Specializes in workplace discrimination, wrongful termination, and labor disputes.",
    education: "Boston University School of Law",
    languages: ["English"],
  },
  {
    id: "8",
    name: "Robert Martinez",
    specialization: "Tax Law",
    experience: 14,
    fees: 290,
    rating: 4.7,
    reviewCount: 78,
    location: "Phoenix, AZ",
    bio: "CPA and tax attorney helping individuals and businesses with tax planning, IRS disputes, and international taxation matters.",
    education: "Georgetown University Law Center",
    languages: ["English", "Spanish"],
  },
]

export const specializations = [
  "Corporate Law",
  "Family Law",
  "Criminal Law",
  "Property Law",
  "Immigration Law",
  "Intellectual Property",
  "Employment Law",
  "Tax Law",
]

export const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Miami, FL",
  "San Francisco, CA",
  "Boston, MA",
  "Phoenix, AZ",
]

export interface Appointment {
  id: string
  lawyerId: string
  lawyerName: string
  userId: string
  userName: string
  date: string
  time: string
  status: "pending" | "accepted" | "rejected" | "completed"
  type: "video" | "in-person"
  notes?: string
}

export const userAppointments: Appointment[] = [
  {
    id: "apt1",
    lawyerId: "1",
    lawyerName: "Sarah Mitchell",
    userId: "user1",
    userName: "John Doe",
    date: "2026-04-05",
    time: "10:00 AM",
    status: "accepted",
    type: "video",
    notes: "Discuss startup incorporation documents",
  },
  {
    id: "apt2",
    lawyerId: "3",
    lawyerName: "Emily Chen",
    userId: "user1",
    userName: "John Doe",
    date: "2026-04-10",
    time: "2:00 PM",
    status: "pending",
    type: "in-person",
  },
  {
    id: "apt3",
    lawyerId: "5",
    lawyerName: "Amanda Foster",
    userId: "user1",
    userName: "John Doe",
    date: "2026-03-25",
    time: "11:00 AM",
    status: "completed",
    type: "video",
    notes: "Immigration consultation for work visa",
  },
]

export const lawyerAppointments: Appointment[] = [
  {
    id: "lapt1",
    lawyerId: "lawyer1",
    lawyerName: "Sarah Mitchell",
    userId: "user1",
    userName: "John Doe",
    date: "2026-04-05",
    time: "10:00 AM",
    status: "pending",
    type: "video",
    notes: "Discuss startup incorporation documents",
  },
  {
    id: "lapt2",
    lawyerId: "lawyer1",
    lawyerName: "Sarah Mitchell",
    userId: "user2",
    userName: "Jane Smith",
    date: "2026-04-06",
    time: "2:00 PM",
    status: "accepted",
    type: "in-person",
    notes: "Contract review for business partnership",
  },
  {
    id: "lapt3",
    lawyerId: "lawyer1",
    lawyerName: "Sarah Mitchell",
    userId: "user3",
    userName: "Mike Johnson",
    date: "2026-04-08",
    time: "11:00 AM",
    status: "pending",
    type: "video",
  },
  {
    id: "lapt4",
    lawyerId: "lawyer1",
    lawyerName: "Sarah Mitchell",
    userId: "user4",
    userName: "Emily Brown",
    date: "2026-03-28",
    time: "3:00 PM",
    status: "completed",
    type: "video",
    notes: "Follow-up on merger documents",
  },
]
