import React, { createContext, useState, useEffect, useContext } from 'react';
import founderImg from '../assets/images/founder_bijit_final_1784267123799.jpg';
import { db, isFirebaseAvailable } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import {
  isSupabaseAvailable,
  fetchCMSDataFromSupabase,
  saveCMSDataToSupabase,
  fetchEnquiriesFromSupabase,
  saveEnquiryToSupabase,
  deleteEnquiryFromSupabase,
  updateEnquiryStatusInSupabase,
  logLoginAttemptToSupabase,
  fetchLoginAttemptsFromSupabase,
  supabase
} from '../lib/supabase';

// Interfaces for our CMS data models
export interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: string;
  enabled?: boolean;
}

export interface ProgramItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  duration: string;
  eligibility: string;
  outcomes: string[];
  modules: string[];
  imageUrl: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  overview: string;
  techUsed: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  videoUrl?: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Workshop' | 'Projects' | 'Events' | 'Science Exhibition';
  imageUrl: string;
}

export interface AchievementItem {
  id: string;
  year: string;
  title: string;
  description: string;
  category: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  avatarUrl: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'Replied' | 'Archived';
}

export interface AboutData {
  introduction: string;
  vision: string;
  mission: string;
  values: string[];
  philosophy: string;
}

export interface FounderData {
  name: string;
  title: string;
  bio: string;
  message: string;
  imageUrl: string;
  timeline: { year: string; event: string }[];
}

export interface ContactData {
  phone: string;
  email: string;
  address: string;
  googleMapEmbedUrl: string;
  whatsappNumber: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  footerLogoUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  bio: string;
  imageUrl: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface UpdateItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
}

export interface CMSData {
  siteName: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  heroHeadline: string;
  heroSubheading: string;
  about: AboutData;
  founder: FounderData;
  team: TeamMember[];
  stats: StatItem[];
  programs: ProgramItem[];
  services: ServiceItem[];
  projects: ProjectItem[];
  gallery: GalleryItem[];
  achievements: AchievementItem[];
  testimonials: TestimonialItem[];
  contact: ContactData;
  updates: UpdateItem[];
  categories: string[];
}

