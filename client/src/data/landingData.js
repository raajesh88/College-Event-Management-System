/**
 * Centralized Landing Page Data & High-Quality Image Asset Registry
 * All URLs are reliable, high-availability public CDN assets optimized for web performance.
 * Any image URL can be easily swapped or replaced here.
 */

export const HERO_BACKGROUND_IMAGE = '/hero-bg.jpg';

export const FALLBACK_EVENT_IMAGE =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';

// 8 Mandatory College Activities for Hero Visuals & Categorization
export const COLLEGE_ACTIVITIES = [
  {
    id: 'cultural',
    name: 'Cultural Events',
    shortTitle: 'Cultural',
    category: 'Cultural',
    tagline: 'Music, Dance, Theatre & Fine Arts',
    description:
      'Immerse in annual fests, acoustic band battles, classical showcases, and theatrical performances that bring vibrant campus life to center stage.',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    iconName: 'Music',
    badgeColor: 'bg-rose-subtle text-rose',
    accent: '#f43f5e',
    highlights: ['Annual College Fest', 'Battle of Bands', 'Drama & Skits', 'Art Gallery'],
  },
  {
    id: 'hackathons',
    name: 'Hackathons',
    shortTitle: 'Hackathons',
    category: 'Hackathon',
    tagline: '36-Hour Innovation Sprints',
    description:
      'Form multidisciplinary teams, solve real-world problems with AI, Web3, and IoT, and pitch your prototypes to leading tech industry mentors.',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    iconName: 'Code',
    badgeColor: 'bg-amber-subtle text-amber',
    accent: '#d97706',
    highlights: ['36-Hour Code Sprint', 'Industry Mentorship', 'Cash Prizes & Grants', 'Startup Incubator Access'],
  },
  {
    id: 'technical',
    name: 'Technical Events',
    shortTitle: 'Technical',
    category: 'Technical',
    tagline: 'Robotics, AI & Engineering Expos',
    description:
      'Explore groundbreaking student projects, autonomous bot combats, drone races, circuit design challenges, and cutting-edge tech exhibitions.',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
    iconName: 'Cpu',
    badgeColor: 'bg-purple-subtle text-purple',
    accent: '#a855f7',
    highlights: ['Robotics Arena', 'AI & ML Symposiums', 'Drone Racing', 'Hardware Hack Lab'],
  },
  {
    id: 'workshops',
    name: 'Workshops',
    shortTitle: 'Workshops',
    category: 'Workshop',
    tagline: 'Hands-on Skill Masterclasses',
    description:
      'Learn high-demand technical and creative skills through interactive, instructor-led bootcamps with verified certificates of completion.',
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    iconName: 'Wrench',
    badgeColor: 'bg-emerald-subtle text-emerald',
    accent: '#10b981',
    highlights: ['Cloud & DevOps Labs', 'Design Thinking Sprints', 'Career Readiness', 'Hands-on Toolkits'],
  },
  {
    id: 'sports',
    name: 'Sports',
    shortTitle: 'Sports',
    category: 'Sports',
    tagline: 'Inter-College Athletic Tournaments',
    description:
      'Compete in varsity leagues, football, cricket, basketball, track & field, and badminton championships fostering sportsmanship and teamwork.',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
    iconName: 'Trophy',
    badgeColor: 'bg-amber-subtle text-amber',
    accent: '#f59e0b',
    highlights: ['Varsity League', 'Track & Field Meet', 'Intramural Cups', 'Fitness Challenges'],
  },
  {
    id: 'competitions',
    name: 'Competitions',
    shortTitle: 'Competitions',
    category: 'Competition',
    tagline: 'Debates, Quizzes & Case Challenges',
    description:
      'Showcase critical thinking, debate prowess, business case modeling, and quiz acumen in prestigious campus-wide tournaments.',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    iconName: 'Medal',
    badgeColor: 'bg-purple-subtle text-purple',
    accent: '#9333ea',
    highlights: ['Parliamentary Debate', 'National Case Cup', 'Campus Quiz League', 'Product Pitch-off'],
  },
  {
    id: 'seminars',
    name: 'Seminars',
    shortTitle: 'Seminars',
    category: 'Seminar',
    tagline: 'Distinguished Keynotes & Panel Talks',
    description:
      'Hear from thought leaders, researchers, and campus alumni sharing insights on emerging technologies, career trajectories, and higher studies.',
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
    iconName: 'Presentation',
    badgeColor: 'bg-amber-subtle text-amber',
    accent: '#ff7a01',
    highlights: ['Distinguished Keynotes', 'Alumni Fireside Chats', 'Research Colloquiums', 'Global Trends'],
  },
  {
    id: 'club-activities',
    name: 'Club Activities',
    shortTitle: 'Club Activities',
    category: 'Club Activity',
    tagline: 'Student Societies, Meetups & Drives',
    description:
      'Connect with student-led communities: astronomy circles, photography collectives, social outreach drives, and coding clubs that ignite passions.',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
    iconName: 'Users',
    badgeColor: 'bg-violet-subtle text-violet',
    accent: '#8b5cf6',
    highlights: ['Student Societies', 'Campus Open Mics', 'Community Outreach', 'Weekly Club Sprints'],
  },
];

