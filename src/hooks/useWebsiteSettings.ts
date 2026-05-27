import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CompanySettings {
  companyName: string;
  founderName: string;
  founderTitle: string;
  experienceYears: string;
  projectsDelivered: string;
  behanceUser: string;
  founderBio: string;
}

export interface ContactSettings {
  phone: string;
  email: string;
  addressText: string;
  cityCountry: string;
  whatsappNumber: string;
}

export interface ThemeSettings {
  bgTone: 'slate' | 'navy' | 'emerald' | 'charcoal' | 'pitchBlack';
  skyBlueIntensity: number;
  emeraldGreenIntensity: number;
  amberYellowIntensity: number;
  enableGlowAnimation: boolean;
  accentHue: string; // e.g., gold or amber hex
}

export interface WebsiteSettings {
  company: CompanySettings;
  contact: ContactSettings;
  theme: ThemeSettings;
}

export const defaultSettings: WebsiteSettings = {
  company: {
    companyName: 'NESTADESIGN',
    founderName: 'HITIMANA JEAN',
    founderTitle: 'Founder of NESTADESIGN',
    experienceYears: '20+',
    projectsDelivered: '200+',
    behanceUser: 'Nestadesign1',
    founderBio: 'I am a professional Graphic Designer with extensive experience in creating diverse visual designs that help companies and individuals communicate their messages effectively and beautifully. Highly skilled in Adobe Photoshop, Illustrator, and other industry standards.',
  },
  contact: {
    phone: '+250 782 739 381',
    email: 'jeanesta81@gmail.com',
    addressText: 'Shyorongi - Rulindo',
    cityCountry: 'Kigali, Rwanda',
    whatsappNumber: '+250782739381',
  },
  theme: {
    bgTone: 'slate',
    skyBlueIntensity: 15,
    emeraldGreenIntensity: 15,
    amberYellowIntensity: 15,
    enableGlowAnimation: true,
    accentHue: '#D4AF37', // Default Brand Gold
  }
};

export function useWebsiteSettings() {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'general');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<WebsiteSettings>;
        
        // Merge with defaults to ensure all properties exist
        setSettings({
          company: { ...defaultSettings.company, ...data.company },
          contact: { ...defaultSettings.contact, ...data.contact },
          theme: { ...defaultSettings.theme, ...data.theme },
        });
      } else {
        // If snapshot doesn't exist, set default
        setSettings(defaultSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching website settings:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveSettings = async (newSettings: WebsiteSettings) => {
    try {
      const docRef = doc(db, 'settings', 'general');
      await setDoc(docRef, newSettings);
      return { success: true };
    } catch (error) {
      console.error('Error saving website settings:', error);
      return { success: false, error };
    }
  };

  return { settings, loading, saveSettings };
}