interface WebContextType {
  data: CMSData;
  enquiries: EnquiryItem[];
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateData: (updatedData: Partial<CMSData>) => void;
  addProgram: (program: Omit<ProgramItem, 'id'>) => void;
  editProgram: (id: string, program: ProgramItem) => void;
  deleteProgram: (id: string) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  editService: (id: string, service: ServiceItem) => void;
  deleteService: (id: string) => void;
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  editProject: (id: string, project: ProjectItem) => void;
  deleteProject: (id: string) => void;
  addGalleryImage: (image: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryImage: (id: string) => void;
  addAchievement: (achievement: Omit<AchievementItem, 'id'>) => void;
  editAchievement: (id: string, achievement: AchievementItem) => void;
  deleteAchievement: (id: string) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  editTeamMember: (id: string, member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
  addUpdate: (update: Omit<UpdateItem, 'id' | 'date'>) => void;
  editUpdate: (id: string, update: UpdateItem) => void;
  deleteUpdate: (id: string) => void;
  addEnquiry: (enquiry: Omit<EnquiryItem, 'id' | 'date' | 'status'>) => void;
  deleteEnquiry: (id: string) => void;
  updateEnquiryStatus: (id: string, status: 'New' | 'Replied' | 'Archived') => void;
  resetAllData: () => void;
}

const defaultCMSData: CMSData = {
  siteName: "Mind Map",
  tagline: "Learn • Innovate • Create",
  logoText: "Mind Map",
  heroHeadline: "Inspiring Innovation Through Practical Learning",
  heroSubheading: "Empowering learners with practical technology education, innovation, creativity, engineering, and future-ready skills.",
  about: {
    introduction: "Mind Map is an innovative STEM education and technology company dedicated to inspiring curiosity, creativity, innovation, and practical learning through hands-on education. We bridge the gap between abstract textbooks and tangible technology, helping young minds explore their full potential through active creation rather than passive absorption.",
    vision: "At Mind Map, our vision is to create a future where every student has the opportunity to explore, innovate, and develop practical technological skills from an early age. We aspire to become a leading STEM education organization that transforms traditional classroom learning into engaging, hands-on experiences, nurturing creativity, critical thinking, and problem-solving abilities.",
    mission: `At Mind Map, our mission is to inspire young minds by delivering high-quality, practical STEM education that bridges the gap between theory and real-world application.

We are committed to:

Providing engaging, hands-on learning experiences in Electronics, Arduino, Robotics, and Emerging Technologies.
Encouraging creativity, innovation, and scientific thinking through project-based learning.
Building students' confidence by allowing them to design, create, and present their own working projects.
Supporting schools with structured, safe, and industry-relevant STEM programs.
Developing essential 21st-century skills such as critical thinking, teamwork, communication, and leadership.
Creating an enjoyable learning environment where curiosity leads to discovery and innovation.
Preparing students to become future engineers, scientists, inventors, entrepreneurs, and responsible global citizens.`,
    values: [
      "Practical-First Learning Strategy",
      "Nurturing Boundless Scientific Curiosity",
      "Uncompromising Excellence in Mentorship",
      "Inclusive Tech Accessibility for All",
      "Fostering Innovative Solution Design"
    ],
    philosophy: "We believe that learning occurs at the intersection of hands-on playing and cognitive building. By allowing students to wire real circuits, write functional scripts, and assemble responsive robots, we convert dry formulas into vibrant, memorable learning adventures."
  },
  founder: {
    name: "Bijit Kumar Prasad",
    title: "Founder",
    bio: "Bijit Kumar Prasad is a visionary educator, technology researcher, and hands-on developer based in Bangalore. With extensive expertise in Embedded Systems, IoT, Robotics, and Advanced Microcontrollers, he has spent over a decade designing state-of-the-art STEM curricula and setting up world-class Robotics Labs. Known for his contagious passion for electronic prototyping, he has mentored thousands of students, teachers, and budding engineers globally.",
    message: "Science and Engineering aren't subjects you memorize—they are tools you use to interact with and shape the physical world. Mind Map was built to give every student the opportunity to construct, break, analyze, and build actual solutions. Let's make engineering an art of creation!",
    imageUrl: founderImg,
    timeline: [
      { year: "2015", event: "Completed research and prototype development in Advanced Wireless Power Systems and Embedded Microcontrollers." },
      { year: "2017", event: "Initiated school-level hands-on tech outreach programs across Karnataka, empowering over 1,500 students with basic breadboard circuits." },
      { year: "2019", event: "Formally pioneered 'Mind Map' to offer organized Robotics and Arduino training, establishing structured STEM curriculums." },
      { year: "2021", event: "Successfully filed patent applications for key local monitoring IoT models and launched smart agricultural sensors." },
      { year: "2023", event: "Established 15+ dedicated high-fidelity Robotics and Innovation Labs in prime schools and colleges." },
      { year: "2025", event: "Delivered over 120 guest lectures and intensive teacher development camps on Future Tech across multiple engineering campuses." }
    ]
  },
  stats: [
    { id: "s1", label: "Projects Completed", value: "150+" , icon: "Cpu" },
    { id: "s2", label: "Workshops Conducted", value: "120+" , icon: "Award" },
    { id: "s3", label: "Partner Institutions", value: "45+", icon: "School" },
    { id: "s4", label: "Learners Trained", value: "300+", icon: "Users" },
    { id: "s5", label: "Years of Experience", value: "6+", icon: "Calendar" }
  ],
  programs: [
    {
      id: "p1",
      title: "STEM Foundation Education",
      description: "Introduce core concepts of physics, logic, design, and practical thinking to young minds.",
      longDescription: "Our entry-level STEM program targets fundamental scientific inquiry. Rather than reading about force, mechanics, or electricity, students interact with gears, pulleys, and basic components, establishing a solid conceptual foundation.",
      category: "Foundation",
      duration: "3 Months (36 Hours)",
      eligibility: "Grade 6 to 8",
      outcomes: [
        "Develop structured logical problem-solving",
        "Understand essential mechanical and electronic principles",
        "Construct operational gears and compound machines"
      ],
      modules: [
        "Module 1: Principles of Motion & Forces",
        "Module 2: Practical Mechanical Mechanisms",
        "Module 3: Introduction to Interactive Science Exhibits"
      ],
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "p2",
      title: "Applied Electronics Training",
      description: "Learn analog components, digital ICs, circuit diagrams, breadboards, and multi-meter testing.",
      longDescription: "A deep-dive course to demystify electrical circuits. Students study and utilize components like resistors, capacitors, diodes, transistors, and 555 timers. Working with breadboards, they build practical devices from scratch.",
      category: "Electronics",
      duration: "4 Months (48 Hours)",
      eligibility: "Grade 6 to 8",
      outcomes: [
        "Read and translate complex circuit diagrams",
        "Confidently build analog/digital breadboard prototypes",
        "Troubleshoot circuits using multimeters and basic oscilloscopes"
      ],
      modules: [
        "Module 1: Fundamental Passive Components",
        "Module 2: Transistors as Switches & Amplifiers",
        "Module 3: Integrated Circuits (IC 555 & LM358)",
        "Module 4: Circuit Simulation and Soldering Practice"
      ],
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "p3",
      title: "Arduino & Microcontroller Programming",
      description: "Program hardware using C/C++, interface key sensors, actuators, and build smart devices.",
      longDescription: "Our premier microelectronics program. It introduces microcontrollers via Arduino UNO. Students learn real text-based C/C++ syntax to control LEDs, read sensor data, display variables, and operate mechanical systems.",
      category: "Coding",
      duration: "6 Months (72 Hours)",
      eligibility: "Grade 6 to 8",
      outcomes: [
        "Master C/C++ fundamentals (loops, conditionals, functions)",
        "Read DHT11, ultrasonic, IR, gas, and temperature sensors",
        "Control motors (Servo, DC, Stepper) and character displays"
      ],
      modules: [
        "Module 1: Arduino Architecture & IDE Basics",
        "Module 2: Digital/Analog Input-Output Prototyping",
        "Module 3: Complex Sensors Interfacing & Logic",
        "Module 4: Interactive Smart Prototyping Graduation"
      ],
      imageUrl: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "p4",
      title: "Robotics & Automation Mastery",
      description: "Build line followers, obstacle avoiders, Bluetooth cars, and multi-DOF robotic arms.",
      longDescription: "An advanced engineering camp combining mechanics, electronics, and microcode. Students synthesize motor drivers, chassis design, and autonomous algorithms to construct responsive vehicles and industrial arms.",
      category: "Robotics",
      duration: "6 Months (80 Hours)",
      eligibility: "Grade 6 to 8",
      outcomes: [
        "Understand motor driver ICs (L293D, L298N)",
        "Write custom navigation algorithms (PID controls)",
        "Interface wireless modules (HC-05 Bluetooth, RF)"
      ],
      modules: [
        "Module 1: Chassis Dynamics & Power Electronics",
        "Module 2: Sensor Arrays for Road Navigation",
        "Module 3: Wireless Control and App Interfacing",
        "Module 4: Advanced Robotic Arm Design"
      ],
      imageUrl: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "p5",
      title: "IoT & Smart Systems",
      description: "Establish cloud-connected systems, log telemetry, host micro web servers, and design smart appliances.",
      longDescription: "Learn to build modern connected systems using ESP8266, ESP32, and cloud suites. This course teaches telemetry logging, webhooks, MQTT brokers, and mobile app triggers for full home and industrial automation prototypes.",
      category: "IoT",
      duration: "4 Months (50 Hours)",
      eligibility: "Grade 6 to 8",
      outcomes: [
        "Create local web servers on microcontrollers",
        "Synchronize data with cloud platforms (Adafruit IO, Blynk, Firebase)",
        "Establish automated SMS, email, and API alerts"
      ],
      modules: [
        "Module 1: ESP8266/ESP32 Hardware Architecture",
        "Module 2: WiFi Client-Server & HTTP Requests",
        "Module 3: MQTT Protocol & Data Streaming Brokerage",
        "Module 4: Building Smart Appliance Dashboards"
      ],
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "p6",
      title: "Artificial Intelligence & Logic",
      description: "Analyze smart vision algorithms, text logic, automation scripting, and voice control.",
      longDescription: "An exploration into modern programming. Students learn how software can perceive environments, detect objects, read speech prompts, and control electronic hardware through smart scripting.",
      category: "AI",
      duration: "5 Months (60 Hours)",
      eligibility: "Grade 6 to 8",
      outcomes: [
        "Code standard algorithms using Python syntax",
        "Run camera feed object-detection models on hardware",
        "Build speech recognition triggers for home automations"
      ],
      modules: [
        "Module 1: Python Core Foundations for STEM",
        "Module 2: Computational Vision & Frame Capturing",
        "Module 3: Neural Concept Basics & IoT Edge Integration"
      ],
      imageUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=600"
    }
  ],
  services: [
    {
      id: "sv1",
      title: "STEM Workshops",
      description: "Fast-paced, high-impact weekend and holiday bootcamps on electronics, robotics, and coding for schools and colleges.",
      icon: "Cpu",
      features: [
        "Complete hardware kit provided to every attendee",
        "Hands-on assembly with step-by-step guidance",
        "Participation certificate and digital resources"
      ]
    },
    {
      id: "sv2",
      title: "Innovation Lab Setup",
      description: "End-to-end consulting, structural planning, hardware sourcing, and trainer alignment to setup custom STEM labs.",
      icon: "School",
      features: [
        "State-of-the-art electronics, robotics, and 3D print assets",
        "Safety design and interactive layout planning",
        "Dedicated syllabus and multi-level lesson libraries"
      ]
    },
    {
      id: "sv3",
      title: "Science Exhibition Guidance",
      description: "Exclusive mentorship to conceptualize, wire, program, and refine show-stopping tech projects for national competitions.",
      icon: "Award",
      features: [
        "Unique idea brainstorming based on current social crises",
        "Circuit debugging, code refactoring, and material layout",
        "Presentation training, charts, and prototype documentation"
      ]
    },
    {
      id: "sv4",
      title: "Teacher Development Programs",
      description: "Intensive training camps for science, physics, and computer tutors to master electronics, microcontrollers, and modern teaching methodologies.",
      icon: "Users",
      features: [
        "Hands-on training matching modern curricula",
        "Debugging guidelines for rapid student query handling",
        "Ready-to-use project scripts and troubleshooting charts"
      ]
    }
  ],
  projects: [
    {
      id: "pr1",
      title: "Li-Fi (Light Fidelity) Audio Link",
      description: "Transmit high-quality audio wirelessly using simple visible light spectrum arrays.",
      overview: "Li-Fi transmits data via micro-flickering LED lighting. This project showcases audio stream transmission from a smartphone, passing through space via a focused light beam, received by a solar cell, amplified, and played out on a speaker.",
      techUsed: ["High Power LED", "Solar Panel", "Audio Amplifier IC (LM386)", "Transistors"],
      difficulty: "Intermediate",
      imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "pr2",
      title: "Smart Helmet with Ignition & Indicator Sync",
      description: "An intelligent rider safety helmet that only starts the bike when worn, prevents ignition if drunk, and syncs wireless indicators.",
      overview: "Designed for premium two-wheeler safety, this prototype couples an electronic smart helmet with a bike's ignition controller. Built-in limit/pressure sensors verify the rider is wearing the helmet to unlock the ignition. An MQ-3 alcohol sensor monitors breath; if elevated levels are detected, the system overrides and disables the starter. Furthermore, left and right turn indicators from the motorcycle are transmitted wirelessly via RF transmitter-receiver modules to high-visibility LED arrays on the helmet to mimic the bike's signaling dynamically, maximizing night and road safety.",
      techUsed: ["Arduino Uno", "RF Transmitter/Receiver (433MHz)", "MQ-3 Alcohol Sensor", "Limit/Force Sensor", "Bright LED indicator strips", "12V Relay Module"],
      difficulty: "Advanced",
      imageUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "pr3",
      title: "Ultrasonic Smart Blind Stick",
      description: "Empower visually impaired individuals using early obstacle alarms and surface water warnings.",
      overview: "This handheld device scans paths up to 1.5 meters ahead. When an obstacle is approached, a buzzer and vibe-motor increase pulse-rates. Conductive probes at the bottom warn the user of puddles or wet mud.",
      techUsed: ["Arduino Nano", "HC-SR04 Ultrasonic", "Buzzer", "Vibration Motor", "Water Probes"],
      difficulty: "Beginner",
      imageUrl: "https://images.unsplash.com/photo-1508847154043-be12a327dc6f?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "pr4",
      title: "Autonomous Obstacle Avoiding Robot",
      description: "A three-wheeled mobile vehicle that scans surrounding boundaries to navigate completely without collision.",
      overview: "Using a mini servo motor, the robot rotates its ultrasonic sensor left and right, assesses the clearest path, and updates its geared dual DC motors dynamically to avoid furniture and walls.",
      techUsed: ["Arduino Uno", "L293D Motor Driver", "Geared Motors", "Ultrasonic Sensor", "Micro Servo"],
      difficulty: "Intermediate",
      imageUrl: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "pr5",
      title: "Home Automation over IoT",
      description: "Control lights, fans, and appliances globally via a custom mobile dashboard or local voice triggers.",
      overview: "Uses a multi-channel relay module to interface standard household fixtures. Connected to home WiFi, the microcontroller securely receives commands from a Blynk application, letting you operate appliances safely.",
      techUsed: ["NodeMCU ESP8266", "4-Channel Relay", "Blynk IoT API", "Optocouplers"],
      difficulty: "Intermediate",
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "pr6",
      title: "Automatic Street Light Controller",
      description: "Conserve electric grid energy using automated light sensors and infrared traffic trackers.",
      overview: "This eco-friendly system detects ambient light levels. During daytime, light fixtures are completely disabled. At night, lights stay at a dimmed 10% brightness, surging to 100% when IR sensors track oncoming pedestrian or auto traffic.",
      techUsed: ["LDR Sensor", "Infrared Proximity Sensors", "Transistor Switch", "High-Bright LED Array"],
      difficulty: "Beginner",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600"
    }
  ],
  gallery: [
    { id: "g1", title: "Hands-on Arduino Prototyping Workshop", category: "Workshop", imageUrl: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=600" },
    { id: "g2", title: "Obstacle Avoider Robot Testing Arena", category: "Projects", imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600" },
    { id: "g3", title: "Robotics Exhibition at Bangalore Tech Summit", category: "Events", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600" },
    { id: "g4", title: "District Science Fair Mind Map Showcase", category: "Science Exhibition", imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600" },
    { id: "g5", title: "Electronics Circuit Wiring BootCamp", category: "Workshop", imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600" },
    { id: "g6", title: "Smart Home IoT Controller Prototype", category: "Projects", imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600" }
  ],
  achievements: [
    { id: "a1", year: "2018", title: "Best STEM Innovation Award", description: "Honored with the District STEM Catalyst Award in Bangalore for promoting practical, circuit-based curriculums at government schools.", category: "Award" },
    { id: "a2", year: "2020", title: "National Science Congress Selection", description: "Two high-school student projects mentored by Mind Map secured outstanding selections at the National Children's Science Congress (NCSC).", category: "Exhibitions" },
    { id: "a3", year: "2022", title: "Smart Irrigation Patent Pending", description: "Our low-cost multi-channel soil moisture tracking telemetry model officially entered Indian patent examination status.", category: "Research" },
    { id: "a4", year: "2024", title: "Excellence in Teacher Training", description: "Recognized by prime school consortiums for executing hands-on hardware training for 300+ secondary science educators.", category: "Training" }
  ],
  testimonials: [
    {
      id: "t1",
      name: "Dr. Sandeep K. S.",
      role: "Principal",
      organization: "Global Tech International School, Bangalore",
      quote: "Mind Map's Innovation Lab has completely re-defined how our students perceive technology. They don't just solve textbook math anymore—they are constructing actual circuits, building autonomous cars, and understanding real coding. Phenomenal change!",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "t2",
      name: "Pranav Gowda",
      role: "Class 10 Student",
      organization: "National STEM Camp Alumnus",
      quote: "My path into electronics started with Mr. Bijit's breadboard classes. His interactive style made Arduino programming so easy to understand. I successfully built my first Smart Helmet project under his expert mentorship!",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "t3",
      name: "Meera Krishnan",
      role: "Parent of Rohan Krishnan",
      organization: "Holiday Robotics Program",
      quote: "My son used to spend all his weekend hours playing computer video games. After joining Mind Map's holiday robotics workshops, he is now designing and assembling hardware. Seeing him solve obstacles and write real lines of C++ code is highly gratifying.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    }
  ],
  contact: {
    phone: "+91 9901993468",
    email: "kumarbijit08@gmail.com",
    address: "Bangalore, Karnataka, India – 560016",
    googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9157297920704!2d77.6631113!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae13f6b98e7997%3A0xe10836ffbb2752!2sBengaluru%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sin!4v1721156000000!5m2!1sen!2sin",
    whatsappNumber: "919901993468",
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    footerLogoUrl: ""
  },
  team: [
    {
      id: "tm1",
      name: "Arjun Gowda",
      designation: "Senior Robotics Mentor",
      bio: "Electronics design expert specializing in Arduino firmware development, PID tuning, and high-DOF mechanical robotic arms prototyping.",
      imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com"
    },
    {
      id: "tm2",
      name: "Sarah Fernandes",
      designation: "STEM Curriculum Architect",
      bio: "Passionate educator with 5+ years designing physical computing syllabi and school STEM lab projects.",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com"
    }
  ],
  updates: [],
  categories: ["Electronics", "Robotics", "Coding", "IoT", "AI", "Foundation", "Workshop", "Project", "Events", "Science Exhibition", "Achievements"]
};

const defaultEnquiries: EnquiryItem[] = [
  {
    id: "eq1",
    name: "Ramesh Kumar",
    email: "ramesh.k@gmail.com",
    phone: "+91 9845012345",
    subject: "Robotics Lab Setup Inquiry",
    message: "We are interested in setting up a high-quality Robotics and STEM lab at our campus in Whitefield, Bangalore. Please share the pricing model, syllabus structure, and equipment list.",
    date: "2026-07-15",
    status: "New"
  },
  {
    id: "eq2",
    name: "Anjali Sharma",
    email: "anjali.s@outlook.com",
    phone: "+91 8877665544",
    subject: "Teacher Training Bootcamp",
    message: "Is there any weekend training scheduled for physics teachers to teach basic Arduino circuits? We want 5 of our secondary school faculty members to attend.",
    date: "2026-07-16",
    status: "Replied"
  }
];

const WebContext = createContext<WebContextType | undefined>(undefined);

export const WebProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CMSData>(defaultCMSData);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(defaultEnquiries);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load from local storage and firestore on mount
  useEffect(() => {
    const savedData = localStorage.getItem('mindmap_cms_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        let updated = false;
        
        // Ensure categories exist and have content
        if (!parsed.categories || !Array.isArray(parsed.categories) || parsed.categories.length === 0) {
          parsed.categories = defaultCMSData.categories;
          updated = true;
        }

        // Update founder image if it is outdated, missing, or mismatched
        if (
          !parsed?.founder?.imageUrl ||
          parsed.founder.imageUrl.includes('unsplash.com') ||
          parsed.founder.imageUrl.includes('founder_bijit_1784266678667') ||
          parsed.founder.imageUrl.includes('founder_bijit_uploaded') ||
          parsed.founder.imageUrl !== founderImg
        ) {
          parsed.founder.imageUrl = founderImg;
          updated = true;
        }

        // Auto-upgrade Vision if it's missing or old placeholder
        if (
          !parsed?.about?.vision || 
          parsed.about.vision === "To cultivate a generation of innovators, thinkers, and problem solvers who can confidently leverage future technologies to create a positive global impact."
        ) {
          if (!parsed.about) parsed.about = {};
          parsed.about.vision = defaultCMSData.about.vision;
          updated = true;
        }

        // Auto-upgrade Mission if it's missing or old placeholder
        if (
          !parsed?.about?.mission || 
          parsed.about.mission === "To establish world-class Innovation Labs in educational institutes and provide comprehensive, structured tech education that fosters scientific inquiry and design-thinking."
        ) {
          if (!parsed.about) parsed.about = {};
          parsed.about.mission = defaultCMSData.about.mission;
          updated = true;
        }
        
        // Update stats if they are still the old values
        if (parsed?.stats) {
          parsed.stats = parsed.stats.map((s: any) => {
            if (s.id === 's1' && s.value === '500+') {
              updated = true;
              return { ...s, value: '150+' };
            }
            if (s.id === 's4' && s.value === '5000+') {
              updated = true;
              return { ...s, value: '300+' };
            }
            if (s.id === 's5' && s.value === '8+') {
              updated = true;
              return { ...s, value: '6+' };
            }
            return s;
          });
        }

        // Auto-upgrade eligibility of all default programs to "Grade 6 to 8"
        if (parsed?.programs) {
          parsed.programs = parsed.programs.map((p: any) => {
            if (p.eligibility !== "Grade 6 to 8") {
              updated = true;
              return { ...p, eligibility: "Grade 6 to 8" };
            }
            return p;
          });
        }

        // Auto-upgrade project pr2 to the user's custom safety helmet project details
        if (parsed?.projects) {
          parsed.projects = parsed.projects.map((p: any) => {
            if (p.id === 'pr2' && (p.title === 'IoT Smart Helmet for Workers' || p.title.includes('Workers') || p.title.includes('Industrial'))) {
              updated = true;
              return {
                id: "pr2",
                title: "Smart Helmet with Ignition & Indicator Sync",
                description: "An intelligent rider safety helmet that only starts the bike when worn, prevents ignition if drunk, and syncs wireless indicators.",
                overview: "Designed for premium two-wheeler safety, this prototype couples an electronic smart helmet with a bike's ignition controller. Built-in limit/pressure sensors verify the rider is wearing the helmet to unlock the ignition. An MQ-3 alcohol sensor monitors breath; if elevated levels are detected, the system overrides and disables the starter. Furthermore, left and right turn indicators from the motorcycle are transmitted wirelessly via RF transmitter-receiver modules to high-visibility LED arrays on the helmet to mimic the bike's signaling dynamically, maximizing night and road safety.",
                techUsed: ["Arduino Uno", "RF Transmitter/Receiver (433MHz)", "MQ-3 Alcohol Sensor", "Limit/Force Sensor", "Bright LED indicator strips", "12V Relay Module"],
                difficulty: "Advanced",
                imageUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600"
              };
            }
            return p;
          });
        }
        
        if (updated) {
          localStorage.setItem('mindmap_cms_data', JSON.stringify(parsed));
        }

        // Auto-upgrade for Team array if it's missing
        if (!parsed.team || !Array.isArray(parsed.team)) {
          parsed.team = defaultCMSData.team;
          localStorage.setItem('mindmap_cms_data', JSON.stringify(parsed));
        }

        // Ensure updates exist
        if (!parsed.updates) {
          parsed.updates = [];
          localStorage.setItem('mindmap_cms_data', JSON.stringify(parsed));
        }

        setData(parsed);
      } catch (e) {
        console.error("Failed to parse CMS data", e);
      }
    } else {
      localStorage.setItem('mindmap_cms_data', JSON.stringify(defaultCMSData));
    }

    const savedEnquiries = localStorage.getItem('mindmap_enquiries');
    if (savedEnquiries) {
      try {
        setEnquiries(JSON.parse(savedEnquiries));
      } catch (e) {
        console.error("Failed to parse enquiries", e);
      }
    } else {
      localStorage.setItem('mindmap_enquiries', JSON.stringify(defaultEnquiries));
    }

    const savedAuth = sessionStorage.getItem('mindmap_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }

    // Bi-directional / cloud synchronization with Supabase and/or Firestore if available
    const syncWithCloud = async () => {
      let cmsLoaded = false;
      let enquiriesLoaded = false;

      // 1. Try Supabase first
      if (isSupabaseAvailable) {
        try {
          const remoteCMS = await fetchCMSDataFromSupabase();
          if (remoteCMS) {
            let cmsUpdated = false;
            if (remoteCMS.projects) {
              remoteCMS.projects = remoteCMS.projects.map((p: any) => {
                if (p.id === 'pr2' && (p.title === 'IoT Smart Helmet for Workers' || p.title.includes('Workers') || p.title.includes('Industrial'))) {
                  cmsUpdated = true;
                  return {
                    id: "pr2",
                    title: "Smart Helmet with Ignition & Indicator Sync",
                    description: "An intelligent rider safety helmet that only starts the bike when worn, prevents ignition if drunk, and syncs wireless indicators.",
                    overview: "Designed for premium two-wheeler safety, this prototype couples an electronic smart helmet with a bike's ignition controller. Built-in limit/pressure sensors verify the rider is wearing the helmet to unlock the ignition. An MQ-3 alcohol sensor monitors breath; if elevated levels are detected, the system overrides and disables the starter. Furthermore, left and right turn indicators from the motorcycle are transmitted wirelessly via RF transmitter-receiver modules to high-visibility LED arrays on the helmet to mimic the bike's signaling dynamically, maximizing night and road safety.",
                    techUsed: ["Arduino Uno", "RF Transmitter/Receiver (433MHz)", "MQ-3 Alcohol Sensor", "Limit/Force Sensor", "Bright LED indicator strips", "12V Relay Module"],
                    difficulty: "Advanced",
                    imageUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600"
                  };
                }
                return p;
              });
            }
            if (cmsUpdated) {
              await saveCMSDataToSupabase(remoteCMS);
            }
            setData(remoteCMS);
            localStorage.setItem('mindmap_cms_data', JSON.stringify(remoteCMS));
            cmsLoaded = true;
          } else {
            // Upsert current local state as master copy if it wasn't there
            const currentLocal = savedData ? JSON.parse(savedData) : defaultCMSData;
            await saveCMSDataToSupabase(currentLocal);
          }

          const remoteEnquiriesList = await fetchEnquiriesFromSupabase();
          if (remoteEnquiriesList && remoteEnquiriesList.length > 0) {
            setEnquiries(remoteEnquiriesList);
            localStorage.setItem('mindmap_enquiries', JSON.stringify(remoteEnquiriesList));
            enquiriesLoaded = true;
          } else if (remoteEnquiriesList && remoteEnquiriesList.length === 0) {
            // Table exists but empty, or we want to push defaults
            const currentEnquiries = savedEnquiries ? JSON.parse(savedEnquiries) : defaultEnquiries;
            for (const eq of currentEnquiries) {
              await saveEnquiryToSupabase(eq);
            }
          }
        } catch (err) {
          console.error('Supabase initial load failed, trying Firebase next...', err);
        }
      }

      // 2. Try Firebase if Supabase didn't load CMS or Enquiries
      if (!cmsLoaded || !enquiriesLoaded) {
        if (!isFirebaseAvailable || !db) return;
        try {
          // Fetch CMS Data
          if (!cmsLoaded) {
            const cmsDocRef = doc(db, 'cms_sections', 'main');
            const cmsSnap = await getDoc(cmsDocRef);
            if (cmsSnap.exists()) {
              const remoteData = cmsSnap.data();
              if (remoteData?.data) {
                const fbCMS = remoteData.data as CMSData;
                let fbUpdated = false;
                if (fbCMS.projects) {
                  fbCMS.projects = fbCMS.projects.map((p: any) => {
                    if (p.id === 'pr2' && (p.title === 'IoT Smart Helmet for Workers' || p.title.includes('Workers') || p.title.includes('Industrial'))) {
                      fbUpdated = true;
                      return {
                        id: "pr2",
                        title: "Smart Helmet with Ignition & Indicator Sync",
                        description: "An intelligent rider safety helmet that only starts the bike when worn, prevents ignition if drunk, and syncs wireless indicators.",
                        overview: "Designed for premium two-wheeler safety, this prototype couples an electronic smart helmet with a bike's ignition controller. Built-in limit/pressure sensors verify the rider is wearing the helmet to unlock the ignition. An MQ-3 alcohol sensor monitors breath; if elevated levels are detected, the system overrides and disables the starter. Furthermore, left and right turn indicators from the motorcycle are transmitted wirelessly via RF transmitter-receiver modules to high-visibility LED arrays on the helmet to mimic the bike's signaling dynamically, maximizing night and road safety.",
                        techUsed: ["Arduino Uno", "RF Transmitter/Receiver (433MHz)", "MQ-3 Alcohol Sensor", "Limit/Force Sensor", "Bright LED indicator strips", "12V Relay Module"],
                        difficulty: "Advanced",
                        imageUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600"
                      };
                    }
                    return p;
                  });
                }
                if (fbUpdated) {
                  await setDoc(cmsDocRef, {
                    id: 'main',
                    data: fbCMS,
                    updatedAt: new Date().toISOString()
                  });
                }
                setData(fbCMS);
                localStorage.setItem('mindmap_cms_data', JSON.stringify(fbCMS));
                cmsLoaded = true;
                // Backfill to Supabase
                if (isSupabaseAvailable) {
                  saveCMSDataToSupabase(fbCMS);
                }
              }
            } else {
              const currentLocal = savedData ? JSON.parse(savedData) : defaultCMSData;
              await setDoc(cmsDocRef, {
                id: 'main',
                data: currentLocal,
                updatedAt: new Date().toISOString()
              });
            }
          }

          // Fetch Enquiries
          if (!enquiriesLoaded) {
            const enquiresColRef = collection(db, 'enquiries');
            const enquiriesSnap = await getDocs(enquiresColRef);
            const remoteEnquiries: EnquiryItem[] = [];
            enquiriesSnap.forEach((docSnap) => {
              remoteEnquiries.push({ id: docSnap.id, ...docSnap.data() } as EnquiryItem);
            });
            
            if (remoteEnquiries.length > 0) {
              remoteEnquiries.sort((a, b) => b.id.localeCompare(a.id));
              setEnquiries(remoteEnquiries);
              localStorage.setItem('mindmap_enquiries', JSON.stringify(remoteEnquiries));
              enquiriesLoaded = true;

              // Backfill to Supabase
              if (isSupabaseAvailable) {
                for (const eq of remoteEnquiries) {
                  saveEnquiryToSupabase(eq);
                }
              }
            }
          }
        } catch (err) {
          console.error('Firebase initial load failed:', err);
        }
      }
    };

    syncWithCloud();
  }, []);

  // Sync to local storage on change
  const updateData = (updatedData: Partial<CMSData>) => {
    setData((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('mindmap_cms_data', JSON.stringify(next));

      // Sync to Supabase if available
      if (isSupabaseAvailable) {
        saveCMSDataToSupabase(next).catch(err => console.error("Supabase update CMS failed:", err));
      }

      // Sync to Firestore if available
      if (isFirebaseAvailable && db) {
        setDoc(doc(db, 'cms_sections', 'main'), {
          id: 'main',
          data: next,
          updatedAt: new Date().toISOString()
        }).catch(err => console.error("Firestore update CMS failed:", err));
      }

      return next;
    });
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    let clientIp = 'Unknown';
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json').then(r => r.json());
      clientIp = ipRes.ip || 'Unknown';
    } catch (e) {
      // Ignore if blocked or offline
    }
    const userAgent = navigator.userAgent || 'Unknown';

    // 1. Try to authenticate via real Supabase Auth
    if (isSupabaseAvailable) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) {
          await logLoginAttemptToSupabase(email, 'FAILED', clientIp, userAgent);
          return { success: false, error: authError.message };
        }

        if (authData.user) {
          // ENFORCE ADMIN EMAIL
          if (email !== 'kumarbijit08@gmail.com') {
            await supabase.auth.signOut();
            await logLoginAttemptToSupabase(email, 'FAILED', clientIp, userAgent);
            return { success: false, error: 'Unauthorized access.' };
          }

          setIsAuthenticated(true);
          sessionStorage.setItem('mindmap_auth', 'true');
          sessionStorage.setItem('mindmap_auth_email', email);
          await logLoginAttemptToSupabase(email, 'SUCCESS', clientIp, userAgent);
          return { success: true };
        }
      } catch (err) {
        console.error('Supabase Auth error:', err);
        return { success: false, error: 'Authentication failed.' };
      }
    }
    
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    sessionStorage.removeItem('mindmap_auth');
    sessionStorage.removeItem('mindmap_auth_email');
    localStorage.removeItem('mindmap_auth_email');
  };

  // Program Handlers
  const addProgram = (program: Omit<ProgramItem, 'id'>) => {
    const newProgram: ProgramItem = {
      ...program,
      id: 'p_new_' + Date.now()
    };
    const nextPrograms = [...data.programs, newProgram];
    updateData({ programs: nextPrograms });
  };

  const editProgram = (id: string, updated: ProgramItem) => {
    const nextPrograms = data.programs.map(p => p.id === id ? updated : p);
    updateData({ programs: nextPrograms });
  };

  const deleteProgram = (id: string) => {
    const nextPrograms = data.programs.filter(p => p.id !== id);
    updateData({ programs: nextPrograms });
  };

  // Service Handlers
  const addService = (service: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...service,
      id: 'sv_new_' + Date.now()
    };
    const nextServices = [...data.services, newService];
    updateData({ services: nextServices });
  };

  const editService = (id: string, updated: ServiceItem) => {
    const nextServices = data.services.map(s => s.id === id ? updated : s);
    updateData({ services: nextServices });
  };

  const deleteService = (id: string) => {
    const nextServices = data.services.filter(s => s.id !== id);
    updateData({ services: nextServices });
  };

  // Project Handlers
  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newProject: ProjectItem = {
      ...project,
      id: 'pr_new_' + Date.now()
    };
    const nextProjects = [...data.projects, newProject];
    updateData({ projects: nextProjects });
  };

  const editProject = (id: string, updated: ProjectItem) => {
    const nextProjects = data.projects.map(p => p.id === id ? updated : p);
    updateData({ projects: nextProjects });
  };

  const deleteProject = (id: string) => {
    const nextProjects = data.projects.filter(p => p.id !== id);
    updateData({ projects: nextProjects });
  };

  // Gallery Handlers
  const addGalleryImage = (image: Omit<GalleryItem, 'id'>) => {
    const newImage: GalleryItem = {
      ...image,
      id: 'g_new_' + Date.now()
    };
    const nextGallery = [...data.gallery, newImage];
    updateData({ gallery: nextGallery });
  };

  const deleteGalleryImage = (id: string) => {
    const nextGallery = data.gallery.filter(g => g.id !== id);
    updateData({ gallery: nextGallery });
  };

  // Update Handlers
  const addUpdate = (update: Omit<UpdateItem, 'id' | 'date'>) => {
    const newUpdate: UpdateItem = {
      ...update,
      id: 'u_new_' + Date.now(),
      date: new Date().toLocaleDateString()
    };
    const nextUpdates = [...(data.updates || []), newUpdate];
    updateData({ updates: nextUpdates });
  };

  const editUpdate = (id: string, updated: UpdateItem) => {
    const nextUpdates = data.updates.map(u => u.id === id ? updated : u);
    updateData({ updates: nextUpdates });
  };

  const deleteUpdate = (id: string) => {
    const nextUpdates = data.updates.filter(u => u.id !== id);
    updateData({ updates: nextUpdates });
  };

  // Achievement Handlers
  const addAchievement = (achievement: Omit<AchievementItem, 'id'>) => {
    const newAchievement: AchievementItem = {
      ...achievement,
      id: 'a_new_' + Date.now()
    };
    const nextAchievements = [...data.achievements, newAchievement];
    updateData({ achievements: nextAchievements });
  };

  const editAchievement = (id: string, updated: AchievementItem) => {
    const nextAchievements = data.achievements.map(a => a.id === id ? updated : a);
    updateData({ achievements: nextAchievements });
  };

  const deleteAchievement = (id: string) => {
    const nextAchievements = data.achievements.filter(a => a.id !== id);
    updateData({ achievements: nextAchievements });
  };

  // Team Member Handlers
  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: 'tm_new_' + Date.now()
    };
    const nextTeam = [...(data.team || []), newMember];
    updateData({ team: nextTeam });
  };