// Rich Curated Upcoming Events (Covering all 8 categories)
export const DEFAULT_UPCOMING_EVENTS = [
  {
    id: 'ev-1',
    title: 'HackCampus 2026: 36-Hour National Hackathon',
    category: 'Hackathons',
    date: 'Oct 14-16, 2026',
    time: '09:00 AM - 09:00 PM',
    venue: 'Campus Innovation Hub & Auditorium',
    department: 'Computer Science & Engineering',
    capacity: 250,
    spotsLeft: 42,
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    description:
      'Build breakthrough applications in AI, Web3, and IoT with mentorship from leading tech pioneers and cash prizes.',
  },
  {
    id: 'ev-2',
    title: 'Tarang: Annual Inter-College Cultural Carnival',
    category: 'Cultural Events',
    date: 'Nov 02-04, 2026',
    time: '10:00 AM - 10:00 PM',
    venue: 'Open Air Amphitheatre & Quadrangle',
    department: 'Student Affairs & Cultural Council',
    capacity: 500,
    spotsLeft: 128,
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    description:
      'Three electrifying days featuring battle of the bands, classical dances, theatrical drama, fashion shows, and art exhibitions.',
  },
  {
    id: 'ev-3',
    title: 'RoboQuest: Autonomous Robotics & AI Symposium',
    category: 'Technical Events',
    date: 'Nov 18, 2026',
    time: '09:30 AM - 05:00 PM',
    venue: 'Mechanical & Robotics Center (Lab 4)',
    department: 'Electronics & Robotics Society',
    capacity: 150,
    spotsLeft: 31,
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    description:
      'Keynotes from autonomous vehicle researchers, live humanoid bot demonstrations, and hands-on ROS obstacle challenges.',
  },
  {
    id: 'ev-4',
    title: 'Full-Stack Cloud & DevOps Architecture Workshop',
    category: 'Workshops',
    date: 'Dec 05, 2026',
    time: '11:00 AM - 04:00 PM',
    venue: 'Executive Seminar Hall A & Cloud Lab',
    department: 'Information Technology',
    capacity: 100,
    spotsLeft: 19,
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    description:
      'Hands-on lab deploying containerized microservices to cloud clusters with automated CI/CD pipelines and load testing.',
  },
  {
    id: 'ev-5',
    title: 'Championship Trophy: Inter-Department Football & Track Meet',
    category: 'Sports',
    date: 'Dec 12-14, 2026',
    time: '08:00 AM - 06:00 PM',
    venue: 'Main Campus Stadium & Sports Complex',
    department: 'Physical Education & Athletics',
    capacity: 350,
    spotsLeft: 64,
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    description:
      'Annual varsity games featuring inter-department football, 100m sprint relays, basketball showdowns, and badminton cups.',
  },
  {
    id: 'ev-6',
    title: 'National Collegiate Debate & Case Study Challenge',
    category: 'Competitions',
    date: 'Jan 10, 2027',
    time: '10:00 AM - 05:30 PM',
    venue: 'Central Conference Hall',
    department: 'Literary & Debating Society',
    capacity: 120,
    spotsLeft: 22,
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    description:
      'Showcase your public speaking, strategic problem-solving, and parliamentary argumentation before eminent judges and alumni.',
  },
  {
    id: 'ev-7',
    title: 'Future Horizons: AI Ethics & Quantum Computing Seminar',
    category: 'Seminars',
    date: 'Jan 22, 2027',
    time: '02:00 PM - 05:00 PM',
    venue: 'Auditorium Block C',
    department: 'Research & Development Cell',
    capacity: 200,
    spotsLeft: 45,
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    description:
      'Distinguished keynote lecture by quantum computing research fellows exploring the paradigm shift in next-gen computation.',
  },
  {
    id: 'ev-8',
    title: 'Campus Photography Society Showcase & Heritage Walk',
    category: 'Club Activities',
    date: 'Feb 06, 2027',
    time: '03:00 PM - 07:00 PM',
    venue: 'Student Activities Center & Campus Lawn',
    department: 'Photography & Creative Arts Club',
    capacity: 80,
    spotsLeft: 14,
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    description:
      'Live photo exhibition displaying student perspectives on campus architecture, followed by a golden-hour outdoor photo walk.',
  },
];

// High-impact stats for trust & scale
export const PLATFORM_STATS = [
  { value: '50+', label: 'Annual Events', detail: 'Across all departments' },
  { value: '12,000+', label: 'Active Students', detail: 'Registered participants' },
  { value: '28+', label: 'Clubs & Societies', detail: 'Student-led organizations' },
  { value: '100%', label: 'Verified Passes', detail: 'Instant QR digital check-in' },
];

// Contact Helpdesk & Inquiries
export const CONTACT_CARDS = [
  {
    title: 'Campus Event Helpdesk',
    desc: 'For questions regarding registrations, passes, or event schedules.',
    contact: 'events-support@college.edu',
    info: 'Mon - Fri, 9:00 AM - 5:00 PM',
    icon: 'Mail',
  },
  {
    title: 'Department Coordination',
    desc: 'For faculty coordinators and department heads publishing events.',
    contact: 'coordinators@college.edu',
    info: 'Academic Affairs Block, Room 204',
    icon: 'Building',
  },
  {
    title: 'Student Clubs & Societies',
    desc: 'For club leaders looking to schedule society meetups and drives.',
    contact: 'clubs-council@college.edu',
    info: 'Student Activities Center',
    icon: 'Users',
  },
];
