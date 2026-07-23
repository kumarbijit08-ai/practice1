import React, { useState, useEffect } from 'react';
import { useWeb, ProgramItem, ServiceItem, ProjectItem, StatItem, EnquiryItem, TeamMember } from '../context/WebContext';
import { fetchLoginAttemptsFromSupabase, deleteLoginAttemptsFromSupabase, cleanLoginAttemptsOlderThan24Hours, resetPasswordForEmail } from '../lib/supabase';
import {
  Lock,
  Unlock,
  X,
  Check,
  Plus,
  Trash2,
  Edit2,
  Save,
  Database,
  Eye,
  EyeOff,
  Settings,
  Key,
  FileText,
  Layout,
  MessageSquare,
  PlusCircle,
  Image,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Compass,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  LogOut,
  Shield,
  Activity,
  Terminal,
  User,
  Users,
  Globe,
  Laptop,
  Search,
  Clock,
  Inbox,
  MailOpen,
  ChevronRight,
  Bell
} from 'lucide-react';

import ImageUploader from './ImageUploader';

const extractAllImages = (data: any): string[] => {
  const images = new Set<string>();
  
  // High-quality default educational/STEM images
  const defaults = [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
  ];
  defaults.forEach(img => images.add(img));

  const traverse = (obj: any) => {
    if (!obj) return;
    if (typeof obj === 'string') {
      if (obj.startsWith('http') || obj.startsWith('data:image')) {
        images.add(obj);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(item => traverse(item));
    } else if (typeof obj === 'object') {
      Object.values(obj).forEach(val => traverse(val));
    }
  };
  traverse(data);
  return Array.from(images);
};

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export default function AdminPanel({ isOpen, onClose, theme }: AdminPanelProps) {
  const {
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
    addTeamMember,
    editTeamMember,
    deleteTeamMember,
    addUpdate,
    editUpdate,
    deleteUpdate,
    deleteEnquiry,
    updateEnquiryStatus,
    resetAllData
  } = useWeb();

  const allCMSImages = extractAllImages(data);

  // Email/Password authentication state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setResetStatus(null);
    try {
      await resetPasswordForEmail(resetEmail);
      setResetStatus({ type: 'success', message: 'If an account exists, a password reset email has been sent.' });
    } catch (err: any) {
      setResetStatus({ type: 'error', message: err.message || 'Failed to send reset email.' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Tabs for navigation
  const [activeTab, setActiveTab] = useState<'general' | 'stats' | 'about' | 'projects' | 'programs' | 'services' | 'enquiries' | 'audit' | 'founder' | 'team' | 'contact' | 'gallery' | 'security' | 'updates' | 'categories'>('general');

  // Audit Logs State
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);
  const [attemptsSearch, setAttemptsSearch] = useState('');
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);

  // Edit forms states
  const [editingTeamMember, setEditingTeamMember] = useState<Partial<TeamMember>>({});

  // Edit forms states
  const [generalForm, setGeneralForm] = useState({
    siteName: '',
    tagline: '',
    logoText: '',
    logoUrl: '',
    heroHeadline: '',
    heroSubheading: ''
  });

  const [aboutForm, setAboutForm] = useState({
    introduction: '',
    vision: '',
    mission: '',
    philosophy: ''
  });

  const [founderForm, setFounderForm] = useState({
    name: '',
    title: '',
    bio: '',
    message: '',
    imageUrl: ''
  });

  const [founderTimeline, setFounderTimeline] = useState<{ year: string; event: string }[]>([]);
  const [newTimelineYear, setNewTimelineYear] = useState('');
  const [newTimelineEvent, setNewTimelineEvent] = useState('');

  const [contactForm, setContactForm] = useState({
    phone: '',
    email: '',
    address: '',
    whatsappNumber: '',
    googleMapEmbedUrl: ''
  });

  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<string>('');
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');
  const [editingGalleryItem, setEditingGalleryItem] = useState<any>(null); // For editing
  const [newCategory, setNewCategory] = useState('');

  // Update form state
  const [newUpdateForm, setNewUpdateForm] = useState({ title: '', content: '', imageUrl: '' });

  // Items lists editing
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Stats edit temp state
  const [statsForm, setStatsForm] = useState<StatItem[]>([]);
  const [newStatValue, setNewStatValue] = useState('');
  const [newStatLabel, setNewStatLabel] = useState('');
  const [newStatIcon, setNewStatIcon] = useState('Cpu');

  // Individual item creation/editing temp states
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem>>({});
  const [editingProgram, setEditingProgram] = useState<Partial<ProgramItem>>({});
  const [editingService, setEditingService] = useState<Partial<ServiceItem>>({});

  // Security tab states
  const [customAdminEmail, setCustomAdminEmail] = useState(() => localStorage.getItem('mindmap_custom_admin_email') || 'kumarbijit08@gmail.com');
  const [customAdminPassword, setCustomAdminPassword] = useState(() => localStorage.getItem('mindmap_custom_admin_password') || '9864581737');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState(() => localStorage.getItem('mindmap_custom_admin_password') || '9864581737');
  const [recentPassword, setRecentPassword] = useState('');

  // Password recovery states
  // Removed password recovery states as requested.

  // Notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Delete confirmation modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Synchronize initial forms when open or data loads
  useEffect(() => {
    if (isOpen && data) {
      setGeneralForm({
        siteName: data.siteName || '',
        tagline: data.tagline || '',
        logoText: data.logoText || '',
        logoUrl: data.logoUrl || '',
        heroHeadline: data.heroHeadline || '',
        heroSubheading: data.heroSubheading || ''
      });

      setAboutForm({
        introduction: data.about?.introduction || '',
        vision: data.about?.vision || '',
        mission: data.about?.mission || '',
        philosophy: data.about?.philosophy || ''
      });

      setStatsForm(data.stats || []);

      setFounderForm({
        name: data.founder?.name || '',
        title: data.founder?.title || '',
        bio: data.founder?.bio || '',
        message: data.founder?.message || '',
        imageUrl: data.founder?.imageUrl || ''
      });

      setFounderTimeline(data.founder?.timeline || []);

      setContactForm({
        phone: data.contact?.phone || '',
        email: data.contact?.email || '',
        address: data.contact?.address || '',
        whatsappNumber: data.contact?.whatsappNumber || '',
        googleMapEmbedUrl: data.contact?.googleMapEmbedUrl || '',
        facebook: data.contact?.facebook || '',
        instagram: data.contact?.instagram || '',
        linkedin: data.contact?.linkedin || '',
        youtube: data.contact?.youtube || '',
        footerLogoUrl: data.contact?.footerLogoUrl || ''
      });
    }
  }, [isOpen, data]);

  // Load audit trail attempts
  const loadLoginAttempts = async () => {
    if (!isAuthenticated) return;
    setIsLoadingAttempts(true);
    try {
      const attempts = await fetchLoginAttemptsFromSupabase();
      setLoginAttempts(attempts);
      setSelectedLogIds([]);
    } catch (err) {
      console.error('Failed to fetch login attempts:', err);
    } finally {
      setIsLoadingAttempts(false);
    }
  };

  const handleDeleteSelectedLogs = async () => {
    if (selectedLogIds.length === 0) return;
    
    setDeleteConfirmation({
      title: 'Delete Selected Audit Logs',
      message: `Are you sure you want to permanently delete the ${selectedLogIds.length} selected log(s)?`,
      onConfirm: async () => {
        setIsLoadingAttempts(true);
        try {
          const success = await deleteLoginAttemptsFromSupabase(selectedLogIds);
          if (success) {
            showToast('success', `${selectedLogIds.length} audit log(s) successfully deleted.`);
            await loadLoginAttempts();
          } else {
            showToast('error', 'Failed to delete selected audit logs from database.');
          }
        } catch (err) {
          showToast('error', 'An error occurred while deleting selected logs.');
        } finally {
          setIsLoadingAttempts(false);
          setDeleteConfirmation(null);
        }
      }
    });
  };

  const handleCleanOlderThan24Hours = async () => {
    setDeleteConfirmation({
      title: 'Clean Audit Logs (>24 Hours)',
      message: 'Are you sure you want to permanently delete all SQL security audit logs older than 24 hours?',
      onConfirm: async () => {
        setIsLoadingAttempts(true);
        try {
          const success = await cleanLoginAttemptsOlderThan24Hours();
          if (success) {
            showToast('success', 'Successfully cleared all security audit logs older than 24 hours.');
            await loadLoginAttempts();
          } else {
            showToast('error', 'Failed to clear old logs from the database.');
          }
        } catch (err) {
          showToast('error', 'An error occurred during database log cleanup.');
        } finally {
          setIsLoadingAttempts(false);
          setDeleteConfirmation(null);
        }
      }
    });
  };

  const handleDeleteSingleLog = async (id: string, email: string) => {
    setDeleteConfirmation({
      title: 'Delete Audit Log',
      message: `Are you sure you want to permanently delete the audit log for "${email}"?`,
      onConfirm: async () => {
        setIsLoadingAttempts(true);
        try {
          const success = await deleteLoginAttemptsFromSupabase([id]);
          if (success) {
            showToast('success', 'Audit log deleted successfully.');
            await loadLoginAttempts();
          } else {
            showToast('error', 'Failed to delete audit log.');
          }
        } catch (err) {
          showToast('error', 'An error occurred.');
        } finally {
          setIsLoadingAttempts(false);
          setDeleteConfirmation(null);
        }
      }
    });
  };

  useEffect(() => {
    if (activeTab === 'audit' && isAuthenticated) {
      loadLoginAttempts();
    }
  }, [activeTab, isAuthenticated]);

  // Self-destruct notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!isOpen) return null;

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput) {
      setAuthError('Please fill in both email and password.');
      return;
    }

    setAuthError('');
    setIsLoggingIn(true);

    try {
      const res = await login(emailInput, passwordInput);
      if (res.success) {
        setAuthError('');
        setEmailInput('');
        setPasswordInput('');
        showToast('success', 'Authenticated successfully! Admin controls unlocked.');
      } else {
        setAuthError(res.error || 'Invalid credentials.');
        showToast('error', res.error || 'Invalid admin credentials.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected error occurred during login.');
      showToast('error', 'Login attempt failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };


  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(generalForm);
    showToast('success', 'General configurations saved and synchronized successfully!');
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      about: {
        ...data.about,
        ...aboutForm
      }
    });
    showToast('success', 'About & Philosophy section content updated and saved.');
  };

  const handleSaveStats = () => {
    updateData({ stats: statsForm });
    showToast('success', 'Snapshot Activities Statistics successfully saved!');
  };

  const handleSaveFounder = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      founder: {
        ...founderForm,
        timeline: founderTimeline
      }
    });
    showToast('success', 'Founder Profile and Timeline updated successfully!');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    updateData({ categories: [...(data.categories || []), newCategory.trim()] });
    setNewCategory('');
    showToast('success', 'Category added.');
  };

  const handleUpdateGalleryItem = () => {
    if (!editingGalleryItem) return;
    updateData({
      gallery: data.gallery?.map(item => item.id === editingGalleryItem.id ? editingGalleryItem : item)
    });
    setEditingGalleryItem(null);
    showToast('success', 'Gallery item updated.');
  };

  const handleRemoveCategory = (cat: string) => {
    updateData({ categories: (data.categories || []).filter(c => c !== cat) });
    showToast('success', 'Category removed.');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      contact: contactForm
    });
    showToast('success', 'Contact settings and Google Maps updated successfully!');
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle.trim() || !newGalleryImageUrl.trim() || !newGalleryCategory.trim()) {
      showToast('error', 'Gallery image title, URL, and category are required.');
      return;
    }
    addGalleryImage({
      title: newGalleryTitle,
      category: newGalleryCategory,
      imageUrl: newGalleryImageUrl
    });
    setNewGalleryTitle('');
    setNewGalleryImageUrl('');
    setNewGalleryCategory('');
    showToast('success', 'New Showcase Gallery item added successfully!');
  };

  const handleStatChange = (id: string, field: keyof StatItem, value: any) => {
    setStatsForm(prev =>
      prev.map(stat => (stat.id === id ? { ...stat, [field]: value } : stat))
    );
  };

  const handleAddStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatValue || !newStatLabel) {
      showToast('error', 'Please fill in both the value and the label.');
      return;
    }
    const newId = `s_${Date.now()}`;
    const newItem: StatItem = {
      id: newId,
      value: newStatValue,
      label: newStatLabel,
      icon: newStatIcon || 'Cpu',
      enabled: true
    };
    setStatsForm(prev => [...prev, newItem]);
    setNewStatValue('');
    setNewStatLabel('');
    setNewStatIcon('Cpu');
    showToast('success', 'New statistic metric added successfully! Click "Save Statistics Metrics" below to save.');
  };

  const handleDeleteStat = (id: string) => {
    setStatsForm(prev => prev.filter(s => s.id !== id));
    showToast('success', 'Metric removed. Click "Save Statistics Metrics" below to save changes.');
  };

  // PROJECT ACTIONS
  const startEditProject = (project: ProjectItem) => {
    setEditingItemId(project.id);
    setEditingProject(project);
  };

  const startNewProject = () => {
    setEditingItemId('new');
    setEditingProject({
      title: '',
      description: '',
      overview: '',
      techUsed: [],
      difficulty: 'Intermediate',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      videoUrl: ''
    });
  };

  const saveProjectForm = () => {
    if (!editingProject.title || !editingProject.description) {
      showToast('error', 'Project Title and Description are required.');
      return;
    }

    const projectToSave = {
      title: editingProject.title || '',
      description: editingProject.description || '',
      overview: editingProject.overview || '',
      techUsed: editingProject.techUsed || [],
      difficulty: editingProject.difficulty || 'Intermediate',
      imageUrl: editingProject.imageUrl || '',
      videoUrl: editingProject.videoUrl || ''
    };

    if (editingItemId === 'new') {
      addProject(projectToSave);
      showToast('success', 'New Project created and added to showcase!');
    } else if (editingItemId) {
      editProject(editingItemId, { ...projectToSave, id: editingItemId });
      showToast('success', 'Project details updated and saved successfully.');
    }
    setEditingItemId(null);
    setEditingProject({});
  };

  // PROGRAM ACTIONS
  const startEditProgram = (program: ProgramItem) => {
    setEditingItemId(program.id);
    setEditingProgram(program);
  };

  const startNewProgram = () => {
    setEditingItemId('new');
    setEditingProgram({
      title: '',
      description: '',
      longDescription: '',
      category: 'Electronics',
      duration: '',
      eligibility: '',
      outcomes: [],
      modules: [],
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
    });
  };

  const saveProgramForm = () => {
    if (!editingProgram.title || !editingProgram.description) {
      showToast('error', 'Program Title and Description are required.');
      return;
    }

    const programToSave = {
      title: editingProgram.title || '',
      description: editingProgram.description || '',
      longDescription: editingProgram.longDescription || '',
      category: editingProgram.category || 'Electronics',
      duration: editingProgram.duration || '',
      eligibility: editingProgram.eligibility || '',
      outcomes: editingProgram.outcomes || [],
      modules: editingProgram.modules || [],
      imageUrl: editingProgram.imageUrl || ''
    };

    if (editingItemId === 'new') {
      addProgram(programToSave);
      showToast('success', 'New Educational Program created successfully!');
    } else if (editingItemId) {
      editProgram(editingItemId, { ...programToSave, id: editingItemId });
      showToast('success', 'Program details updated and saved.');
    }
    setEditingItemId(null);
    setEditingProgram({});
  };

  // SERVICE ACTIONS
  const startEditService = (service: ServiceItem) => {
    setEditingItemId(service.id);
    setEditingService(service);
  };

  const startNewService = () => {
    setEditingItemId('new');
    setEditingService({
      title: '',
      description: '',
      icon: 'Cpu',
      features: []
    });
  };

  const saveServiceForm = () => {
    if (!editingService.title || !editingService.description) {
      showToast('error', 'Service Title and Description are required.');
      return;
    }

    const serviceToSave = {
      title: editingService.title || '',
      description: editingService.description || '',
      icon: editingService.icon || 'Cpu',
      features: editingService.features || []
    };

    if (editingItemId === 'new') {
      addService(serviceToSave);
      showToast('success', 'New Technological Service registered!');
    } else if (editingItemId) {
      editService(editingItemId, { ...serviceToSave, id: editingItemId });
      showToast('success', 'Service details modified and successfully saved.');
    }
    setEditingItemId(null);
    setEditingService({});
  };

  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAdminEmail.trim() || !customAdminPassword.trim()) {
      showToast('error', 'Admin email and password cannot be empty.');
      return;
    }
    const currentActualPassword = localStorage.getItem('mindmap_custom_admin_password') || '9864581737';
    if (recentPassword !== currentActualPassword) {
      showToast('error', 'Incorrect recent password. Please enter your correct current password to update credentials.');
      return;
    }
    if (customAdminPassword !== confirmAdminPassword) {
      showToast('error', 'Passwords do not match.');
      return;
    }
    localStorage.setItem('mindmap_custom_admin_email', customAdminEmail.trim());
    localStorage.setItem('mindmap_custom_admin_password', customAdminPassword);
    setRecentPassword(''); // Clear the input field for security
    showToast('success', 'Administrative security credentials updated successfully! You have been logged out.');
    logout(); // Force logout to invalidate session
  };

  return (
    <div className="fixed inset-4 z-50 bg-neutral-950/95 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-2xl flex items-center justify-center overflow-hidden text-neutral-100">
      {/* Toast Notification inside overlay */}
      {notification && (
        <div className={`fixed top-6 right-6 z-55 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border text-sm font-semibold transition-all duration-300 animate-slide-in ${
          notification.type === 'success'
            ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/30'
            : 'bg-rose-950/90 text-rose-400 border-rose-500/30'
        }`}>
          {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Admin Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-[1030px] min-w-[1030px] h-[90vh] shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>CMS Command Deck</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Secure Portal
                </span>
              </h2>
              <p className="text-xs text-neutral-400">Manage, edit, and instantly synchronize all texts and content</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  showToast('success', 'Logged out securely.');
                }}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-rose-950 hover:text-rose-400 border border-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                title="Lock Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer text-neutral-400 hover:text-white"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECURITY AUTH GATE */}
        {!isAuthenticated ? (
          <div className="flex-1 overflow-y-auto bg-neutral-950/40 p-6 md:p-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* LEFT COLUMN: AUTH FORMS */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden w-full max-w-3xl mx-auto">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-sky-400 to-indigo-500"></div>
                
                <div className="space-y-8">
                    <>
                      <div className="text-center sm:text-left">
                        <div className="inline-flex p-4 bg-sky-500/10 text-sky-400 rounded-2xl mb-4">
                          <Shield className="w-10 h-10" />
                        </div>
                        <h3 className="text-5xl font-black text-white">Command Deck Sign In</h3>
                        <p className="text-sm text-neutral-400 mt-2">
                          Sign in with your administrative credentials to unlock the CMS. All login sessions are audited.
                        </p>
                      </div>

                      {isForgotPassword ? (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                          <div className="space-y-3">
                            <label className="text-xs font-black uppercase text-neutral-400 tracking-wider">Email Address</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-500">
                                <Mail className="w-5 h-5" />
                              </span>
                              <input
                                type="email"
                                required
                                placeholder="e.g., admin@yourdomain.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-base text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                disabled={isLoggingIn}
                              />
                            </div>
                          </div>

                          {resetStatus && (
                            <div className={`p-4 ${resetStatus.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' : 'bg-rose-950/40 border-rose-500/20 text-rose-400'} border rounded-2xl text-sm flex items-start gap-3`}>
                              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                              <span>{resetStatus.message}</span>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-4 bg-sky-500 hover:bg-sky-600 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-500 font-bold uppercase tracking-wider text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
                          >
                            {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => { setIsForgotPassword(false); setResetStatus(null); }}
                            className="w-full py-2 text-neutral-500 hover:text-white text-xs font-semibold uppercase tracking-wider"
                          >
                            Back to Login
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                          <div className="space-y-3">
                            <label className="text-xs font-black uppercase text-neutral-400 tracking-wider">Admin Email</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-500">
                                <User className="w-5 h-5" />
                              </span>
                              <input
                                type="email"
                                required
                                placeholder="e.g., admin@yourdomain.com"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-base text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                disabled={isLoggingIn}
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-black uppercase text-neutral-400 tracking-wider">Password</label>
                              <button 
                                type="button" 
                                onClick={() => setIsForgotPassword(true)}
                                className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                              >
                                Forgot password?
                              </button>
                            </div>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-500">
                                <Key className="w-5 h-5" />
                              </span>
                              <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-base text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono tracking-widest transition-all"
                                disabled={isLoggingIn}
                              />
                            </div>
                          </div>

                          {authError && (
                            <div className="p-4 bg-rose-950/40 border border-rose-500/20 rounded-2xl text-sm text-rose-400 flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                              <span>{authError}</span>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-4 bg-sky-500 hover:bg-sky-600 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-500 font-bold uppercase tracking-wider text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
                          >
                            {isLoggingIn ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Verifying Session...</span>
                              </>
                            ) : (
                              <>
                                <Unlock className="w-4 h-4" />
                                <span>Unlock Command Deck</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}

                      <div className="pt-2 text-xs text-neutral-500 text-center">
                        Secure administrative login.
                      </div>
                    </>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-800/60 w-full flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                    PostgreSQL Audit Active
                  </span>
                  <span>Supabase Gateway TLS</span>
                </div>
              </div>



            </div>
          </div>
        ) : (
          /* FULL CMS DASHBOARD */
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar Tabs */}
            <div className="w-56 border-r border-neutral-800 bg-neutral-950/40 p-4 space-y-1.5 overflow-y-auto">
              <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 px-3 mb-2">Sections</div>
              
              <button
                onClick={() => { setActiveTab('general'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'general' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Layout className="w-4 h-4" />
                <span>Global Setup</span>
              </button>

              <button
                onClick={() => { setActiveTab('categories'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'categories' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Categories</span>
              </button>

              <button
                onClick={() => { setActiveTab('stats'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'stats' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Snapshot Stats</span>
              </button>

              <button
                onClick={() => { setActiveTab('about'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'about' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Tech Curiosity</span>
              </button>

              <button
                onClick={() => { setActiveTab('projects'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'projects' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>All Projects</span>
              </button>

              <button
                onClick={() => { setActiveTab('programs'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'programs' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>STEM Programs</span>
              </button>

              <button
                onClick={() => { setActiveTab('services'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'services' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Our Services</span>
              </button>

              <button
                onClick={() => { setActiveTab('founder'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'founder' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <User className="w-4 h-4 text-sky-400" />
                <span>Founder Profile</span>
              </button>

              <button
                onClick={() => { setActiveTab('team'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'team' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Users className="w-4 h-4 text-sky-400" />
                <span>Educator Team</span>
              </button>

              <button
                onClick={() => { setActiveTab('gallery'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'gallery' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Image className="w-4 h-4 text-sky-400" />
                <span>Showcase Gallery</span>
              </button>

              <button
                onClick={() => { setActiveTab('contact'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'contact' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Phone className="w-4 h-4 text-sky-400" />
                <span>Contact & Map</span>
              </button>

              <div className="pt-4 text-[10px] uppercase font-bold tracking-widest text-neutral-500 px-3 mb-2">Communications</div>

              <button
                onClick={() => { setActiveTab('enquiries'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'enquiries' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="flex-1">Inquiries</span>
                {enquiries?.filter(e => e.status === 'New').length > 0 && (
                  <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {enquiries.filter(e => e.status === 'New').length}
                  </span>
                )}
              </button>

              <div className="pt-4 text-[10px] uppercase font-bold tracking-widest text-neutral-500 px-3 mb-1.5">Security</div>

              <button
                onClick={() => { setActiveTab('audit'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'audit' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Shield className="w-4 h-4 text-sky-400" />
                <span className="flex-1">SQL Audit Logs</span>
              </button>

              <button
                onClick={() => { setActiveTab('security'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'security' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Key className="w-4 h-4 text-sky-400" />
                <span className="flex-1">Security Settings</span>
              </button>

              <button
                onClick={() => { setActiveTab('updates'); setEditingItemId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'updates' ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
              >
                <Bell className="w-4 h-4 text-sky-400" />
                <span className="flex-1">Updates Management</span>
              </button>

              <div className="pt-6 px-3">
                <div className="rounded-xl bg-neutral-900 border border-neutral-800/60 p-2.5 text-[10px] text-neutral-400">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span>Live Syncing</span>
                  </div>
                  <span>Saves updates to Supabase Database storage.</span>
                </div>
              </div>
            </div>

            {/* Editing / Content Workspace */}
            <div className="flex-1 p-6 overflow-y-auto bg-neutral-900/20">

              {/* CATEGORIES TAB */}
              {activeTab === 'categories' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Tag Categories</h3>
                    <p className="text-xs text-neutral-400">Manage categories for Programs and Projects.</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="New Category Name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {data.categories?.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                        <span className="text-sm text-white">{cat}</span>
                        <button
                          onClick={() => handleRemoveCategory(cat)}
                          className="p-1.5 hover:bg-rose-950 hover:text-rose-400 text-neutral-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 1. GENERAL SETUP TAB */}
              {activeTab === 'general' && (
                <form onSubmit={handleSaveGeneral} className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Global Branding & Headlines</h3>
                    <p className="text-xs text-neutral-400">Modify general text elements seen in the header, navbar, and primary screen banner.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Website Name</label>
                      <input
                        type="text"
                        value={generalForm.siteName}
                        onChange={(e) => setGeneralForm({ ...generalForm, siteName: e.target.value })}
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Logo Text</label>
                      <input
                        type="text"
                        value={generalForm.logoText}
                        onChange={(e) => setGeneralForm({ ...generalForm, logoText: e.target.value })}
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <ImageUploader
                      label="Logo Image URL"
                      value={generalForm.logoUrl || ''}
                      onChange={(url) => setGeneralForm({ ...generalForm, logoUrl: url })}
                      allImages={allCMSImages}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Tagline / Motto</label>
                    <input
                      type="text"
                      value={generalForm.tagline}
                      onChange={(e) => setGeneralForm({ ...generalForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Hero Main Title Headline</label>
                    <textarea
                      value={generalForm.heroHeadline}
                      onChange={(e) => setGeneralForm({ ...generalForm, heroHeadline: e.target.value })}
                      className="w-full h-20 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Hero Subheading description</label>
                    <textarea
                      value={generalForm.heroSubheading}
                      onChange={(e) => setGeneralForm({ ...generalForm, heroSubheading: e.target.value })}
                      className="w-full h-24 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-neutral-800">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save and Update Live</span>
                    </button>
                  </div>
                </form>
              )}

              {/* 2. STATS TAB */}
              {activeTab === 'stats' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">Snapshot of Activity (Home Stats)</h3>
                      <p className="text-xs text-neutral-400">Modify, toggle, or add new statistics metrics shown on your home page showcasing activity snapshot metrics.</p>
                    </div>
                  </div>

                  {/* ADD NEW STAT FORM */}
                  <form onSubmit={handleAddStat} className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                      <PlusCircle className="w-4 h-4" />
                      <span>Add New Stat Metric</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] text-neutral-300 font-bold">Numeric Value (e.g. 150+)</label>
                        <input
                          type="text"
                          required
                          value={newStatValue}
                          onChange={(e) => setNewStatValue(e.target.value)}
                          placeholder="e.g. 150+"
                          className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-neutral-300 font-bold">Descriptive Label</label>
                        <input
                          type="text"
                          required
                          value={newStatLabel}
                          onChange={(e) => setNewStatLabel(e.target.value)}
                          placeholder="e.g. Projects Completed"
                          className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-neutral-300 font-bold">Lucide Icon (e.g. Shield, Cpu, BookOpen)</label>
                        <input
                          type="text"
                          value={newStatIcon}
                          onChange={(e) => setNewStatIcon(e.target.value)}
                          placeholder="Cpu"
                          className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm font-mono text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-sky-400 hover:text-sky-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border border-neutral-700"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Metric To List</span>
                      </button>
                    </div>
                  </form>

                  {/* STATS ITEMS LIST */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {statsForm.map((stat) => {
                      const isEnabled = stat.enabled !== false;
                      return (
                        <div
                          key={stat.id}
                          className={`p-4 border rounded-xl space-y-3 shadow-inner transition-all duration-200 ${
                            isEnabled
                              ? 'bg-neutral-950 border-neutral-800'
                              : 'bg-neutral-950/40 border-neutral-900/60 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                            <span className="text-[10px] font-mono text-neutral-500">ID: {stat.id}</span>
                            <div className="flex items-center gap-2">
                              {/* TOGGLE ENABLE/DISABLE */}
                              <button
                                type="button"
                                onClick={() => handleStatChange(stat.id, 'enabled', !isEnabled)}
                                title={isEnabled ? 'Click to Disable' : 'Click to Enable'}
                                className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                                  isEnabled
                                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                                }`}
                              >
                                {isEnabled ? (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3 h-3" />
                                    <span>Disabled</span>
                                  </>
                                )}
                              </button>

                              {/* DELETE BUTTON */}
                              <button
                                type="button"
                                onClick={() => handleDeleteStat(stat.id)}
                                title="Delete Statistic"
                                className="p-1 rounded-md text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[11px] text-neutral-400 font-bold">Numeric Value (e.g. 100+)</label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-neutral-400 font-bold">Descriptive Label</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-neutral-400 font-bold">Lucide Icon (e.g. Shield, Cpu, Sparkles)</label>
                            <input
                              type="text"
                              value={stat.icon}
                              onChange={(e) => handleStatChange(stat.id, 'icon', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-sm font-mono text-neutral-300 focus:outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex justify-end">
                    <button
                      onClick={handleSaveStats}
                      className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Statistics Metrics</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. ABOUT & TECH CURIOSITY */}
              {activeTab === 'about' && (
                <form onSubmit={handleSaveAbout} className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Tech Curiosity, Vision & Philosophy</h3>
                    <p className="text-xs text-neutral-400">Edit the comprehensive text of the STEM and Tech Curiosity blocks.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Introduction Headline & Bio</label>
                    <textarea
                      value={aboutForm.introduction}
                      onChange={(e) => setAboutForm({ ...aboutForm, introduction: e.target.value })}
                      className="w-full h-32 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Vision Statement</label>
                      <textarea
                        value={aboutForm.vision}
                        onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                        className="w-full h-32 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Mission Statement</label>
                      <textarea
                        value={aboutForm.mission}
                        onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                        className="w-full h-32 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Teaching Philosophy & Methodology</label>
                    <textarea
                      value={aboutForm.philosophy}
                      onChange={(e) => setAboutForm({ ...aboutForm, philosophy: e.target.value })}
                      className="w-full h-24 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                    />
                  </div>

                  <div className="pt-4 border-t border-neutral-800">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Tech Curiosity Text</span>
                    </button>
                  </div>
                </form>
              )}

              {/* 4. PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">Showcased Projects</h3>
                      <p className="text-xs text-neutral-400">Manage interactive student projects, Arduino builders, and technology showpieces.</p>
                    </div>
                    {editingItemId === null && (
                      <button
                        onClick={startNewProject}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Project</span>
                      </button>
                    )}
                  </div>

                  {/* Editing workspace for a single project */}
                  {editingItemId !== null ? (
                    <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4 max-w-4xl">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <h4 className="text-sm font-black uppercase text-sky-400 tracking-wider">
                          {editingItemId === 'new' ? 'Create New Project' : 'Edit Project Details'}
                        </h4>
                        <button
                          onClick={() => setEditingItemId(null)}
                          className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">Project Title</label>
                          <input
                            type="text"
                            value={editingProject.title || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">Difficulty Grade</label>
                          <select
                            value={editingProject.difficulty || 'Intermediate'}
                            onChange={(e) => setEditingProject({ ...editingProject, difficulty: e.target.value as any })}
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">Short Summary description</label>
                        <input
                          type="text"
                          value={editingProject.description || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">Project Full Overview</label>
                        <textarea
                          value={editingProject.overview || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, overview: e.target.value })}
                          className="w-full h-24 px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">Tech Stack (comma-separated, e.g. Arduino, C++, Sensors)</label>
                        <input
                          type="text"
                          value={editingProject.techUsed?.join(', ') || ''}
                          onChange={(e) => setEditingProject({
                            ...editingProject,
                            techUsed: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="Arduino Uno, Servos, Ultrasound Sensor"
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-4">
                        <ImageUploader
                          label="Project Showcase Image"
                          value={editingProject.imageUrl || ''}
                          onChange={(url) => setEditingProject({ ...editingProject, imageUrl: url })}
                          allImages={allCMSImages}
                        />

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">Youtube / Video URL (Optional)</label>
                          <input
                            type="text"
                            value={editingProject.videoUrl || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white font-mono text-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-neutral-800 flex items-center gap-3">
                        <button
                          onClick={saveProjectForm}
                          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Commit Save</span>
                        </button>
                        <button
                          onClick={() => setEditingItemId(null)}
                          className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Project items listing grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.projects?.map((project) => (
                        <div key={project.id} className="bg-neutral-950 border border-neutral-800/80 rounded-2xl overflow-hidden p-4 flex flex-col justify-between shadow-xl">
                          <div>
                            <div className="aspect-video rounded-lg overflow-hidden bg-neutral-900 mb-3 relative">
                              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                              <span className="absolute top-2 right-2 bg-sky-500/90 text-neutral-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-md">
                                {project.difficulty}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">{project.title}</h4>
                            <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{project.description}</p>
                            
                            <div className="flex flex-wrap gap-1 mb-4">
                              {project.techUsed?.map((tech, i) => (
                                <span key={i} className="text-[9px] bg-neutral-900 text-sky-400 px-1.5 py-0.5 rounded-md font-mono border border-neutral-800/60">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-neutral-900 flex items-center justify-between gap-2">
                            <button
                              onClick={() => startEditProject(project)}
                              className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmation({
                                  title: 'Delete Project',
                                  message: `Are you sure you want to permanently delete project "${project.title}" from the showcase?`,
                                  onConfirm: () => {
                                    deleteProject(project.id);
                                    showToast('success', 'Project removed from portfolio.');
                                    setDeleteConfirmation(null);
                                  }
                                });
                              }}
                              className="p-1.5 bg-neutral-900 hover:bg-rose-950 text-neutral-500 hover:text-rose-400 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
                              title="Delete project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. PROGRAMS TAB */}
              {activeTab === 'programs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">Educational & STEM Programs</h3>
                      <p className="text-xs text-neutral-400">Edit or append curriculum guides, electronics programs, and workshops.</p>
                    </div>
                    {editingItemId === null && (
                      <button
                        onClick={startNewProgram}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Program</span>
                      </button>
                    )}
                  </div>

                  {editingItemId !== null ? (
                    <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4 max-w-4xl">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <h4 className="text-sm font-black uppercase text-sky-400 tracking-wider">
                          {editingItemId === 'new' ? 'Register New Curriculum' : 'Modify Program details'}
                        </h4>
                        <button onClick={() => setEditingItemId(null)} className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">Program Title</label>
                          <input
                            type="text"
                            value={editingProgram.title || ''}
                            onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">Category Section</label>
                          <select
                            value={editingProgram.category || ''}
                            onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value })}
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none"
                          >
                            <option value="">Select Category</option>
                            {data.categories?.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">Course Duration</label>
                          <input
                            type="text"
                            value={editingProgram.duration || ''}
                            onChange={(e) => setEditingProgram({ ...editingProgram, duration: e.target.value })}
                            placeholder="6 Weeks"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">Age Eligibility</label>
                          <input
                            type="text"
                            value={editingProgram.eligibility || ''}
                            onChange={(e) => setEditingProgram({ ...editingProgram, eligibility: e.target.value })}
                            placeholder="Ages 10-16"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">Brief Overview Description</label>
                        <input
                          type="text"
                          value={editingProgram.description || ''}
                          onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">In-Depth Course description</label>
                        <textarea
                          value={editingProgram.longDescription || ''}
                          onChange={(e) => setEditingProgram({ ...editingProgram, longDescription: e.target.value })}
                          className="w-full h-24 px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <ImageUploader
                          label="STEAM Program Image"
                          value={editingProgram.imageUrl || ''}
                          onChange={(url) => setEditingProgram({ ...editingProgram, imageUrl: url })}
                          allImages={allCMSImages}
                        />
                      </div>

                      <div className="pt-4 border-t border-neutral-800 flex items-center gap-3">
                        <button
                          onClick={saveProgramForm}
                          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Commit Save</span>
                        </button>
                        <button onClick={() => setEditingItemId(null)} className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.programs?.map((program) => (
                        <div key={program.id} className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-2xl flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-black uppercase bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full">
                              {program.category}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-2 mb-1">{program.title}</h4>
                            <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{program.description}</p>
                            
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 font-mono">
                              <div>Duration: <span className="text-neutral-300">{program.duration}</span></div>
                              <div>Ages: <span className="text-neutral-300">{program.eligibility}</span></div>
                            </div>
                          </div>

                          <div className="pt-3 mt-4 border-t border-neutral-900 flex items-center gap-2">
                            <button
                              onClick={() => startEditProgram(program)}
                              className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmation({
                                  title: 'Delete Educational Program',
                                  message: `Are you sure you want to permanently delete the program "${program.title}"?`,
                                  onConfirm: () => {
                                    deleteProgram(program.id);
                                    showToast('success', 'Program removed.');
                                    setDeleteConfirmation(null);
                                  }
                                });
                              }}
                              className="p-1.5 bg-neutral-900 hover:bg-rose-950 text-neutral-500 hover:text-rose-400 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 6. SERVICES TAB */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">Corporate & Tech Services</h3>
                      <p className="text-xs text-neutral-400">Modify service catalogs, institutional setups, and training scopes.</p>
                    </div>
                    {editingItemId === null && (
                      <button
                        onClick={startNewService}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Register Service</span>
                      </button>
                    )}
                  </div>

                  {editingItemId !== null ? (
                    <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4 max-w-4xl">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <h4 className="text-sm font-black uppercase text-sky-400 tracking-wider">
                          {editingItemId === 'new' ? 'Register Service' : 'Modify Service Scopes'}
                        </h4>
                        <button onClick={() => setEditingItemId(null)} className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">Service Title</label>
                          <input
                            type="text"
                            value={editingService.title || ''}
                            onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">Lucide Icon name</label>
                          <input
                            type="text"
                            value={editingService.icon || 'Cpu'}
                            onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-mono text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">Brief Scope description</label>
                        <textarea
                          value={editingService.description || ''}
                          onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                          className="w-full h-24 px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none"
                        />
                      </div>

                      <div className="pt-4 border-t border-neutral-800 flex items-center gap-3">
                        <button
                          onClick={saveServiceForm}
                          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Commit Save</span>
                        </button>
                        <button onClick={() => setEditingItemId(null)} className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.services?.map((service) => (
                        <div key={service.id} className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-2xl flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-mono font-bold text-sky-400">[{service.icon}]</span>
                            <h4 className="text-sm font-bold text-white mt-1 mb-1">{service.title}</h4>
                            <p className="text-xs text-neutral-400 line-clamp-3">{service.description}</p>
                          </div>

                          <div className="pt-3 mt-4 border-t border-neutral-900 flex items-center gap-2">
                            <button
                              onClick={() => startEditService(service)}
                              className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmation({
                                  title: 'Delete Service Profile',
                                  message: `Are you sure you want to permanently delete the service profile "${service.title}"?`,
                                  onConfirm: () => {
                                    deleteService(service.id);
                                    showToast('success', 'Service removed.');
                                    setDeleteConfirmation(null);
                                  }
                                });
                              }}
                              className="p-1.5 bg-neutral-900 hover:bg-rose-950 text-neutral-500 hover:text-rose-400 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 7. ENQUIRIES TAB */}
              {activeTab === 'enquiries' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Inquiries & Correspondence</h3>
                    <p className="text-xs text-neutral-400">Review communications, questions, and responses submitted by prospective students or clients.</p>
                  </div>

                  <div className="space-y-4">
                    {enquiries && enquiries.length > 0 ? (
                      enquiries.map((enquiry) => (
                        <div
                          key={enquiry.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            enquiry.status === 'New'
                              ? 'bg-sky-950/10 border-sky-500/20 shadow-md'
                              : enquiry.status === 'Replied'
                              ? 'bg-neutral-950/40 border-neutral-800'
                              : 'bg-neutral-950/20 border-neutral-900 opacity-60'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-800/60 pb-3 mb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{enquiry.name}</span>
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  enquiry.status === 'New'
                                    ? 'bg-sky-500 text-neutral-950'
                                    : enquiry.status === 'Replied'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-neutral-800 text-neutral-400'
                                }`}>
                                  {enquiry.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 font-mono">
                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-neutral-500" /> {enquiry.email}</span>
                                {enquiry.phone && (
                                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-neutral-500" /> {enquiry.phone}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-[11px] text-neutral-500 font-mono">
                              Received: {enquiry.date}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs font-black text-white uppercase tracking-wider">Subject: {enquiry.subject}</div>
                            <p className="text-xs text-neutral-300 bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800/40 font-serif leading-relaxed">
                              {enquiry.message}
                            </p>
                          </div>

                          <div className="pt-3 mt-4 border-t border-neutral-800/60 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                              {enquiry.status !== 'Replied' && (
                                <button
                                  onClick={() => {
                                    updateEnquiryStatus(enquiry.id, 'Replied');
                                    showToast('success', 'Inquiry marked as Replied.');
                                  }}
                                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg transition-all cursor-pointer"
                                >
                                  Mark Replied
                                </button>
                              )}
                              {enquiry.status !== 'Archived' && (
                                <button
                                  onClick={() => {
                                    updateEnquiryStatus(enquiry.id, 'Archived');
                                    showToast('success', 'Inquiry moved to archive.');
                                  }}
                                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-lg transition-all cursor-pointer"
                                >
                                  Archive
                                </button>
                              )}
                              {enquiry.status !== 'New' && (
                                <button
                                  onClick={() => {
                                    updateEnquiryStatus(enquiry.id, 'New');
                                    showToast('success', 'Inquiry reset to New status.');
                                  }}
                                  className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-bold rounded-lg transition-all cursor-pointer"
                                >
                                  Mark New
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                setDeleteConfirmation({
                                  title: 'Delete Inquiry Record',
                                  message: `Are you sure you want to permanently delete this message record from "${enquiry.name}"?`,
                                  onConfirm: () => {
                                    deleteEnquiry(enquiry.id);
                                    showToast('success', 'Inquiry completely purged from database.');
                                    setDeleteConfirmation(null);
                                  }
                                });
                              }}
                              className="px-2.5 py-1.5 hover:bg-rose-950 text-neutral-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete communication permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-neutral-950/40 border border-neutral-800 rounded-2xl text-neutral-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                        <span className="text-xs">No user enquiries have been submitted yet.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 8. SQL AUDIT LOGS TAB */}
              {activeTab === 'audit' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-sky-400" />
                        <span>SQL Security Audit Logs</span>
                      </h3>
                      <p className="text-xs text-neutral-400">Review real-time access authorizations and potential intrusion attempts stored in Supabase PostgreSQL.</p>
                    </div>

                    <button
                      onClick={loadLoginAttempts}
                      disabled={isLoadingAttempts}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAttempts ? 'animate-spin' : ''}`} />
                      <span>Refresh Audit Stream</span>
                    </button>
                  </div>

                  {/* Summary Stats Panels */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center gap-3">
                      <div className="p-3 bg-neutral-900 text-sky-400 border border-neutral-800 rounded-xl">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Total Attempts</span>
                        <span className="text-lg font-black text-white">{loginAttempts.length}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center gap-3">
                      <div className="p-3 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 rounded-xl">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Success rate</span>
                        <span className="text-lg font-black text-emerald-400">
                          {loginAttempts.length > 0 
                            ? Math.round((loginAttempts.filter(a => a.status === 'SUCCESS').length / loginAttempts.length) * 100) 
                            : 100}%
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center gap-3">
                      <div className={`p-3 rounded-xl border ${
                        loginAttempts.filter(a => a.status === 'FAILED').length > 0 
                          ? 'bg-rose-950/40 text-rose-400 border-rose-500/20' 
                          : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                      }`}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Failed Intrusion blocks</span>
                        <span className={`text-lg font-black ${
                          loginAttempts.filter(a => a.status === 'FAILED').length > 0 ? 'text-rose-400' : 'text-neutral-400'
                        }`}>
                          {loginAttempts.filter(a => a.status === 'FAILED').length}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center gap-3">
                      <div className="p-3 bg-amber-950/40 text-amber-400 border border-amber-500/20 rounded-xl">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Older than 24 Hours</span>
                        <span className="text-lg font-black text-amber-400">
                          {loginAttempts.filter(attempt => {
                            if (!attempt.attempted_at) return false;
                            return new Date(attempt.attempted_at).getTime() < (Date.now() - 24 * 60 * 60 * 1000);
                          }).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Search Bar filter */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Filter attempts by Email or IP Address..."
                      value={attemptsSearch}
                      onChange={(e) => setAttemptsSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  {/* Bulk Operations and Cleanup Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={
                          loginAttempts.length > 0 &&
                          loginAttempts.every(attempt => selectedLogIds.includes(attempt.id))
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLogIds(loginAttempts.map(attempt => attempt.id));
                          } else {
                            setSelectedLogIds([]);
                          }
                        }}
                        className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 text-sky-500 focus:ring-sky-500/20 cursor-pointer"
                        title="Select All Logs"
                      />
                      <span className="text-xs font-bold text-neutral-300">
                        {selectedLogIds.length > 0 
                          ? `${selectedLogIds.length} log(s) selected` 
                          : 'Select logs to delete multiple'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {selectedLogIds.length > 0 && (
                        <button
                          type="button"
                          onClick={handleDeleteSelectedLogs}
                          className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Selected ({selectedLogIds.length})</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleCleanOlderThan24Hours}
                        className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Clean logs older than 24 Hours ({
                          loginAttempts.filter(attempt => {
                            if (!attempt.attempted_at) return false;
                            return new Date(attempt.attempted_at).getTime() < (Date.now() - 24 * 60 * 60 * 1000);
                          }).length
                        })</span>
                      </button>
                    </div>
                  </div>

                  {/* Logs List Container */}
                  <div className="space-y-3.5">
                    {isLoadingAttempts ? (
                      <div className="text-center py-16 bg-neutral-950/40 border border-neutral-800 rounded-2xl text-neutral-400">
                        <RefreshCw className="w-8 h-8 mx-auto mb-2 text-sky-400 animate-spin" />
                        <span className="text-xs">Querying PostgreSQL table data from Supabase...</span>
                      </div>
                    ) : (
                      (() => {
                        const filtered = loginAttempts.filter(attempt => {
                          const term = attemptsSearch.toLowerCase();
                          return (attempt.email || '').toLowerCase().includes(term) ||
                                 (attempt.ip_address || '').toLowerCase().includes(term) ||
                                 (attempt.status || '').toLowerCase().includes(term);
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-12 bg-neutral-950/40 border border-neutral-800 rounded-2xl text-neutral-500">
                              <Terminal className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                              <span className="text-xs">No login attempts match your current search query.</span>
                            </div>
                          );
                        }

                        return filtered.map((attempt) => {
                          const browser = (() => {
                            const ua = attempt.user_agent || '';
                            if (ua.includes('Edg/')) return 'Microsoft Edge';
                            if (ua.includes('Chrome/')) return 'Google Chrome';
                            if (ua.includes('Firefox/')) return 'Mozilla Firefox';
                            if (ua.includes('Safari/')) return 'Apple Safari';
                            return 'Web Browser';
                          })();

                          const os = (() => {
                            const ua = attempt.user_agent || '';
                            if (ua.includes('Windows NT')) return 'Windows';
                            if (ua.includes('Macintosh')) return 'macOS';
                            if (ua.includes('Android')) return 'Android';
                            if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
                            if (ua.includes('Linux')) return 'Linux';
                            return 'Unknown OS';
                          })();

                          const timestamp = attempt.attempted_at 
                            ? new Date(attempt.attempted_at).toLocaleString() 
                            : 'Unknown Time';

                          const isSelected = selectedLogIds.includes(attempt.id);

                          return (
                            <div 
                              key={attempt.id} 
                              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-neutral-950/60 ${
                                isSelected
                                  ? 'bg-sky-500/5 border-sky-500/40'
                                  : attempt.status === 'SUCCESS' 
                                    ? 'bg-neutral-950/30 border-neutral-800/80 hover:border-emerald-500/10' 
                                    : 'bg-rose-950/5 border-rose-950/40 hover:border-rose-500/20'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Row Checkbox */}
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedLogIds(prev => [...prev, attempt.id]);
                                    } else {
                                      setSelectedLogIds(prev => prev.filter(id => id !== attempt.id));
                                    }
                                  }}
                                  className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 text-sky-500 focus:ring-sky-500/20 cursor-pointer"
                                />

                                <div className={`p-2 rounded-xl border shrink-0 ${
                                  attempt.status === 'SUCCESS' 
                                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
                                    : 'bg-rose-950/40 text-rose-400 border-rose-500/20 animate-pulse'
                                }`}>
                                  <Shield className="w-4 h-4" />
                                </div>
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-bold text-white text-sm tracking-tight truncate">{attempt.email}</span>
                                    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                      attempt.status === 'SUCCESS' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    }`}>
                                      {attempt.status}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 font-mono">
                                    <span className="flex items-center gap-1">
                                      <Globe className="w-3.5 h-3.5 text-neutral-500" />
                                      <span>IP: {attempt.ip_address}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Laptop className="w-3.5 h-3.5 text-neutral-500" />
                                      <span>{browser} ({os})</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-4 border-t border-neutral-800/40 md:border-t-0 pt-3 md:pt-0 shrink-0">
                                <div className="text-xs text-neutral-500 font-mono flex items-center gap-1.5">
                                  <Terminal className="w-3.5 h-3.5 text-neutral-600" />
                                  <span>{timestamp}</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteSingleLog(attempt.id, attempt.email)}
                                  className="p-1.5 hover:bg-rose-950 text-neutral-500 hover:text-rose-400 rounded-lg border border-neutral-800/40 hover:border-rose-500/20 transition-all cursor-pointer"
                                  title="Delete single log entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        });
                      })()
                    )}
                  </div>
                </div>
              )}

              {/* SECURITY SETTINGS TAB */}
              {activeTab === 'security' && (
                <form onSubmit={handleSaveSecuritySettings} className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                      <Key className="w-5 h-5 text-sky-400" />
                      <span>Security & Administration Settings</span>
                    </h3>
                    <p className="text-xs text-neutral-400">Configure custom credentials for fallback logins. This will overwrite standard fallback settings safely without locking you out of the hardcoded credentials.</p>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-6">
                    <div className="space-y-1.5 border-b border-neutral-800 pb-4">
                      <label className="text-xs font-bold text-neutral-300">Custom Admin Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          value={customAdminEmail}
                          onChange={(e) => setCustomAdminEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="e.g., admin@yourdomain.com"
                        />
                      </div>
                      <p className="text-[10px] text-neutral-500">The customized email you want to use to log into this administrative CMS console.</p>
                    </div>

                    <div className="space-y-1.5 bg-neutral-900/40 p-4 border border-neutral-800 rounded-xl">
                      <label className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 animate-pulse" />
                        <span>Recent Password (Current Passkey) *</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type="password"
                          required
                          value={recentPassword}
                          onChange={(e) => setRecentPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="Enter current password to authorize change"
                        />
                      </div>
                      <p className="text-[10px] text-neutral-400">For security, you must authorize changes with your current admin password.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">New Password / Passkey PIN</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type="password"
                          value={customAdminPassword}
                          onChange={(e) => setCustomAdminPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="Enter new passkey"
                        />
                      </div>
                      <p className="text-[10px] text-neutral-500">Use a secure custom passkey or password.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Confirm Password / Passkey PIN</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type="password"
                          value={confirmAdminPassword}
                          onChange={(e) => setConfirmAdminPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="Retype passkey to confirm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-neutral-950 font-extrabold text-xs rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Credentials</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCustomAdminEmail('kumarbijit08@gmail.com');
                        setCustomAdminPassword('9864581737');
                        setConfirmAdminPassword('9864581737');
                        setRecentPassword('');
                        localStorage.removeItem('mindmap_custom_admin_email');
                        localStorage.removeItem('mindmap_custom_admin_password');
                        showToast('success', 'Reset to default credentials successfully.');
                      }}
                      className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Reset to Default
                    </button>
                  </div>
                </form>
              )}

              {/* UPDATES TAB */}
              {activeTab === 'updates' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white">Updates Management</h3>
                  
                  <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                    <h4 className="font-bold text-sm text-white mb-4">Add New Update</h4>
                    <div className="space-y-3">
                      <input type="text" placeholder="Title" value={newUpdateForm.title} onChange={e => setNewUpdateForm({...newUpdateForm, title: e.target.value})} className="w-full p-2 bg-neutral-800 rounded text-sm text-white" />
                      <textarea placeholder="Content" value={newUpdateForm.content} onChange={e => setNewUpdateForm({...newUpdateForm, content: e.target.value})} className="w-full p-2 bg-neutral-800 rounded text-sm text-white" />
                      <ImageUploader label="Update Image" value={newUpdateForm.imageUrl} onChange={(url) => setNewUpdateForm({...newUpdateForm, imageUrl: url})} allImages={allCMSImages} />
                      <button 
                        onClick={() => {
                          if (newUpdateForm.title && newUpdateForm.content) {
                              addUpdate(newUpdateForm);
                              setNewUpdateForm({ title: '', content: '', imageUrl: '' });
                              showToast('success', 'Update added!');
                          } else {
                              showToast('error', 'Title and Content required!');
                          }
                        }}
                        className="w-full p-2 bg-sky-500 rounded text-neutral-900 text-sm font-bold"
                      >
                        Add Update
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                    <h4 className="font-bold text-sm text-white mb-4">Existing Updates</h4>
                    <div className="space-y-2">
                      {Array.isArray(data?.updates) && data.updates.map(u => (
                        <div key={u.id} className="p-2 border border-neutral-700 rounded text-sm flex justify-between items-center">
                          <span>{u.title}</span>
                          <button onClick={() => deleteUpdate(u.id)} className="text-rose-400">Delete</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 9. FOUNDER PROFILE TAB */}
              {activeTab === 'founder' && (
                <form onSubmit={handleSaveFounder} className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Founder Profile & Milestone Timeline</h3>
                    <p className="text-xs text-neutral-400">Configure information about the founder, display image, bio, and interactive milestone items.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Founder Name</label>
                      <input
                        type="text"
                        value={founderForm.name}
                        onChange={(e) => setFounderForm({ ...founderForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Title / Subtitle</label>
                      <input
                        type="text"
                        value={founderForm.title}
                        onChange={(e) => setFounderForm({ ...founderForm, title: e.target.value })}
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <ImageUploader
                      label="Founder Profile Image"
                      value={founderForm.imageUrl}
                      onChange={(url) => setFounderForm({ ...founderForm, imageUrl: url })}
                      allImages={allCMSImages}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Biographical Description</label>
                    <textarea
                      value={founderForm.bio}
                      onChange={(e) => setFounderForm({ ...founderForm, bio: e.target.value })}
                      className="w-full h-32 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Personal Sign-off Message / Quote</label>
                    <textarea
                      value={founderForm.message}
                      onChange={(e) => setFounderForm({ ...founderForm, message: e.target.value })}
                      className="w-full h-24 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                      required
                    />
                  </div>

                  {/* Interactive Timeline Editor */}
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 text-sky-400">Timeline Milestones</h4>
                      <p className="text-[11px] text-neutral-400">List and add professional timeline history milestones.</p>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {founderTimeline.map((item, index) => (
                        <div key={index} className="p-3 bg-neutral-900 border border-neutral-800/80 rounded-xl flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <span className="font-bold text-sky-400 font-mono tracking-wider bg-sky-500/10 px-2 py-0.5 rounded-md text-[10px]">{item.year}</span>
                            <p className="text-neutral-300 font-medium leading-relaxed mt-1">{item.event}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFounderTimeline(prev => prev.filter((_, idx) => idx !== index));
                              showToast('success', 'Milestone pending deletion. Click "Save Founder Profile" to finalize.');
                            }}
                            className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {founderTimeline.length === 0 && (
                        <div className="text-center py-4 text-xs text-neutral-500">No milestones set.</div>
                      )}
                    </div>

                    {/* Add milestone mini form */}
                    <div className="pt-2 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400">Year</label>
                        <input
                          type="text"
                          placeholder="e.g., 2024"
                          value={newTimelineYear}
                          onChange={(e) => setNewTimelineYear(e.target.value)}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-7 space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400">Milestone Event Description</label>
                        <input
                          type="text"
                          placeholder="What happened in this milestone..."
                          value={newTimelineEvent}
                          onChange={(e) => setNewTimelineEvent(e.target.value)}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!newTimelineYear.trim() || !newTimelineEvent.trim()) {
                              showToast('error', 'Please fill in both Year and Milestone details.');
                              return;
                            }
                            setFounderTimeline(prev => [...prev, { year: newTimelineYear, event: newTimelineEvent }]);
                            setNewTimelineYear('');
                            setNewTimelineEvent('');
                            showToast('success', 'Milestone added locally. Make sure to click save below!');
                          }}
                          className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-800">
                    <button
                       type="submit"
                       className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Founder Profile</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TEAM MEMBERS TAB */}
              {activeTab === 'team' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Educators & Mentors Team</h3>
                    <p className="text-xs text-neutral-400">Configure information, names, designations, custom bio messages, and social links for team members.</p>
                  </div>

                  {editingItemId === null ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
                        <div className="space-y-1">
                          <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">Active Directory</span>
                          <p className="text-[11px] text-neutral-400">Manage {data.team?.length || 0} registered educators who appear below the Founder section on the main site.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId('new');
                            setEditingTeamMember({
                              name: '',
                              designation: '',
                              bio: '',
                              imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
                              linkedin: '',
                              github: '',
                              twitter: ''
                            });
                          }}
                          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Educator</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.team && data.team.map((member) => (
                          <div key={member.id} className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col justify-between space-y-4">
                            <div className="flex items-start gap-4">
                              <img
                                src={member.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                alt={member.name}
                                className="w-14 h-14 object-cover rounded-xl border border-neutral-800"
                                referrerPolicy="no-referrer"
                              />
                              <div className="space-y-1 min-w-0 flex-1">
                                <h4 className="text-sm font-bold text-white truncate">{member.name}</h4>
                                <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider truncate">{member.designation}</p>
                                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">{member.bio}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-neutral-900">
                              <div className="flex gap-2">
                                {member.linkedin && <span className="text-[9px] font-mono text-sky-400/80 bg-sky-500/10 px-1.5 py-0.5 rounded">LinkedIn</span>}
                                {member.github && <span className="text-[9px] font-mono text-sky-400/80 bg-sky-500/10 px-1.5 py-0.5 rounded">GitHub</span>}
                                {member.twitter && <span className="text-[9px] font-mono text-sky-400/80 bg-sky-500/10 px-1.5 py-0.5 rounded">Twitter</span>}
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingItemId(member.id);
                                    setEditingTeamMember(member);
                                  }}
                                  className="p-2 text-neutral-400 hover:text-sky-400 hover:bg-sky-400/10 rounded-lg transition-all cursor-pointer"
                                  title="Edit Member"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeleteConfirmation({
                                      title: 'Delete Educator/Mentor',
                                      message: `Are you sure you want to permanently delete team member "${member.name}"?`,
                                      onConfirm: () => {
                                        deleteTeamMember(member.id);
                                        showToast('success', 'Educator/Mentor removed.');
                                        setDeleteConfirmation(null);
                                      }
                                    });
                                  }}
                                  className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all cursor-pointer"
                                  title="Delete Member"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {(!data.team || data.team.length === 0) && (
                          <div className="col-span-full text-center py-12 text-xs text-neutral-500 bg-neutral-950/20 border border-dashed border-neutral-800 rounded-2xl">
                            No team members configured. Click "Add Educator" to get started!
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!editingTeamMember.name || !editingTeamMember.designation) {
                          return;
                        }
                        const payload = {
                          name: editingTeamMember.name,
                          designation: editingTeamMember.designation,
                          bio: editingTeamMember.bio || '',
                          imageUrl: editingTeamMember.imageUrl || '',
                          linkedin: editingTeamMember.linkedin || '',
                          github: editingTeamMember.github || '',
                          twitter: editingTeamMember.twitter || ''
                        };

                        if (editingItemId === 'new') {
                          addTeamMember(payload);
                        } else {
                          editTeamMember(editingItemId, { ...payload, id: editingItemId });
                        }
                        setEditingItemId(null);
                        setEditingTeamMember({});
                      }}
                      className="space-y-4 max-w-3xl bg-neutral-950 p-6 border border-neutral-800 rounded-2xl"
                    >
                      <h4 className="text-xs font-black uppercase tracking-wider text-sky-400">
                        {editingItemId === 'new' ? 'Add New Educator' : 'Modify Educator Details'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide">Educator Name *</label>
                          <input
                            type="text"
                            required
                            value={editingTeamMember.name || ''}
                            onChange={(e) => setEditingTeamMember({ ...editingTeamMember, name: e.target.value })}
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                            placeholder="e.g. Sarah Fernandes"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide">Designation / Designation *</label>
                          <input
                            type="text"
                            required
                            value={editingTeamMember.designation || ''}
                            onChange={(e) => setEditingTeamMember({ ...editingTeamMember, designation: e.target.value })}
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                            placeholder="e.g. STEM Curriculum Architect"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <ImageUploader
                          label="Educator / Mentor Profile Image"
                          value={editingTeamMember.imageUrl || ''}
                          onChange={(url) => setEditingTeamMember({ ...editingTeamMember, imageUrl: url })}
                          allImages={allCMSImages}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide">Biographical Description</label>
                        <textarea
                          value={editingTeamMember.bio || ''}
                          onChange={(e) => setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })}
                          className="w-full h-28 px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                          placeholder="Tell us about their background, mentorship expertise, and passion..."
                        />
                      </div>

                      <div className="border-t border-neutral-900 pt-4 space-y-4">
                        <h5 className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Social Connects (Optional Links)</h5>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-neutral-400 uppercase">LinkedIn Profile</label>
                            <input
                              type="url"
                              placeholder="https://linkedin.com/in/username"
                              value={editingTeamMember.linkedin || ''}
                              onChange={(e) => setEditingTeamMember({ ...editingTeamMember, linkedin: e.target.value })}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-neutral-400 uppercase">GitHub Profile</label>
                            <input
                              type="url"
                              placeholder="https://github.com/username"
                              value={editingTeamMember.github || ''}
                              onChange={(e) => setEditingTeamMember({ ...editingTeamMember, github: e.target.value })}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-neutral-400 uppercase">Twitter Profile</label>
                            <input
                              type="url"
                              placeholder="https://twitter.com/username"
                              value={editingTeamMember.twitter || ''}
                              onChange={(e) => setEditingTeamMember({ ...editingTeamMember, twitter: e.target.value })}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-4 border-t border-neutral-900">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Member</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(null);
                            setEditingTeamMember({});
                          }}
                          className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* 10. SHOWCASE GALLERY TAB */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Showcase Gallery Portfolio</h3>
                    <p className="text-xs text-neutral-400">View, update, upload or delete images showcased in the dynamic filter gallery.</p>
                  </div>

                  {/* Add New Gallery Image */}
                  <form onSubmit={handleAddGalleryImage} className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4 max-w-3xl">
                    <h4 className="text-xs font-black uppercase tracking-wider text-sky-400">Add New Image to Gallery</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">Image Title</label>
                        <input
                          type="text"
                          placeholder="e.g., Robotics Lab Session"
                          value={newGalleryTitle}
                          onChange={(e) => setNewGalleryTitle(e.target.value)}
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm focus:outline-none text-white"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300 flex justify-between">
                          Category Tag
                          <button 
                            type="button" 
                            onClick={() => setActiveTab('categories')}
                            className="text-sky-400 hover:text-sky-300"
                          >
                            Manage Categories
                          </button>
                        </label>
                        <select
                          value={newGalleryCategory}
                          onChange={(e) => setNewGalleryCategory(e.target.value)}
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm focus:outline-none text-white"
                          required
                        >
                          <option value="">Select Category</option>
                          {data.categories?.length > 0 ? (
                            data.categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))
                          ) : (
                            <option value="" disabled>No categories available</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <ImageUploader
                        label="Portfolio Showcase Image"
                        value={newGalleryImageUrl}
                        onChange={(url) => setNewGalleryImageUrl(url)}
                        allImages={allCMSImages}
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Insert Image into Showcase</span>
                    </button>
                  </form>

                  {/* Active Gallery Items Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">Current Gallery Images ({data.gallery?.length || 0})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {data.gallery?.map((item) => (
                        <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden group relative">
                          {editingGalleryItem?.id === item.id ? (
                            <div className="p-3 space-y-2">
                              <input
                                type="text"
                                value={editingGalleryItem.title}
                                onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                                className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-sm text-white"
                              />
                              <select
                                value={editingGalleryItem.category}
                                onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })}
                                className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-sm text-white"
                              >
                                {data.categories?.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                              <div className="flex gap-2">
                                <button onClick={handleUpdateGalleryItem} className="flex-1 bg-sky-500 text-neutral-950 text-xs font-bold py-1 rounded">Save</button>
                                <button onClick={() => setEditingGalleryItem(null)} className="flex-1 bg-neutral-700 text-white text-xs font-bold py-1 rounded">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="aspect-video bg-neutral-900 overflow-hidden">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                              </div>
                              <div className="p-2.5">
                                <span className="text-[8px] font-extrabold uppercase bg-sky-500/15 text-sky-400 px-1.5 py-0.5 rounded-md font-mono">{item.category}</span>
                                <h5 className="text-[11px] font-bold text-white mt-1.5 line-clamp-1">{item.title}</h5>
                              </div>
                              <button
                                onClick={() => setEditingGalleryItem(item)}
                                className="absolute top-2 left-2 p-1.5 bg-neutral-950/80 hover:bg-sky-950 text-neutral-400 hover:text-sky-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-neutral-800"
                                title="Edit image"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirmation({
                                    title: 'Remove Gallery Image',
                                    message: `Are you sure you want to remove the image "${item.title}" from your portfolio showcase?`,
                                    onConfirm: () => {
                                      deleteGalleryImage(item.id);
                                      showToast('success', 'Image removed from gallery showcase portfolio.');
                                      setDeleteConfirmation(null);
                                    }
                                  });
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-neutral-950/80 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-neutral-800"
                                title="Remove image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 11. CONTACT & MAP TAB */}
              {activeTab === 'contact' && (
                <form onSubmit={handleSaveContact} className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Contact Information & Maps Embed</h3>
                    <p className="text-xs text-neutral-400">Edit contact telephone, helpdesk email, address, WhatsApp triggers, and interactive map embeds.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Facebook URL</label>
                      <input
                        type="url"
                        value={contactForm.facebook || ''}
                        onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Instagram URL</label>
                      <input
                        type="url"
                        value={contactForm.instagram || ''}
                        onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">LinkedIn URL</label>
                      <input
                        type="url"
                        value={contactForm.linkedin || ''}
                        onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })}
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">YouTube URL</label>
                      <input
                        type="url"
                        value={contactForm.youtube || ''}
                        onChange={(e) => setContactForm({ ...contactForm, youtube: e.target.value })}
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Office Telephone / Hotline</label>
                      <input
                        type="text"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">WhatsApp Number (with Country Code)</label>
                      <input
                        type="text"
                        value={contactForm.whatsappNumber}
                        onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Helpdesk Email Address</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Physical Office / Lab Location Address</label>
                    <textarea
                      value={contactForm.address}
                      onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                      className="w-full h-20 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <ImageUploader
                      label="Footer Logo Image"
                      value={contactForm.footerLogoUrl || ''}
                      onChange={(url) => setContactForm({ ...contactForm, footerLogoUrl: url })}
                      allImages={allCMSImages}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Google Maps IFrame Embed URL</label>
                    <textarea
                      value={contactForm.googleMapEmbedUrl}
                      onChange={(e) => setContactForm({ ...contactForm, googleMapEmbedUrl: e.target.value })}
                      className="w-full h-24 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-white"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      required
                    />
                    <span className="text-[10px] text-neutral-500">Provide the direct `src` attribute from Google Maps iframe share code.</span>
                  </div>

                  <div className="pt-4 border-t border-neutral-800">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Contact Details</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Custom Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{deleteConfirmation.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{deleteConfirmation.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteConfirmation.onConfirm}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