  const editTeamMember = (id: string, updated: TeamMember) => {
    const nextTeam = (data.team || []).map(tm => tm.id === id ? updated : tm);
    updateData({ team: nextTeam });
  };

  const deleteTeamMember = (id: string) => {
    const nextTeam = (data.team || []).filter(tm => tm.id !== id);
    updateData({ team: nextTeam });
  };

  // Enquiry Handlers
  const addEnquiry = (enquiry: Omit<EnquiryItem, 'id' | 'date' | 'status'>) => {
    const id = 'eq_new_' + Date.now();
    const newEnquiry: EnquiryItem = {
      ...enquiry,
      id,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    const nextEnquiries = [newEnquiry, ...enquiries];
    setEnquiries(nextEnquiries);
    localStorage.setItem('mindmap_enquiries', JSON.stringify(nextEnquiries));

    // Write to Supabase if available
    if (isSupabaseAvailable) {
      saveEnquiryToSupabase(newEnquiry).catch(err => console.error("Supabase addEnquiry failed:", err));
    }

    // Write to Firestore if available
    if (isFirebaseAvailable && db) {
      setDoc(doc(db, 'enquiries', id), {
        name: newEnquiry.name,
        email: newEnquiry.email,
        phone: newEnquiry.phone,
        subject: newEnquiry.subject,
        message: newEnquiry.message,
        date: newEnquiry.date,
        status: newEnquiry.status
      }).catch(err => console.error("Firestore addEnquiry failed:", err));
    }
  };

  const deleteEnquiry = (id: string) => {
    const nextEnquiries = enquiries.filter(eq => eq.id !== id);
    setEnquiries(nextEnquiries);
    localStorage.setItem('mindmap_enquiries', JSON.stringify(nextEnquiries));

    // Delete from Supabase if available
    if (isSupabaseAvailable) {
      deleteEnquiryFromSupabase(id).catch(err => console.error("Supabase deleteEnquiry failed:", err));
    }

    // Delete from Firestore if available
    if (isFirebaseAvailable && db) {
      deleteDoc(doc(db, 'enquiries', id))
        .catch(err => console.error("Firestore deleteEnquiry failed:", err));
    }
  };

  const updateEnquiryStatus = (id: string, status: 'New' | 'Replied' | 'Archived') => {
    const nextEnquiries = enquiries.map(eq => eq.id === id ? { ...eq, status } : eq);
    setEnquiries(nextEnquiries);
    localStorage.setItem('mindmap_enquiries', JSON.stringify(nextEnquiries));

    // Update in Supabase if available
    if (isSupabaseAvailable) {
      updateEnquiryStatusInSupabase(id, status).catch(err => console.error("Supabase updateEnquiryStatus failed:", err));
    }

    // Update in Firestore if available
    if (isFirebaseAvailable && db) {
      updateDoc(doc(db, 'enquiries', id), { status })
        .catch(err => console.error("Firestore updateEnquiryStatus failed:", err));
    }
  };

  const resetAllData = () => {
    setData(defaultCMSData);
    setEnquiries(defaultEnquiries);
    localStorage.setItem('mindmap_cms_data', JSON.stringify(defaultCMSData));
    localStorage.setItem('mindmap_enquiries', JSON.stringify(defaultEnquiries));

    // Clear CMS section in Supabase
    if (isSupabaseAvailable) {
      saveCMSDataToSupabase(defaultCMSData).catch(err => console.error("Supabase reset CMS failed:", err));
    }

    if (isFirebaseAvailable && db) {
      // Clear CMS section in firestore
      setDoc(doc(db, 'cms_sections', 'main'), {
        id: 'main',
        data: defaultCMSData,
        updatedAt: new Date().toISOString()
      }).catch(err => console.error("Firestore resetAllData CMS failed:", err));
    }
  };

  return (
    <WebContext.Provider value={{
      data,
      enquiries,
      isAuthenticated,
      setIsAuthenticated,
      login,
      logout,
      updateData,
      addProgram,
      editProgram,
      deleteProgram,
      addService,
      editService,
      deleteService,
      addProject,
      editProject,
      deleteProject,
      addGalleryImage,
      deleteGalleryImage,
      addAchievement,
      editAchievement,
      deleteAchievement,
      addTeamMember,
      editTeamMember,
      deleteTeamMember,
      addUpdate,
      editUpdate,
      deleteUpdate,
      addEnquiry,
      deleteEnquiry,
      updateEnquiryStatus,
      resetAllData
    }}>
      {children}
    </WebContext.Provider>
  );
};

export const useWeb = () => {
  const context = useContext(WebContext);
  if (!context) {
    throw new Error('useWeb must be used within a WebProvider');
  }
  return context;
};
